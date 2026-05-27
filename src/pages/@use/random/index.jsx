import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="random">
				<mark>pota/use/random</mark> exposes small randomness
				helpers backed by <mark>crypto.getRandomValues</mark> —
				not <mark>Math.random</mark>. Includes a seeded LCG when
				you need reproducibility.
			</Header>

			<Section title="API">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>signature</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>random()</td>
							<td>{`() => number`}</td>
							<td>
								crypto-strength float in <mark>[0, 1)</mark>.
							</td>
						</tr>
						<tr>
							<td>randomBetween</td>
							<td>(min=0, max=100, generator=random)</td>
							<td>
								integer in <mark>[min, max]</mark> inclusive,
								floored. Pass your own generator (e.g. a{' '}
								<mark>randomSeeded</mark> one) to opt out of
								crypto.
							</td>
						</tr>
						<tr>
							<td>randomColor</td>
							<td>(min=0, max=255)</td>
							<td>
								<mark>'rgb(r,g,b)'</mark> with each channel
								sampled via <mark>randomBetween(min, max)</mark>.
							</td>
						</tr>
						<tr>
							<td>randomId()</td>
							<td>{`() => string`}</td>
							<td>
								base36 string of one crypto-generated 64-bit
								integer. Roughly 12-13 chars; collision-safe
								for typical UI key purposes.
							</td>
						</tr>
						<tr>
							<td>chance</td>
							<td>(chance=50, generator=random)</td>
							<td>
								returns <mark>true</mark> with the given
								percentage probability (0-100).
							</td>
						</tr>
						<tr>
							<td>randomSeeded(seed)</td>
							<td>{`(number) => () => number`}</td>
							<td>
								linear-congruential generator. Returns a
								function that produces deterministic floats
								in <mark>[0, 1)</mark>; pass it to{' '}
								<mark>randomBetween</mark> /{' '}
								<mark>chance</mark> for reproducible runs
								(tests, fixtures, replays).
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Reproducible randomness">
				<Code
					code={`import { randomSeeded, randomBetween } from 'pota/use/random'

const rng = randomSeeded(42)
randomBetween(0, 9, rng)  // deterministic across runs`}
					render={false}
				/>
			</Section>
		</>
	)
}
