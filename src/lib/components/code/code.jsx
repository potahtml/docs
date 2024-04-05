import styles from './code.module.css'

import { compress } from '../../compress.js'
import { signal, ref, memo, effect } from 'pota'
import { Show } from 'pota/web'
import { getValue } from 'pota/lib'
import { prettierConfig } from '../../prettier-config.js'

import 'pota/plugins/pasteTextPlain'

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

	const [code, setCode] = signal(getValue(props.code), {
		equals: false,
	})

	effect(() => {
		setCode(getValue(props.code))
	})

	const codeURL = memo(() => compress(code()))

	const frame = ref()

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
				<Show when={props.render !== false}>
					<Render
						codeURL={codeURL}
						frame={frame}
					/>
				</Show>
				<Show when={props.children}>
					<figcaption flair="text-multiline">
						{props.children}
					</figcaption>
				</Show>
			</figure>
			<Show when={props.render !== false}>
				<aside>
					<a
						href="javascript://"
						onClick={() => frame().contentWindow.location.reload()}
					>
						re-run
					</a>
					{' / '}
					<span class="no-playground">
						<a
							href="javascript://"
							onClick={() => window.open('/playground#' + codeURL())}
						>
							open in playground
						</a>
						{' / '}
					</span>
					<a
						href="javascript://"
						onClick={() =>
							window.open(
								'/pages/@playground/preview/index.html#' + codeURL(),
							)
						}
					>
						open in blank
					</a>
				</aside>
			</Show>
		</section>
	)
}

function Preview(props) {
	return globalThis.prettier
		.format(props.code(), {
			plugins: [
				globalThis.prettierPluginBabel,
				globalThis.prettierPluginEstree,
			],
			...prettierConfig,
		})
		.then(code =>
			globalThis.shiki.then(highlighter =>
				highlighter.codeToHtml(code, {
					lang: 'js',
				}),
			),
		)
		.then(code => (
			<div
				contentEditable={props.editable ? true : false}
				spellcheck={false}
				onInput={e => props.setCode(e.target.innerText)}
				innerHTML={code}
				pasteTextPlain
			/>
		))
}

// RENDER

// auto size frames when frame loads
window.addEventListener('message', function (e) {
	for (const frame of document.querySelectorAll('iframe')) {
		if (e.source === frame.contentWindow) {
			const size = JSON.parse(e.data).height
			if (size < 600) {
				frame.style.height = size + 'px'
			}
			break
		}
	}
})

function Render(props) {
	return (
		<section class={styles.frame}>
			{() => {
				props.codeURL() // tracks to force reruns
				return new Promise(resolve =>
					resolve(
						<iframe
							title="Live Code Example"
							name="Live Code Example"
							ref={props.frame}
							src={() =>
								'/pages/@playground/preview/index.html' +
								(window.location.href.includes('playground')
									? '?playground'
									: '') +
								'#' +
								props.codeURL()
							}
						/>,
					),
				)
			}}
		</section>
	)
}
