// Serves `/node_modules/pota/*` from the docs project's node_modules in
// dev. Vite's `root` is `src/` (see vite.config.js), so its static file
// server only serves files under `src/` — a request for
// `/node_modules/...` has no `src/node_modules` to match and falls
// through to a 404 (or the SPA html fallback, depending on the request's
// Accept header).
//
// The playground hard-codes `/node_modules/pota/...` URLs in two places,
// both because `pota` lives in node_modules (a symlink to the repo root):
//   - the preview iframe's importmap (generated/docs/importmap.json),
//     which resolves bare `pota` specifiers in user code, and
//   - the Babel standalone `<script>` in
//     src/components/playground/transform.js.
// Without this middleware neither resolves and the playground can't load
// Babel or run any example.
//
// Scope is deliberately limited to `/node_modules/pota/` so Vite keeps
// handling everything else it pre-bundles (e.g. `/node_modules/.vite/`).
// Dev-only: the deployed site is produced by scraping a running server,
// so the same URLs resolve there too.

import { createReadStream, statSync } from 'node:fs'
import { dirname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
// docs/tools → docs/node_modules
const nodeModulesDir = join(here, '..', 'node_modules')
const PREFIX = '/node_modules/'

const MIME = {
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.cjs': 'text/javascript',
	'.json': 'application/json',
	'.map': 'application/json',
	'.css': 'text/css',
	'.wasm': 'application/wasm',
}

export function nodeModulesPlugin() {
	return {
		name: 'pota-docs-node-modules',
		enforce: 'pre',

		configureServer(server) {
			// Registered directly (not via a returned post hook) so it
			// runs before Vite's internal static / html-fallback
			// middlewares, which would otherwise shadow these paths.
			server.middlewares.use((req, res, next) => {
				if (req.method !== 'GET' && req.method !== 'HEAD') {
					return next()
				}
				const url = (req.url || '').split(/[?#]/)[0]
				// Only pota — leave Vite's own node_modules handling alone.
				if (!url.startsWith(PREFIX + 'pota/')) return next()

				const rel = decodeURIComponent(url.slice(PREFIX.length))
				const file = normalize(join(nodeModulesDir, rel))
				// Stay within node_modules — reject `..` escapes.
				if (!file.startsWith(nodeModulesDir + sep)) return next()

				let stat
				try {
					stat = statSync(file) // follows the pota symlink
				} catch {
					return next()
				}
				if (!stat.isFile()) return next()

				const ext = file.slice(file.lastIndexOf('.'))
				res.setHeader(
					'Content-Type',
					MIME[ext] || 'application/octet-stream',
				)
				res.setHeader('Content-Length', stat.size)
				res.setHeader('Cache-Control', 'no-cache')
				if (req.method === 'HEAD') {
					res.end()
					return
				}
				createReadStream(file).pipe(res)
			})
		},
	}
}
