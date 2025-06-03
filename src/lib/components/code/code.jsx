import styles from './code.module.css'

import { effect, memo, ref, signal } from 'pota'
import { getValue, sheet } from 'pota/std'
import { Show } from 'pota/components'
import { compress } from '../../compress.js'

import snippetcss from './tm-textarea-stylesheet.css?raw'
import { prettier } from '../../prettier.js'
const snippetStyleSheet = sheet(snippetcss)

import { TabIndentation } from 'tm-textarea/bindings/tab-indentation'
import { transform } from '../../transform.js'

// auto size frames when frame loads
window.addEventListener('message', function (e) {
	for (const frame of document.querySelectorAll('iframe')) {
		if (e.source === frame.contentWindow) {
			const size = JSON.parse(e.data).height
			frame.style.height = size + 'px'
			break
		}
	}
})

export function Code(props) {
	if (props.url) {
		return fetch(props.url)
			.then(code => code.text())
			.then(code => {
				return (
					<Code
						children={props.children}
						preview={props.preview}
						render={props.render}
						code={code}
					/>
				)
			})
	}

	// TODO change this for writable
	const [code, setCode] = signal(getValue(props.code))

	effect(() => {
		setCode(getValue(props.code))
	})

	const codeURL = memo(() => compress(code()))

	const frame = ref()

	// transformed code

	const [transformedURL, setTransformedURL] = signal('')

	effect(() => {
		props.render !== false &&
			transform(code()).then(code =>
				setTransformedURL(compress(code)),
			)
	})

	return (
		<section
			class={styles.container}
			flair="col grow"
		>
			<form>
				<figure flair="col grow">
					<Show when={props.preview !== false}>
						<section
							class={styles.snippetContainer}
							data-editable={props.render !== false}
						>
							<tm-textarea
								ref={TabIndentation.binding}
								class="snippet"
								grammar="tsx"
								theme="monokai"
								value={prettier(code())}
								data-editable={props.render !== false}
								prop:editable={props.render !== false}
								stylesheet={snippetStyleSheet}
								on:input={e => setCode(e.target.value)}
							/>
						</section>
					</Show>
					<Show
						when={() => props.render !== false && transformedURL()}
					>
						<section class={styles.frame}>
							<iframe
								loading="lazy"
								title="Live Code Example"
								name="Live Code Example"
								ref={frame}
								src={() =>
									'/pages/@playground/preview/index.html' +
									(window.location.href.includes('playground')
										? '?playground'
										: '') +
									'#' +
									transformedURL()
								}
							/>
						</section>
					</Show>

					<Show when={props.children}>
						<figcaption flair="text-multiline width">
							{props.children}
						</figcaption>
					</Show>
				</figure>
				<Show when={() => props.render !== false && frame()}>
					<aside flair="row width right">
						<div style="text-align:right">
							<a
								href="javascript://"
								on:click={() =>
									frame().contentWindow.location.reload()
								}
							>
								re-run
							</a>
							{' / '}
							<span class="no-playground">
								<a
									href="javascript://"
									on:click={() =>
										window.open('/playground#' + codeURL())
									}
								>
									open in playground
								</a>
								{' / '}
							</span>
							<a
								href="javascript://"
								on:click={() =>
									window.open(
										'/pages/@playground/preview/index.html#' +
											transformedURL(),
									)
								}
							>
								open in blank
							</a>
						</div>
					</aside>
				</Show>
			</form>
		</section>
	)
}
