import { Code, Header, Section, Tag } from '#main'

export default function () {
	return (
		<>
			<Header title={<Tag>Collapse ...</Tag>}>
				Similar to <Tag>Show</Tag>, it renders its children based on a
				condition, the difference is that the element is not removed
				from the document if the condition becomes falsy. Useful for
				iframes, canvas, video, audio.
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
					url="/pages/@components/collapse/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Reactive">
				<p>
					A youtube video keeps playing in the background even if the
					collapse element is set to be hidden
				</p>
				<Code url="/pages/@components/collapse/reactive.jsx"></Code>
			</Section>
		</>
	)
}
