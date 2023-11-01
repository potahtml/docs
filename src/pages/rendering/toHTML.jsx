import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="toHTML">
				<p>
					Creates and returns HTML elements for{' '}
					<mark>props.children</mark>. it returns a{' '}
					<mark>DocumentFragment</mark> with the children rendered.
					Keep in mind that using the elements on any document will
					remove these from the DocumentFragment. Reactivity will work
					properly as long as you move the group together.
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
							<td>Children</td>
							<td>Children</td>
							<td>
								This is <mark>props.children</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/rendering/toHTML/snippet.jsx"></Code>
			</Section>
		</>
	)
}
