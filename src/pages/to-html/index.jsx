import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="toHTML">
				Creates and returns HTML elements for anything you pass to it.
				it returns the children rendered in a{' '}
				<mark>DocumentFragment</mark> when there is more than 1
				<mark>childNode</mark>. If there is only 1, it returns the
				node instead. Keep in mind that using the elements on any
				document will remove these from the{' '}
				<mark>DocumentFragment</mark>. Reactivity will work properly
				as long as you move the group together.
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
							<td>Children</td>
							<td>Children</td>
							<td>
								This is <mark>props.children</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/to-html/snippet.jsx"></Code>
			</Section>
		</>
	)
}
