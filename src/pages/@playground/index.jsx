import styles from './playground.module.css'

import { CheatSheetText } from '../../lib/components/cheatsheet.jsx'
import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'

import { effect, memo, signal } from 'pota'
import { Collapse, For, Head, Show } from 'pota/web'

import { compress, uncompress } from '../../lib/compress.js'
import example from './default-example.js'
import { prettier } from '../../lib/prettier.js'
import { transform } from '../../lib/transform.js'

import 'pota/plugin/clipboard'

import { TabIndentation } from 'tm-textarea/bindings/tab-indentation'

const themes = [
	'andromeeda',
	'aurora-x',
	'ayu-dark',
	'catppuccin-frappe',
	'catppuccin-latte',
	'catppuccin-macchiato',
	'catppuccin-mocha',
	'dark-plus',
	'dracula-soft',
	'dracula',
	'everforest-dark',
	'everforest-light',
	'github-dark-default',
	'github-dark-dimmed',
	'github-dark-high-contrast',
	'github-dark',
	'github-light-default',
	'github-light-high-contrast',
	'github-light',
	'houston',
	'laserwave',
	'light-plus',
	'material-theme-darker',
	'material-theme-lighter',
	'material-theme-ocean',
	'material-theme-palenight',
	'material-theme',
	'min-dark',
	'min-light',
	'monokai',
	'night-owl',
	'nord',
	'one-dark-pro',
	'one-light',
	'plastic',
	'poimandres',
	'red',
	'rose-pine-dawn',
	'rose-pine-moon',
	'rose-pine',
	'slack-dark',
	'slack-ochin',
	'snazzy-light',
	'solarized-dark',
	'solarized-light',
	'synthwave-84',
	'tokyo-night',
	'vesper',
	'vitesse-black',
	'vitesse-dark',
	'vitesse-light',
]
export default function () {
	const [autorun, setAutorun, updateAutorun] = signal(true)

	const initialValue =
		window.location.hash !== ''
			? uncompress(
					decodeURIComponent(window.location.hash.substring(1)),
				)
			: example

	// somehow backwards compatible
	const [code, setCode] = signal(
		initialValue.code ? initialValue.code : initialValue,
	)

	const codeDownload = memo(() =>
		URL.createObjectURL(
			new Blob([code()], {
				type: 'application/tsx',
			}),
		),
	)

	const codeURL = memo(() => compress(code()))

	// transformed code

	const [transformed, setTransformed] = signal('')

	effect(() => {
		transform(code()).then(setTransformed)
	})

	effect(() => {
		window.location.hash = '#' + codeURL()
	})

	// ui

	const [tab, setTab] = signal('code')

	const [theme, setTheme] = signal(
		localStorage.playgroundTheme || 'monokai',
	)

	return (
		<>
			<Header title="Pota's Playground"></Header>

			<section
				id="container"
				flair="col grow"
				style="padding-top:0px;"
			>
				<section
					flair="vertical"
					class={styles.toolbar}
				>
					<div>
						<span>
							<a
								href="javascript://"
								onClick={() => setTab('code')}
							>
								Code
							</a>
						</span>
						<span>
							<a
								href="javascript://"
								onClick={() => setTab('pota-jsx')}
							>
								Transformed
							</a>
						</span>
						<span>
							<a
								href="javascript://"
								onClick={() => setTab('cheatsheet')}
							>
								Cheat Sheet
							</a>
						</span>
						<span>
							<a
								href="javascript://"
								download="pota.tsx"
								onClick={e => (e.target.href = codeDownload())}
							>
								Download
							</a>
						</span>
						<span>
							<a
								target="_blank"
								href="#"
								clipboard={e => {
									e.preventDefault()
									const node = e.target
									node.href = '#' + codeURL()

									node.textContent = 'Link Copied!'
									setTimeout(() => {
										node.textContent = 'Link'
									}, 2000)
									return node.href
								}}
							>
								Link
							</a>
						</span>
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
									onClick={() => updateAutorun(checked => !checked)}
								/>
							</label>
						</span>
						<span>
							<select
								class={styles.themeSelector}
								onChange={e => {
									const value = e.currentTarget.value
									setTheme(value)
									localStorage.playgroundTheme = value
								}}
							>
								<For each={themes}>
									{item => (
										<option
											selected={theme() === item}
											value={item}
										>
											{item.replace(/-/g, ' ')}
										</option>
									)}
								</For>
							</select>
						</span>
					</div>
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
							<Collapse when={() => tab() === 'code'}>
								<tm-textarea
									ref={TabIndentation.binding}
									class="playground line-numbers"
									value={prettier(code(), true)}
									onInput={e => setCode(e.target.value)}
									grammar="tsx"
									theme={theme()}
									onMount={element => {
										effect(() => {
											element.theme = theme()
										})
									}}
									onKeyDown={e => {
										if (e.ctrlKey && e.keyCode === 83) {
											// CTRL + S

											const textarea = e.target

											e.preventDefault()

											prettier(textarea.value, true).then(code => {
												textarea.focus()
												textarea.value = code
											})
										}
									}}
								/>
							</Collapse>
							<Show when={() => tab() === 'pota-jsx'}>
								{code => (
									<tm-textarea
										class="playground line-numbers"
										grammar="tsx"
										theme={theme()}
										onMount={element => {
											effect(() => {
												element.theme = theme()
											})
										}}
										value={transformed}
										editable={false}
									/>
								)}
							</Show>
							<Collapse when={() => tab() === 'cheatsheet'}>
								<tm-textarea
									class="playground"
									value={prettier(CheatSheetText)}
									grammar="tsx"
									theme={theme()}
									onMount={element => {
										effect(() => {
											element.theme = theme()
										})
									}}
									editable={false}
								/>
							</Collapse>
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
			</section>
		</>
	)
}
