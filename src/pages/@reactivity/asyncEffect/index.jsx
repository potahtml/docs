import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="asyncEffect">
				Effect for async work, serialised by default. On each run
				the callback receives the promise from the previous run
				(or <mark>undefined</mark> on the first); awaiting that
				promise guarantees one run finishes before the next
				begins. For synchronous effects see{' '}
				<a href="/Reactivity/effect">effect</a> /{' '}
				<a href="/Reactivity/syncEffect">syncEffect</a>.
			</Header>

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
							<td>{`(prev: Promise<any> | undefined) => any`}</td>
							<td>
								async (or sync) function that receives the
								previous run's promise. Return value is awaited
								before the run is marked done.
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> <mark>void</mark>.
				</p>
			</Section>

			<Section title="Sequential async">
				<p>
					Awaiting <mark>prev</mark> serialises the work — useful
					for chained network requests where overlapping is wrong
					(stale results clobbering current ones, parallel writes
					racing on the server).
				</p>
				<Code
					url="/pages/@reactivity/asyncEffect/sequential.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
