// Emits one static HTML file per docs URL into the build output, so
// crawlers and no-JS readers get real content instead of an empty app
// shell. dist/index.html (home) is rewritten in place; every other URL
// — each documentation/content/**/*.md plus the standalone pages —
// gets a mirror of it with the per-page <title>, description / OG
// tags, and the page's markdown rendered inside <div id="root"> —
// index.jsx renders with {clear: true}, so the app replaces it on
// boot, and until then (and without JS) it's real, indexable page
// content. The app's <Head> blocks set the same head values — the
// per-page fields below MIRROR those blocks (DocPage.jsx, Home.jsx,
// Thanks.jsx, Cheatsheet.jsx, PlaygroundPage.jsx, NotFound.jsx);
// change both together.
//
// Cloudflare Pages serves /components/For from components/For.html
// (clean URLs), and the 404.html written here replaces its blanket
// SPA fallback: unknown URLs now return a real 404 status while still
// rendering the app's NotFound page.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { marked } from 'marked'

import { parseDoc, parseFrontmatter } from './content-parser.js'
import {
	contentDir,
	listMarkdown,
	routeId,
} from './vite-plugin-content.js'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const repoRoot = join(root, '..', '..')

const ORIGIN = 'https://pota.quack.uy'
const HOME_TITLE = 'pota — small reactive web renderer'

const escapeHtml = s =>
	String(s)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')

// marked's inline HTML carries encoded entities (`&#39;`, `&amp;`, …);
// decode them so escapeHtml below doesn't double-encode. &amp; last,
// so it can't manufacture new entities out of decoded text.
const decodeEntities = s =>
	String(s)
		.replace(/&#x([0-9a-f]+);/gi, (_, h) =>
			String.fromCodePoint(parseInt(h, 16)),
		)
		.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&quot;', '"')
		.replaceAll('&amp;', '&')

// same derivation as the runtime Head blocks: lede entries are
// inline-rendered HTML — strip tags, collapse whitespace
const ledeText = lede =>
	decodeEntities(
		(lede || [])
			.map(s => s.replace(/<[^>]*>/g, ''))
			.join(' ')
			.replace(/\s+/g, ' ')
			.trim(),
	)

// full markdown body (frontmatter stripped) → HTML for the root div
const mdHtml = raw => marked.parse(parseFrontmatter(raw).body)

const readMd = (...path) => readFileSync(join(...path), 'utf8')

// One descriptor per URL. `desc` undefined = keep the template's
// default description/og:description (matches runtime pages that don't
// override them); `prerender` undefined = leave the root div empty
// (the playground has no markdown body).
function pageList() {
	const pages = []

	const homeRaw = readMd(root, 'src', 'pages', 'home.md')
	const home = parseDoc(homeRaw, 'home')
	pages.push({
		out: 'index.html',
		url: '/',
		title: HOME_TITLE,
		ogTitle: HOME_TITLE,
		desc: ledeText(home.lede) || undefined,
		prerender: mdHtml(homeRaw),
	})

	pages.push({
		out: 'thanks.html',
		url: '/thanks',
		title: 'thanks — pota',
		prerender: mdHtml(readMd(root, 'src', 'pages', 'thanks.md')),
	})
	pages.push({
		out: 'cheatsheet.html',
		url: '/cheatsheet',
		title: 'cheatsheet — pota',
		prerender: mdHtml(readMd(repoRoot, 'documentation', 'cheatsheet.md')),
	})
	pages.push({
		out: 'playground.html',
		url: '/playground',
		title: 'playground — pota',
	})
	pages.push({
		out: '404.html',
		url: '/404',
		title: 'not found — pota',
		ogTitle: 'not found — pota',
		desc: '',
	})

	for (const file of listMarkdown(contentDir)) {
		const raw = readFileSync(file, 'utf8')
		const route = routeId(file)
		const doc = parseDoc(raw, route)
		pages.push({
			out: route + '.html',
			url: '/' + route,
			title: `${doc.title} — pota`,
			ogTitle: doc.title,
			desc: ledeText(doc.lede) || undefined,
			prerender: mdHtml(raw),
		})
	}

	return pages
}

// rewrite `content` of `<meta name|property="key" content="…">`,
// tolerating the formatted (multi-line) attribute layout of the built
// index.html. Function replacers throughout: page content may contain
// `$&`-style sequences that string replacements would expand.
const setMetaContent = (html, attr, key, value) =>
	html.replace(
		new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`),
		(_, open, close) => open + escapeHtml(value) + close,
	)

function renderPage(template, page) {
	let html = template
	html = html.replace(
		/<title>[\s\S]*?<\/title>/,
		() => `<title>${escapeHtml(page.title)}</title>`,
	)
	html = setMetaContent(html, 'property', 'og:url', ORIGIN + page.url)
	if (page.ogTitle !== undefined) {
		html = setMetaContent(html, 'property', 'og:title', page.ogTitle)
	}
	if (page.desc !== undefined) {
		html = setMetaContent(html, 'name', 'description', page.desc)
		html = setMetaContent(
			html,
			'property',
			'og:description',
			page.desc,
		)
	}
	if (page.prerender !== undefined) {
		html = html.replace(
			'<div id="root"></div>',
			() => `<div id="root">${page.prerender}</div>`,
		)
	}
	return html
}

export function staticPagesPlugin() {
	let outDir
	return {
		name: 'pota-docs-static-pages',
		apply: 'build',

		configResolved(config) {
			outDir = resolve(config.root, config.build.outDir)
		},

		closeBundle() {
			const template = readFileSync(join(outDir, 'index.html'), 'utf8')
			const pages = pageList()
			for (const page of pages) {
				const file = join(outDir, page.out)
				mkdirSync(dirname(file), { recursive: true })
				writeFileSync(file, renderPage(template, page))
			}
			console.log(`[static-pages] wrote ${pages.length} pages`)
		},
	}
}
