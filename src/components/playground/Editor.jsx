import styles from './Editor.module.css'

import { cleanup, withValue } from 'pota'

import {
	EditorState,
	EditorSelection,
	Compartment,
} from '@codemirror/state'
import {
	EditorView,
	keymap,
	lineNumbers,
	drawSelection,
	highlightActiveLine,
} from '@codemirror/view'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import {
	defaultKeymap,
	history,
	historyKeymap,
} from '@codemirror/commands'
import { completionKeymap } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'

import { highlight } from './highlight.js'
import { formatWithCursor } from './transform.js'

const isCssName = name => (name || '').endsWith('.css')

// Mod-s (Ctrl/Cmd-S): prettier-format the document in place, keeping the
// cursor where it was. A parse failure (mid-edit syntax error) no-ops.
const formatView = (view, isCss) => {
	const code = view.state.doc.toString()
	const head = view.state.selection.main.head
	formatWithCursor(code, head, isCss ? 'css' : 'js')
		.then(res => {
			if (!res || res.formatted == null || res.formatted === code) {
				return
			}
			const offset = Math.max(
				0,
				Math.min(res.cursorOffset ?? head, res.formatted.length),
			)
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: res.formatted,
				},
				selection: EditorSelection.cursor(offset),
			})
		})
		.catch(() => {})
}

const languageExtFor = file => {
	if (isCssName(file.name) || file.lang === 'css') return css()
	return javascript({ jsx: true, typescript: true })
}

/**
 * Multi-file CodeMirror, shared by Snippet (read-only highlighting) and
 * Playground (editable). One EditorState per file, swapped on
 * `activeFile` change so per-tab undo history and cursor survive tab
 * switches.
 *
 * When `typescript` is set (Playground only), an isolated in-browser TS
 * language service drives hover types, completion and diagnostics, kept
 * in sync with the file list and the active file.
 *
 * @param {{
 *   files:       () => { name: string, lang?: string, source: string }[],
 *   activeFile:  () => string,
 *   editable?:   boolean,
 *   typescript?: boolean,
 *   fill?:       boolean,
 *   delay?:      number,
 *   'on:change'?:(name: string, source: string) => void,
 * }} props
 */
