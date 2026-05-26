import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="isResolved">
				<mark>true</mark> once every passed{' '}
				<a href="/Reactivity/derived">derived</a> has resolved at
				least once. Useful with{' '}
				<a href="/Components/Suspense">&lt;Suspense/&gt;</a> or as
				a render-time guard for async-driven values that start
				out as <mark>undefined</mark>.
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
							<td>...deriveds</td>
							<td>{`Derived<any>[]`}</td>
							<td>one or more derived values to check</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> <mark>boolean</mark> —{' '}
					<mark>true</mark> when each argument has committed at
					least once.
				</p>
			</Section>

			<Section title="Render a loading state">
				<p>
					Async <mark>derived</mark> chains start unresolved —
					their value is <mark>undefined</mark> until the first
					commit. <mark>isResolved</mark> is the way to render a
					loading state without throwing on the first read.
				</p>
				<Code url="/pages/@reactivity/isResolved/loading.jsx"></Code>
			</Section>
		</>
	)
}
