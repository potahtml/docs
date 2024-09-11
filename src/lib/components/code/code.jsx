import styles from './code.module.css'

import { effect, memo, ref, signal } from 'pota'
import { getValue, sheet } from 'pota/std'
import { Show } from 'pota/web'
import { compress } from '../../compress.js'
import { prettierConfig } from '../../prettier-config.js'

import 'pota/plugin/pasteTextPlain'

import { setCDN } from 'solid-shiki-textarea/custom-element'

setCDN('/assets/shiki')

import shikicss from './solid-shiki-textarea.css?raw'

const shikiStyleSheet = sheet(shikicss)

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
		<section
			class={styles.container}
			flair="col grow"
		>
			<figure flair="col grow">
				<Show when={props.preview !== false}>
					<Preview
						code={code()}
						setCode={setCode}
						editable={props.render !== false}
						scroll={props.scroll}
					/>
				</Show>
				<Show when={props.render !== false}>
					<Render
						codeURL={codeURL}
						frame={frame}
					/>
				</Show>

				<Show when={props.children}>
					<figcaption flair="text-multiline width">
						{props.children}
					</figcaption>
				</Show>
			</figure>
			<Show when={props.render !== false}>
				<aside flair="grow row right">
					<div>
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
								onClick={() =>
									window.open('/playground#' + codeURL())
								}
							>
								open in playground
							</a>
							{' / '}
						</span>
						<a
							href="javascript://"
							onClick={() =>
								window.open(
									'/pages/@playground/preview/index.html#' +
										codeURL(),
								)
							}
						>
							open in blank
						</a>
					</div>
				</aside>
			</Show>
		</section>
	)
}

function Preview(props) {
	return globalThis.prettier
		.format(props.code, {
			plugins: [
				globalThis.prettierPluginBabel,
				globalThis.prettierPluginEstree,
			],
			...prettierConfig,
		})
		.then(code => (
			<section
				class={styles.shikiContainer}
				bool:editable={props.editable}
			>
				<section
					attr:flair={props.scroll === false ? 'no-scroll' : 'scroll'}
					class={styles.shiki}
				>
					<shiki-textarea
						lang="jsx"
						theme="monokai"
						value={code}
						stylesheet={shikiStyleSheet}
						onInput={e => {
							props.setCode(e.target.value)
						}}
						editable={props.editable ? true : false}
					/>
				</section>
			</section>
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
							loading="lazy"
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
