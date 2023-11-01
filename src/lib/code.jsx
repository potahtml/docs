import styles from './code.module.css'

import * as prettier from 'https://unpkg.com/prettier@3.0.3/standalone.mjs'
import prettierPluginBabel from 'https://unpkg.com/prettier@3.0.3/plugins/babel.mjs'
import prettierPluginEstree from 'https://unpkg.com/prettier@3.0.3/plugins/estree.mjs'

import { compress } from './compress.js'
import { Show, signal, ref, memo, effect } from 'pota'
import { getValue } from 'pota/lib'

export function Code(props) {
	if (props.url) {
		return (
			window.location.href.includes('localhost')
				? import(/* @vite-ignore */ props.url + '?raw').then(code =>
						code.default.toString(),
				  )
				: fetch(props.url).then(code => code.text())
		).then(code => {
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
	return prettier
		.format(props.code(), {
			parser: 'babel',
			plugins: [prettierPluginBabel, prettierPluginEstree],
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
				src={() => '/public/playground/index.html#' + codeURL()}
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
						window.open('/public/playground/index.html#' + codeURL())
					}
				>
					open in blank
				</a>
			</aside>
		</section>
	)
}
