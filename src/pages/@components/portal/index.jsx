import { Code, Header, Section, Tag } from '#main'

export default function () {
	return (
		<>
			<Header title={<Tag>Portal ...</Tag>}>
				Portal inserts its children into a different part of the
				document. It does so without using a wrapper. For portaling
				children to <mark>document.head</mark> see{' '}
				<Tag mark={true}>Head</Tag> component instead
			</Header>

			<p>
				Behind the scenes it use <mark>render</mark>, so in case the
				container to which we portaled is removed from the document,
				then the <mark>portal</mark> is disposed.
			</p>
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
							<td>mount</td>
							<td>Element</td>
							<td>
								Element to portal into. The element should be in the
								document
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Portaling Children">
				<p>Portal some children to the body</p>
				<Code url="/pages/@components/portal/body.jsx"></Code>
			</Section>
		</>
	)
}
