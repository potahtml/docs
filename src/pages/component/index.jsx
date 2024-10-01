import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Component">
				<mark>Component</mark> assist the creation of dynamic,
				untracked components. It takes a component and its props, then
				returns a function where you can pass additional props to
				override the initially defined ones.
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
			</Section>

			<Section title="Component as a Factory">
				<Code url="/pages/component/element.jsx">
					Component with default props
				</Code>
			</Section>

			<Section title="Component With Props Override">
				<Code url="/pages/component/element-override.jsx">
					Component with default props that change
				</Code>
			</Section>

			<Section title="Component With Empty Props">
				<Code url="/pages/component/factory.jsx">
					<mark>props</mark> argument may be omitted
				</Code>
			</Section>
		</>
	)
}
