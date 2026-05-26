import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="untrack">
				Runs <mark>fn</mark> without establishing reactive
				dependencies on anything it reads. Use it inside a
				tracking scope when you want a value's <em>current</em>{' '}
				snapshot but don't want to re-run when it later changes.
				For the explicit-deps form of an effect, see{' '}
				<a href="/Reactivity/on">on</a>.{' '}
				<a href="/Reactivity/signal">signal</a>'s{' '}
				<mark>update(prev =&gt; next)</mark> wraps the read in{' '}
				<mark>untrack</mark> internally.
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
							<td>function whose reads should not subscribe</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> the return value of <mark>fn</mark>.
				</p>
			</Section>

			<Section title="Snapshot a signal in an effect">
				<p>
					Inside a tracking scope (
					<mark>effect</mark>, <mark>memo</mark>,{' '}
					<mark>derived</mark>), reading a signal subscribes the
					surrounding scope to its changes. Wrap the read in{' '}
					<mark>untrack(() =&gt; …)</mark> when you want the
					value at this moment but don't want to re-run when it
					later changes.
				</p>
				<Code url="/pages/@reactivity/untrack/snapshot.jsx"></Code>
			</Section>
		</>
	)
}
