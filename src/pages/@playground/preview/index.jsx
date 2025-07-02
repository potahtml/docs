import './index.css'

import { uncompress } from '../../../lib/compress.js'

// reload on hash change gets rid of accidental loops

addEventListener('hashchange', e => window.location.reload())

// auto size frame to content

let timeout
const element = document.documentElement
new ResizeObserver(() => {
	clearTimeout(timeout)
	setTimeout(() => {
		window.parent.postMessage(
			JSON.stringify({
				height: element.getBoundingClientRect().height,
				messageKind: 'height',
			}),
			'*',
		)
	}, 200)
}).observe(element)

// code from hash

const hashed = window.location.hash.substring(1)
const code = hashed ? uncompress(decodeURIComponent(hashed)) : ''

// display error

function displayError(content, type = 'error') {
	setTimeout(() => {
		const errors = document.createElement('div')
		errors.classList.add(type)
		errors.textContent = content
		document.body.append(errors)
	}, 500)
}

// listen for errors

let errored = false
window.onerror = function (event, source, line, col, error) {
	errored = true
	document.body.textContent = ''
	displayError(error?.message, 'error')
}

// create script

if (code.startsWith('Error:')) {
	displayError(code, 'error')
} else {
	document.body.textContent = ''

	const script = document.createElement('script')
	script.type = 'module'
	script.textContent = code

	document.head.append(script)

	if (!errored) {
		setTimeout(() => {
			window.parent.postMessage(
				JSON.stringify({ messageKind: 'done' }),
				'*',
			)
		}, 1000)
	}
}
