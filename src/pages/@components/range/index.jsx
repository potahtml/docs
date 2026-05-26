import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Range ...</Tag>}>
				Renders one entry per number in a numeric range. Think of
				it as Python's <mark>range()</mark> wired into{' '}
				<mark>&lt;For/&gt;</mark>: it generates the numbers and
				calls the child callback with each <mark>(item, index)</mark>
				.
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
							<td>start?</td>
							<td>number | signal</td>
							<td>
								first value (default <mark>0</mark>). Always
								emitted.
							</td>
						</tr>
						<tr>
							<td>stop?</td>
							<td>number | signal</td>
							<td>
								final value (default <mark>0</mark>). Inclusive
								when reached exactly. Count up when{' '}
								<mark>start &lt; stop</mark>, down when{' '}
								<mark>start &gt; stop</mark>.
							</td>
						</tr>
						<tr>
							<td>step?</td>
							<td>number | signal</td>
							<td>
								increment between emitted values (default{' '}
								<mark>1</mark>). Negative values are normalised to
								their absolute value — use <mark>start</mark> and{' '}
								<mark>stop</mark> to pick direction.
							</td>
						</tr>
						<tr>
							<td>children</td>
							<td>{'(item: number, index: number) => JSX.Element'}</td>
							<td>
								callback invoked for each emitted number. Same
								semantics as <mark>&lt;For/&gt;</mark>'s child
								callback.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Numeric range">
				<p>
					<mark>&lt;Range start stop step/&gt;</mark> produces a{' '}
					<mark>&lt;For/&gt;</mark> over the numeric range, calling
					its children with <mark>(value, index)</mark>. All three
					props accept either a number or an accessor — drive the
					bounds with signals.
				</p>
				<Code url="/pages/@components/range/numeric.jsx"></Code>
			</Section>

			<Section title="Descending with negative step">
				<p>
					<mark>step</mark> defaults to <mark>1</mark>. Pass a
					negative number with <mark>start &gt; stop</mark> to
					count down — the resulting iteration mirrors{' '}
					<mark>for (let n = start; n &gt; stop; n += step)</mark>.
					All three props can be reactive.
				</p>
				<Code url="/pages/@components/range/descending.jsx"></Code>
			</Section>

			<Section title="Simple Test">
				<p>
					Use a <mark>Range</mark> to display some values
				</p>
				<Code url="/pages/@components/range/simple.jsx"></Code>
			</Section>
		</>
	)
}
