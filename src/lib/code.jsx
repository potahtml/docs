import styles from './code.module.css'

import { compress } from './compress.js'
import { Show, signal, ref, memo, effect } from 'pota'
import { getValue } from 'pota/lib'

export function Code(props) {
	if (props.url) {
		return fetch(props.url)
			.then(code => code.text())
			.then(code => {
				return (
					<Code
						{...{
							...props,
							code: code,
							url: null,
						}}
					/>
				)
			})
	}
	const [code, setCode] = signal(getValue(props.code))

	effect(() => {
		setCode(getValue(props.code))
	})

	return (
		<section class={styles.code}>
			<figure>
				<Show when={props.preview !== false}>
					<Preview
						code={code}
						setCode={setCode}
						editable={props.render !== false}
					/>
				</Show>
				<Show when={props.children}>
					<figcaption>{props.children}</figcaption>
				</Show>
				<Show when={props.render !== false}>
					<Render code={code} />
				</Show>
			</figure>
		</section>
	)
}

function Preview(props) {
	return globalThis.prettier
		.format(props.code(), {
			parser: 'babel',
			plugins: [
				globalThis.prettierPluginBabel,
				globalThis.prettierPluginEstree,
			],
			printWidth: 55,
			useTabs: false,
			tabWidth: 2,
			semi: false,
			singleQuote: true,
			quoteProps: 'as-needed',
			jsxSingleQuote: false,
			trailingComma: 'none',
			bracketSpacing: true,
			bracketSameLine: false,
			arrowParens: 'avoid',
			proseWrap: 'never',
			endOfLine: 'lf',
			singleAttributePerLine: true,
		})
		.then(code =>
			globalThis.shiki
				.getHighlighter({
					theme: 'monokai',
					langs: ['js'],
				})
				.then(highlighter => (
					<div
						contentEditable={props.editable ? true : false}
						spellcheck={false}
						onInput={e => props.setCode(e.target.textContent)}
						innerHTML={highlighter.codeToHtml(code, {
							lang: 'js',
						})}
						on:paste={e => {
							e.preventDefault()
							document.execCommand(
								'inserttext',
								false,
								e.clipboardData.getData('text/plain'),
							)
						}}
					/>
				)),
		)
}

// RENDER

// auto size frames when frame loads
window.addEventListener('message', function (e) {
	for (const frame of document.querySelectorAll('iframe')) {
		if (e.source === frame.contentWindow) {
			frame.style.height = JSON.parse(e.data).height + 'px'
			break
		}
	}
})

function Render(props) {
	const codeURL = memo(() =>
		encodeURIComponent(compress({ code: props.code() })),
	)

	const frame = ref()
	return (
		<section class={styles.frame}>
			<iframe
				ref={frame}
				src={() => '/pages/preview/index.html#' + codeURL()}
			/>
			<aside>
				<a
					href="javascript://"
					onClick={() => frame().contentWindow.location.reload()}
				>
					re-run
				</a>
				{' / '}
				<a
					href="javascript://"
					onClick={() => window.open('/playground#' + codeURL())}
				>
					open in playground
				</a>
				{' / '}
				<a
					href="javascript://"
					onClick={() =>
						window.open('/pages/preview/index.html#' + codeURL())
					}
				>
					open in blank
				</a>
			</aside>
		</section>
	)
}
