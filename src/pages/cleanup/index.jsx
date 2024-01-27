import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="cleanup">
				<mark>cleanup</mark> is for components that need a cleanup
				step.
			</Header>

			<p>
				The <mark>cleanup</mark> callbacks, will run once the current
				tracking scope is disposed or recreated. It is provided by the
				Reactive Library in use.
			</p>
			<p>
				The order seems to be from last added to first added, after
				the Elements has been removed from the document.
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
								function to run once the tracking scope is disposed
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/cleanup/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Timing">
				<p>
					Displays current timings of <mark>onUnmount</mark> on
					Elements vs <mark>cleanup</mark>
				</p>
				<Code url="/pages/cleanup/timing.jsx"></Code>
			</Section>
		</>
	)
}
