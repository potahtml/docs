import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="setProperty">
				Imperative helper for assigning a DOM property on an element.
				Unwraps reactive accessors; assigning <mark>null</mark> or{' '}
				<mark>undefined</mark> sets the property to <mark>null</mark>
				.
			</Header>

			<Section title="Signature">
				<Code
					code={`setProperty(node, name, value)`}
					render={false}
				/>
			</Section>

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
							<td>node</td>
							<td>Element</td>
							<td>target element</td>
						</tr>
						<tr>
							<td>name</td>
							<td>string</td>
							<td>property name on the DOM node</td>
						</tr>
						<tr>
							<td>value</td>
							<td>unknown | signal</td>
							<td>
								value to assign. Functions are unwrapped reactively.{' '}
								<mark>null</mark> / <mark>undefined</mark> set the
								property to <mark>null</mark>.
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> <mark>void</mark>
				</p>
			</Section>

			<Section title="When to use">
				<p>
					Use <mark>setProperty</mark> (or the{' '}
					<a href="/props/prop%3A__">prop:</a> namespace in JSX)
					whenever the DOM property and HTML attribute diverge —{' '}
					<mark>value</mark> on inputs after user edits,{' '}
					<mark>checked</mark> state, <mark>srcObject</mark> on{' '}
					<mark>video</mark>, <mark>textContent</mark>, or custom
					properties on a custom element.
				</p>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@props/set-property/snippet.jsx"></Code>
			</Section>
		</>
	)
}
