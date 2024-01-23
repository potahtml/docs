import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Dynamic ...</Tag>}>
				Allows to create dynamic components. For JavaScript space see{' '}
				<mark>Component</mark>.
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
				<Code url="/pages/@components/dynamic/test.jsx"></Code>
			</Section>
		</>
	)
}
