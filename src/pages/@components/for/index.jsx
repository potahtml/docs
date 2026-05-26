import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>For ...</Tag>}>
				Reactive version of <mark>array.map</mark> for reactive lists
			</Header>

			<Section title="Arguments">
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
							<td>each</td>
							<td>signal/iterable object </td>
							<td>an iterable or a signal whose value is iterable</td>
						</tr>
						<tr>
							<td>restoreFocus</td>
							<td>boolean</td>
							<td>
								when items are reordered, the DOM swap can steal
								focus and scroll position. Set to{' '}
								<mark>true</mark> to save and restore both around
								the swap.
							</td>
						</tr>
						<tr>
							<td>fallback</td>
							<td>any</td>
							<td>rendered when the list is empty</td>
						</tr>
						<tr>
							<td>reactiveIndex</td>
							<td>boolean</td>
							<td>
								when <mark>true</mark>, the callback receives a
								reactive signal for the index instead of a plain
								number
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Keyed list">
				<p>
					<mark>&lt;For each={'{...}'}&gt;</mark> renders one
					child per item, keying by item identity. When the
					array is reordered, rows move; when items remain the
					same reference, the corresponding DOM node is reused.
					Pass the <em>reader</em> (<mark>items</mark>) to keep
					the list reactive.
				</p>
				<Code url="/pages/@components/for/keyed.jsx"></Code>
			</Section>

			<Section title="Reactive index and fallback">
				<p>
					Pass <mark>reactiveIndex</mark> and the second callback
					parameter becomes a signal accessor — useful when a row
					needs to display or react to its own current index
					(which changes when neighbors are added or removed).{' '}
					<mark>fallback</mark> renders when the list is empty.
				</p>
				<Code url="/pages/@components/for/index-fallback.jsx"></Code>
			</Section>

			<Section title="Sortable list with editable rows">
				<p>
					Swapping two items in the array moves the existing
					DOM nodes instead of recreating them — any state
					inside a row (input focus, animation progress, a
					child component's signal) survives the reorder. Pass{' '}
					<mark>restoreFocus</mark> so <mark>For</mark> even
					returns the focused element to where it was after the
					swap. Storing the array as a{' '}
					<a href="/Store">mutable</a> makes per-field edits
					reactive too, so the displayed text follows{' '}
					<mark>item.text = ...</mark> mutations after a swap.
				</p>
				<Code url="/pages/@components/for/sortable.jsx"></Code>
			</Section>

			<Section title="Simple Test">
				<p>
					Use a <mark>For</mark> to display some values, blink updates
				</p>
				<Code url="/pages/@components/for/simple.jsx"></Code>
			</Section>

			<Section title="Heavy Test">
				<p>Stress test</p>
				<Code url="/pages/@components/for/test.jsx"></Code>
			</Section>

			<Section title="Fallback">
				<p>
					For when the list has no items, render a fallback
				</p>
				<Code url="/pages/@components/for/fallback.jsx"></Code>
			</Section>
		</>
	)
}