export function Editor(props) {
	const editable = props.editable !== false
	const useTs = editable && !!props.typescript

	return (
		<div
			class={styles.editor}
			data-editable={editable ? '' : undefined}
			data-fill={props.fill ? '' : undefined}
			use:ref={container => {
				/** @type {Map<string, EditorState>} one state per file */
				const stateMap = new Map()
				// Content we last reported to the parent — lets us ignore
				// the echo back through props.files without clobbering
				// in-progress keystrokes.
				const lastSent = new Map()

				const tsCompartment = new Compartment()
				/** @type {any} */
				let tsApi = null

				let currentName = null
				let changeTimeout = null
				let view

				const changeListener = EditorView.updateListener.of(
					update => {
						// `currentName` may legitimately be '' — guard on null.
						if (currentName == null || !props['on:change']) return
						if (!update.docChanged) return
						clearTimeout(changeTimeout)
						const name = currentName
						changeTimeout = setTimeout(() => {
							const source = update.view.state.doc.toString()
							lastSent.set(name, source)
							props['on:change'](name, source)
						}, props.delay || 250)
					},
				)

				const makeState = (file, cursorOffset) => {
					const doc = file.source || ''
					const isCss = isCssName(file.name)
					const opts = {
						allowImportingTsExtensions: true,
						doc,
						extensions: editable
							? [
									lineNumbers(),
									history(),
									drawSelection(),
									indentOnInput(),
									bracketMatching(),
									highlightActiveLine(),
									languageExtFor(file),
									highlight,
									EditorView.lineWrapping,
									changeListener,
									keymap.of([
										{
											key: 'Mod-s',
											preventDefault: true,
											run: view => (formatView(view, isCss), true),
										},
										...defaultKeymap,
										...historyKeymap,
										...completionKeymap,
									]),
									...(useTs
										? [
												// CSS files get no TS extensions
												tsCompartment.of(
													isCss || !tsApi ? [] : tsApi.extensions,
												),
											]
										: []),
								]
							: [
									drawSelection(),
									languageExtFor(file),
									highlight,
									EditorView.lineWrapping,
									EditorState.readOnly.of(true),
									EditorView.editable.of(false),
								],
					}
					if (
						typeof cursorOffset === 'number' &&
						cursorOffset >= 0 &&
						cursorOffset <= doc.length
					) {
						opts.selection = EditorSelection.cursor(cursorOffset)
					}
					return EditorState.create(opts)
				}

				// Re-apply TS extensions for the current file after a state
				// swap (stored states may predate tsApi being ready). CSS
				// tabs get none — wrong language.
				const applyCurrentTs = () => {
					if (!useTs || !tsApi) return
					view.dispatch({
						effects: tsCompartment.reconfigure(
							isCssName(currentName) ? [] : tsApi.extensions,
						),
					})
				}

				const fileByName = name =>
					props.files().find(f => f.name === name) || {
						name,
						source: '',
					}

				// ---- bootstrap ----

				const initialFiles = props.files()
				const initialActive =
					props.activeFile() || initialFiles[0]?.name || ''

				for (const f of initialFiles) {
					stateMap.set(f.name, makeState(f))
				}
				currentName = initialActive

				view = new EditorView({
					state:
						stateMap.get(initialActive) ||
						makeState(fileByName(initialActive)),
					parent: container,
				})

				// ---- async TS bring-up (per editor) ----

				if (useTs) {
					// Lazy: keeps @typescript/vfs out of the main bundle —
					// only loaded when a live editable example mounts.
					import('./ts-service.js')
						.then(m => m.createTsEnvironment())
						.then(api => {
							tsApi = api
							for (const f of props.files()) {
								// CSS files aren't TS source — the ambient
								// `*.css` declarations type their imports.
								if (isCssName(f.name)) continue
								api.updateFile(f.name, f.source)
							}
							api.setActivePath(currentName)
							applyCurrentTs()
						})
						.catch(err => {
							console.error('playground TS service failed:', err)
						})
				}

				// ---- reactive: file list (content + add/remove sync) ----

				withValue(props.files, files => {
					if (!Array.isArray(files)) return
					const names = new Set(files.map(f => f.name))

					for (const name of [...stateMap.keys()]) {
						if (!names.has(name)) {
							stateMap.delete(name)
							tsApi && tsApi.removeFile(name)
						}
					}

					for (const f of files) {
						if (!stateMap.has(f.name)) {
							stateMap.set(f.name, makeState(f))
							tsApi &&
								!isCssName(f.name) &&
								tsApi.updateFile(f.name, f.source)
							continue
						}
						// Skip the echo of our own edits.
						if (lastSent.get(f.name) === f.source) continue

						const isCurrent = f.name === currentName
						const cur = isCurrent
							? view.state.doc.toString()
							: stateMap.get(f.name).doc.toString()
						if (cur === f.source) continue

						if (isCurrent) {
							view.dispatch({
								changes: {
									from: 0,
									to: view.state.doc.length,
									insert: f.source || '',
								},
							})
						} else {
							stateMap.set(f.name, makeState(f))
						}
						tsApi &&
							!isCssName(f.name) &&
							tsApi.updateFile(f.name, f.source)
					}
				})

				// ---- reactive: active file ----

				withValue(props.activeFile, name => {
					if (!name || name === currentName) return
					// Persist the outgoing state only if its file still
					// exists (guards against re-adding a renamed-away file).
					const stillExists = props
						.files()
						.some(f => f.name === currentName)
					if (currentName && stillExists) {
						stateMap.set(currentName, view.state)
					}
					const nextState =
						stateMap.get(name) || makeState(fileByName(name))
					stateMap.set(name, nextState)
					currentName = name
					view.setState(nextState)
					applyCurrentTs()
					tsApi && tsApi.setActivePath(name)
					// Selecting a tab moves focus into the code, so typing
					// lands in the file you just switched to. Editable only.
					if (editable) view.focus()
				})

				cleanup(() => {
					clearTimeout(changeTimeout)
					view.destroy()
				})
			}}
		/>
	)
}
