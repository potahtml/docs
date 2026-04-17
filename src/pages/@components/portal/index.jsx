import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Portal ...</Tag>}>
				Inserts its children into a different element while keeping
				them inside the current reactive scope — no wrapper node is
				added. For portaling into <mark>document.head</mark>, prefer{' '}
				<Tag mark={true}>Head</Tag>, which also deduplicates{' '}
				<mark>title</mark> / <mark>meta</mark> /{' '}
				<mark>rel=canonical</mark>.
			</Header>

			<p>
				Portaled content is rendered via <mark>insert</mark> and is
				owned by the surrounding component: if that component is
				disposed, the portaled nodes are removed too.
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
