import './index.css'

import { uncompress } from '../../lib/compress.js'

// auto size frame to content

new ResizeObserver(entries => {
	window.parent.postMessage(
		JSON.stringify({
			height: document.documentElement.scrollHeight,
		}),
		'*',
	)
}).observe(document.body)

// run

run()

addEventListener('hashchange', run)

function run() {
	// props

	const props = uncompress(
		decodeURIComponent(window.location.hash.substring(1)),
	)

	// transform jsx

	let transform

	// ignore parse errors
	try {
		transform = globalThis.Babel.transform(props.code, {
			plugins: [
				[
					'transform-react-jsx',
					{
						runtime: 'automatic',
						importSource: 'pota',
						throwIfNamespace: false,
						useSpread: true,
						useBuiltIns: false,
					},
				],
			],
		})
	} catch (e) {
		return
	}

	// append script

	const script = document.createElement('script')
	script.type = 'module'
	script.appendChild(document.createTextNode(transform.code))

	document.body.textContent = ''
	document.head.appendChild(script)

	window.onerror = function (event, source, line, col, error) {
		const errors = document.createElement('div')
		errors.classList.add('error')
		document.body.textContent = ''
		document.body.appendChild(errors)
		errors.textContent = error?.message
	}
}
