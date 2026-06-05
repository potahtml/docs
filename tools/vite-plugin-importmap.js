// Injects the `pota` importmap into any HTML that carries the
// `<!--POTA_IMPORTMAP-->` marker (currently just preview.html), reading
// it at build time from the repo's generated/docs/importmap.json so the
// preview iframe always resolves bare `pota` specifiers against an
// up-to-date map. Regenerate that file from the repo root with
// `npm run build:generate`.
//
// Running here (transformIndexHtml, dev + build) means there is no
// hand-maintained copy to drift; the marker degrades to an inert comment
// if the generated file is missing.

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
// docs/tools → docs → projects → <repo root>
const importmapPath = join(
	here,
	'..',
	'..',
	'..',
	'generated',
	'docs',
	'importmap.json',
)

const MARKER = '<!--POTA_IMPORTMAP-->'

function importmapScript() {
	try {
		const map = JSON.parse(readFileSync(importmapPath, 'utf8'))
		return (
			'<script type="importmap">\n' +
			JSON.stringify(map, null, '\t') +
			'\n\t\t</script>'
		)
	} catch (err) {
		console.warn(
			`[importmap] could not read ${importmapPath}: ${err.message}\n` +
				`  run \`npm run build:generate\` from the repo root — the preview ` +
				`iframe will not resolve bare \`pota\` specifiers until then.`,
		)
		return '<!-- pota importmap unavailable (run npm run build:generate) -->'
	}
}

export function importmapPlugin() {
	return {
		name: 'pota-docs-importmap',
		enforce: 'pre',

		transformIndexHtml(html) {
			if (!html.includes(MARKER)) return
			return html.replace(MARKER, importmapScript())
		},

		configureServer(server) {
			// pick up regenerations without a manual restart
			server.watcher.add(importmapPath)
			server.watcher.on('change', file => {
				if (file === importmapPath) {
					server.ws.send({ type: 'full-reload' })
				}
			})
		},
	}
}
