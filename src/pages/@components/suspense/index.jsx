import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Suspense ...</Tag>}>
				Provides a fallback till children promises resolve
				(recursively)
			</Header>

			<Section title="Suspense Attributes">
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
							<td>fallback</td>
							<td>any</td>
							<td>
								show <mark>fallback</mark> while awaiting
							</td>
						</tr>
						<tr>
							<td>children</td>
							<td>children</td>
							<td>children to render</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/suspense/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Chained components demo">
				<Code url="/pages/@components/suspense/test.jsx"></Code>
			</Section>
		</>
	)
}
