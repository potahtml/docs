import styles from './playground.module.css'

import { CheatSheet } from '../../lib/components/cheatsheet.jsx'
import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'

import { Collapse, effect, signal } from 'pota'

import { compress, uncompress } from '../../lib/compress.js'
import example from './default-example.js'
import importmap from './default-importmap.js'
import { Monaco } from '../../lib/components/monaco/monaco.jsx'
import { prettier } from '../../lib/prettier.js'
import { bind } from 'pota/plugins/bind'

function getCodeFromURL() {
	return window.location.hash !== ''
		? uncompress(
				decodeURIComponent(window.location.hash.substring(1)),
			)
		: undefined
}

export default function () {
	const [autorun, setAutorun] = signal(true)

	let fetched = getCodeFromURL()
	if (typeof fetched === 'string') {
		fetched = {
			code: fetched,
			importmap: importmap,
			lib: 'solid',
		}
	}

	// initial value for code
	const [source, setSource] = signal(
		fetched || {
			code: example,
			importmap: importmap,
			lib: 'solid',
		},
		{ equals: false },
	)

	// to update only the code
	function updateCode(code) {
		setSource(source => {
			source.code = code
			return source
		})
	}
	// to update only the importmap
	function updateImportmap(importmap) {
		setSource(source => {
			source.importmap = importmap
			return source
		})
	}

	// to update only the lib
	const lib = bind(source().lib)

	effect(() => {
		lib()
		setSource(source => {
			source.lib = lib()
			return source
		})
	})

	// prettify initial value
	prettier(source().code).then(updateCode)

	// update hash
	effect(() => {
		window.location.hash =
			'#' + encodeURIComponent(compress(source()))
	})

	const [tab, setTab] = signal('code')

	return (
		<>
			<Header title="Playground"></Header>

			<section flair="row grow full">
				<section flair="row grow">
					<Collapse when={() => tab() === 'importmap'}>
						<Monaco
							code={() => source().importmap}
							onChange={updateImportmap}
							onFormat={prettier}
							delay={200}
							language="json"
						/>
					</Collapse>
					<Collapse when={() => tab() === 'code'}>
						<Monaco
							code={() => source().code}
							onChange={updateCode}
							onFormat={prettier}
							delay={200}
							language="javascript"
						/>
					</Collapse>
				</section>
				<section flair="col grow">
					<section class={styles.toolbar}>
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
							<label
								flair="selection-none"
								style="vertical-align: middle;"
							>
								Autorun{' '}
								<input
									name="button"
									type="checkbox"
									checked={autorun()}
									onClick={() => setAutorun(checked => !checked)}
								/>
							</label>
						</span>
						<span>
							<label
								flair="selection-none"
								style="vertical-align: middle;"
							>
								{' '}
								Reactive Library{' '}
								<select bind={lib}>
									<option value="solid">solid</option>
									<option value="oby">oby</option>
									<option value="flimsy">flimsy</option>
								</select>
							</label>
						</span>
					</section>
					<Code
						code={() => autorun() && source()}
						render={true}
						preview={false}
					/>

					<br />

					<section flair="scroll-y scroll-thin grow col">
						<CheatSheet />
					</section>
				</section>
			</section>
		</>
	)
}
