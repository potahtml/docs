import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="root">
				Creates a new top-level tracking scope. The callback
				receives a <mark>dispose</mark> function that tears down
				everything created inside. Reactive work that outlives a
				component (long-lived subscriptions, imperative rendering,
				stores instantiated at module load) belongs in a{' '}
				<mark>root</mark>. <a href="/render">render</a> creates
				one for you internally; call <mark>root</mark> directly
				when there's no render tree.
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
							<td>(dispose) {'=>'} T</td>
							<td>
								runs once, immediately. Receives the disposer for
								the root.
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> the return value of <mark>fn</mark>.
				</p>
			</Section>

			<Section title="Detached scope with manual dispose">
				<p>
					<mark>root</mark> runs <mark>fn</mark> in a new owner
					that is <em>not</em> attached to any parent — so
					cleanups stick around until you call the disposer{' '}
					<mark>fn</mark> received. Use it for reactive code
					outside a component tree (workers, modal managers,
					background timers).
				</p>
				<Code
					url="/pages/@reactivity/root/detached.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Module-level reactive store">
				<p>
					Wrapping a module's reactive setup in <mark>root</mark>{' '}
					gives those primitives their own owner — they don't
					get cleaned up when a component unmounts, and any
					cleanups they register live for the whole page.
				</p>
				<Code
					url="/pages/@reactivity/root/module.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
