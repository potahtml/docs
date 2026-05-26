import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="syncEffect">
				Like <a href="/Reactivity/effect">effect</a>, but the body
				runs <em>synchronously</em> when a dependency changes
				instead of being queued for the next scheduler tick. Pick
				it only when the side-effect must land before the current
				call returns — for everything else,{' '}
				<mark>effect</mark> is the right primitive.
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
							<td>() {'=>'} void</td>
							<td>function whose tracked reads become its deps</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> <mark>void</mark>.
				</p>
			</Section>

			<Section title="Synchronous snapshot">
				<p>
					<mark>effect</mark> defers the body to the effects queue
					(fired after the current update batch).{' '}
					<mark>syncEffect</mark> runs synchronously inside the
					current batch — useful when you need a value computed{' '}
					<em>during</em> the same microtask, e.g. as part of a
					context setup or a one-shot read used by the surrounding
					render.
				</p>
				<Code url="/pages/@reactivity/syncEffect/snapshot.jsx"></Code>
			</Section>
		</>
	)
}
