import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="useSelector">
				Builds a signal generator from a source signal. The returned
				function, called with a value, yields a read-only signal
				that's <mark>true</mark> when the source currently matches
				that value. The key property: this uses a single effect for
				every value — not one effect per value — so it scales to
				long lists of items checking against a single selection.
			</Header>

			<Section title="Per-row selection state">
				<p>
					<mark>useSelector(currentSignal)</mark> returns an{' '}
					<mark>isSelected(item)</mark> factory: each row asks{' '}
					<mark>isSelected(item)</mark> once and gets a stable
					boolean signal that flips when the parent's
					{' '}<mark>currentSignal</mark> changes — only the
					previously-selected and newly-selected rows re-run,
					not all rows.
				</p>
				<Code url="/pages/@use/selector/list.jsx"></Code>
			</Section>

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
