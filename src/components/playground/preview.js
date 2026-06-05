// Preview iframe runtime. Loaded by preview.html (which carries the
// `pota` importmap). The parent docs page transforms each file with
// Babel, packages `{ entry, modules }`, compresses it, and points the
// iframe at `preview.html#<payload>`. Here we uncompress and execute:
//
//   single-file → inject the transformed module directly
//   multi-file  → precompile `.module.css` via lightningcss, rewrite
//                 relative imports to blob URLs, import the entry
//
// Ported from the old docs site (projects/docs/src/@playground/preview).

import { uncompress } from './compress.js'

// reload on hash change — the parent re-runs by swapping the hash, and a
// fresh document is the simplest way to get a clean slate.
addEventListener('hashchange', () => window.location.reload())

// follow live theme changes from the parent without a reload (toggling
// the site theme while a preview is open). Initial theme comes from the
// URL params in preview.html.
addEventListener('message', e => {
	let msg
	try {
		msg = JSON.parse(e.data)
	} catch {
		return
	}
	if (!msg || msg.messageKind !== 'theme') return
	const root = document.documentElement
	if (msg.theme) root.dataset.theme = msg.theme
	if (msg.vars) {
		for (const name in msg.vars)
			root.style.setProperty(name, msg.vars[name])
	}
})

// ---------- auto-size: report height to the parent ----------

let sizeTimeout
const docEl = document.documentElement
new ResizeObserver(() => {
	clearTimeout(sizeTimeout)
	sizeTimeout = setTimeout(() => {
		window.parent.postMessage(
			JSON.stringify({
				messageKind: 'height',
				height: docEl.getBoundingClientRect().height,
			}),
			'*',
		)
	}, 150)
}).observe(docEl)

// ---------- error box ----------

function displayError(content) {
	setTimeout(() => {
		const box = document.createElement('div')
		box.className = 'error'
		box.textContent = content
		document.body.append(box)
	}, 100)
}

let errored = false
window.onerror = (event, source, line, col, error) => {
	errored = true
	document.body.textContent = ''
	displayError(error?.message || String(event))
}

// ---------- multi-file bundling ----------

// `import(url)` through Function so the build doesn't try to resolve the
// CDN URL.
const dynImport = new Function('u', 'return import(u)')
const LIGHTNING_URL = 'https://esm.sh/lightningcss-wasm@1.29.1'

let lightningPromise
function loadLightning() {
	if (!lightningPromise) {
		lightningPromise = (async () => {
			const mod = await dynImport(LIGHTNING_URL)
			if (typeof mod.default === 'function') await mod.default()
			return mod
		})()
	}
	return lightningPromise
}

/**
 * Pre-compile every `.module.css` via lightningcss → `{ css, classmap }`.
 * Plain `.css` is left untouched (injected as-is later). Kept separate so
 * the blob-build loop below stays synchronous.
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
			out[name] = { css: decoder.decode(result.code), classmap }
		} catch (err) {
			displayError('CSS module "' + name + '": ' + err.message)
			out[name] = { css: modules[name], classmap: {} }
		}
	}
	return out
}

/**
 * Walk the module graph, rewriting each relative import to the blob URL
 * of its dependency. A file's own imports are resolved before it becomes
 * a blob (blob URLs are frozen on creation).
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
			.replace(
				/from\s+(['"])(\.[^'"]+)\1/g,
				(_, q, s) => `from ${q}${resolveSpec(s)}${q}`,
			)
			.replace(
				/import\s*\(\s*(['"])(\.[^'"]+)\1\s*\)/g,
				(_, q, s) => `import(${q}${resolveSpec(s)}${q})`,
			)
			.replace(
				/\bimport\s+(['"])(\.[^'"]+)\1/g,
				(_, q, s) => `import ${q}${resolveSpec(s)}${q}`,
			)

	const injectStyle = cssText => {
		const style = document.createElement('style')
		style.textContent = cssText
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
		displayError(code)
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
		displayError('Entry file "' + entry + '" not found')
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

const hashed = window.location.hash.substring(1)
const payload = hashed ? uncompress(decodeURIComponent(hashed)) : ''

if (payload && typeof payload === 'object' && payload.modules) {
	runMulti(payload.entry, payload.modules)
} else if (payload) {
	runSingle(payload)
}
