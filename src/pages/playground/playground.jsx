import styles from './playground.module.css'
import { CHEATSHEET, Code, Header, prettierConfig } from '#main'

import {
	addEventListener,
	cleanup,
	effect,
	onReady,
	ref,
	signal,
	untrack,
} from 'pota'

import { compress, uncompress } from '../../lib/compress.js'
import example from './example.jsx'

export default function () {
	const container = ref()
	const [autorun, setAutorun] = signal(true)

	// initial value for code
	const [code, setCode] = signal(
		window.location.hash !== ''
			? uncompress(
					decodeURIComponent(window.location.hash.substring(1)),
				).code
			: example,
	)

	// update the hash
	effect(() => {
		if (code()) {
			history.pushState(
				undefined,
				'',
				'#' + encodeURIComponent(compress({ code: code() })),
			)
		}
	})

	effect(() => {
		if (container()) {
			/*
				monaco.editor.defineTheme('monokai', monokai)
				monaco.editor.setTheme('monokai')
			*/

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

			editor
				.getModel()
				.onDidChangeContent(event => setCode(editor.getValue()))

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

			addEventListener(
				window,
				'resize',
				() => {
					// console.log('resize')
					editor.layout()
				},
				false,
			)

			cleanup(() => {
				editor.dispose()
			})
		}
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
						code={() => autorun() && code()}
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
