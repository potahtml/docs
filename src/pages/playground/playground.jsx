import styles from './playground.module.css'
import { CHEATSHEET, Code, Header, prettierConfig } from '#main'

import {
	addEventListener,
	cleanup,
	effect,
	ref,
	signal,
	untrack,
} from 'pota'

import { compress, uncompress } from '../../lib/compress.js'
import example from './example.jsx'

function getCodeFromURL() {
	return window.location.hash !== ''
		? uncompress(
				decodeURIComponent(window.location.hash.substring(1)),
			).code
		: undefined
}

export default function () {
	const container = ref()
	const [autorun, setAutorun] = signal(true)

	// initial value for code
	const [code, setCode] = signal(getCodeFromURL() || example)
	const [delayedCode, setDelayedCode] = signal(code)

	// update delayed code
	let updateDelayedCodeTimeout
	effect(() => {
		code()
		clearTimeout(updateDelayedCodeTimeout)
		updateDelayedCodeTimeout = setTimeout(
			() => setDelayedCode(code()),
			200,
		)
	})

	effect(() => {
		history.pushState(
			undefined,
			'',
			'#' + encodeURIComponent(compress({ code: delayedCode() })),
		)
	})

	effect(() => {
		if (!container()) return

		const editor = globalThis.monaco.editor.create(container(), {
			value: untrack(code),
			language: 'javascript',
			fontSize: 17,
			roundedSelection: false,
			theme: 'vs-dark',
			scrollbar: {
				vertical: 'auto',
				horizontal: 'auto',
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
		})

		// on code change
		editor
			.getModel()
			.onDidChangeContent(event => setCode(editor.getValue()))

		// shorcuts
		editor.onKeyDown(e => {
			if (
				// CTRL + S
				(e.keyCode === 49 && e.ctrlKey) ||
				// SHIFT + ALT + F
				(e.keyCode === 36 && e.altKey && e.shiftKey)
			) {
				e.preventDefault()

				globalThis.prettier
					.format(editor.getValue(), {
						plugins: [
							globalThis.prettierPluginBabel,
							globalThis.prettierPluginEstree,
						],
						...prettierConfig,
						printWidth: 70,
					})
					.then(code => editor.setValue(code))
			}
		})

		// resize
		addEventListener(window, 'resize', () => editor.layout(), false)

		// update code when using back button
		addEventListener(
			window,
			'popstate',
			() => {
				const code = getCodeFromURL()
				if (code !== editor.getValue()) {
					editor.setValue(code)
				}
			},
			false,
		)

		// cleanup
		cleanup(() => editor.dispose())
	})

	return (
		<>
			<Header title="Playground"></Header>

			<section flair="row grow full">
				<section flair="row grow">
					<div
						class={styles.container}
						ref={container}
					></div>
				</section>
				<section flair="col grow">
					<Code
						code={() => autorun() && delayedCode()}
						render={true}
						preview={false}
					/>
					<section flair="col">
						<label
							flair="row center selection-none"
							style="z-index:1"
						>
							<input
								name="button"
								type="checkbox"
								checked={autorun()}
								onClick={() => setAutorun(checked => !checked)}
							/>{' '}
							Autorun
						</label>
					</section>
					<br />

					<section flair="scroll-y scroll-thin grow col">
						<CHEATSHEET />
					</section>
				</section>
			</section>
		</>
	)
}
