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

			<Section title="Derived value">
				<p>
					<mark>memo(fn)</mark> returns an accessor — call it (
					<mark>doubled()</mark>) to read, or pass the accessor
					itself (<mark>{'{doubled}'}</mark>) as a JSX child for
					a reactive binding. The body re-runs only when
					something it read actually changes, and only once per
					change even if multiple readers depend on it.
				</p>
				<Code url="/pages/@reactivity/memo/derived-value.jsx"></Code>
			</Section>

			<Section title="Filtered list">
				<p>
					A memo is the right tool for a derived array — the
					filter runs once when <mark>query</mark> or{' '}
					<mark>items</mark> changes, and{' '}
					<mark>&lt;For/&gt;</mark> reads the resulting array.
					Without the memo, every <mark>&lt;For/&gt;</mark> and
					every other reader would re-filter on every dependency
					read.
				</p>
				<Code url="/pages/@reactivity/memo/filtered.jsx"></Code>
			</Section>

			<Section title="Layered memos">
				<p>
					Memos compose: a memo can read other memos, and each
					layer caches independently. Adding{' '}
					<mark>done.length</mark> recomputes{' '}
					<mark>completed</mark>, but <mark>total</mark> doesn't
					change unless the source array's length does — so the
					percentage memo skips work the rest of the chain
					didn't trigger.
				</p>
				<Code url="/pages/@reactivity/memo/layered.jsx"></Code>
			</Section>

			<Section title="Lazy execution">
				<p>
					An unread memo is a no-op — its function only runs
					once something reads its value. Useful when memos are
					declared eagerly but might not be needed depending on
					the branch.
				</p>
				<Code url="/pages/@reactivity/memo/memo.jsx"></Code>
			</Section>
		</>
	)
}
