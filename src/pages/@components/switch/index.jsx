import { Code, Header, Section, Tag } from '#main'

export default function () {
	return (
		<>
			<Header title={<Tag>Switch ...</Tag>}>
				Shows the first <mark>Match</mark> that matches or a fallback
				in case of no match
			</Header>

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
