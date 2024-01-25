import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Component">
				<mark>Component</mark> assist the creation of dynamic
				untracked components. Takes a component and props, returns a
				function. For JSX space see <mark>Dynamic</mark>. When{' '}
				<mark>props</mark> argument is defined it returns a function
				with fixed props. When the <mark>props</mark> argument is
				omitted it returns a function that you can pass props to it.
			</Header>

			<Section title="Component">
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
							<td>component</td>
							<td>fn/Element/tagName/object with toString method</td>
							<td>component to create</td>
						</tr>
						<tr>
							<td>[props]</td>
							<td>object</td>
							<td>component props</td>
						</tr>
					</tbody>
				</table>

				<Code url="/pages/component/element.jsx">
					Component with fixed props
				</Code>
			</Section>

			<Section title="Component as a Factory">
				<p>
					In a similar way, when <mark>props</mark> argument is
					omitted it allows you to use props on the returned function.
				</p>
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
							<td>component</td>
							<td>fn/Element/tagName/object with toString method</td>
							<td>component to create</td>
						</tr>
					</tbody>
				</table>
				<Code url="/pages/component/factory.jsx"></Code>
			</Section>
		</>
	)
}
