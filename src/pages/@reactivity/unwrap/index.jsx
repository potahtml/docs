import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="unwrap">
				Recursively resolves a value, calling any function it
				encounters and flattening arrays one level. The
				snapshot half of <a href="/resolve">resolve</a>:{' '}
				<mark>resolve</mark> wraps <mark>unwrap</mark> in a
				memo so the result is reactive; <mark>unwrap</mark> on
				its own does the same walk once and returns a plain
				value.
			</Header>

			<Section title="Signature">
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
							<td>unwrap(children)</td>
							<td>{`<T>(T) => Resolved<T>`}</td>
							<td>
								If <mark>children</mark> is a function,
								calls it and unwraps the result. If it's an
								array, unwraps each entry and concatenates
								(one-level flatten). Anything else is
								returned as-is.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snapshot a JSX tree">
				<p>
					Use <mark>unwrap</mark> when you want the resolved
					children but don't need to track changes — for
					example to read out an array of nodes once during a
					non-reactive operation.
				</p>
				<Code
					code={`import { unwrap } from 'pota'

const nodes = unwrap(() => <>{items.map(item => <li>{item}</li>)}</>)
// nodes: an array of <li> elements, no subscriptions created`}
					render={false}
				/>
			</Section>

			<Section title="vs resolve">
				<p>
					Prefer <a href="/resolve">resolve(fn)</a> for any
					reactive use — it memoises the walk so subsequent
					reads are cheap and consumers re-run on change. Reach
					for <mark>unwrap</mark> only when you genuinely need
					a one-shot snapshot outside a tracking scope.
				</p>
			</Section>
		</>
	)
}
