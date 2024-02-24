import { mutable, ready, version } from 'pota'
import styles from './bench.module.css'

export function Bench() {
	const renderTime = mutable({ time: 0, best: 0 })

	ready(() => {
		const stop = performance.now()

		const key = window.location.href

		renderTime.best = +localStorage[key] || 0

		renderTime.time = +(stop - globalThis.start).toFixed(2)

		if (renderTime.best === 0 || renderTime.time < renderTime.best) {
			localStorage[key] = renderTime.time
		}
	})
	return (
		<section
			title="Current / Best"
			class={styles.bench}
		>
			{() =>
				'v' +
				version +
				' - ' +
				renderTime.time +
				' / ' +
				renderTime.best
			}
		</section>
	)
}
