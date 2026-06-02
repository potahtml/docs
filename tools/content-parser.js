// Build-time markdown parser for the docs content. Runs in Node
// inside the Vite plugin — `marked` never ships to the client.
//
// parseDoc(raw, id) → a DocPage-shaped object:
//   { id, title, subpath, kind, topic, exports, lede[], sections[], examples[] }
// parseMeta(raw, id) → lightweight metadata for the manifest (no body).
//
// Heuristics:
//   - paragraphs between the H1 and the first H2 → `lede`
//   - each H2 → a section, EXCEPT `## Examples` which switches into
//     examples mode where each H3 is an example step
//   - every code fence under `## Examples` is `live: true`; fences
//     elsewhere are static snippets

import { marked } from 'marked'

const slug = s =>
	String(s)
		.toLowerCase()
		.replace(/<[^>]*>/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')

const inline = t => marked.parseInline(t || '')

// plain text from inline markdown (for titles / descriptions)
const plain = s =>
	String(s || '')
		.replace(/`([^`]*)`/g, '$1')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_>#]/g, '')
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim()

const cellHtml = c => inline(c.text)

const isExamples = text => /^examples$/i.test(plain(text))

const SCRIPT_EXT = /\.(jsx|tsx|js|ts)$/

// Entry of a multi-file group: the first script file, else the first.
function pickEntry(files) {
	const script = files.find(f => SCRIPT_EXT.test(f.name))
	return (script || files[0]).name
}

// Coalesce a run of consecutive NAMED code fences (nothing between) into
// one multi-file group `{ type:'files', live, files[], entry }`. Unnamed
// fences stay standalone single-file `file` items.
function pushContent(arr, item) {
	if (item.type === 'file' && item.name) {
		const last = arr[arr.length - 1]
		const file = {
			name: item.name,
			lang: item.lang,
			source: item.source,
		}
		if (last && last.type === 'files') {
			last.files.push(file)
			last.entry = pickEntry(last.files)
			return
		}
		if (last && last.type === 'file' && last.name) {
			const files = [
				{ name: last.name, lang: last.lang, source: last.source },
				file,
			]
			arr[arr.length - 1] = {
				type: 'files',
				live: last.live,
				files,
				entry: pickEntry(files),
			}
			return
		}
	}
	arr.push(item)
}

function parseFrontmatter(raw) {
	const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw)
	if (!m) return { data: {}, body: raw }

	const data = {}
	for (const line of m[1].split('\n')) {
		const mm = /^([\w-]+):\s*(.*)$/.exec(line)
		if (!mm) continue
		let v = mm[2].trim()
		if (v.startsWith('[') && v.endsWith(']')) {
			v = v
				.slice(1, -1)
				.split(',')
				.map(s => s.trim())
				.filter(Boolean)
		} else {
			v = v.replace(/^['"]|['"]$/g, '')
		}
		data[mm[1]] = v
	}
	return { data, body: raw.slice(m[0].length) }
}

function tokenToItem(t, live) {
	switch (t.type) {
		case 'paragraph':
			return { type: 'paragraph', html: inline(t.text) }
		case 'code': {
			// info string is `<language> [filename]`, e.g. ```jsx app.jsx
			const info = (t.lang || '').trim().split(/\s+/)
			return {
				type: 'file',
				live,
				lang: info[0] || '',
				name: info.slice(1).join(' '),
				source: t.text,
			}
		}
		case 'heading':
			return {
				type: 'heading',
				level: t.depth,
				id: slug(t.text),
				text: plain(t.text),
			}
		case 'list':
			return {
				type: 'list',
				ordered: !!t.ordered,
				items: t.items.map(i => inline(i.text)),
			}
		case 'table':
			return {
				type: 'table',
				header: t.header.map(cellHtml),
				rows: t.rows.map(r => r.map(cellHtml)),
			}
		case 'blockquote':
			return { type: 'paragraph', html: inline(t.text) }
		default:
			return null
	}
}

