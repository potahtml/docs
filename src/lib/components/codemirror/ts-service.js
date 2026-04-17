import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualTypeScriptEnvironment,
} from '@typescript/vfs'

import { autocompletion } from '@codemirror/autocomplete'
import { linter } from '@codemirror/lint'
import { hoverTooltip, EditorView } from '@codemirror/view'

const ENTRY = '/main.tsx'

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

export async function createTsExtensions(types) {
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

	const rootFiles = [ENTRY]
	for (const t of types) {
		const path = '/node_modules/' + t.f
		fsMap.set(path, t.c)
		rootFiles.push(path)
	}
	fsMap.set(ENTRY, ' ')

	const system = createSystem(fsMap)
	const env = createVirtualTypeScriptEnvironment(
		system,
		rootFiles,
		ts,
		compilerOptions,
	)

	const syncDoc = EditorView.updateListener.of(update => {
		if (update.docChanged) {
			env.updateFile(ENTRY, update.state.doc.toString() || ' ')
		}
	})

	const completion = autocompletion({
		override: [
			ctx => {
				const before = ctx.matchBefore(/[\w$.'"/@]*/)
				const info = env.languageService.getCompletionsAtPosition(
					ENTRY,
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
			ENTRY,
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
			...env.languageService.getSemanticDiagnostics(ENTRY),
			...env.languageService.getSyntacticDiagnostics(ENTRY),
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
		setDoc(value) {
			env.updateFile(ENTRY, value || ' ')
		},
	}
}
