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
								when moving items on a list that contains inputs may
								cause focus lost
							</td>
						</tr>
						<tr>
							<td>fallback</td>
							<td>any</td>
							<td>
								when list is empty a fallback could be displayed
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
				<p>Sowwy, but I need to test this thing</p>
				<Code url="/pages/@components/for/test.jsx"></Code>
			</Section>

			<Section title="Fallback">
				<p>
					For when the list has no items, a fallback could be
					displayed
				</p>
				<Code url="/pages/@components/for/fallback.jsx"></Code>
			</Section>
		</>
	)
}
