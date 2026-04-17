import { signal } from 'pota'
import { compress, uncompress } from './compress.js'

/**
 * Playground state — single module that owns the multi-file document
 * model and persists it to both the URL hash and localStorage using
 * the same shape.
 *
 * State shape:
 *   {
 *     files:  [{ name: string, content: string }, ...],
 *     active: string,                // filename currently shown
 *     cursor: { file: string, offset: number } | null
 *   }
 *
 * URL: compressed via ./compress.js
 * localStorage: plain JSON at key `playgroundState`
 *
 * No backwards-compatibility with the old single-string schema.
 */

const DEFAULT_FILE_NAME = 'main.tsx'
const LOCAL_STORAGE_KEY = 'playgroundState'

function defaultState(fallbackContent) {
	return {
		files: [
			{ name: DEFAULT_FILE_NAME, content: fallbackContent || '' },
		],
		active: DEFAULT_FILE_NAME,
		cursor: null,
	}
}

function isValidState(s) {
	return (
		s &&
		Array.isArray(s.files) &&
		s.files.every(
			f => f && typeof f.name === 'string' && 'content' in f,
		) &&
		typeof s.active === 'string'
	)
}

function readFromURL() {
	const hash = window.location.hash.substring(1)
	if (!hash) return null
	try {
		const parsed = uncompress(decodeURIComponent(hash))
		// New multi-file shape
		if (isValidState(parsed)) return parsed
		// `open in playground` from the docs: the hash is just the code
		// string (what the playground used to serialize before tabs).
		if (typeof parsed === 'string') {
			return {
				files: [{ name: DEFAULT_FILE_NAME, content: parsed }],
				active: DEFAULT_FILE_NAME,
				cursor: null,
			}
		}
		// Older wrapper `{ code: "..." }`, if it ever lands here.
		if (parsed && typeof parsed.code === 'string') {
			return {
				files: [
					{ name: DEFAULT_FILE_NAME, content: parsed.code },
				],
				active: DEFAULT_FILE_NAME,
				cursor: null,
			}
		}
	} catch {}
	return null
}

function readFromLocalStorage() {
	try {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw)
		if (isValidState(parsed)) return parsed
	} catch {}
	return null
}

/**
 * @param {string} [fallbackContent] used when the URL hash is empty
 */
export function createPlaygroundState(fallbackContent) {
	const initial =
		readFromURL() ||
		readFromLocalStorage() ||
		defaultState(fallbackContent)

	const [files, setFiles] = signal(initial.files)
	const [active, setActive] = signal(initial.active)
	const [cursor, setCursor] = signal(initial.cursor)

	const getFile = name => files().find(f => f.name === name)

	const updateFileContent = (name, content) => {
		const current = files()
		const idx = current.findIndex(f => f.name === name)
		if (idx === -1) return
		if (current[idx].content === content) return
		const next = current.slice()
		next[idx] = { ...next[idx], content }
		setFiles(next)
	}

	const addFile = (base = 'untitled.ts') => {
		const current = files()
		let name = base
		let i = 1
		while (current.some(f => f.name === name)) {
			name = base.replace(/(\.[^.]+)?$/, m => `-${i}${m || ''}`)
			i++
		}
		setFiles([...current, { name, content: '' }])
		setActive(name)
		return name
	}

	const removeFile = name => {
		const current = files()
		const idx = current.findIndex(f => f.name === name)
		if (idx === -1) return false
		const remaining = current.filter(f => f.name !== name)
		if (remaining.length === 0) return false // refuse last-file delete
		setFiles(remaining)
		if (active() === name) {
			// Prefer the tab to the left; if the closed tab was the
			// leftmost, fall back to the new leftmost.
			const leftIdx = Math.max(0, idx - 1)
			setActive(remaining[leftIdx].name)
		}
		return true
	}

	const renameFile = (oldName, newName) => {
		newName = (newName || '').trim()
		if (!newName || newName === oldName) return false
		if (files().some(f => f.name === newName)) return false
		setFiles(
			files().map(f =>
				f.name === oldName ? { ...f, name: newName } : f,
			),
		)
		if (active() === oldName) setActive(newName)
		return true
	}

	const snapshot = () => ({
		files: files(),
		active: active(),
		cursor: cursor(),
	})

	const persistToURL = () => {
		try {
			window.location.hash = '#' + compress(snapshot())
		} catch (err) {
			console.error('playground-state: persistToURL failed', err)
		}
	}

	const persistToLocalStorage = () => {
		try {
			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify(snapshot()),
			)
		} catch (err) {
			console.error(
				'playground-state: persistToLocalStorage failed',
				err,
			)
		}
	}

	const persist = () => {
		persistToURL()
		persistToLocalStorage()
	}

	return {
		// accessors
		files,
		active,
		cursor,

		// direct setters (use sparingly — prefer the mutation helpers)
		setFiles,
		setActive,
		setCursor,

		// mutation helpers
		getFile,
		updateFileContent,
		addFile,
		removeFile,
		renameFile,

		// serialization
		snapshot,
		persistToURL,
		persistToLocalStorage,
		persist,
	}
}
