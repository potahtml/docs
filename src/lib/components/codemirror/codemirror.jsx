import styles from './codemirror.module.css'

import { addEvent, cleanup, withValue } from 'pota'

import { EditorState, Compartment, EditorSelection } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'

import types from '../../../../node_modules/pota/generated/docs/types.json' with { type: 'json' }
import { createTsExtensions } from './ts-service.js'

/**
 * One TS env per page session — seeded empty at first use, then kept in
 * sync with the user's file list by the component's reconcile step.
 */
let tsReadyPromise
function ensureTs() {
	if (!tsReadyPromise) {
		tsReadyPromise = createTsExtensions(types, [], '')
	}
	return tsReadyPromise
}

const themeMap = {
	'one-dark': oneDark,
}

const languageExtFor = name => {
	if (name.endsWith('.css')) return css()
	return javascript({ jsx: true, typescript: true })
}

/**
 * Multi-file CodeMirror editor.
 *
 * @param {{
 *   files:       () => { name: string, content: string }[],
 *   activeFile:  () => string,
 *   cursor?:     () => { file: string, offset: number } | null,
 *   'on:change'?:(name: string, content: string) => void,
 *   'on:cursorChange'?:(file: string, offset: number) => void,
 *   'on:format'?:(code: string) => Promise<string>,
 *   language?:   string,
 *   delay?:      number,
 *   theme?:      () => string,
 * }} props
 */
