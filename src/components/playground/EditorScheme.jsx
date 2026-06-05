import { signal } from 'pota'
import { Show } from 'pota/components'
import { clickOutside, escape } from 'pota/use/clickoutside'

import styles from './EditorScheme.module.css'
import { schemes } from '../editor-schemes.js'
import { editorScheme, setEditorScheme } from '../theme.js'

// representative tokens previewed as dots on each row
const SWATCHES = ['keyword', 'string', 'function']

const labelFor = id =>
	(schemes.find(s => s.id === id) || schemes[0]).label

// Swatch colors for a row: the scheme's own palette (the variant matching
// the active base), or the live `--cm-*` vars for "auto" (no palette of
// its own — it follows the site theme).
const swatchesFor = s => {
	if (!s.light) return SWATCHES.map(k => `var(--cm-${k})`)
	const v =
		document.documentElement.dataset.theme === 'dark'
			? s.dark
			: s.light
	return SWATCHES.map(k => v[k])
}

// Themed dropdown for the editor's syntax color scheme. Opens upward (the
// footer hugs the window's bottom edge) and closes on outside-click or
// Escape. State is global: every playground's control reflects and sets
// the same `editorScheme` signal.
export function EditorScheme() {
	const open = signal(false)

	// the open panel, captured so the highlighted row can be kept in view
	let panelEl

	const itemCls = id => () =>
		styles.item +
		(editorScheme.read() === id ? ' ' + styles.active : '')

	// Keyboard nav like a native <select>: arrows move the selection one
	// step (clamped at the ends) and apply it live; Home/End jump to the
	// first/last scheme. The trigger keeps focus while the panel is open,
	// so this runs whether it is open or closed.
	const apply = i => {
		const next = Math.min(schemes.length - 1, Math.max(0, i))
		setEditorScheme(schemes[next].id)
		if (!open.read()) return
		queueMicrotask(() => {
			panelEl
				?.querySelector('.' + styles.active)
				?.scrollIntoView({ block: 'nearest' })
		})
	}

	const onKeydown = e => {
		const i = schemes.findIndex(s => s.id === editorScheme.read())
		const cur = i < 0 ? 0 : i
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				apply(cur + 1)
				break
			case 'ArrowUp':
				e.preventDefault()
				apply(cur - 1)
				break
			case 'Home':
				e.preventDefault()
				apply(0)
				break
			case 'End':
				e.preventDefault()
				apply(schemes.length - 1)
				break
		}
	}

	return (
		<div
			class={styles.group}
			use:ref={[
				clickOutside(() => open.write(false)),
				escape(() => open.write(false)),
			]}
		>
			<button
				type="button"
				class={() =>
					styles.trigger + (open.read() ? ' ' + styles.open : '')
				}
				title="Editor color scheme"
				aria-label="Editor color scheme"
				aria-expanded={() => (open.read() ? 'true' : 'false')}
				on:click={() => open.update(v => !v)}
				on:keydown={onKeydown}
			>
				{() => labelFor(editorScheme.read())}
				<span class={styles.caret}>▾</span>
			</button>

			<Show when={open.read}>
				<div
					class={styles.panel}
					role="listbox"
					aria-label="Editor color scheme"
					use:ref={el => (panelEl = el)}
				>
					{schemes.map(s => (
						<button
							type="button"
							role="option"
							class={itemCls(s.id)}
							aria-selected={() =>
								editorScheme.read() === s.id ? 'true' : 'false'
							}
							on:click={() => {
								setEditorScheme(s.id)
								open.write(false)
							}}
						>
							<span class={styles.swatches}>
								{swatchesFor(s).map(c => (
									<span
										class={styles.dot}
										style={{ background: c }}
									/>
								))}
							</span>
							{s.label}
						</button>
					))}
				</div>
			</Show>
		</div>
	)
}