export function parseDoc(raw, id) {
	const { data, body } = parseFrontmatter(raw)
	const tokens = marked.lexer(body)

	const lede = []
	const sections = []
	const examples = []

	let mode = 'lede' // 'lede' | 'section' | 'examples'
	let section = null
	let step = null
	const preStep = [] // examples-mode content seen before the first H3

	for (const t of tokens) {
		if (t.type === 'space') continue
		if (t.type === 'heading' && t.depth === 1) continue

		if (t.type === 'heading' && t.depth === 2) {
			if (isExamples(t.text)) {
				mode = 'examples'
				section = null
				step = null
			} else {
				mode = 'section'
				section = {
					id: slug(t.text),
					title: plain(t.text),
					content: [],
				}
				sections.push(section)
			}
			continue
		}

		if (
			mode === 'examples' &&
			t.type === 'heading' &&
			t.depth === 3
		) {
			step = { slug: slug(t.text), title: plain(t.text), content: [] }
			if (preStep.length) {
				step.content.push(...preStep.splice(0))
			}
			examples.push(step)
			continue
		}

		if (mode === 'lede') {
			if (t.type === 'paragraph') lede.push(inline(t.text))
			continue
		}

		const item = tokenToItem(t, mode === 'examples')
		if (!item) continue

		if (mode === 'section' && section)
			pushContent(section.content, item)
		else if (mode === 'examples')
			pushContent(step ? step.content : preStep, item)
	}

	return {
		id,
		title: data.title || id,
		subpath: data.subpath || '',
		kind: data.kind || 'reference',
		topic: data.topic || data.bucket || '',
		exports: toArray(data.exports),
		lede,
		sections,
		examples,
	}
}

// Standalone editorial pages under `pages/` (not API reference, not in
// the manifest). Unlike parseDoc, the whole body is kept in document
// order, rendered by Content.jsx.
//   parsePage(raw, id) → { id, title, lede[], content[] }
//
// Title: frontmatter `title`, else the H1. Lede (hero subtitle):
// frontmatter `lede` if present (and then the whole body is content),
// otherwise the leading paragraphs before the first block-level item.
// A code fence tagged `live` (```jsx live) becomes a live Playground;
// other fences are static snippets.
export function parsePage(raw, id) {
	const { data, body } = parseFrontmatter(raw)
	const tokens = marked.lexer(body)

	let title = data.title || ''
	const lede = []
	const content = []
	// a frontmatter `lede:` wins and keeps the whole body as content
	let bodyStarted = !!data.lede
	if (data.lede) lede.push(data.lede)

	for (const t of tokens) {
		if (t.type === 'space') continue
		if (t.type === 'heading' && t.depth === 1) {
			if (!title) title = plain(t.text)
			continue
		}
		if (!bodyStarted && t.type === 'paragraph') {
			lede.push(inline(t.text))
			continue
		}
		bodyStarted = true
		if (t.type === 'code') {
			// strip the `live` keyword so the rest is still `<lang> [name]`
			const words = (t.lang || '').trim().split(/\s+/).filter(Boolean)
			const live = words.includes('live')
			const item = tokenToItem(
				{ ...t, lang: words.filter(w => w !== 'live').join(' ') },
				live,
			)
			if (item) pushContent(content, item)
			continue
		}
		const item = tokenToItem(t, false)
		if (item) pushContent(content, item)
	}

	return { id, title: title || id, lede, content }
}

export function parseMeta(raw, id) {
	const { data, body } = parseFrontmatter(raw)

	let descSource = ''
	for (const t of marked.lexer(body)) {
		if (t.type === 'heading' && t.depth === 1) continue
		if (t.type === 'heading' && t.depth === 2) break
		if (t.type === 'paragraph') {
			descSource = t.text
			break
		}
	}

	let desc = data.desc || data.tagline || plain(descSource)
	const sentence = desc.split(/(?<=[.!?])\s/)[0] || desc
	desc =
		sentence.length > 120 ? sentence.slice(0, 117) + '…' : sentence

	return {
		id,
		title: data.title || id,
		subpath: data.subpath || '',
		kind: data.kind || 'reference',
		topic: data.topic || data.bucket || '',
		exports: toArray(data.exports),
		desc,
		href: '/' + id,
	}
}

function toArray(v) {
	if (Array.isArray(v)) return v
	return v ? [v] : []
}
