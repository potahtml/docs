import styles from './monaco.module.css'

import {
	addEventListener,
	cleanup,
	effect,
	memo,
	ref,
	signal,
	untrack,
} from 'pota'
import { onDocumentSize } from 'pota/plugin/useDocumentSize'

import { getValue } from 'pota/std'

const [scriptLoading, setScriptsLoading, updateScriptsLoading] =
	signal(0)
const scriptsLoaded = memo(() => scriptLoading() === 3)

function loadScript(src, onload) {
	const script = document.createElement('script')
	script.crossOrigin = 'anonymous'
	script.onload = onload
	document.head.append(script)
	script.src = src
}

let loading = false
function load() {
	// load only once ever
	if (loading) return
	loading = true

	// required by the imported scripts
	if (!globalThis.require) {
		globalThis.require = {}
	}
	if (!globalThis.require.paths) {
		globalThis.require.paths = {}
	}
	globalThis.require.paths.vs =
		'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'

	// load scripts, in order
	loadScript(
		'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.js',
		() => {
			updateScriptsLoading(value => value + 1)
			loadScript(
				'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/editor/editor.main.nls.js',
				() => {
					updateScriptsLoading(value => value + 1)
					loadScript(
						'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/editor/editor.main.js',
						() => {
							updateScriptsLoading(value => value + 1)
						},
					)
				},
			)
		},
	)
}

export function Monaco(props) {
	load()

	const container = ref()

	effect(() => {
		if (!container() || !scriptsLoaded()) return

		const editor = globalThis.monaco.editor.create(container(), {
			value: untrack(() => getValue(props.code)),
			language: props.language || 'javascript',
			fontSize: 17,
			roundedSelection: false,
			theme: 'vs-dark',
			scrollbar: {
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
			wordWrap: props.language === 'json',
		})

		// cleanup
		cleanup(() => editor.dispose())

		// on code change
		let codeChangeTimeout
		editor.getModel().onDidChangeContent(event => {
			if (props.onChange) {
				clearTimeout(codeChangeTimeout)
				codeChangeTimeout = setTimeout(
					() => props.onChange(editor.getValue()),
					props.delay || 200,
				)
			}
		})

		// resize
		onDocumentSize(() => editor.layout())

		// shorcuts
		editor.onKeyDown(e => {
			if (
				// CTRL + S
				(e.keyCode === 49 && e.ctrlKey) ||
				// SHIFT + ALT + F
				(e.keyCode === 36 && e.altKey && e.shiftKey)
			) {
				e.preventDefault()
				if (props.onFormat && props.language === 'javascript') {
					props
						.onFormat(editor.getValue())
						.then(code => editor.setValue(code))
				} else {
					editor.getAction('editor.action.formatDocument').run()
				}
			}
		})
	})

	return (
		<div
			class={styles.container}
			ref={container}
		>
			<link
				rel="stylesheet"
				data-name="vs/editor/editor.main"
				crossorigin="anonymous"
				href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/editor/editor.main.min.css"
			/>
		</div>
	)
}
