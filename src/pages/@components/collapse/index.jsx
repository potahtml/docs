import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

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
								once <mark>when</mark> becomes truthy, the children
								are shown. When it becomes falsy they are hidden
								but stay mounted, so iframes, canvases, video and
								audio keep their state.
							</td>
						</tr>
						<tr>
							<td>fallback</td>
							<td>any</td>
							<td>
								rendered in place of the children while{' '}
								<mark>when</mark> is falsy
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

			<Section title="Hide without unmounting">
				<p>
					<mark>&lt;Collapse when/&gt;</mark> uses{' '}
					<mark>style:display="none"</mark> instead of removing the
					subtree. State inside the children survives across
					hide/show — useful for tabs, accordions, or expensive
					widgets you don't want to re-mount.
				</p>
				<Code url="/pages/@components/collapse/preserved.jsx"></Code>
			</Section>

			<Section title="Reactive">
				<p>
					A youtube video keeps playing in the background even if the
					collapse element is set to be hidden
				</p>
				<Code url="/pages/@components/collapse/reactive.jsx"></Code>
			</Section>

			<Section title="Fallback">
				<p>
					A youtube video keeps playing in the background and a
					fallback is shown
				</p>
				<Code url="/pages/@components/collapse/fallback.jsx"></Code>
			</Section>
		</>
	)
}
