import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="lazy">
				lazy creates a component thats lazy loaded via a dynamic
				import. The resulting component can be used as{' '}
				<mark>Component(props)</mark>. Mostly used as{' '}
				<mark>children</mark> on a <mark>Route</mark> for code
				splitting. Promises are run with the original owner when the
				promise returns a function.
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
							<td>fn</td>
							<td>fn</td>
							<td>a function that returns the import</td>
						</tr>
						<tr>
							<td>fallback</td>
							<td>[fallback]</td>
							<td>
								to render something in case the import/promise fails
								for some reason
							</td>
						</tr>
					</tbody>
				</table>
				<b>Return Value</b>: <mark>(props)=>Component</mark>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/lazy/snippet.jsx"
					render={true}
				></Code>
			</Section>

			<Section title="Test">
				<Code
					url="/pages/lazy/test.jsx"
					render={true}
				></Code>
			</Section>
		</>
	)
}
