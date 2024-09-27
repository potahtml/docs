import styles from './playground.module.css'

import { CheatSheetText } from '../../lib/components/cheatsheet.jsx'
import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'

import { signal } from 'pota'
import { Collapse } from 'pota/web'

import { compress, uncompress } from '../../lib/compress.js'
import example from './default-example.js'
import importmap from '../../importmap/importmap.json?raw'
import { prettier } from '../../lib/prettier.js'

import 'pota/plugin/clipboard'

function getCodeFromURL() {
	return window.location.hash !== ''
		? uncompress(
				decodeURIComponent(window.location.hash.substring(1)),
			)
		: undefined
}

export default function () {
	const [autorun, setAutorun, updateAutorun] = signal(true)

	let fetched = getCodeFromURL()
	if (typeof fetched === 'string') {
		fetched = {
			code: fetched,
			importmap: importmap,
		}
	}

	// initial value for code
	const [source, setSource, updateSource] = signal(
		fetched || {
			code: example,
			importmap: importmap,
		},
		{ equals: false },
	)

	// to update only the code
	function updateCode(code) {
		updateSource(source => {
			source.code = code
			return source
		})
	}
	// to update only the importmap
	function updateImportmap(importmap) {
		updateSource(source => {
			source.importmap = importmap
			return source
		})
	}

	const [tab, setTab] = signal('code')

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
							onClick={() => setTab('importmap')}
						>
							Import Map
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
							onClick={e => {
								e.target.href = URL.createObjectURL(
									new Blob([source().code], {
										type: 'application/tsx',
									}),
								)
							}}
						>
							Download Code
						</a>
					</span>
					<span>
						<a
							target="_blank"
							href={() => '#' + compress(source())}
							clipboard={e => {
								e.preventDefault()
								const node = e.target
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
								name="button"
								type="checkbox"
								checked={autorun()}
								onClick={() => updateAutorun(checked => !checked)}
							/>
						</label>
					</span>
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
							<Collapse when={() => tab() === 'importmap'}>
								<tm-textarea
									class="playground"
									value={() => source().importmap}
									onInput={e => updateImportmap(e.target.value)}
									grammar="json"
									theme="monokai"
								/>
							</Collapse>
							<Collapse when={() => tab() === 'code'}>
								<tm-textarea
									class="playground"
									value={prettier(source().code)}
									onInput={e => updateCode(e.target.value)}
									grammar="tsx"
									theme="monokai"
									onKeyDown={e => {
										if (e.ctrlKey && e.keyCode === 83) {
											// CTRL + S

											const textarea = e.target

											e.preventDefault()

											prettier(textarea.value).then(code => {
												textarea.focus()
												textarea.value = code
											})
										}
									}}
								/>
							</Collapse>
							<Collapse when={() => tab() === 'cheatsheet'}>
								<tm-textarea
									class="playground"
									value={prettier(CheatSheetText)}
									grammar="tsx"
									theme="monokai"
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
								code={() => autorun() && source()}
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
