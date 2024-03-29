import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'
import { Tag } from '../../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title="useBeforeLeave">
				Used to run code before leaving the route. To prevent leaving
				the route, return false. It also works with async functions
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
								async or sync function that when returns false it
								prevents the navigation. The async function could
								resolve to <mark>false</mark> or just{' '}
								<mark>reject</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Preventing navigation">
				<p>Example preventing navigation</p>
				<Code
					url="/pages/@components/router/use-before-leave/snippet.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
