import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="useLocation">
				<p>Returns location data in a reactive object</p>
			</Header>

			<Section title="Properties">
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
							<td>hash</td>
							<td>signal</td>
							<td>
								<mark>window.location.hash</mark>
							</td>
						</tr>
						<tr>
							<td>href</td>
							<td>signal</td>
							<td>
								<mark>window.location.href</mark>
							</td>
						</tr>
						<tr>
							<td>pathname</td>
							<td>signal</td>
							<td>
								<mark>window.location.pathname</mark>
							</td>
						</tr>
						<tr>
							<td>path</td>
							<td>signal</td>
							<td>
								<mark>window.location.pathname</mark> +{' '}
								<mark>window.location.hash</mark>
							</td>
						</tr>
						<tr>
							<td>query</td>
							<td>signal</td>
							<td>
								A key-value pairs object with URI decoded values of{' '}
								<mark>searchParams</mark> that it's only computed when
								used, such:{' '}
								<mark>
									{'{'}search:'variété'{'}'}
								</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Log of useLocation">
				<p>
					We modify the location to trigger reactivity based on the
					location
				</p>
				<Code url="/pages/router/useLocation/snippet.jsx"></Code>
			</Section>
		</>
	)
}
