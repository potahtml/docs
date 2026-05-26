import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="map">
				Reactive equivalent of <mark>array.map</mark>. Runs the
				callback only for added, removed or changed entries —
				existing rows keep their state instead of being recreated
				on every change. Powers <mark>&lt;For/&gt;</mark> and works
				with arrays, sets and maps.
			</Header>

			<p>
				Plain{' '}
				<mark>{'array.map(item => <li>{item}</li>)'}</mark> can't
				react to mutations without rebuilding every row from
				scratch, losing focus, DOM state, and any work the row
				performed. <mark>map</mark> avoids that by keying rows by
				identity and reusing them across updates.
			</p>

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
							<td>iterable | () {'=>'} iterable</td>
							<td>
								array, Set, Map, or a signal returning one of the
								above
							</td>
						</tr>
						<tr>
							<td>callback</td>
							<td>(item, index) {'=>'} JSX.Element</td>
							<td>runs once per row; its return value is rendered</td>
						</tr>
						<tr>
							<td>noSort?</td>
							<td>boolean</td>
							<td>
								when <mark>true</mark>, reordering the input does
								not reorder the DOM
							</td>
						</tr>
						<tr>
							<td>fallback?</td>
							<td>any</td>
							<td>rendered when the input is empty</td>
						</tr>
						<tr>
							<td>reactiveIndex?</td>
							<td>boolean</td>
							<td>
								when <mark>true</mark>, <mark>index</mark> is a
								signal instead of a number
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Keyed iteration">
				<p>
					Pass the read function so the list stays reactive.
					Reversing the array reuses every row's DOM node — only
					their order changes.
				</p>
				<Code url="/pages/@reactivity/map/keyed.jsx"></Code>
			</Section>

			<Section title="map test">
				<p>Modifying an array and getting reactive changes</p>
				<Code url="/pages/@reactivity/map/test.jsx"></Code>
			</Section>

			<Section title="map types">
				<p>map works with Array, Set and Map</p>
				<Code url="/pages/@reactivity/map/types.jsx"></Code>
			</Section>
		</>
	)
}
