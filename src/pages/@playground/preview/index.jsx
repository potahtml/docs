import './index.css'

import { uncompress } from '../../../lib/compress.js'

// reload on hash change gets rid of accidental loops

addEventListener('hashchange', e => window.location.reload())

// auto size frame to content

const element = document.documentElement
new ResizeObserver(() => {
	const height = element.getBoundingClientRect().height
	window.parent.postMessage(JSON.stringify({ height }), '*')
}).observe(element)

// code from hash

const hashed = window.location.hash.substring(1)
const code = hashed ? uncompress(decodeURIComponent(hashed)) : ''

// display error

function displayError(content, type = 'error') {
	const errors = document.createElement('div')
	errors.classList.add(type)
	errors.textContent = content
	document.body.append(errors)
}

// listen for errors

window.onerror = function (event, source, line, col, error) {
	document.body.textContent = ''
	displayError(error?.message, 'error')
}

// create script

const script = document.createElement('script')
script.type = 'module'
script.textContent = code
document.head.append(script)
