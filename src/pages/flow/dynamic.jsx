import { Code, Header, Section, Tag } from '#main'

export default function () {
	return (
		<>
			<Header title={<Tag>Dynamic ...</Tag>}>
				Allows to create dynamic components. For JavaScript space see{' '}
				<mark>create</mark>.
			</Header>

			<Section title="Attributes">
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
							<td>tagName/fn/Component Class/Element</td>
							<td>component to create</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Using dynamic">
				<p>Simple test</p>
				<Code url="/pages/flow/dynamic/test.jsx"></Code>
			</Section>
		</>
	)
}
