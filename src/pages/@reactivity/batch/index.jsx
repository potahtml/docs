import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="batch">
				Groups multiple writes so dependent effects re-run once at
				the end of the batch instead of after each individual
				write. Most user code paths (event handlers, cleanups)
				already batch — reach for <mark>batch</mark> when you're
				synthesizing your own update boundary. For batched store
				mutations the <a href="/Store">store</a>'s{' '}
				<mark>setStore</mark> wraps <mark>batch</mark> for you.
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
							<td>() {'=>'} T</td>
							<td>
								function whose writes coalesce. Reads inside still
								track; only the propagation is deferred.
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> the return value of <mark>fn</mark>.
				</p>
			</Section>

			<Section title="Coalesce signal writes">
				<p>
					Without <mark>batch</mark>, two writes back-to-back
					would fire two effect runs; inside a batch, the effect
					runs once with the final state.
				</p>
				<Code url="/pages/@reactivity/batch/rename.jsx"></Code>
			</Section>

			<Section title="Batch store mutations">
				<p>
					Mutations against a <mark>mutable</mark> proxy notify
					observers per write. Wrap a multi-step transition in{' '}
					<mark>batch</mark> so the result reaches readers as a
					single transaction — invariants between fields hold
					even when the intermediate state would be inconsistent.
				</p>
				<Code url="/pages/@reactivity/batch/transfer.jsx"></Code>
			</Section>
		</>
	)
}
