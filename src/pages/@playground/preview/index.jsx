import { uncompress } from '../../../lib/compress.js'
import './index.css'

// auto size frame to content

new ResizeObserver(entries => {
	if (
		document.body.scrollHeight > 20 &&
		document.body.scrollHeight < 600
	)
		window.parent.postMessage(
			JSON.stringify({
				height: document.body.scrollHeight,
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

	document.body.textContent = ''

	const script = document.createElement('script')
	script.type = 'module'
	script.append(document.createTextNode(transform.code))

	document.body.append(script)
}

// listen for errors

window.onerror = function (event, source, line, col, error) {
	const errors = document.createElement('div')
	errors.classList.add('error')
	errors.textContent = error?.message
	document.body.textContent = ''
	document.body.append(errors)
}
