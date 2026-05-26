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
				A <mark>cleanup</mark> callback runs when the current
				tracking scope is disposed (or recreated, as happens with
				a re-run memo).
			</p>
			<p>
				Callbacks run in reverse registration order (LIFO), after
				the elements owned by the scope have been removed from the
				document.
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

			<Section title="Detach a listener on disposal">
				<p>
					<mark>cleanup(fn)</mark> schedules <mark>fn</mark> to
					run when the current owner disposes — typically a
					parent component unmount or <mark>render()</mark>'s
					returned disposer being called. Pair it with anything
					you set up imperatively (timers, listeners,
					third-party instances) so it doesn't outlive the
					scope.
				</p>
				<Code url="/pages/cleanup/clock.jsx"></Code>
			</Section>

			<Section title="Timing">
				<p>
					Displays current timings of <mark>disconnected</mark> on
					Elements vs <mark>cleanup</mark>
				</p>
				<Code url="/pages/cleanup/timing.jsx"></Code>
			</Section>
		</>
	)
}
