import styles from './monaco.module.css'

import { addEvent, cleanup, withValue } from 'pota'

import { onDocumentSize } from 'pota/use/resize'

import types from '../../../../node_modules/pota/generated/docs/types.json' with { type: 'json' }

/** @type import('monaco-editor') */
const monaco = globalThis.monaco

// Register bundled ambient types once. These attach to Monaco's global
// TS service and are visible to every model we create.
for (const type of types) {
	monaco.languages.typescript.typescriptDefaults.addExtraLib(
		type.c,
		'file:///project/node_modules/' + type.f,
	)
}

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
	allowNonTsExtensions: true,
	jsxImportSource: 'pota',
	types: ['pota'],
	jsx: monaco.languages.typescript.JsxEmit.Preserve,
	target: monaco.languages.typescript.ScriptTarget.ESNext,
	moduleResolution:
		monaco.languages.typescript.ModuleResolutionKind.NodeJs,
})

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
	noSemanticValidation: false,
	noSyntaxValidation: false,
})

const uriFor = name => monaco.Uri.parse('file:///project/' + name)

const languageFor = name => {
	if (name.endsWith('.css')) return 'css'
	if (name.endsWith('.json')) return 'json'
	if (name.endsWith('.html')) return 'html'
	if (name.endsWith('.md') || name.endsWith('.markdown'))
		return 'markdown'
	return 'typescript'
}

/**
 * Multi-file Monaco editor.
 *
 * @param {{
 *   files:       () => { name: string, content: string }[],
 *   activeFile:  () => string,
 *   cursor?:     () => { file: string, offset: number } | null,
 *   'on:change'?:(name: string, content: string) => void,
 *   'on:cursorChange'?:(file: string, offset: number) => void,
 *   'on:format'?:(code: string) => Promise<string>,
 *   language?:   string,
 *   delay?:      number,
 *   theme?:      () => string,
 * }} props
 */
