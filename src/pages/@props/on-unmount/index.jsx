import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="on:unmount">
				<mark>on:unmount</mark> is for Elements that need to run some
				cleanup tasks before these are removed from the document.
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
							<td>fn</td>
							<td>fn</td>
							<td>
								function to run just before the Element is removed
								from the document
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@props/on-unmount/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Test">
				<p>
					Show when the elements are about to be removed from the
					document
				</p>
				<Code url="/pages/@props/on-unmount/test.jsx"></Code>
			</Section>
		</>
	)
}
