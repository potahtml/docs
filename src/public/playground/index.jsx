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
}).observe(document.documentElement)

// run

run()

addEventListener('hashchange', run)

function run() {
	// props

	const props = uncompress(
		decodeURIComponent(window.location.hash.substring(1)),
	)

	// transform jsx

	const transform = globalThis.Babel.transform(props.code, {
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

	// append script

	const script = document.createElement('script')
	script.type = 'module'
	/*
		// this is nice but breaks the importmap as origin blob: differs
		script.src = URL.createObjectURL(
			new Blob([transform.code], {
				type: 'text/javascript; charset=utf-8',
			}),
		)
	*/
	script.appendChild(document.createTextNode(transform.code))

	document.body.textContent = ''
	document.head.appendChild(script)

	const errors = document.createElement('div')
	document.body.appendChild(errors)
	window.onerror = function (event, source, line, col, error) {
		errors.textContent = error?.message
	}
}
