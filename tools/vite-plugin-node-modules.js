// Serves pota's runtime to the playground at `/modules/pota/*`, reading
// from the docs project's on-disk `node_modules/pota` (a symlink to the
// repo root). Vite's `root` is `src/` (see vite.config.js), so its static
// file server only serves files under `src/` — a request for `/modules/…`
// has no match there and falls through to a 404 (or the SPA html
// fallback, depending on the request's Accept header), hence this
// middleware.
//
// Why `/modules/` and not the natural `/node_modules/`: the deployed site
// is the built `dist/` shipped as-is via `wrangler pages deploy`, and
// Cloudflare Pages hard-ignores any directory named `node_modules` (a
// non-overridable entry in wrangler's deploy ignore list — see the
// `validate()` IGNORE_LIST, `**/node_modules`). A folder literally called
// node_modules is silently dropped from the upload, so the runtime is
// served — and copied into the build — under `modules/` instead.
//
// The playground hard-codes `/modules/pota/...` URLs in three places:
//   - the preview iframe's importmap (generated/docs/importmap.json),
//     which resolves bare `pota` specifiers in user code,
//   - the Babel standalone `<script>` in
//     src/components/playground/transform.js (BABEL_URL), and
//   - the editor's type-bundle fetch in
//     src/components/playground/ts-service.js (TYPES_URL).
// Without this middleware none resolve and the playground can't load
// Babel, the types, or run any example. (The TS language service's own
// virtual FS still keys types under `/node_modules/` — that's an
// in-memory resolution detail, not an HTTP path; see ts-service.js.)
//
// Scope is deliberately limited to `/modules/pota/`. On build there is no
// middleware, so closeBundle() copies the runtime files into
// dist/modules/pota and publish.sh ships that copy.

import { cpSync, createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
// docs/tools → docs/node_modules
const nodeModulesDir = join(here, '..', 'node_modules')
const PREFIX = '/modules/'

// Everything the playground loads from /modules/pota/ at runtime,
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
				cpSync(from, join(outDir, 'modules', 'pota', rel), {
					recursive: true,
				})
			}
		},
	}
}
