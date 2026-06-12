import { signal } from 'pota'
import { Show } from 'pota/components'
import { clickOutside, escape } from 'pota/use/clickoutside'

import styles from './ThemeToggle.module.css'
import {
	mode,
	seed,
	spacing,
	ligatures,
	setMode,
	setSeed,
	setSpacing,
	setLigatures,
} from './theme.js'

const MODES = [
	['light', '☀ light'],
	['dark', '☾ dark'],
	['custom', '✎ custom'],
]

// Gear button → small appearance popover: theme (light / dark / custom
// accent) and prose spacing. The whole group hosts the outside-click /
// Escape close so clicking the gear itself never counts as "outside".
export function ThemeToggle() {
	const open = signal(false)
	let colorInput

	const segCls = m => () =>
		styles.seg + (mode.read() === m ? ' ' + styles.active : '')

	const ligCls = on => () =>
		styles.seg + (ligatures.read() === on ? ' ' + styles.active : '')

	// "custom" doubles as the accent picker: selecting it switches the
	// theme and pops the native color picker — no separate accent row.
	const onSeg = m => {
		setMode(m)
		if (m === 'custom') colorInput?.click()
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
				class={styles.gear}
				title="Appearance"
				aria-label="Appearance"
				aria-expanded={() => (open.read() ? 'true' : 'false')}
				on:click={() => open.update(v => !v)}
			>
				⚙
			</button>

			<Show when={open.read}>
				<div
					class={styles.panel}
					role="dialog"
					aria-label="Appearance"
				>
					<div class={styles.row}>
						<span class={styles.label}>Theme</span>
						<div class={styles.segs} role="group">
							{MODES.map(([m, text]) => (
								<button
									type="button"
									class={segCls(m)}
									on:click={() => onSeg(m)}
								>
									{text}
								</button>
							))}
							<input
								class={styles.colorInput}
								type="color"
								tabindex="-1"
								aria-hidden="true"
								prop:value={seed.read}
								use:ref={el => (colorInput = el)}
								on:input={e => setSeed(e.currentTarget.value)}
							/>
						</div>
					</div>

					<div class={styles.row}>
						<span class={styles.label}>Spacing</span>
						<div class={styles.rangeLine}>
							<input
								class={styles.range}
								type="range"
								min="0.7"
								max="1.6"
								step="0.05"
								prop:value={() => String(spacing.read())}
								on:input={e =>
									setSpacing(Number(e.currentTarget.value))
								}
							/>
							<span class={styles.rangeVal}>
								{() => spacing.read().toFixed(2) + '×'}
							</span>
						</div>
					</div>

					<div class={styles.row}>
						<span class={styles.label}>Ligatures</span>
						<div class={styles.segs} role="group">
							<button
								type="button"
								class={ligCls(true)}
								on:click={() => setLigatures(true)}
							>
								on
							</button>
							<button
								type="button"
								class={ligCls(false)}
								on:click={() => setLigatures(false)}
							>
								off
							</button>
						</div>
					</div>
				</div>
			</Show>
		</div>
	)
}
