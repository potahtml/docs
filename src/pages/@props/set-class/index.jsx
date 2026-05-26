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
				The declarative form is{' '}
				<a href="/props/class%3A__">class:__</a>.
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
					<mark>setClass</mark>. Use the function when
					building nodes imperatively, writing a{' '}
					<a href="/use/ref">use:ref</a> factory, or driving
					a class from an effect outside JSX.
				</p>
				<p>
					Related: <a href="/props/class%3A__">class:__</a> covers
					the declarative forms.
				</p>
			</Section>

			<Section title="Toggle a class">
				<p>
					<mark>setClass(node, name, value)</mark> adds the
					class when <mark>value</mark> is truthy and removes
					it when falsy. Reactive accessors are unwrapped — pass
					the read function directly and the class follows the
					signal automatically.
				</p>
				<Code url="/pages/@props/set-class/example.jsx"></Code>
			</Section>

			<Section title="setClassList — many classes at once">
				<p>
					<mark>setClassList(node, value)</mark> accepts a
					string, an array of names, or an object{' '}
					<mark>{'{ name: truthy }'}</mark>. Each entry can be
					a reactive accessor — signals you reference are
					tracked and the corresponding class follows.
				</p>
				<Code url="/pages/@props/set-class/list.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@props/set-class/snippet.jsx"></Code>
			</Section>
		</>
	)
}
