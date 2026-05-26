import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="listener">
				Returns the currently-running reactive listener (the
				tracking scope an inner computation is inside), or{' '}
				<mark>undefined</mark> if there is none. A low-level
				introspection helper — handy when authoring a primitive
				that wants to behave differently inside vs. outside a
				reactive scope. Most app code never needs it; reach for{' '}
				<a href="/Reactivity/effect">effect</a> /{' '}
				<a href="/Reactivity/memo">memo</a> instead.
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
							<td>listener()</td>
							<td>{`Computation | undefined`}</td>
							<td>
								the active tracking scope (effect / memo / derived),
								or <mark>undefined</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Detect a tracking scope">
				<p>
					Branch behavior based on whether reads will subscribe.
					Useful when authoring a getter that should return a
					memo when tracked but a plain value otherwise.
				</p>
				<Code
					url="/pages/@reactivity/listener/inspect.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
