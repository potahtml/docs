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
