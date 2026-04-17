import styles from './tabs-bar.module.css'

import { signal } from 'pota'
import { For, Show } from 'pota/components'

/**
 * Renders a horizontal row of file tabs.
 *
 * @param {{
 * 	files: () => { name: string; content: string }[]
 * 	activeFile: () => string
 * 	'on:select'?: (name: string) => void
 * 	'on:rename'?: (oldName: string, newName: string) => void
 * 	'on:delete'?: (name: string) => void
 * 	'on:add'?: () => void
 * }} props
 */
export function TabsBar(props) {
	return (
		<div class={styles.bar}>
			<For each={props.files}>
				{file => (
					<Tab
						file={file}
						active={() => props.activeFile() === file.name}
						on:select={() => props['on:select']?.(file.name)}
						on:rename={next => props['on:rename']?.(file.name, next)}
						on:delete={() => props['on:delete']?.(file.name)}
					/>
				)}
			</For>
			<button
				type="button"
				class={styles.add}
				title="Add a file"
				on:click={() => props['on:add']?.()}
			>
				+
			</button>
		</div>
	)
}

function Tab(props) {
	const [editing, setEditing] = signal(false)
	let nameEl

	const startEdit = () => {
		setEditing(true)
		// the editable span is remounted when `editing` flips true, so
		// its use:ref handles focus + select.
	}

	const commit = () => {
		if (!editing()) return
		const next = (nameEl?.textContent || '').trim()
		setEditing(false)
		if (next && next !== props.file.name) {
			props['on:rename']?.(next)
		}
	}

	const cancel = () => {
		if (nameEl) nameEl.textContent = props.file.name
		setEditing(false)
	}

	return (
		<div
			class={() =>
				styles.tab + (props.active() ? ' ' + styles.active : '')
			}
			on:click={e => {
				// ignore clicks that land on the close button
				if (e.target.closest('[data-role="close"]')) return
				if (editing()) return
				props['on:select']?.()
			}}
			on:dblclick={e => {
				if (e.target.closest('[data-role="close"]')) return
				startEdit()
			}}
		>
			<Show when={editing}>
				<span
					class={styles.nameInput}
					contenteditable="true"
					spellcheck="false"
					autocorrect="off"
					autocapitalize="off"
					use:ref={el => {
						nameEl = el
						el.textContent = props.file.name
						// focus + select-all on the next tick, after the
						// browser has finished inserting the element.
						queueMicrotask(() => {
							el.focus()
							const range = document.createRange()
							range.selectNodeContents(el)
							const sel = window.getSelection()
							sel.removeAllRanges()
							sel.addRange(range)
						})
					}}
					on:blur={commit}
					on:keydown={e => {
						if (e.key === 'Enter') {
							e.preventDefault()
							e.stopPropagation()
							commit()
						} else if (e.key === 'Escape') {
							e.preventDefault()
							e.stopPropagation()
							cancel()
						}
					}}
				/>
			</Show>
			<Show when={() => !editing()}>
				<span class={styles.name}>{props.file.name}</span>
			</Show>
			<button
				type="button"
				class={styles.close}
				data-role="close"
				title="Delete file"
				on:click={e => {
					e.stopPropagation()
					props['on:delete']?.()
				}}
			>
				X
			</button>
		</div>
	)
}
