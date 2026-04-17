import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualTypeScriptEnvironment,
} from '@typescript/vfs'

import { autocompletion } from '@codemirror/autocomplete'
import { linter } from '@codemirror/lint'
import { hoverTooltip, EditorView } from '@codemirror/view'

const toPath = name => (name.startsWith('/') ? name : '/' + name)

const kindToCmType = {
	'var': 'variable',
	'let': 'variable',
	'const': 'constant',
	'function': 'function',
	'method': 'method',
	'property': 'property',
	'class': 'class',
	'interface': 'interface',
	'enum': 'enum',
	'module': 'namespace',
	'type': 'type',
	'keyword': 'keyword',
	'alias': 'type',
	'parameter': 'variable',
}

/**
 * Builds a multi-file TypeScript language-service for CodeMirror.
 *
 * @param {{f: string, c: string}[]} types  bundled ambient types (types.json)
 * @param {{name: string, content: string}[]} initialFiles  user-authored files
 * @param {string} initialActive  filename currently being edited
 */
export async function createTsExtensions(
	types,
	initialFiles,
	initialActive,
) {
	const ts = globalThis.ts
	if (!ts) {
		throw new Error(
			'TypeScript not loaded — expected globalThis.ts (check index.html CDN script).',
		)
	}

	const compilerOptions = {
		target: ts.ScriptTarget.ES2022,
		module: ts.ModuleKind.ESNext,
		jsx: ts.JsxEmit.Preserve,
		moduleResolution: ts.ModuleResolutionKind.NodeJs,
		allowNonTsExtensions: true,
		allowJs: true,
		esModuleInterop: true,
		jsxImportSource: 'pota',
		types: ['pota'],
	}

	const fsMap = await createDefaultMapFromCDN(
		compilerOptions,
		ts.version,
		true,
		ts,
	)

	// Bundled types are treated as addExtraLib-style ambient roots.
	const rootFiles = []
	for (const t of types) {
		const path = '/node_modules/' + t.f
		fsMap.set(path, t.c)
		rootFiles.push(path)
	}

	// Seed user files into the vfs so createVirtualTypeScriptEnvironment
	// can build sourceFiles for them from the very start.
	for (const f of initialFiles) {
		fsMap.set(toPath(f.name), f.content || ' ')
		rootFiles.push(toPath(f.name))
	}

	const system = createSystem(fsMap)
	const env = createVirtualTypeScriptEnvironment(
		system,
		rootFiles,
		ts,
		compilerOptions,
	)

	let activePath = toPath(
		initialActive ||
			(initialFiles[0] && initialFiles[0].name) ||
			'main.tsx',
	)

	// ---- editor extensions (driven by activePath) ----

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
		const text = ts.displayPartsToString(info.displayParts || [])
		const docs = ts.displayPartsToString(info.documentation || [])
		return {
			pos: info.textSpan.start,
			end: info.textSpan.start + info.textSpan.length,
			create() {
				const dom = document.createElement('div')
				dom.className = 'cm-ts-hover'
				dom.style.cssText =
					'padding:6px 8px;font-family:ui-monospace,monospace;font-size:13px;max-width:600px;white-space:pre-wrap;'
				dom.textContent = text + (docs ? '\n\n' + docs : '')
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

	// ---- public file-management API ----

	return {
		extensions: [syncDoc, completion, hover, diagnostics],

		setActivePath(name) {
			activePath = toPath(name)
		},

		createFile(name, content) {
			const path = toPath(name)
			try {
				env.createFile(path, content || ' ')
			} catch (err) {
				// file already existed — update instead
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
