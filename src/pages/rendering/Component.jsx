import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="Component">
				<mark>Component</mark> assist the creation of dynamic
				untracked components. Takes a component and props, returns a
				function. This is handy for reactivity. For JSX space see{' '}
				<mark>Dynamic</mark>.
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
							<td>props</td>
							<td>object</td>
							<td>the component props</td>
						</tr>
					</tbody>
				</table>

				<Code url="/pages/rendering/component/element.jsx"></Code>
			</Section>

			<Section title="Factory">
				<p>
					In a similar way, <mark>Factory</mark> takes a component
					that you can use with props.
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
				<Code url="/pages/rendering/component/factory.jsx"></Code>
			</Section>
		</>
	)
}
