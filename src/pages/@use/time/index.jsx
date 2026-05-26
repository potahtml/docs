import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="useTimeout">
				useTimeout is a helper to create a <mark>setTimeout</mark>{' '}
				that autodisposes. It also allows for the delay to be
				reactive. Provides <mark>start</mark> and <mark>stop</mark>{' '}
				functions for easily restarting the timeout.
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
		</>
	)
}