export function Monaco(props) {
	return (
		<div
			class={styles.container}
			use:ref={container => {
				/** @type {Map<string, import('monaco-editor').editor.ITextModel>} */
				const modelMap = new Map()
				/** Per-model cursor/scroll so tab-swap restores where the
				 * user was. Monaco doesn't do this automatically. */
				const viewStateMap = new Map()
				/** Last content we pushed out to the parent — used to
				 * ignore the echo on files-prop updates. */
				const lastSentContent = new Map()

				let editor
				let currentName = null
				let codeChangeTimeout = null
				let contentSubscription = null

				const makeModel = (name, content) => {
					// If a model with this URI already exists (e.g. after
					// rename or across remounts), reuse/overwrite it.
					const uri = uriFor(name)
					const existing = monaco.editor.getModel(uri)
					if (existing) {
						if (existing.getValue() !== (content || '')) {
							existing.setValue(content || '')
						}
						return existing
					}
					return monaco.editor.createModel(
						content || '',
						props.language || languageFor(name),
						uri,
					)
				}

				const scheduleSave = () => {
					if (!currentName) return
					clearTimeout(codeChangeTimeout)
					const name = currentName
					codeChangeTimeout = setTimeout(() => {
						const m = modelMap.get(name)
						if (!m) return
						const content = m.getValue()
						lastSentContent.set(name, content)
						if (props['on:change']) {
							props['on:change'](name, content)
						}
						if (props['on:cursorChange']) {
							const pos = editor.getPosition()
							if (pos) {
								props['on:cursorChange'](
									name,
									m.getOffsetAt(pos),
								)
							}
						}
					}, props.delay || 200)
				}

				let cursorSubscription = null
				const bindChanges = model => {
					if (contentSubscription) {
						contentSubscription.dispose()
						contentSubscription = null
					}
					contentSubscription = model.onDidChangeContent(() =>
						scheduleSave(),
					)
				}

				// ---- bootstrap ----

				for (const f of props.files()) {
					modelMap.set(f.name, makeModel(f.name, f.content))
				}

				const initialName =
					props.activeFile() || props.files()[0]?.name || ''
				const initialModel =
					modelMap.get(initialName) || makeModel(initialName, '')
				modelMap.set(initialName, initialModel)
				currentName = initialName

				/** @type {import('monaco-editor').editor.IStandaloneCodeEditor} */
				editor = monaco.editor.create(container, {
					model: initialModel,
					fontSize: 18,
					roundedSelection: false,
					scrollbar: {
						useShadows: false,
						vertical: 'visible',
						horizontal: 'visible',
						verticalScrollbarSize: 10,
						horizontalScrollbarSize: 10,
					},
					formatOnType: false,
					formatOnPaste: true,
					renderWhitespace: 'none',
					renderLineHighlight: 'none',
					automaticLayout: true,
					minimap: { enabled: false },
					scrollBeyondLastLine: false,
					wordWrap: 'bounded',
					smoothScrolling: false,
					mouseWheelScrollSensitivity: 4,
					autoClosingBrackets: 'never',
					autoClosingQuotes: 'never',
					fontLigatures: '',
					autoSurround: 'never',
					wordWrapColumn: 70,
				})

				bindChanges(initialModel)

				// Cursor tracking — piggy-back on the content debounce so
				// we save on keystrokes and clicks without waiting for
				// focusout.
				cursorSubscription = editor.onDidChangeCursorPosition(() =>
					scheduleSave(),
				)

				// Restore cursor after focus so monaco doesn't reset the
				// position when focus lands on its default location.
				const initialCursor = props.cursor ? props.cursor() : null
				setTimeout(() => {
					editor.focus()
					if (
						initialCursor &&
						initialCursor.file === currentName &&
						typeof initialCursor.offset === 'number'
					) {
						const pos = initialModel.getPositionAt(
							initialCursor.offset,
						)
						editor.setPosition(pos)
						editor.revealPositionInCenter(pos)
					}
				}, 0)

				// ---- focusout flush ----

				const flush = () => {
					if (codeChangeTimeout) {
						clearTimeout(codeChangeTimeout)
						codeChangeTimeout = null
						if (props['on:change'] && currentName) {
							const m = modelMap.get(currentName)
							if (m) props['on:change'](currentName, m.getValue())
						}
					}
					if (props['on:cursorChange'] && currentName) {
						const m = modelMap.get(currentName)
						const pos = editor.getPosition()
						if (m && pos) {
							props['on:cursorChange'](
								currentName,
								m.getOffsetAt(pos),
							)
						}
					}
				}
				container.addEventListener('focusout', flush)

				// ---- reactive: file list ----

				withValue(props.files, files => {
					if (!Array.isArray(files)) return
					const nextNames = new Set(files.map(f => f.name))

					// Removed files
					for (const name of [...modelMap.keys()]) {
						if (!nextNames.has(name)) {
							const m = modelMap.get(name)
							if (m) m.dispose()
							modelMap.delete(name)
							viewStateMap.delete(name)
							lastSentContent.delete(name)
						}
					}

					// Added / content-synced files (skip echoes of our own
					// writes to avoid clobbering in-progress typing/cursor).
					for (const f of files) {
						if (!modelMap.has(f.name)) {
							modelMap.set(f.name, makeModel(f.name, f.content))
							continue
						}
						if (lastSentContent.get(f.name) === f.content) {
							continue
						}
						const m = modelMap.get(f.name)
						if (m.getValue() !== (f.content || '')) {
							m.setValue(f.content || '')
						}
					}
				})

				// ---- reactive: active file ----

				withValue(props.activeFile, name => {
					if (!name || name === currentName) return
					// Save current model's view state so returning to it
					// restores cursor + scroll.
					if (currentName) {
						const snap = editor.saveViewState()
						if (snap) viewStateMap.set(currentName, snap)
					}
					let model = modelMap.get(name)
					if (!model) {
						const f = props.files().find(x => x.name === name)
						model = makeModel(name, f?.content || '')
						modelMap.set(name, model)
					}
					editor.setModel(model)
					currentName = name
					bindChanges(model)
					const snap = viewStateMap.get(name)
					if (snap) editor.restoreViewState(snap)
					editor.focus()
				})

				// ---- reactive: theme ----

				withValue(props.theme, value => {
					monaco.editor.setTheme(value || 'vs-dark')
				})

				// External "replace current tab's content" event.
				addEvent(window, 'monacoCodeChanged', e => {
					if (e.detail) {
						const m = modelMap.get(currentName)
						if (m) m.setValue(e.detail.trim())
					}
				})

				// Format shortcut
				editor.onKeyDown(e => {
					if (
						(e.keyCode === 49 && e.ctrlKey) || // CTRL + S
						(e.keyCode === 36 && e.altKey && e.shiftKey) // SHIFT+ALT+F
					) {
						e.preventDefault()
						if (props['on:format']) {
							props['on:format'](editor.getValue())
								.then(code => {
									const position = editor.getPosition()
									editor.setValue(code)
									if (position) editor.setPosition(position)
								})
								.catch(() => {
									editor
										.getAction('editor.action.formatDocument')
										.run()
								})
						} else {
							editor.getAction('editor.action.formatDocument').run()
						}
					}
				})

				onDocumentSize(() => editor.layout())

				cleanup(() => {
					flush()
					if (contentSubscription) contentSubscription.dispose()
					if (cursorSubscription) cursorSubscription.dispose()
					editor.dispose()
					for (const m of modelMap.values()) m.dispose()
				})
			}}
		>
			<link
				rel="stylesheet"
				data-name="vs/editor/editor.main"
				crossorigin="anonymous"
				href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/editor/editor.main.min.css"
			/>
		</div>
	)
}

Monaco.themes = ['vs', 'vs-dark', 'hc-black', 'hc-light']
