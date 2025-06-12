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
					Automatically create signals for the values and returns true
					when the value matches
				</p>
				<Code url="/pages/@use/time/snippet.jsx"></Code>
			</Section>
		</>
	)
}
