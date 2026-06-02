import { signal } from 'pota'
import styles from './ViewToggle.module.css'

// shared layout signal — every TopicList on the page reads it.
export const layout = signal('inline')

export function ViewToggle() {
	const cls = mode => () =>
		styles.btn + (layout.read() === mode ? ' ' + styles.active : '')

	return (
		<div class={styles.toggle} role="group" aria-label="Layout">
			<button
				class={cls('inline')}
				on:click={() => layout.write('inline')}
			>
				⊞ inline
			</button>
			<button
				class={cls('list')}
				on:click={() => layout.write('list')}
			>
				☰ list
			</button>
		</div>
	)
}
