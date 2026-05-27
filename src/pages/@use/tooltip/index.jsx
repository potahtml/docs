import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="tooltip">
				<mark>pota/use/tooltip</mark> is a singleton ref factory
				that shows a tooltip on hover or focus and hides it on
				leave or blur. One tooltip is visible at a time —
				activating a different trigger replaces the active one
				(matches how OS-native tooltips behave).
			</Header>

			<p>
				A single shared overlay (see{' '}
				<a href="/use/overlay">overlay</a>) backs every{' '}
				<mark>tooltip(...)</mark> call. The overlay is
				refcounted: it appears on the first tooltip mount and is
				removed when the last ref disposes. Auto-repositions on
				scroll and viewport resize.
			</p>

			<Section title="Shape">
				<Code
					code={`import { tooltip } from 'pota/use/tooltip'

<button use:ref={tooltip({ content: 'Save the document' })}>
  Save
</button>

// reactive content + alternative position
<a use:ref={tooltip({
  content: () => unreadCount.read() + ' unread',
  position: 'bottom-right',
  arrows: false,
})}>
  Inbox
</a>`}
					render={false}
				/>
			</Section>

			<Section title="opts">
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
							<td>content</td>
							<td>
								string | JSX | accessor | signal{' '}
								<mark>.read</mark>
							</td>
							<td>
								tooltip body. Reactive when given a function —
								the visible tooltip updates as the value
								changes.
							</td>
						</tr>
						<tr>
							<td>position?</td>
							<td>OverlayPosition</td>
							<td>
								default <mark>'top'</mark>. See{' '}
								<a href="/use/overlay">overlay</a> for the
								full list (cardinals, plain corners, overlap
								corners).
							</td>
						</tr>
						<tr>
							<td>arrows?</td>
							<td>boolean</td>
							<td>
								default <mark>true</mark>. Toggles the arrow
								indicator on the panel.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Composing with other refs">
				<p>
					Use ref arrays to compose tooltips with other
					behaviors:
				</p>
				<Code
					code={`import { tooltip } from 'pota/use/tooltip'
import { clickOutside } from 'pota/use/clickoutside'

<button use:ref={[
  tooltip({ content: 'Click outside to cancel' }),
  clickOutside(cancel),
]}>
  Confirm
</button>`}
					render={false}
				/>
			</Section>
		</>
	)
}
