import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="onMount">
				<mark>onMount</mark> is for Elements that need to run some
				initialization after these have been connected to the
				document. Is available exclusively to Elements via an
				attribute.
			</Header>

			<p>
				As of this writing, the <mark>onMount</mark> callbacks, will
				run after the current batch of Nodes have been inserted into
				the document, before paint, in recursive order, and before the{' '}
				<mark>ready</mark> callbacks.
			</p>

			<p>
				It is recomended to pass to this API a signal if any work with
				it will be done in parallel to avoid race-conditions.
			</p>

			<Section title="Arguments">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>type</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>fn</td>
							<td>fn</td>
							<td>
								function to run once the Element is connected to the
								document
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@props/on-mount/snippet.jsx"
					render={false}
				/>
			</Section>

			<Section title="Timing">
				<p>Displays current timings of ready vs onMount</p>
				<Code url="/pages/ready/timing.jsx"></Code>
			</Section>
		</>
	)
}
