// Serves `/node_modules/pota/*` from the docs project's node_modules in
// dev and preview. Vite's `root` is `src/` (see vite.config.js), so its
// static file server only serves files under `src/` — a request for
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
// The deployed site is a scrape of the preview server, which only
// captures URLs the crawler happened to hit — so on build the plugin
// also copies the runtime files into dist/node_modules/pota, and
// publish.sh ships that copy instead of trusting the crawl.

import { cpSync, createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
// docs/tools → docs/node_modules
const nodeModulesDir = join(here, '..', 'node_modules')
const PREFIX = '/node_modules/'

// Everything the playground loads from /node_modules/pota/ at runtime,
// relative to node_modules/pota: `src` backs the preview iframe's
// importmap (user code may import any subpath, so the whole tree goes),
// plus the Babel standalone bundle, the editor's type bundle, and the
// ESM build of color-bits (src/use/color.js's only bare dependency).
// node_modules/pota is a symlink to the repo root — copying the whole
// package would drag in .git, node_modules and projects/ (recursively,
// dist/ included), so keep this list targeted.
const RUNTIME_PATHS = [
	'src',
	'generated/babel-preset-standalone.js',
	'generated/docs/types.json',
	'generated/docs/color-bits',
]

const MIME = {
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.cjs': 'text/javascript',
	'.json': 'application/json',
	'.map': 'application/json',
	'.css': 'text/css',
	'.wasm': 'application/wasm',
}

function potaMiddleware(nmDir) {
	return (req, res, next) => {
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			return next()
		}
		const url = (req.url || '').split(/[?#]/)[0]
		if (!url.startsWith(PREFIX + 'pota/')) return next()

		const rel = decodeURIComponent(url.slice(PREFIX.length))
		const file = normalize(join(nmDir, rel))
		if (!file.startsWith(nmDir + sep)) return next()

		let stat
		try {
			stat = statSync(file)
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
	}
}

export function nodeModulesPlugin() {
	let outDir
	return {
		name: 'pota-docs-node-modules',
		enforce: 'pre',

		configResolved(config) {
			// closeBundle also fires when the dev server shuts down — only
			// resolve outDir (and so only copy) for real builds.
			if (config.command === 'build') {
				outDir = resolve(config.root, config.build.outDir)
			}
		},

		configureServer(server) {
			server.middlewares.use(potaMiddleware(nodeModulesDir))
		},
		configurePreviewServer(server) {
			server.middlewares.use(potaMiddleware(nodeModulesDir))
		},

		// dev and preview serve these through the middleware above; a
		// static deploy of dist/ has no middleware, so physically copy the
		// runtime files into the build output.
		closeBundle() {
			if (!outDir) return
			for (const rel of RUNTIME_PATHS) {
				const from = join(nodeModulesDir, 'pota', rel)
				if (!existsSync(from)) {
					throw new Error(
						`[node-modules] ${from} is missing — generate it from the ` +
							`repo root first (npm run dev, or build:babel-preset + ` +
							`build:generate), or the deployed playground cannot run.`,
					)
				}
				cpSync(from, join(outDir, 'node_modules', 'pota', rel), {
					recursive: true,
				})
			}
		},
	}
}
