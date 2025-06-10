import styles from './monaco.module.css'

import { cleanup, signal, withValue } from 'pota'

import { onDocumentSize } from 'pota/plugin/useDocumentSize'

import { Show } from 'pota/components'

import types from './types.json' with { type: 'json' }

const [scriptsLoaded, setScriptsLoaded] = signal(false)

function loadScriptInOrder(...scripts) {
	return new Promise(async resolve => {
		for (const script of scripts) {
			await loadScript(script)
		}
		setTimeout(resolve)
	})
}
function loadScript(src) {
	return new Promise(resolve => {
		const script = document.createElement('script')
		script.onload = () => {
			setTimeout(resolve)
		}
		script.crossOrigin = 'anonymous'
		script.src = src
		document.head.append(script)
	})
}

let scriptsLoading = false

const MonacoVersion = '0.46.0'

/**
 * Create a Monaco editor
 *
 * @param {{
 * 	value?: string
 * 	'on:change'?: Function
 * 	language?: string
 * 	delay?: number
 * 	'on:format'?: Function
 * 	theme?: Accessor<string>
 * }} props
 */
export function Monaco(props) {
	// required by the imported scripts
	if (!globalThis.require) {
		globalThis.require = {}
	}
	if (!globalThis.require.paths) {
		globalThis.require.paths = {
			vs: `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MonacoVersion}/min/vs`,
		}
	}
	if (!globalThis.require.paths.vs) {
		globalThis.require.paths.vs = `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MonacoVersion}/min/vs`
	}

	if (!scriptsLoading) {
		scriptsLoading = true

		loadScriptInOrder(
			`https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MonacoVersion}/min/vs/loader.js`,
			`https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MonacoVersion}/min/vs/editor/editor.main.nls.js`,
			`https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MonacoVersion}/min/vs/editor/editor.main.js`,
		).then(async x => {
			/** @type import('monaco-editor') */
			const monaco = globalThis.monaco

			for (const type of types) {
				monaco.languages.typescript.typescriptDefaults.addExtraLib(
					type.c,
					'file:///project/node_modules/' + type.f,
				)
			}

			// compiler options
			monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
				{
					allowNonTsExtensions: true,
					jsxImportSource: 'pota',
					types: ['pota'],
					jsx: monaco.languages.typescript.JsxEmit.Preserve,
					target: monaco.languages.typescript.ScriptTarget.ESNext,
					moduleResolution:
						monaco.languages.typescript.ModuleResolutionKind.NodeJs,
				},
			)

			monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
				{
					noSemanticValidation: false,
					noSyntaxValidation: false,
				},
			)

			/** @type import('monaco-editor').editor.ITextModel */
			const model = monaco.editor.createModel(
				``,
				'',
				monaco.Uri.parse('file:///project/main.tsx'),
			)
			monaco.model = model

			setScriptsLoaded(true)
		})
	}

	return (
		<Show when={scriptsLoaded}>
			{() => (
				<div
					class={styles.container}
					use:ref={async container => {
						/** @type import('monaco-editor') */
						const monaco = globalThis.monaco

						/** @type import('monaco-editor').editor.IStandaloneCodeEditor */
						const editor = monaco.editor.create(container, {
							model: monaco.model,
							language: props.language || 'typescript',
							fontSize: 17,
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
							wordWrap: props.language === 'json' ? 'on' : 'off',
						})

						withValue(props.value, value => {
							editor.setValue(value)
						})
						withValue(props.theme, value => {
							monaco.editor.setTheme(value || 'vs-dark')
						})

						// cleanup
						cleanup(() => editor.dispose())

						// on code change
						let codeChangeTimeout
						editor.getModel().onDidChangeContent(event => {
							if (props['on:change']) {
								clearTimeout(codeChangeTimeout)
								codeChangeTimeout = setTimeout(
									() => props['on:change'](editor.getValue()),
									props.delay || 200,
								)
							}
						})

						// resize
						onDocumentSize(() => editor.layout())

						// code change

						addEvent(window, 'monacoCodeChanged', e => {
							if (e.detail) {
								editor.setValue(e.detail)
							}
						})
						// shorcuts
						editor.onKeyDown(e => {
							if (
								// CTRL + S
								(e.keyCode === 49 && e.ctrlKey) ||
								// SHIFT + ALT + F
								(e.keyCode === 36 && e.altKey && e.shiftKey)
							) {
								e.preventDefault()
								if (props['on:format']) {
									props['on:format'](editor.getValue())
										.then(code => {
											const position = editor.getPosition()
											editor.setValue(code)
											if (position) editor.setPosition(position)
										})
										.catch(e => {
											editor
												.getAction('editor.action.formatDocument')
												.run()
										})
								} else {
									editor
										.getAction('editor.action.formatDocument')
										.run()
								}
							}
						})
					}}
				>
					<link
						rel="stylesheet"
						data-name="vs/editor/editor.main"
						crossorigin="anonymous"
						href={`https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MonacoVersion}/min/vs/editor/editor.main.min.css`}
					/>
				</div>
			)}
		</Show>
	)
}

Monaco.themes = ['vs', 'vs-dark', 'hc-black', 'hc-light']
