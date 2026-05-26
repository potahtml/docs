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

			<Section title="Modal in an overlay">
				<p>
					<mark>&lt;Portal mount=&#123;node&#125;/&gt;</mark>{' '}
					renders its children into <mark>node</mark> instead of
					the surrounding tree, while keeping context, ownership,
					and cleanup tied to the component that declared it.
					Useful for tooltips, modals, toasts — anything that
					needs to escape the parent's overflow/z-index context.
				</p>
				<Code url="/pages/@components/portal/modal.jsx"></Code>
			</Section>

			<Section title="Toast queue">
				<p>
					A toast container needs to escape any parent's{' '}
					<mark>overflow: hidden</mark> or stacking context —{' '}
					<mark>&lt;Portal/&gt;</mark> projects each toast into a
					global host element while keeping its lifecycle tied to
					the caller. Add a fixed-positioned host once and any
					nested component can push notifications into it.
				</p>
				<Code url="/pages/@components/portal/toasts.jsx"></Code>
			</Section>

			<Section title="Portaling Children">
				<p>Portal some children to the body</p>
				<Code url="/pages/@components/portal/body.jsx"></Code>
			</Section>
		</>
	)
}
