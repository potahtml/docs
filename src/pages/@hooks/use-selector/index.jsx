import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="useSelector">
				Selector is a helper to create a conditional read-only signal.
				A signal generator. It returns a function that evaluates to
				true when the argument matches the original signal. The
				important thing, is that creates one effect instead of one
				effect for each checked value.
			</Header>

			<Section title="Using selector">
				<p>
					Automatically create signals for the values and returns true
					when the value matches
				</p>
				<Code url="/pages/@hooks/use-selector/test.jsx"></Code>
			</Section>
		</>
	)
}
