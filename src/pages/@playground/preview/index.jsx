import './index.css'
import 'dom-flair'

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
const payload = hashed ? uncompress(decodeURIComponent(hashed)) : ''

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

// ---------- bundling (multi-file mode) ----------

// Lazy-load lightningcss-wasm from esm.sh. Using a Function-wrapped
// import so kompiler doesn't try to resolve the URL at build time.
const dynImport = new Function('u', 'return import(u)')
const LIGHTNING_URL =
	'https://esm.sh/lightningcss-wasm@1.29.1'

let lightningPromise
function loadLightning() {
	if (!lightningPromise) {
		lightningPromise = (async () => {
			const mod = await dynImport(LIGHTNING_URL)
			// default export is an async WASM init — call once
			if (typeof mod.default === 'function') {
				await mod.default()
			}
			return mod
		})()
	}
	return lightningPromise
}

/**
 * Pre-compile every `.module.css` file via lightningcss. Plain `.css`
 * files are passed through untouched (just injected as a <style>).
 * Returns `{ [fileName]: { css, classmap } }`. Called before the
 * blob loop so that step stays synchronous.
 */
async function precompileCssModules(modules) {
	const cssNames = Object.keys(modules).filter(n =>
		n.endsWith('.module.css'),
	)
	if (cssNames.length === 0) return {}

	const lightning = await loadLightning()
	const out = {}
	const encoder = new TextEncoder()
	const decoder = new TextDecoder()

	for (const name of cssNames) {
		try {
			const result = lightning.transform({
				filename: name,
				code: encoder.encode(modules[name]),
				cssModules: true,
				minify: false,
			})
			const classmap = {}
			for (const [orig, exp] of Object.entries(
				result.exports || {},
			)) {
				classmap[orig] = exp.name
			}
			out[name] = {
				css: decoder.decode(result.code),
				classmap,
			}
		} catch (err) {
			displayError(
				'CSS module "' + name + '": ' + err.message,
				'error',
			)
			out[name] = {
				css: modules[name],
				classmap: {},
			}
		}
	}
	return out
}

/**
 * Walk the module graph depth-first, rewriting every relative import
 * to point at the blob URL of the dependency.  Each module's blob URL
 * is frozen after creation, so we must resolve a file's own imports
 * BEFORE turning it into a blob.
 *
 * CSS / CSS-modules handling:
 * - `foo.module.css` -> uses the pre-compiled output (CSS + classmap)
 *   from `precompileCssModules`, injects the <style>, returns a JS
 *   module whose default export is the classmap.
 * - `foo.css` (plain) -> inject the <style> as-is, return an empty
 *   default-export module so `import './foo.css'` doesn't throw.
 */
function buildBlobs(modules, cssCompiled) {
	const blobs = Object.create(null)
	const visiting = new Set()

	const resolveSpec = spec => {
		const bare = spec.replace(/^\.\//, '').replace(/^\//, '')
		for (const ext of [
			'',
			'.ts',
			'.tsx',
			'.js',
			'.jsx',
			'.css',
			'.module.css',
		]) {
			if (modules[bare + ext]) return makeBlob(bare + ext)
		}
		return spec
	}

	const rewrite = code =>
		code
			// `from '...'` — covers `import … from` and `export … from`
			.replace(/from\s+(['"])(\.[^'"]+)\1/g,
				(_, q, s) => `from ${q}${resolveSpec(s)}${q}`)
			// `import('...')` — dynamic import
			.replace(/import\s*\(\s*(['"])(\.[^'"]+)\1\s*\)/g,
				(_, q, s) => `import(${q}${resolveSpec(s)}${q})`)
			// `import '...'` — side-effect import (quote must follow
			// `import` directly, otherwise we'd match the specifier of
			// `import name from '...'` and rewrite it twice).
			.replace(/\bimport\s+(['"])(\.[^'"]+)\1/g,
				(_, q, s) => `import ${q}${resolveSpec(s)}${q}`)

	const injectStyle = css => {
		const style = document.createElement('style')
		style.textContent = css
		document.head.append(style)
	}

	const makeBlob = name => {
		if (blobs[name]) return blobs[name]
		if (visiting.has(name)) {
			throw new Error('Circular import: ' + name)
		}
		visiting.add(name)

		let body
		if (name.endsWith('.module.css')) {
			const pre = cssCompiled[name]
			injectStyle(pre.css)
			body = `export default ${JSON.stringify(pre.classmap)}`
		} else if (name.endsWith('.css')) {
			injectStyle(modules[name])
			body = 'export default null'
		} else {
			body = rewrite(modules[name])
		}

		visiting.delete(name)
		const blob = new Blob([body], {
			type: 'application/javascript',
		})
		blobs[name] = URL.createObjectURL(blob)
		return blobs[name]
	}

	return makeBlob
}

function runSingle(code) {
	if (typeof code === 'string' && code.startsWith('Error:')) {
		displayError(code, 'error')
		return
	}
	document.body.textContent = ''
	const script = document.createElement('script')
	script.type = 'module'
	script.textContent = code
	document.head.append(script)
}

async function runMulti(entry, modules) {
	if (!entry || !modules || !modules[entry]) {
		displayError('Entry file "' + entry + '" not found', 'error')
		return
	}
	const cssCompiled = await precompileCssModules(modules)
	document.body.textContent = ''
	const makeBlob = buildBlobs(modules, cssCompiled)
	const entryUrl = makeBlob(entry)
	const loader = document.createElement('script')
	loader.type = 'module'
	loader.textContent = `import(${JSON.stringify(entryUrl)})`
	document.head.append(loader)
}

// ---------- dispatch ----------

if (payload && typeof payload === 'object' && payload.modules) {
	runMulti(payload.entry, payload.modules)
} else {
	runSingle(payload)
}

if (!errored) {
	setTimeout(() => {
		window.parent.postMessage(
			JSON.stringify({ messageKind: 'done' }),
			'*',
		)
	}, 1000)
}
