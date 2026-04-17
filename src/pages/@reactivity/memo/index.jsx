import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="memo">
				Read-only signal whose value is the return of{' '}
				<mark>fn</mark>, recomputed when any signal it reads
				changes. Memos in pota are <em>lazy</em>: the function
				doesn't run until the memo is read the first time. If it
				is never read, it never runs.
			</Header>

			<p>
				Use <mark>memo</mark> to cache derived work and share it
				with multiple consumers — they all see the same value
				without re-running <mark>fn</mark>.
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
							<td>() {'=>'} T</td>
							<td>function to memoise</td>
						</tr>
						<tr>
							<td>options?</td>
							<td>{`{ equals?: false | ((prev, next) => boolean) }`}</td>
							<td>
								<mark>equals: false</mark> notifies on every
								recomputation; a comparator lets you control when
								dependents re-run
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> a read-only signal — call it to read the
					current value.
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@reactivity/memo/memo-snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Usage">
				<Code url="/pages/@reactivity/memo/memo.jsx"></Code>
			</Section>
		</>
	)
}
