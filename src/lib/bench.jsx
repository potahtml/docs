import { onReady, signal } from 'pota'
import styles from './bench.module.css'

export function Bench() {
	const [renderTime, setRenderTime] = signal(0)

	const key = window.location.href
	const best = +localStorage[key] || '?'

	onReady(() => {
		const time = +(performance.now() - globalThis.start).toFixed(2)
		setRenderTime(time)

		const past = +localStorage[key] || 1000
		if (time > 0 && time < past) {
			localStorage[key] = time
		}
	})
	return (
		<section
			title="Current / Best"
			class={styles.bench}
			data-render={() => renderTime() + ' / '}
		>
			{best}
		</section>
	)
}
