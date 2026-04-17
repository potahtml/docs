import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Switch ...</Tag>}>
				Renders the first <mark>&lt;Match/&gt;</mark> child whose{' '}
				<mark>when</mark> is truthy. If none match, renders{' '}
				<mark>fallback</mark> — or, if no explicit{' '}
				<mark>fallback</mark> prop is set, a nested{' '}
				<mark>&lt;Match/&gt;</mark> with no <mark>when</mark> acts
				as the default branch.
			</Header>

			<p>
				If the child of the matching <mark>&lt;Match/&gt;</mark> is
				a function, it receives a signal carrying the current{' '}
				<mark>when</mark> value — the same callback pattern as{' '}
				<a href="/Components/Show">Show</a>.
			</p>

			<Section title="Switch Attributes">
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
								when all the conditions of the <mark>Match</mark> are
								falsy, render <mark>fallback</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Match Attributes">
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
							<td>when</td>
							<td>any</td>
							<td>
								once <mark>when</mark> becomes truthy, it will show
								its children
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/switch/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Switch/Match testing">
				<Code url="/pages/@components/switch/test.jsx"></Code>
			</Section>
		</>
	)
}
