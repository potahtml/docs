import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'
import { Tag } from '../../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title="useLocation">
				Returns location data in a reactive object
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
								<mark>searchParams</mark>, such:{' '}
								<mark>
									{'{'}search:'variété'{'}'}
								</mark>
							</td>
						</tr>
						<tr>
							<td>params</td>
							<td>fn</td>
							<td>
								A key-value pairs object with URI decoded values of{' '}
								Router <mark>params</mark>, such:{' '}
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
				<Code url="/pages/@components/router/use-location/snippet.jsx"></Code>
			</Section>
		</>
	)
}
