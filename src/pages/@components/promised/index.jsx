import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Promised ...</Tag>}>
				Allows to create a component that provides a fallback while a
				promise is running. If the promise returns a function, it will
				run the function with the current owner.
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
							<td>children</td>
							<td>function</td>
							<td>function holding the promise</td>
						</tr>
						<tr>
							<td>fallback?</td>
							<td>any</td>
							<td>
								a thing to render as fallback while the promise is not
								resolved
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Using Promised">
				<p>Simple test</p>
				<Code url="/pages/@components/promised/test.jsx"></Code>
			</Section>
		</>
	)
}
