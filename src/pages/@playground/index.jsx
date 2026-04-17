import styles from './playground.module.css'

import { CheatSheetText } from '../../lib/components/cheatsheet.jsx'
import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'

import { addEvent, memo, signal } from 'pota'
import { For, Show, Tabs } from 'pota/components'

import example from './default-example.js'
import { prettier } from '../../lib/prettier.js'
import { transform } from '../../lib/transform.js'

import 'pota/use/clipboard'

import { Monaco } from '../../lib/components/monaco/monaco.jsx'
import { CodeMirror } from '../../lib/components/codemirror/codemirror.jsx'
import { TabsBar } from '../../lib/components/tabs-bar/tabs-bar.jsx'
import { createPlaygroundState } from '../../lib/playground-state.js'

const playgroundState = createPlaygroundState(example)
const {
	files: pgFiles,
	active: pgActive,
	cursor: pgCursor,
	updateFileContent,
	addFile,
	removeFile,
	renameFile,
	setActive,
	setFiles,
	setCursor,
	persist,
} = playgroundState

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
const [themeCM, setCMTheme] = signal(
	localStorage.themeCM || 'one-dark',
)
const [activeEditor, setActiveEditor] = signal(
	localStorage.activeEditor || 'monaco',
)

export default function () {
	const [autorun, setAutorun, updateAutorun] = signal(true)

	// The preview pipeline works on a single entry file — pick the
	// active tab's content. Other files are for type-checking / editor
	// convenience only (no bundler on the preview side).
	const activeCode = memo(() => {
		const name = pgActive()
		const f = pgFiles().find(x => x.name === name)
		return f ? f.content : ''
	})

	// Editors flush their latest debounced value via this handler on
	// focusout. Writes both URL and localStorage synchronously.
	const handleChange = (name, content) => {
		updateFileContent(name, content)
		persist()
	}

	const handleCursorChange = (file, offset) => {
		setCursor({ file, offset })
		persist()
	}

	// Save on unload so state survives a full reload even if the
	// editor never fired a focusout / debounce flush first.
	addEvent(window, 'beforeunload', () => persist())

	const restoreDefault = () => {
		setFiles([{ name: 'main.tsx', content: example }])
		setActive('main.tsx')
		persist()
	}

	// ui

	return (
		<>
			<Header title="Pota's Playground"></Header>

			<section
				id="container"
				flair="col grow"
				style="padding-top:0px;"
				class={styles['no-animations']}
			>
				<Tabs>
					<section flair="vertical" class={styles.toolbar}>
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
										setActiveEditor(value)
										localStorage.activeEditor = value
									}}
								>
									<option
										selected={activeEditor() === 'monaco'}
										value="monaco"
									>
										Monaco
									</option>
									<option
										selected={activeEditor() === 'codemirror'}
										value="codemirror"
									>
										CodeMirror
									</option>
								</select>
								<Show when={() => activeEditor() === 'monaco'}>
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
								<Show
									when={() =>
										activeEditor() === 'codemirror' &&
										CodeMirror.themes.length > 1
									}
								>
									<select
										class={styles.themeSelector}
										on:change={e => {
											const value = e.currentTarget.value
											setCMTheme(value)
											localStorage.themeCM = value
										}}
									>
										<For each={CodeMirror.themes}>
											{item => (
												<option
													selected={themeCM() === item}
													value={item}
												>
													{item.replace(/-/g, ' ')}
												</option>
											)}
										</For>
									</select>
								</Show>
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
									on:click={restoreDefault}
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
						<section id="left" flair="col grow">
							<form id="form-playground">
								<Tabs.Panels>
									<Tabs.Panel flair="col grow" collapse>
										<TabsBar
											files={pgFiles}
											activeFile={pgActive}
											on:select={name => {
												setActive(name)
												persist()
											}}
											on:rename={(oldName, newName) => {
												if (renameFile(oldName, newName)) {
													persist()
												}
											}}
											on:delete={name => {
												if (removeFile(name)) persist()
											}}
											on:add={() => {
												addFile('untitled.ts')
												persist()
											}}
										/>
										<Show when={() => activeEditor() === 'monaco'}>
											<Monaco
												files={pgFiles}
												activeFile={pgActive}
												cursor={pgCursor}
												on:change={handleChange}
												on:cursorChange={handleCursorChange}
												on:format={code => prettier(code, true)}
												theme={themeMonaco}
											/>
										</Show>
										<Show
											when={() => activeEditor() === 'codemirror'}
										>
											<CodeMirror
												files={pgFiles}
												activeFile={pgActive}
												cursor={pgCursor}
												on:change={handleChange}
												on:cursorChange={handleCursorChange}
												on:format={code => prettier(code, true)}
												theme={themeCM}
											/>
										</Show>
									</Tabs.Panel>
									<Tabs.Panel flair="col grow">
										<tm-textarea
											class="playground line-numbers"
											grammar="tsx"
											theme={themeTM}
											value={() => transform(activeCode())}
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
						<section id="right" flair="col grow">
							<section flair="row grow">
								<Code
									files={() => (autorun() ? pgFiles() : [])}
									entry="main.tsx"
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
