import { signal } from 'pota'
import { For, Show } from 'pota/components'
import styles from './Tabs.module.css'

// Editable file tab bar for the Playground. Click selects, double-click
// renames (contenteditable), the × deletes, and + adds a file. Ported
// from the old docs site's tabs-bar.
//
// props: {
//   files: () => { name: string }[],
//   activeFile: () => string,
//   'on:select'?: (name) => void,
//   'on:rename'?: (oldName, newName) => void,
//   'on:delete'?: (name) => void,
//   'on:add'?: () => void,
//   canDelete?: () => boolean,
// }
export function Tabs(props) {
	return (
		<div class={styles.bar}>
			<For each={props.files}>
				{file => (
					<Tab
						file={file}
						active={() => props.activeFile() === file.name}
						canDelete={props.canDelete}
						on:select={() => props['on:select']?.(file.name)}
						on:rename={next =>
							props['on:rename']?.(file.name, next)
						}
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
	const editing = signal(false)
	let nameEl

	const commit = () => {
		if (!editing.read()) return
		const next = (nameEl?.textContent || '').trim()
		editing.write(false)
		if (next && next !== props.file.name) {
			props['on:rename']?.(next)
		}
	}

	const cancel = () => {
		if (nameEl) nameEl.textContent = props.file.name
		editing.write(false)
	}

	return (
		<div
			class={() =>
				styles.tab + (props.active() ? ' ' + styles.active : '')
			}
			on:click={e => {
				if (e.target.closest('[data-role="close"]')) return
				if (editing.read()) return
				props['on:select']?.()
			}}
			on:dblclick={e => {
				if (e.target.closest('[data-role="close"]')) return
				editing.write(true)
			}}
		>
			<Show when={editing.read}>
				<span
					class={styles.nameInput}
					contenteditable="true"
					spellcheck="false"
					autocorrect="off"
					autocapitalize="off"
					use:ref={el => {
						nameEl = el
						el.textContent = props.file.name
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
			<Show when={() => !editing.read()}>
				<span class={styles.name}>{props.file.name}</span>
			</Show>
			<Show when={() => (props.canDelete ? props.canDelete() : true)}>
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
					×
				</button>
			</Show>
		</div>
	)
}
