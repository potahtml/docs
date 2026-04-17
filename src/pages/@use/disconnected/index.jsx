import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:disconnected">
				Element attribute that runs its callback just before the
				element is removed from the document. Useful for tearing
				down non-reactive subscriptions tied to the live DOM — for
				reactive-scope teardown, prefer{' '}
				<a href="/cleanup">cleanup</a>. Accepts a single callback
				or an array of callbacks.
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
					url="/pages/@use/disconnected/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Test">
				<p>
					Show when the elements are about to be removed from the
					document
				</p>
				<Code url="/pages/@use/disconnected/test.jsx"></Code>
			</Section>
		</>
	)
}
