// In-browser TypeScript language service for the playground editor —
// hover types, completion, and diagnostics. Ported from the old docs
// site (projects/docs/src/lib/components/codemirror/ts-service.js).
//
// TypeScript itself and the bundled pota types are loaded lazily (only
// when a live, editable example is first opened). The expensive default
// lib map is built once and shared; each Playground then gets its own
// isolated environment so multiple live examples on one page don't clash
// over file names or the active path.

import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualTypeScriptEnvironment,
} from '@typescript/vfs'

import { autocompletion } from '@codemirror/autocomplete'
import { linter } from '@codemirror/lint'
import { hoverTooltip, EditorView } from '@codemirror/view'

// @typescript/vfs (and its `debug` dep) may reference `process` in the
// browser — make sure it exists before they load.
globalThis.process = globalThis.process || { env: {} }
globalThis.process.env = globalThis.process.env || {}

const TS_URL =
	'https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/typescript.js'
const TYPES_URL = '/modules/pota/generated/docs/types.json'

const toPath = name => (name.startsWith('/') ? name : '/' + name)

const kindToCmType = {
	var: 'variable',
	let: 'variable',
	const: 'constant',
	function: 'function',
	method: 'method',
	property: 'property',
	class: 'class',
	interface: 'interface',
	enum: 'enum',
	module: 'namespace',
	type: 'type',
	keyword: 'keyword',
	alias: 'type',
	parameter: 'variable',
}

// TS quick-info display-part kind → our --cm-* syntax color. Unmapped
// kinds (text, space, lineBreak) inherit the tooltip's default color.
const partToCm = {
	keyword: 'keyword',
	operator: 'punctuation',
	punctuation: 'punctuation',
	stringLiteral: 'string',
	regularExpressionLiteral: 'string',
	numericLiteral: 'number',
	aliasName: 'type',
	className: 'type',
	interfaceName: 'type',
	enumName: 'type',
	typeAliasName: 'type',
	typeParameterName: 'type',
	functionName: 'function',
	methodName: 'function',
	parameterName: 'variable',
	propertyName: 'variable',
	fieldName: 'variable',
	enumMemberName: 'variable',
	localName: 'variable',
	moduleName: 'type',
}

// --- signature formatting ------------------------------------------
//
// Quick-info display parts arrive as one long line (TS only pre-breaks
// object-literal types), so long signatures soft-wrap at the tooltip
// edge mid-token. Reflow them: drop the `(alias)` prefix and trailing
// `import X` line (every import alias carries them — noise here), and
// when a line overflows the tooltip, expand its widest bracket group
// one item per line (params, object members) or stack union members.
// Operates on parts, not text, so syntax coloring is preserved.

// ~520px tooltip at 12px JetBrains Mono (0.6em advance) ≈ 70 chars.
const SIG_WIDTH = 68
const SIG_INDENT = '    ' // match TS's own pre-broken indentation
const SIG_OPEN = { '(': ')', '[': ']', '{': '}', '<': '>' }

const partsWidth = parts =>
	parts.reduce((w, p) => w + p.text.length, 0)

const trimSpaceParts = parts => {
	let a = 0
	let b = parts.length
	while (a < b && parts[a].kind === 'space') a++
	while (b > a && parts[b - 1].kind === 'space') b--
	return parts.slice(a, b)
}

// Widest complete bracket pair in `tokens` (every bracket is its own
// punctuation part; `=>` is a single part, so it never miscounts).
function widestGroup(tokens) {
	const stack = []
	let widest = null
	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i].text
		if (SIG_OPEN[t]) {
			stack.push({ open: i, close: SIG_OPEN[t] })
		} else if (stack.length && t === stack[stack.length - 1].close) {
			const g = stack.pop()
			const width = partsWidth(tokens.slice(g.open + 1, i))
			if (!widest || width > widest.width) {
				widest = { open: g.open, close: i, width }
			}
		}
	}
	return widest
}

// Indices of depth-0 `|` parts — union members to stack when too long.
function topLevelPipes(tokens) {
	const pipes = []
	const stack = []
	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i].text
		if (SIG_OPEN[t]) stack.push(SIG_OPEN[t])
		else if (stack.length && t === stack[stack.length - 1]) stack.pop()
		else if (!stack.length && t === '|') pipes.push(i)
	}
	return pipes
}

// Split group contents at depth-0 `,` / `;`, separator kept with item.
function splitItems(tokens) {
	const items = []
	const stack = []
	let start = 0
	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i].text
		if (SIG_OPEN[t]) stack.push(SIG_OPEN[t])
		else if (stack.length && t === stack[stack.length - 1]) stack.pop()
		else if (!stack.length && (t === ',' || t === ';')) {
			items.push(tokens.slice(start, i + 1))
			start = i + 1
		}
	}
	if (start < tokens.length) items.push(tokens.slice(start))
	return items
}

