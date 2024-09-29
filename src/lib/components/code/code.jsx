import styles from './code.module.css'

import { effect, memo, ref, signal } from 'pota'
import { getValue, sheet } from 'pota/std'
import { Show } from 'pota/web'
import { compress } from '../../compress.js'

import snippetcss from './tm-textarea-stylesheet.css?raw'
import { prettier } from '../../prettier.js'
const snippetStyleSheet = sheet(snippetcss)

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
			<form>
				<figure flair="col grow scroll-y">
					<Show when={props.preview !== false}>
						<section
							class={styles.snippetContainer}
							bool:editable={props.render !== false}
						>
							<tm-textarea
								class="snippet"
								grammar="tsx"
								theme="monokai"
								value={prettier(code().code ? code().code : code())}
								bool:editable={props.editable}
								stylesheet={snippetStyleSheet}
								onInput={e => setCode(e.target.value)}
								editable={props.render !== false}
							/>
						</section>
					</Show>
					<Show when={props.render !== false}>
						<section class={styles.frame}>
							<iframe
								allowTransparency={true}
								/*loading="lazy"*/
								title="Live Code Example"
								name="Live Code Example"
								ref={frame}
								src={() =>
									'/pages/@playground/preview/index.html' +
									(window.location.href.includes('playground')
										? '?playground'
										: '') +
									'#' +
									codeURL()
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
				<Show when={props.render !== false}>
					<aside flair="row width right">
						<div style="text-align:right">
							<a
								href="javascript://"
								onClick={() =>
									frame().contentWindow.location.reload()
								}
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
			</form>
		</section>
	)
}
