import styles from './playground.module.css'

import { CheatSheet } from '../../lib/components/cheatsheet.jsx'
import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'

import { effect, memo, signal, untrack } from 'pota'
import { Collapse } from 'pota/web'

import { compress, uncompress } from '../../lib/compress.js'
import example from './default-example.js'
import importmap from './default-importmap.js'
import { Monaco } from '../../lib/components/monaco/monaco.jsx'
import { prettier } from '../../lib/prettier.js'

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

	// prettify initial value
	prettier(source.code).then(updateCode)

	// update hash
	effect(() => {
		window.location.hash = '#' + compress(source())
	})

	const [tab, setTab] = signal('code')

	const code = memo(() => autorun() && source())
	code()

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
									checked={untrack(autorun)}
									onClick={() => setAutorun(checked => !checked)}
								/>
							</label>
						</span>
					</section>
					<Code
						code={code}
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
