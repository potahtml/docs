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
const TYPES_URL = '/node_modules/pota/generated/docs/types.json'

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

// Append text to `host`, turning bare http(s) URLs into real links.
// Trailing sentence punctuation is kept outside the anchor.
const URL_RE = /https?:\/\/[^\s<>")']+/g
function appendText(text, host) {
	let last = 0
	for (const m of text.matchAll(URL_RE)) {
		let url = m[0]
		const trail = /[.,;:]+$/.exec(url)
		if (trail) url = url.slice(0, -trail[0].length)
		if (m.index > last) {
			host.append(document.createTextNode(text.slice(last, m.index)))
		}
		const a = document.createElement('a')
		a.href = url
		a.target = '_blank'
		a.rel = 'noreferrer noopener'
		a.textContent = url
		host.append(a)
		if (trail) host.append(document.createTextNode(trail[0]))
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
			}
			const libMap = await createDefaultMapFromCDN(
				compilerOptions,
				ts.version,
				true,
				ts,
			)
			const typeRoots = []
			for (const t of types) {
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
				renderParts(info.displayParts, sig)
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
