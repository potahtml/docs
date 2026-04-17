import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="setAttribute">
				Imperative helper for setting an attribute on an element.
				Unwraps reactive accessors, and removes the attribute when
				the value is <mark>false</mark>, <mark>null</mark> or{' '}
				<mark>undefined</mark>.
			</Header>

			<Section title="Signature">
				<Code
					code={`setAttribute(node, name, value)`}
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
							<td>attribute name (case sensitive)</td>
						</tr>
						<tr>
							<td>value</td>
							<td>string | number | boolean | signal</td>
							<td>
								attribute value. A function is treated as a reactive
								accessor and tracked; <mark>true</mark> sets the
								attribute to the empty string;{' '}
								<mark>false</mark> / <mark>null</mark> /{' '}
								<mark>undefined</mark> remove the attribute.
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
					In JSX, prefer writing attributes directly —{' '}
					<mark>{'<div id={id}/>'}</mark> already flows through{' '}
					<mark>setAttribute</mark>. Reach for the function when you
					are working outside JSX: building elements via{' '}
					<mark>document.createElement</mark>, driving a ref from an
					effect, writing a{' '}
					<a href="/props/propsPlugin">propsPlugin</a>, or
					bridging a third-party library.
				</p>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@props/set-attribute/snippet.jsx"></Code>
			</Section>
		</>
	)
}