/** @returns {{ indent: string, tokens: any[] }[]} */
function breakLine(tokens, indent) {
	if (indent.length + partsWidth(tokens) <= SIG_WIDTH) {
		return [{ indent, tokens }]
	}
	// a small group isn't what overflows — don't split `(+2 overloads)`
	const group = widestGroup(tokens)
	if (group && group.width >= 24) {
		const head = trimSpaceParts(tokens.slice(0, group.open + 1))
		const items = splitItems(
			tokens.slice(group.open + 1, group.close),
		)
		const tail = trimSpaceParts(tokens.slice(group.close))
		return [
			...breakLine(head, indent),
			...items.flatMap(item => {
				// content ending in a separator leaves a space-only
				// remainder — dropping it avoids a blank line before `}`
				item = trimSpaceParts(item)
				return item.length
					? breakLine(item, indent + SIG_INDENT)
					: []
			}),
			...breakLine(tail, indent),
		]
	}
	const pipes = topLevelPipes(tokens)
	if (pipes.length) {
		const segments = []
		let start = 0
		for (const p of pipes) {
			segments.push(tokens.slice(start, p))
			start = p
		}
		segments.push(tokens.slice(start))
		const lines = []
		for (const seg of segments) {
			const tokens = trimSpaceParts(seg)
			if (tokens.length) {
				lines.push(
					...breakLine(
						tokens,
						lines.length ? indent + SIG_INDENT : indent,
					),
				)
			}
		}
		return lines
	}
	return [{ indent, tokens }]
}

// Drop the `(alias) ` prefix and the trailing `import X` line(s) that
// quick info appends to every import alias.
function stripAliasNoise(parts) {
	if (
		parts.length > 3 &&
		parts[0].text === '(' &&
		parts[1].text === 'alias' &&
		parts[2].text === ')'
	) {
		parts = trimSpaceParts(parts.slice(3))
	}
	for (;;) {
		let last = -1
		for (let i = 0; i < parts.length; i++) {
			if (parts[i].kind === 'lineBreak') last = i
		}
		if (last <= 0) break
		const after = trimSpaceParts(parts.slice(last + 1))
		if (
			after.length &&
			after[0].kind === 'keyword' &&
			(after[0].text === 'import' || after[0].text === 'export')
		) {
			parts = parts.slice(0, last)
		} else {
			break
		}
	}
	return parts
}

export function formatSignatureParts(parts) {
	parts = stripAliasNoise(parts || [])

	// Flatten TS's own pre-breaks (it multi-lines object-literal types
	// but leaves params crammed on the first line) so the whole
	// signature lays out under the one rule below — otherwise an
	// import hover and a call-site hover of the same symbol format
	// differently.
	const flat = []
	for (let i = 0; i < parts.length; i++) {
		if (parts[i].kind === 'lineBreak') {
			flat.push({ text: ' ', kind: 'space' })
			while (i + 1 < parts.length && parts[i + 1].kind === 'space') {
				i++
			}
		} else {
			flat.push(parts[i])
		}
	}

	const out = []
	for (const line of breakLine(trimSpaceParts(flat), '')) {
		if (out.length) {
			out.push({ text: '\n' + line.indent, kind: 'space' })
		}
		out.push(...line.tokens)
	}
	return out
}

// Render TypeScript `displayParts` into `host` as syntax-colored spans,
// reusing the editor's --cm-* palette so the hover matches the code.
function renderParts(parts, host) {
	for (const p of parts || []) {
		const cm = partToCm[p.kind]
		if (cm) {
			const span = document.createElement('span')
			span.style.color = 'var(--cm-' + cm + ')'
			span.textContent = p.text
			host.append(span)
		} else {
			host.append(document.createTextNode(p.text))
		}
	}
}

