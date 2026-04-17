import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:connected">
				Element attribute that runs its callback once the element
				is connected to the document. Available only as an
				attribute on elements (not as a standalone lifecycle —
				that's <a href="/ready">ready</a>). Accepts a single
				callback or an array of callbacks.
			</Header>

			<p>
				<mark>use:connected</mark> callbacks run after the current
				batch of nodes has been inserted into the document, before
				paint, in recursive order, and before the{' '}
				<mark>ready</mark> callbacks.
			</p>

			<p>
				If work scheduled from the callback runs in parallel with
				other reactive updates, pass the callback a signal so the
				value stays in sync and you avoid race conditions.
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
					url="/pages/@use/connected/snippet.jsx"
					render={false}
				/>
			</Section>

			<Section title="Timing">
				<p>Displays current timings of ready vs connected</p>
				<Code url="/pages/ready/timing.jsx"></Code>
			</Section>
		</>
	)
}
