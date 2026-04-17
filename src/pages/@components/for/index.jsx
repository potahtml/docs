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
