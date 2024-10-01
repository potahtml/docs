import { ready, version } from 'pota'
import { signalify } from 'pota/store'
import styles from './bench.module.css'

export function Bench() {
	const renderTime = signalify({ time: 0, best: 0 })

	ready(() => {
		const stop = performance.now()

		const key = 'bench-' + window.location.pathname
		if (!localStorage.v3) {
			localStorage.clear()
			localStorage.v3 = true
		}
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
