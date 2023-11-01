import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="create">
				<p>
					Used as a component factory for when its needed to reuse the
					same component with different props. Handy for dynamic
					things on JavaScript space. When used with a function it
					untracks its body which avoids re-renders
				</p>
			</Header>

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
							<td>component</td>
							<td>fn/Element/tagName/object with toString method</td>
							<td>the component to create</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Tag Name">
				<p>
					Creates a component from the tag name <mark>marquee</mark>
				</p>
				<Code url="/pages/rendering/create/usage.jsx"></Code>
			</Section>
			<Section title="Enhance HTML">
				<p>
					Creates a component from a native element. It clones the
					node.
				</p>
				<Code url="/pages/rendering/create/element.jsx"></Code>
			</Section>
		</>
	)
}
