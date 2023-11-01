import styles from './playground.module.css'
import { CHEATSHEET, Code, Header } from '#main'

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

// monaco
import * as monaco from 'monaco-editor'
import editor from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import json from 'monaco-editor/esm/vs/language/json/json.worker.js?worker'
import css from 'monaco-editor/esm/vs/language/css/css.worker.js?worker'
import html from 'monaco-editor/esm/vs/language/html/html.worker.js?worker'
import ts from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker'
// import monokai from './monokai.js'

self.MonacoEnvironment = {
	getWorker: function (moduleId, label) {
		if (label === 'json') return new json()
		if (label === 'css') return new css()
		if (label === 'html') return new html()
		if (label === 'typescript' || label === 'javascript')
			return new ts()
		return new editor()
	},
}

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
			history.replaceState(
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

			const editor = monaco.editor.create(container(), {
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

			<section
				flair="row grow"
				style="max-height:90%"
			>
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
					<section
						flair="col"
						style="top:6px;position: relative;"
					>
						<label flair="row center selection-none">
							<input
								type="checkbox"
								checked={autorun()}
								onClick={() => setAutorun(checked => !checked)}
							/>{' '}
							Autorun
						</label>
					</section>
					<section
						style="max-height: 100%;margin-top:10px;"
						flair="scroll-y scroll-thin grow col"
					>
						<CHEATSHEET />
					</section>
				</section>
			</section>
		</>
	)
}
