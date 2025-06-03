import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="ready">
				<mark>ready</mark> is for components that need to run some
				initialization.
			</Header>

			<p>
				The <mark>ready</mark> callbacks, will run once the current
				processing batch is done. That's it, after the full queue of{' '}
				<mark>on:mount</mark> callbacks has been processed, and before
				painting. Relevant Elements that render something should be
				already connected to the document.
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
								function to run once the processing batch is done
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/ready/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Timing">
				<p>
					Displays current timings of <mark>ready</mark> vs{' '}
					<mark>on:mount</mark>
				</p>
				<Code url="/pages/ready/timing.jsx"></Code>
			</Section>
		</>
	)
}
