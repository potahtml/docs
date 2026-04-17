import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="setStyle">
				Imperative helper for applying styles to an element. Accepts
				a CSS string, a style object, or a reactive accessor. A
				property value of <mark>null</mark>, <mark>undefined</mark>{' '}
				or <mark>false</mark> removes that property.
			</Header>

			<Section title="Signature">
				<Code
					code={`setStyle(node, value)`}
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
							<td>value</td>
							<td>string | object | signal</td>
							<td>
								strings are assigned to <mark>style.cssText</mark>;
								objects are applied property-by-property; functions
								are unwrapped reactively. A property set to{' '}
								<mark>null</mark>, <mark>undefined</mark> or{' '}
								<mark>false</mark> is removed.
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
					In JSX, <mark>style="…"</mark>, <mark>style={'{…}'}</mark>
					{' '}
					and <mark>style:color={'{…}'}</mark> already route through
					this helper. Call <mark>setStyle</mark> directly when you
					are building elements imperatively, writing a{' '}
					<a href="/props/propsPlugin">propsPlugin</a>, or driving
					styles from an effect outside the render tree.
				</p>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@props/set-style/snippet.jsx"></Code>
			</Section>
		</>
	)
}
