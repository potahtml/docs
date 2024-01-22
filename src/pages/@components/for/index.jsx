import { Code, Header, Section, Tag } from '#main'

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
		</>
	)
}
