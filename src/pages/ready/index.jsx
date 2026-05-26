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
				A <mark>ready</mark> callback runs once the current
				processing batch is done — i.e. after the full queue of{' '}
				<mark>connected</mark> callbacks has been processed, and
				before the next paint. By then, the elements produced by
				the scope should already be connected to the document.
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

			<Section title="Focus on mount">
				<p>
					Schedule imperative work that needs the node in the
					DOM — measuring sizes, focusing inputs, attaching
					third-party widgets. <mark>ready(fn)</mark> fires
					after <mark>onProps</mark>, <mark>onRef</mark>, and{' '}
					<mark>onMount</mark>.
				</p>
				<Code url="/pages/ready/focus.jsx"></Code>
			</Section>

			<Section title="readyAsync">
				<p>
					<mark>readyAsync(fn)</mark> waits for any tracked async
					work (promises inside{' '}
					<mark>derived</mark>/<mark>withValue</mark>/etc.) to
					complete before firing. Useful when you need a
					snapshot of the world <em>after</em> everything has
					loaded — common in tests or in screenshot/printing
					flows.
				</p>
				<Code url="/pages/ready/async.jsx"></Code>
			</Section>

			<Section title="Timing">
				<p>
					Displays current timings of <mark>ready</mark> vs{' '}
					<mark>connected</mark>
				</p>
				<Code url="/pages/ready/timing.jsx"></Code>
			</Section>
		</>
	)
}
