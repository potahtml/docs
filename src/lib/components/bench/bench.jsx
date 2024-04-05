import { ready, version } from 'pota'
import { signalify } from 'pota/store'
import styles from './bench.module.css'

export function Bench() {
	const renderTime = signalify({ time: 0, best: 0 })

	ready(() => {
		const stop = performance.now()

		const key = window.location.href
		if (!localStorage.v2) {
			localStorage.clear()
			localStorage.v2 = true
		}
		renderTime.best = +localStorage[key] || 0

		renderTime.time = +(stop - globalThis.start).toFixed(2)

		if (renderTime.best === 0 || renderTime.time < renderTime.best) {
			if (!key.includes('/playground')) {
				localStorage[key] = renderTime.time
			}
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
