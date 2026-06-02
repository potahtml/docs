// Vite plugin that turns the docs markdown into data at build time.
//
//   import doc from './content/render.md'   → parsed DocPage object
//   import { manifest } from 'virtual:manifest'
//       → { sections } built from every page's frontmatter, grouped by
//         the curated taxonomy in topics.js
//
// `marked` and the parser run here, in Node — they never reach the
// client bundle.

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseDoc, parseMeta, parsePage } from './content-parser.js'
import { buildManifest } from './topics.js'

// this plugin lives in new-site/tools/, so project paths are one up
const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const contentDir = join(root, 'src', 'content')
// editorial page copy, kept apart from the API-reference content/ tree
// so page prose is easy to find and edit
const pagesDir = join(root, 'pages')

const VIRTUAL_ID = 'virtual:manifest'
const RESOLVED_ID = '\0' + VIRTUAL_ID

const stripQuery = id => id.split('?')[0]
const isContentMd = id =>
	stripQuery(id).endsWith('.md') &&
	stripQuery(id).startsWith(contentDir)
const isPageMd = id =>
	stripQuery(id).endsWith('.md') &&
	stripQuery(id).startsWith(pagesDir)

const pageId = file =>
	relative(pagesDir, stripQuery(file))
		.replace(/\\/g, '/')
		.replace(/\.md$/, '')

const routeId = file =>
	relative(contentDir, stripQuery(file))
		.replace(/\\/g, '/')
		.replace(/\.md$/, '')

function listMarkdown(dir) {
	const out = []
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name)
		if (entry.isDirectory()) out.push(...listMarkdown(full))
		else if (entry.name.endsWith('.md')) out.push(full)
	}
	return out
}

function loadManifest() {
	const pages = listMarkdown(contentDir).map(file =>
		parseMeta(readFileSync(file, 'utf8'), routeId(file)),
	)
	return buildManifest(pages)
}

export function contentPlugin() {
	return {
		name: 'pota-docs-content',
		enforce: 'pre',

		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_ID
		},

		load(id) {
			if (id === RESOLVED_ID) {
				return `export const manifest = ${JSON.stringify(loadManifest())}`
			}
			if (isContentMd(id)) {
				const raw = readFileSync(stripQuery(id), 'utf8')
				const doc = parseDoc(raw, routeId(id))
				return `export default ${JSON.stringify(doc)}`
			}
			if (isPageMd(id)) {
				const raw = readFileSync(stripQuery(id), 'utf8')
				const page = parsePage(raw, pageId(id))
				return `export default ${JSON.stringify(page)}`
			}
		},

		configureServer(server) {
			const invalidateManifest = () => {
				const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
				if (mod) server.moduleGraph.invalidateModule(mod)
				server.ws.send({ type: 'full-reload' })
			}
			const onChange = file => {
				if (file.endsWith('.md') || file.endsWith('topics.js')) {
					invalidateManifest()
				}
			}
			server.watcher.add(contentDir)
			server.watcher.on('add', onChange)
			server.watcher.on('unlink', onChange)
		},
	}
}
