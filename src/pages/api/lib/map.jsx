import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="map">
				Reactive helper that runs a callback only on new or modified
				entries. The problem of doing{' '}
				<mark>{'{array.map(item => <li>{item}</li>)}'}</mark>
				is that is doesnt react when the array is modified (items
				added/modified/deleted), as that would require to recreate the
				whole array. For this reason <mark>map</mark> exists.
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
							<td>items</td>
							<td>signal/iterable object </td>
							<td>a signal whose value is iterable</td>
						</tr>
						<tr>
							<td>callback</td>
							<td>fn</td>
							<td>callback to run on each item</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="map test">
				<p>Modifying an array and getting reactive changes</p>
				<Code url="/pages/api/lib/map/test.jsx"></Code>
			</Section>

			<Section title="map types">
				<p>map works with Array, Set and Map</p>
				<Code url="/pages/api/lib/map/types.jsx"></Code>
			</Section>
		</>
	)
}
