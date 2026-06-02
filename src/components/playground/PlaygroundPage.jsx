import { cleanup } from 'pota'
import { Head } from 'pota/components'

import { Playground } from './Playground.jsx'
import { compress, uncompress } from './compress.js'
import defaultExample from './default-example.js'

// Standalone /playground. Mirrors the editor into the location hash so a
// tweaked example is shareable: open /playground#<payload> and the editor
// rehydrates from it. The hash carries the same gzip+base64 payload the
// preview iframe uses, wrapping `{ entry, files }`.

const seed = () => [
	{ name: 'app.jsx', lang: 'jsx', source: defaultExample },
]

// Decode the shared snapshot from `location.hash`, tolerating an empty or
// malformed hash (fall back to the seed example).
function fromHash() {
	const raw = window.location.hash.slice(1)
	if (!raw) return null
	try {
		const data = uncompress(decodeURIComponent(raw))
		if (data && Array.isArray(data.files) && data.files.length) {
			return { files: data.files, entry: data.entry }
		}
	} catch {}
	return null
}

export function PlaygroundPage() {
	const initial = fromHash()
	const files = initial ? initial.files : seed()
	const entry = initial ? initial.entry : undefined

	// Coalesce keystrokes: encoding + replaceState per keypress is cheap,
	// but one write per idle burst keeps the address bar (and back/forward
	// via replaceState, not pushState) calm.
	let timer
	const onChange = (current, entry) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			const payload = compress({ entry, files: current })
			window.history.replaceState(
				null,
				'',
				window.location.pathname + '#' + payload,
			)
		}, 250)
	}
	cleanup(() => clearTimeout(timer))

	return (
		<>
			<Head>
				<title>playground — pota</title>
			</Head>
			<Playground
				files={files}
				entry={entry}
				fullPage={true}
				on:change={onChange}
			/>
		</>
	)
}
