import styles from './codemirror.module.css'

import { addEvent, cleanup, withValue } from 'pota'

import { EditorState, Compartment } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import types from '../../../../node_modules/pota/generated/docs/types.json' with { type: 'json' }
import { createTsExtensions } from './ts-service.js'

let tsReadyPromise
function ensureTs() {
	if (!tsReadyPromise) {
		tsReadyPromise = createTsExtensions(types)
	}
	return tsReadyPromise
}

const themeMap = {
	'one-dark': oneDark,
}

/**
 * CodeMirror editor. Mirrors the Monaco component's props contract so
 * the playground can swap between them.
 *
 * @param {{
 * 	value?: Accessor<string>
 * 	'on:change'?: Function
 * 	language?: string
 * 	delay?: number
 * 	'on:format'?: Function
 * 	theme?: Accessor<string>
 * }} props
 */
export function CodeMirror(props) {
	return (
		<div
			class={styles.container}
			use:ref={container => {
				const themeCompartment = new Compartment()
				const tsCompartment = new Compartment()

				let codeChangeTimeout
				const changeListener = EditorView.updateListener.of(
					update => {
						if (update.docChanged && props['on:change']) {
							clearTimeout(codeChangeTimeout)
							codeChangeTimeout = setTimeout(
								() => props['on:change'](view.state.doc.toString()),
								props.delay || 200,
							)
						}
					},
				)

				const formatKeymap = keymap.of([
					{
						key: 'Mod-s',
						preventDefault: true,
						run: () => {
							runFormat()
							return true
						},
					},
					{
						key: 'Shift-Alt-f',
						preventDefault: true,
						run: () => {
							runFormat()
							return true
						},
					},
				])

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

				const state = EditorState.create({
					doc: '',
					extensions: [
						basicSetup,
						javascript({
							jsx: true,
							typescript:
								(props.language || 'typescript') === 'typescript',
						}),
						themeCompartment.of(oneDark),
						tsCompartment.of([]),
						changeListener,
						formatKeymap,
						EditorView.lineWrapping,
					],
				})

				const view = new EditorView({ state, parent: container })

				const flush = () => {
					if (codeChangeTimeout) {
						clearTimeout(codeChangeTimeout)
						codeChangeTimeout = null
						if (props['on:change']) {
							props['on:change'](view.state.doc.toString())
						}
					}
				}

				// flush pending debounced change when focus leaves the
				// editor, so switching editors commits the latest value to
				// the parent signal before the switch unmounts us.
				container.addEventListener('focusout', flush)

				ensureTs()
					.then(ts => {
						view.dispatch({
							effects: tsCompartment.reconfigure(ts.extensions),
						})
						ts.setDoc(view.state.doc.toString())
					})
					.catch(err => {
						console.error('CodeMirror TS service failed:', err)
					})

				withValue(props.value, value => {
					view.dispatch({
						changes: {
							from: 0,
							to: view.state.doc.length,
							insert: value || '',
						},
					})
				})

				withValue(props.theme, value => {
					const ext = themeMap[value] ?? oneDark
					view.dispatch({
						effects: themeCompartment.reconfigure(ext),
					})
				})

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
