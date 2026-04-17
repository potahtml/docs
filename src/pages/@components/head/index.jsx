import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Head ...</Tag>}>
				Mounts its children into <mark>document.head</mark>. When a
				new child is inserted there the runtime detects tags that
				should be unique and replaces the existing one in place, so
				multiple pages/components can all contribute to the head
				without duplicates.
			</Header>

			<Section title="Deduplication">
				<p>
					Every element inserted into <mark>document.head</mark>{' '}
					(via <mark>&lt;Head/&gt;</mark>, a portal, or the
					renderer directly) is checked against the existing head.
					If a match is found by the rules below, the existing
					element is <em>replaced</em> with the new one.
				</p>
				<table>
					<thead>
						<tr>
							<th>tag</th>
							<th>matched by</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<mark>&lt;title&gt;</mark>
							</td>
							<td>there can only be one — any existing title</td>
						</tr>
						<tr>
							<td>
								<mark>&lt;meta&gt;</mark>
							</td>
							<td>
								same <mark>name</mark> attribute, or same{' '}
								<mark>property</mark> attribute
							</td>
						</tr>
						<tr>
							<td>
								<mark>&lt;link rel="canonical"&gt;</mark>
							</td>
							<td>any existing canonical link</td>
						</tr>
					</tbody>
				</table>
				<p>
					Tags that aren't in this list are appended as usual;
					they are not deduplicated.
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/head/snippet.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
