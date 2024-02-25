import './index.css'

import { uncompress } from '../../../lib/compress.js'

// auto size frame to content

let resizeObserverTimeout
new ResizeObserver(entries => {
	if (
		document.body.scrollHeight > 20 &&
		document.body.scrollHeight < 600
	) {
		clearTimeout(resizeObserverTimeout)
		resizeObserverTimeout = setTimeout(() => {
			window.parent.postMessage(
				JSON.stringify({
					height: document.body.scrollHeight,
				}),
				'*',
			)
		}, 80)
	}
}).observe(document.body)

// props

let props = uncompress(
	decodeURIComponent(window.location.hash.substring(1)),
)

if (typeof props === 'string') {
	props = {
		code: props,
	}
}

// display error

function displayError(content, type = 'error') {
	const errors = document.createElement('div')
	errors.classList.add(type)
	errors.textContent = content
	document.body.append(errors)
}

// transform jsx ignore parse errors

try {
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

	// create script

	const script = document.createElement('script')
	script.type = 'module'
	script.textContent = transform.code

	// listen for errors

	window.onerror = function (event, source, line, col, error) {
		document.body.textContent = ''
		displayError(error?.message, 'error')
	}

	// append script

	document.head.append(script)
} catch (e) {
	displayError(String(e))
}
