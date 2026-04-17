import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Tabs ...</Tag>}>
				Accessible, nestable <mark>Tabs</mark> component by{' '}
				<a href="https://github.com/boredofnames">@boredofnames</a>.
				Composes three sub-components — <mark>Tabs.Labels</mark>,{' '}
				<mark>Tabs.Label</mark>, <mark>Tabs.Panels</mark>,{' '}
				<mark>Tabs.Panel</mark> — and exposes a{' '}
				<mark>Tabs.selected</mark> helper for reading the current
				tab from elsewhere in the tree.
			</Header>

			<Section title="Shape">
				<ul>
					<li>
						<mark>&lt;Tabs.Labels&gt;</mark> renders a{' '}
						<mark>&lt;nav role="tablist"&gt;</mark> around its
						children
					</li>
					<li>
						each <mark>&lt;Tabs.Label&gt;</mark> becomes a{' '}
						<mark>&lt;button role="tab"&gt;</mark>
					</li>
					<li>
						<mark>&lt;Tabs.Panels&gt;</mark> does not wrap — it just
						renders the panels sequentially
					</li>
					<li>
						each <mark>&lt;Tabs.Panel&gt;</mark> becomes a{' '}
						<mark>&lt;section role="tabpanel"&gt;</mark>
					</li>
					<li>unknown props are forwarded to the element</li>
				</ul>
			</Section>

			<Section title="Attributes">
				<table>
					<thead>
						<tr>
							<th>component</th>
							<th>prop</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<mark>Tabs</mark>
							</td>
							<td>selected?</td>
							<td>
								initial tab index (default <mark>0</mark>)
							</td>
						</tr>
						<tr>
							<td>
								<mark>Tabs.Label</mark>
							</td>
							<td>name?</td>
							<td>
								optional label name exposed through{' '}
								<mark>Tabs.selected().name</mark>
							</td>
						</tr>
						<tr>
							<td>
								<mark>Tabs.Label</mark>
							</td>
							<td>selected?</td>
							<td>
								when <mark>true</mark>, marks this label as the
								initially selected tab (overrides{' '}
								<mark>Tabs.selected</mark>)
							</td>
						</tr>
						<tr>
							<td>
								<mark>Tabs.Label</mark>
							</td>
							<td>hidden?</td>
							<td>hides the label (and its matching panel)</td>
						</tr>
						<tr>
							<td>
								<mark>Tabs.Label</mark>
							</td>
							<td>onClick?</td>
							<td>
								called with{' '}
								<mark>{'{ event, group, id, props }'}</mark>{' '}
								before the selection change is applied
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Tabs.selected">
				<p>
					<mark>Tabs.selected()</mark> returns the selected-tab
					signal tuple for the nearest <mark>&lt;Tabs&gt;</mark>{' '}
					ancestor. Read it to know which tab is active:{' '}
					<mark>{`const [get] = Tabs.selected(); get().id`}</mark>.
				</p>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@components/tabs/snippet.jsx"></Code>
			</Section>
		</>
	)
}