// Append text to `host`, turning markdown `[label](url)` links (lib.dom
// docs are full of `[MDN Reference](…)`) and bare http(s) URLs into real
// links. Trailing sentence punctuation on bare URLs is kept outside the
// anchor.
const URL_RE =
	/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|https?:\/\/[^\s<>")']+/g
function appendText(text, host) {
	let last = 0
	for (const m of text.matchAll(URL_RE)) {
		let url = m[2] || m[0]
		let label = m[1] || ''
		let trail = ''
		if (!label) {
			const t = /[.,;:]+$/.exec(url)
			if (t) {
				trail = t[0]
				url = url.slice(0, -trail.length)
			}
			label = url
		}
		if (m.index > last) {
			host.append(document.createTextNode(text.slice(last, m.index)))
		}
		const a = document.createElement('a')
		a.href = url
		a.target = '_blank'
		a.rel = 'noreferrer noopener'
		a.textContent = label
		host.append(a)
		if (trail) host.append(document.createTextNode(trail))
		last = m.index + m[0].length
	}
	if (last < text.length) {
		host.append(document.createTextNode(text.slice(last)))
	}
}

// Render JSDoc documentation parts: color known kinds with the editor
// palette, turn `{@link ...}` targets and bare URLs into links, and drop
// the `{@link`/`}` delimiter parts.
function renderDoc(parts, host) {
	for (const p of parts || []) {
		if (p.kind === 'link') continue
		if (p.kind === 'linkName' || p.kind === 'linkText') {
			const raw = p.text.trim()
			const sp = raw.indexOf(' ')
			const head = sp === -1 ? raw : raw.slice(0, sp)
			const tail = sp === -1 ? '' : raw.slice(sp + 1)
			if (/^https?:\/\//.test(head)) {
				const a = document.createElement('a')
				a.href = head
				a.target = '_blank'
				a.rel = 'noreferrer noopener'
				a.textContent = tail || head
				host.append(a)
			} else {
				const span = document.createElement('span')
				span.style.color = 'var(--cm-type)'
				span.textContent = raw
				host.append(span)
			}
			continue
		}
		const cm = partToCm[p.kind]
		if (cm) {
			const span = document.createElement('span')
			span.style.color = 'var(--cm-' + cm + ')'
			span.textContent = p.text
			host.append(span)
		} else {
			appendText(p.text, host)
		}
	}
}

// Render JSDoc tags (`@param`, `@returns`, `@example`, `@see`, …) as a
// labeled list. `@example` bodies become a code block; everything else
// is inline text with URLs made clickable.
function renderTags(tags, host) {
	for (const tag of tags) {
		const row = document.createElement('div')
		row.className = 'cm-ts-hover-tag'

		const name = document.createElement('span')
		name.className = 'cm-ts-hover-tagname'
		name.textContent = '@' + tag.name
		row.append(name)

		const body = (tag.text || []).map(p => p.text).join('')
		if (body) {
			if (tag.name === 'example') {
				const pre = document.createElement('pre')
				pre.className = 'cm-ts-hover-code'
				pre.textContent = body
				row.append(pre)
			} else {
				row.append(document.createTextNode(' '))
				appendText(body, row)
			}
		}
		host.append(row)
	}
}

let tsPromise
function loadTypeScript() {
	if (!tsPromise) {
		tsPromise = new Promise((resolve, reject) => {
			if (globalThis.ts) return resolve(globalThis.ts)
			const s = document.createElement('script')
			s.src = TS_URL
			s.onload = () => resolve(globalThis.ts)
			s.onerror = () => reject(new Error('failed to load typescript'))
			document.head.append(s)
		})
	}
	return tsPromise
}

let typesPromise
function loadTypes() {
	if (!typesPromise) {
		typesPromise = fetch(TYPES_URL)
			.then(r => (r.ok ? r.json() : []))
			.catch(() => [])
	}
	return typesPromise
}

// Build (once) the shared base: TypeScript + the default lib map seeded
// with pota's bundled ambient types. Cloned per environment below.
let corePromise
function loadTsCore() {
	if (!corePromise) {
		corePromise = (async () => {
			const [ts, types] = await Promise.all([
				loadTypeScript(),
				loadTypes(),
			])
			const compilerOptions = {
				target: ts.ScriptTarget.ES2022,
				module: ts.ModuleKind.ESNext,
				jsx: ts.JsxEmit.Preserve,
				moduleResolution: ts.ModuleResolutionKind.Bundler,
				allowNonTsExtensions: true,
				allowImportingTsExtensions: true,
				allowJs: true,
				esModuleInterop: true,
				jsxImportSource: 'pota',
				noEmit: true,
				types: ['pota'],
				// Match pota's own tsconfig.json so live examples are held
				// to the same bar as the source, not a stricter one.
				// @typescript/vfs forces `strict: true`; pota keeps strict
				// but disables these two, so re-disable them here — otherwise
				// every idiomatic example shows implicit-any / nullability
				// squiggles that pota itself never flags.
				strict: true,
				strictNullChecks: false,
				noImplicitAny: false,
			}
			const libMap = await createDefaultMapFromCDN(
				compilerOptions,
				ts.version,
				true,
				ts,
			)
			const typeRoots = []
			for (const t of types) {
				// Virtual-FS path for the TS language service, NOT an HTTP
				// URL. TypeScript resolves bare specifiers (`import 'pota'`)
				// by walking `node_modules/`, so these in-memory entries must
				// stay under `/node_modules/` even though the runtime assets
				// are served from `/modules/` (TYPES_URL above fetches the
				// bundle itself; this only keys it for the editor).
				const path = '/node_modules/' + t.f
				libMap.set(path, t.c)
				typeRoots.push(path)
			}

			// CSS imports: type `*.module.css` defaults as a class-name map
			// and let plain `*.css` resolve (side-effect imports). Without
			// these ambient declarations the language service flags every
			// CSS import as "cannot find module". The preview's lightningcss
			// step produces the matching runtime values. CSS files are kept
			// out of the virtual FS (see Editor.jsx) so these wildcards win.
			const CSS_MODULES_DTS = '/css-modules.d.ts'
			libMap.set(
				CSS_MODULES_DTS,
				[
					"declare module '*.module.css' {",
					'\tconst classes: { readonly [key: string]: string }',
					'\texport default classes',
					'}',
					"declare module '*.css' {",
					'\tconst css: string',
					'\texport default css',
					'}',
					'',
				].join('\n'),
			)
			typeRoots.push(CSS_MODULES_DTS)

			return { ts, compilerOptions, libMap, typeRoots }
		})()
	}
	return corePromise
}

/**
 * Create an isolated language-service environment + the CodeMirror
 * extensions that drive it. One per Playground.
 */
export async function createTsEnvironment() {
	const { ts, compilerOptions, libMap, typeRoots } =
		await loadTsCore()

	// Clone the lib map so this env's user files never leak into another.
	const fsMap = new Map(libMap)
	const system = createSystem(fsMap)
	const env = createVirtualTypeScriptEnvironment(
		system,
		[...typeRoots],
		ts,
		compilerOptions,
	)

	let activePath = '/app.tsx'

	const syncDoc = EditorView.updateListener.of(update => {
		if (update.docChanged) {
			env.updateFile(activePath, update.state.doc.toString() || ' ')
		}
	})

	const completion = autocompletion({
		override: [
			ctx => {
				const before = ctx.matchBefore(/[\w$.'"/@]*/)
				const info = env.languageService.getCompletionsAtPosition(
					activePath,
					ctx.pos,
					{},
				)
				if (!info || !info.entries.length) return null
				return {
					from: before ? before.from : ctx.pos,
					options: info.entries.map(e => ({
						label: e.name,
						type: kindToCmType[e.kind] || 'text',
						boost: e.sortText ? -Number(e.sortText) : 0,
					})),
					validFor: /^[\w$]*$/,
				}
			},
		],
	})

	const hover = hoverTooltip((view, pos) => {
		const info = env.languageService.getQuickInfoAtPosition(
			activePath,
			pos,
		)
		if (!info) return null
		return {
			pos: info.textSpan.start,
			end: info.textSpan.start + info.textSpan.length,
			create() {
				const dom = document.createElement('div')
				dom.className = 'cm-ts-hover'

				const sig = document.createElement('div')
				sig.className = 'cm-ts-hover-sig'
				renderParts(formatSignatureParts(info.displayParts), sig)
				dom.append(sig)

				if (info.documentation && info.documentation.length) {
					const doc = document.createElement('div')
					doc.className = 'cm-ts-hover-doc'
					renderDoc(info.documentation, doc)
					dom.append(doc)
				}

				if (info.tags && info.tags.length) {
					const tags = document.createElement('div')
					tags.className = 'cm-ts-hover-tags'
					renderTags(info.tags, tags)
					dom.append(tags)
				}

				return { dom }
			},
		}
	})

	const diagnostics = linter(view => {
		const all = [
			...env.languageService.getSemanticDiagnostics(activePath),
			...env.languageService.getSyntacticDiagnostics(activePath),
		]
		const doc = view.state.doc
		return all
			.filter(d => d.start != null && d.length != null)
			.map(d => {
				const from = Math.min(d.start, doc.length)
				const to = Math.min(d.start + d.length, doc.length)
				return {
					from,
					to: to > from ? to : from + 1,
					severity:
						d.category === ts.DiagnosticCategory.Error
							? 'error'
							: d.category === ts.DiagnosticCategory.Warning
								? 'warning'
								: 'info',
					message: ts.flattenDiagnosticMessageText(
						d.messageText,
						'\n',
					),
				}
			})
	})

	return {
		extensions: [syncDoc, completion, hover, diagnostics],

		setActivePath(name) {
			activePath = toPath(name)
		},

		createFile(name, content) {
			const path = toPath(name)
			try {
				env.createFile(path, content || ' ')
			} catch {
				env.updateFile(path, content || ' ')
			}
		},

		updateFile(name, content) {
			const path = toPath(name)
			try {
				env.updateFile(path, content || ' ')
			} catch {
				env.createFile(path, content || ' ')
			}
		},

		removeFile(name) {
			const path = toPath(name)
			try {
				env.deleteFile(path)
			} catch {}
		},
	}
}
