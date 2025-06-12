import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="useSelector">
				Selector is a helper to create a conditional read-only signal.
				A signal generator. It returns a function that evaluates to{' '}
				<mark>true</mark> when the argument matches the original
				signal. The thing to remember, is that creates 1 effect
				instead of N effects for N values.
			</Header>

			<Section title="Using selector">
				<p>
					Automatically create signals for the values and returns{' '}
					<mark>true</mark> when a value matches
				</p>
				<Code url="/pages/@use/selector/snippet.jsx"></Code>
			</Section>
			<Section title="Using selector with multiple values">
				<p>Using it with multiple values</p>
				<Code url="/pages/@use/selector/snippet-multiple.jsx"></Code>
			</Section>
		</>
	)
}