export function CodeMirror(props) {
	return (
		<div
			class={styles.container}
			use:ref={container => {
				const themeCompartment = new Compartment()
				const tsCompartment = new Compartment()

				/** @type {Map<string, EditorState>} — one state per open tab */
				const stateMap = new Map()
				/** Content we most recently sent to the parent. Lets us
				 * ignore the echo back through props.files without clobbering
				 * the user's in-progress keystrokes. */
				const lastSentContent = new Map()

				let currentName = null
				let codeChangeTimeout = null
				let tsApi = null
				let view // forward reference

				// ---- extension builders ----

				const changeListener = EditorView.updateListener.of(
					update => {
						if (!currentName) return
						if (update.docChanged || update.selectionSet) {
							clearTimeout(codeChangeTimeout)
							const name = currentName
							codeChangeTimeout = setTimeout(() => {
								const content = update.view.state.doc.toString()
								lastSentContent.set(name, content)
								if (props['on:change']) {
									props['on:change'](name, content)
								}
								if (props['on:cursorChange']) {
									props['on:cursorChange'](
										name,
										update.view.state.selection.main.head,
									)
								}
							}, props.delay || 200)
						}
					},
				)

				const runFormat = () => {
					if (!props['on:format']) return
					const current = view.state.doc.toString()
					props['on:format'](current)
						.then(code => {
							const pos = view.state.selection.main.head
							view.dispatch({
								changes: {
									from: 0,
									to: view.state.doc.length,
									insert: code,
								},
								selection: {
									anchor: Math.min(pos, code.length),
								},
							})
						})
						.catch(() => {})
				}

				const formatKeymap = keymap.of([
					{
						key: 'Mod-s',
						preventDefault: true,
						run: () => (runFormat(), true),
					},
					{
						key: 'Shift-Alt-f',
						preventDefault: true,
						run: () => (runFormat(), true),
					},
				])

				const makeState = (name, content, cursorOffset) => {
					const doc = content || ''
					const isCss = name && name.endsWith('.css')
					const opts = {
						doc,
						extensions: [
							basicSetup,
							languageExtFor(name || ''),
							themeCompartment.of(oneDark),
							// TS service is irrelevant for CSS — skip the
							// extensions there to avoid spurious diagnostics.
							tsCompartment.of(
								isCss || !tsApi ? [] : tsApi.extensions,
							),
							changeListener,
							formatKeymap,
							EditorView.lineWrapping,
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

				// Always re-apply current TS config after swapping state,
				// because stored states may have been created before tsApi
				// was ready. CSS tabs get no TS extensions (wrong language).
				const applyCurrentTs = () => {
					if (!tsApi) return
					const isCss =
						currentName && currentName.endsWith('.css')
					view.dispatch({
						effects: tsCompartment.reconfigure(
							isCss ? [] : tsApi.extensions,
						),
					})
				}

				// ---- bootstrap ----

				const initialFiles = props.files()
				const initialActive =
					props.activeFile() || initialFiles[0]?.name || ''
				const initialCursor = props.cursor ? props.cursor() : null

				for (const f of initialFiles) {
					const cursorOffset =
						initialCursor && initialCursor.file === f.name
							? initialCursor.offset
							: undefined
					stateMap.set(
						f.name,
						makeState(f.name, f.content, cursorOffset),
					)
				}
				currentName = initialActive

				view = new EditorView({
					state:
						stateMap.get(initialActive) ||
						makeState(initialActive, ''),
					parent: container,
				})

				// Defer focus so the DOM / pota render cycle has settled
				// — focusing synchronously inside use:ref is unreliable
				// when the editor is mounted inside a conditionally shown
				// panel.
				setTimeout(() => view.focus(), 0)

				// Flush pending debounced change + report cursor on focus loss.
				const flush = () => {
					if (codeChangeTimeout) {
						clearTimeout(codeChangeTimeout)
						codeChangeTimeout = null
						if (currentName) {
							const content = view.state.doc.toString()
							lastSentContent.set(currentName, content)
							if (props['on:change']) {
								props['on:change'](currentName, content)
							}
						}
					}
					if (props['on:cursorChange'] && currentName) {
						props['on:cursorChange'](
							currentName,
							view.state.selection.main.head,
						)
					}
				}
				container.addEventListener('focusout', flush)

				// ---- async TS bring-up ----

				ensureTs()
					.then(api => {
						tsApi = api
						for (const f of props.files()) {
							api.createFile(f.name, f.content)
						}
						api.setActivePath(currentName)
						applyCurrentTs()
					})
					.catch(err => {
						console.error('CodeMirror TS service failed:', err)
					})

				// ---- reactive: file list ----

				withValue(props.files, files => {
					if (!Array.isArray(files)) return
					const nextNames = new Set(files.map(f => f.name))

					// Removed files
					for (const name of [...stateMap.keys()]) {
						if (!nextNames.has(name)) {
							stateMap.delete(name)
							tsApi && tsApi.removeFile(name)
						}
					}

					// Added / content-synced files.
					// Echoes of the editor's own changes arrive here (parent
					// re-publishes the value we just sent). Skip those via
					// lastSentContent so we never overwrite in-progress
					// keystrokes with a stale string — that was resetting
					// the cursor.
					for (const f of files) {
						if (!stateMap.has(f.name)) {
							stateMap.set(f.name, makeState(f.name, f.content))
							tsApi && tsApi.createFile(f.name, f.content)
							continue
						}
						if (lastSentContent.get(f.name) === f.content) {
							continue
						}
						const state = stateMap.get(f.name)
						const current =
							f.name === currentName
								? view.state.doc.toString()
								: state.doc.toString()
						if (current !== f.content) {
							if (f.name === currentName) {
								view.dispatch({
									changes: {
										from: 0,
										to: view.state.doc.length,
										insert: f.content || '',
									},
								})
							} else {
								stateMap.set(
									f.name,
									makeState(f.name, f.content),
								)
							}
							tsApi && tsApi.updateFile(f.name, f.content)
						}
					}
				})

				// ---- reactive: active file ----

				withValue(props.activeFile, name => {
					if (!name || name === currentName) return
					// Persist the current state (latest doc + cursor).
					if (currentName) {
						stateMap.set(currentName, view.state)
					}
					const nextState =
						stateMap.get(name) ||
						makeState(
							name,
							(props.files().find(f => f.name === name) || {})
								.content || '',
						)
					stateMap.set(name, nextState)
					currentName = name
					view.setState(nextState)
					applyCurrentTs()
					tsApi && tsApi.setActivePath(name)
					// Defensively re-apply selection — ensures the cursor
					// lands where we saved it, even if any mount-time
					// transaction would otherwise reset it.
					const savedSelection = nextState.selection
					setTimeout(() => {
						view.focus()
						if (savedSelection) {
							view.dispatch({ selection: savedSelection })
						}
					}, 0)
				})

				// ---- reactive: theme ----

				withValue(props.theme, value => {
					const ext = themeMap[value] ?? oneDark
					view.dispatch({
						effects: themeCompartment.reconfigure(ext),
					})
				})

				// External "replace current tab's content" event.
				addEvent(window, 'monacoCodeChanged', e => {
					if (e.detail) {
						view.dispatch({
							changes: {
								from: 0,
								to: view.state.doc.length,
								insert: e.detail.trim(),
							},
						})
					}
				})

				cleanup(() => {
					flush()
					view.destroy()
				})
			}}
		/>
	)
}

CodeMirror.themes = ['one-dark']
