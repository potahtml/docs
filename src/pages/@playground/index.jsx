import styles from './playground.module.css'

import { CheatSheetText } from '../../lib/components/cheatsheet.jsx'
import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'

import { addEvent, effect, memo, signal } from 'pota'
import { For, Show, Tabs } from 'pota/components'

import { compress, uncompress } from '../../lib/compress.js'
import example from './default-example.js'
import { prettier } from '../../lib/prettier.js'
import { transform } from '../../lib/transform.js'

import 'pota/use/clipboard'

import { Monaco } from '../../lib/components/monaco/monaco.jsx'
import { emit } from 'pota/use/event'

const themesMonaco = [
	//'vs',
	'vs-dark',
	'hc-black',
	//'hc-light'
]
const themesTM = [
	'andromeeda',
	'aurora-x',
	'ayu-dark',
	'catppuccin-frappe',
	/*'catppuccin-latte',*/
	'catppuccin-macchiato',
	'catppuccin-mocha',
	'dark-plus',
	'dracula-soft',
	'dracula',
	/*'everforest-dark',*/
	'everforest-light',
	'github-dark-default',
	'github-dark-dimmed',
	'github-dark-high-contrast',
	'github-dark',
	/*'github-light-default',*/
	/*'github-light-high-contrast',*/
	/*'github-light',*/
	'houston',
	'laserwave',
	/*'light-plus',*/
	'material-theme-darker',
	'material-theme-lighter',
	'material-theme-ocean',
	'material-theme-palenight',
	'material-theme',
	'min-dark',
	/*'min-light',*/
	'monokai',
	'night-owl',
	'nord',
	'one-dark-pro',
	/*'one-light',*/
	'plastic',
	'poimandres',
	'red',
	/*'rose-pine-dawn',*/
	'rose-pine-moon',
	'rose-pine',
	'slack-dark',
	/*'slack-ochin',*/
	/*'snazzy-light',*/
	'solarized-dark',
	'solarized-light',
	'synthwave-84',
	'tokyo-night',
	'vesper',
	'vitesse-black',
	'vitesse-dark',
	'vitesse-light',
]

const [themeTM, setTMTheme] = signal(
	localStorage.themeTM || 'monokai',
)
const [themeMonaco, setMonacoTheme] = signal(
	localStorage.themeMonaco || 'vs-dark',
)

export default function () {
	const [autorun, setAutorun, updateAutorun] = signal(true)

	const initialValue =
		window.location.hash !== ''
			? uncompress(
					decodeURIComponent(window.location.hash.substring(1)),
				)
			: localStorage.playground || example

	// somehow backwards compatible
	const [code, setCode] = signal(
		initialValue.code ? initialValue.code : initialValue,
	)

	const codeURL = memo(() => compress(code()))

	effect(() => {
		window.location.hash = '#' + codeURL()
	})

	addEvent(window, 'message', function (e) {
		if (e.data && typeof e.data === 'string') {
			const message = JSON.parse(e.data)
			if (message.messageKind === 'done') {
				localStorage.playground = code()
			}
		}
	})

	// ui

	return (
		<>
			<Header title="Pota's Playground"></Header>

			<section
				id="container"
				flair="col grow"
				style="padding-top:0px;"
			>
				<Tabs>
					<section
						flair="vertical"
						class={styles.toolbar}
					>
						<Tabs.Labels>
							<Tabs.Label name="code">Code</Tabs.Label>
							<Tabs.Label name="transformed">Transformed</Tabs.Label>
							<Tabs.Label name="cheatsheet">Cheat Sheet</Tabs.Label>
						</Tabs.Labels>
						<span>
							<label
								flair="selection-none"
								style="vertical-align: middle;"
							>
								Autorun{' '}
								<input
									name="autorun"
									type="checkbox"
									checked={autorun()}
									on:click={() => updateAutorun(checked => !checked)}
								/>
							</label>
						</span>
						<span>
							<Show
								when={() =>
									Tabs.selected().read().name == 'transformed' ||
									Tabs.selected().read().name === 'cheatsheet'
								}
							>
								<select
									class={styles.themeSelector}
									on:change={e => {
										const value = e.currentTarget.value
										setTMTheme(value)
										localStorage.themeTM = value
									}}
								>
									<For each={themesTM}>
										{item => (
											<option
												selected={themeTM() === item}
												value={item}
											>
												{item.replace(/-/g, ' ')}
											</option>
										)}
									</For>
								</select>
							</Show>
							<Show
								when={() => Tabs.selected().read().name === 'code'}
							>
								<select
									class={styles.themeSelector}
									on:change={e => {
										const value = e.currentTarget.value
										setMonacoTheme(value)
										localStorage.themeMonaco = value
									}}
								>
									<For each={themesMonaco}>
										{item => (
											<option
												selected={themeMonaco() === item}
												value={item}
											>
												{item.replace(/-/g, ' ')}
											</option>
										)}
									</For>
								</select>
							</Show>
						</span>
						<Show when={() => Tabs.selected().read().name === 'code'}>
							<span title="Restore Default Example">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 -960 960 960"
									width="24px"
									fill="#e3e3e3"
									on:click={e => {
										setCode(example)
										localStorage.playground = example
										emit(window, 'monacoCodeChanged', {
											detail: example,
										})
									}}
								>
									<path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
								</svg>
							</span>
						</Show>
					</section>
					<section
						id="container"
						flair="row grow"
						style="padding-top:0px;"
					>
						<section
							id="left"
							flair="col grow"
						>
							<form id="form-playground">
								<Tabs.Panels>
									<Tabs.Panel flair="col grow">
										<Monaco
											value={prettier(code(), true).catch(x =>
												code(),
											)}
											on:change={value => setCode(value)}
											on:format={code => prettier(code, true)}
											theme={themeMonaco}
										/>
									</Tabs.Panel>
									<Tabs.Panel flair="col grow">
										<tm-textarea
											class="playground line-numbers"
											grammar="tsx"
											theme={themeTM}
											value={() => transform(code())}
											prop:editable={false}
										/>
									</Tabs.Panel>
									<Tabs.Panel flair="col grow">
										<tm-textarea
											class="playground"
											value={prettier(CheatSheetText)}
											grammar="tsx"
											theme={themeTM}
											prop:editable={false}
										/>
									</Tabs.Panel>
								</Tabs.Panels>
							</form>
						</section>
						<section
							id="right"
							flair="col grow"
						>
							<section flair="row grow">
								<Code
									code={() => autorun() && code()}
									render={true}
									preview={false}
								/>
							</section>
						</section>
					</section>
				</Tabs>
			</section>
		</>
	)
}
