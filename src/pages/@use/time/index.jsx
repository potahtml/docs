import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="time">
				<mark>pota/use/time</mark> ships clock formatters,{' '}
				<mark>useTimeout</mark> for auto-disposing
				timers, <mark>useElapsed</mark> for relative-time
				readers that re-render on unit boundaries, and{' '}
				<mark>useStopwatch</mark> for start/stop/reset
				counters.
			</Header>

			<Section title="Auto-disposing timer with datetime">
				<p>
					<mark>pota/use/time</mark> exposes <mark>now</mark>,{' '}
					<mark>date</mark>, <mark>datetime</mark>,{' '}
					<mark>time</mark>, <mark>timeWithSeconds</mark>,{' '}
					<mark>day</mark>, plus{' '}
					<mark>useTimeout(cb, delay, ...args)</mark> — the
					timeout integrates with the owner so it cancels
					automatically on disposal.
				</p>
				<Code url="/pages/@use/time/timer.jsx"></Code>
			</Section>

			<Section title="Reactive delay">
				<p>
					<mark>useTimeout</mark> accepts an accessor for{' '}
					<mark>delay</mark>, so the underlying{' '}
					<mark>setTimeout</mark> resets every time the delay
					changes. Useful for "save after N ms of idle"-style
					flows where the user can adjust the threshold live.
				</p>
				<Code url="/pages/@use/time/reactive-delay.jsx"></Code>
			</Section>

			<Section title="Using useTimeout">
				<p>
					<mark>start()</mark> schedules the callback;{' '}
					<mark>stop()</mark> cancels it. When <mark>delay</mark>{' '}
					is a signal, writing to it restarts the pending timeout
					automatically. The timeout also cancels itself when the
					owning scope is disposed.
				</p>
				<Code url="/pages/@use/time/snippet.jsx"></Code>
			</Section>

			<Section title="useElapsed — relative time without per-second renders">
				<p>
					<mark>useElapsed(timestamp)</mark> returns a
					reactive reader of seconds elapsed since a Unix
					timestamp. The trick: it re-evaluates only on the
					next unit boundary — once per second under a
					minute, once per minute under an hour, once per
					hour under a day, and so on — so a row that says{' '}
					<em>"5 days ago"</em> doesn't re-render every
					second. The argument may be a value or an
					accessor; <mark>0</mark> / falsy values stop the
					ticker. Auto-cleans on scope dispose.
				</p>
				<Code url="/pages/@use/time/elapsed.jsx"></Code>
			</Section>

			<Section title="useStopwatch — start / stop / reset">
				<p>
					<mark>useStopwatch(opts?)</mark> returns{' '}
					<mark>{`{ elapsed, running, start, stop, reset }`}</mark>.{' '}
					<mark>elapsed()</mark> is a reactive reader in
					milliseconds; the underlying tick is{' '}
					<mark>opts.interval</mark> (default{' '}
					<mark>1000</mark>). For finer resolution lower the
					interval — or drive your own loop from{' '}
					<mark>useAnimationFrame</mark> reading{' '}
					<mark>now()</mark> directly. Pass{' '}
					<mark>{`{ autoStart: true }`}</mark> to start on
					construction.
				</p>
				<Code url="/pages/@use/time/stopwatch.jsx"></Code>
			</Section>
		</>
	)
}
