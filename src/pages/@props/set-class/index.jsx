import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="setClass">
				Imperative helper for assigning classes to an element.
				Accepts a string, an array, a{' '}
				<mark>{'{className: boolean}'}</mark> object, or a reactive
				accessor. Strings replace the full <mark>class</mark>{' '}
				attribute; arrays and objects add/remove individual classes.
			</Header>

			<Section title="Signature">
				<Code
					code={`setClass(node, value)`}
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
							<td>
								string | string[] |{' '}
								<mark>{'{ className: boolean }'}</mark> | signal
							</td>
							<td>
								a string sets <mark>class</mark> wholesale;
								array/object forms add truthy entries and remove
								falsy ones; functions are tracked reactively.
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
					JSX's <mark>class=</mark> and{' '}
					<mark>class:myClass=</mark> already flow through{' '}
					<mark>setClass</mark>. Use the function when building
					nodes imperatively, writing a{' '}
					<a href="/props/propsPlugin">propsPlugin</a>, or
					driving a class from an effect outside JSX.
				</p>
				<p>
					Related: <a href="/props/class%3A__">class:__</a> covers
					the declarative forms.
				</p>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@props/set-class/snippet.jsx"></Code>
			</Section>
		</>
	)
}
