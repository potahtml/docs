import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Switch ...</Tag>}>
				Renders the first <mark>&lt;Match/&gt;</mark> child whose{' '}
				<mark>when</mark> is truthy. If none match, renders{' '}
				<mark>fallback</mark> — or, if no explicit{' '}
				<mark>fallback</mark> prop is set, a nested{' '}
				<mark>&lt;Match/&gt;</mark> with no <mark>when</mark> acts
				as the default branch.
			</Header>

			<p>
				If the child of the matching <mark>&lt;Match/&gt;</mark> is
				a function, it receives a signal carrying the current{' '}
				<mark>when</mark> value — the same callback pattern as{' '}
				<a href="/Components/Show">Show</a>.
			</p>

			<Section title="Switch Attributes">
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
							<td>fallback</td>
							<td>any</td>
							<td>
								when all the conditions of the <mark>Match</mark> are
								falsy, render <mark>fallback</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Match Attributes">
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
							<td>when</td>
							<td>any</td>
							<td>
								once <mark>when</mark> becomes truthy, it will show
								its children. A <mark>&lt;Match/&gt;</mark>{' '}
								without <mark>when</mark> becomes the implicit
								fallback when no other branch matches.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/switch/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Pick the first matching branch">
				<p>
					<mark>&lt;Switch/&gt;</mark> evaluates each child{' '}
					<mark>&lt;Match/&gt;</mark> in order and renders the
					first one whose <mark>when</mark> is truthy. The
					fallback is either an explicit{' '}
					<mark>fallback</mark> prop or the last{' '}
					<mark>&lt;Match/&gt;</mark> declared without a{' '}
					<mark>when</mark>. Cleaner than nested{' '}
					<mark>&lt;Show/&gt;</mark>s when you have several
					mutually-exclusive states.
				</p>
				<Code url="/pages/@components/switch/first-match.jsx"></Code>
			</Section>

			<Section title="Switch with the matched value">
				<p>
					Like <mark>Show</mark>, <mark>Match</mark> invokes its
					children with the matched value (reactively). Useful
					when the discriminator carries data — for example,
					route segments or status objects — and the body needs
					to read it without re-checking.
				</p>
				<Code url="/pages/@components/switch/render-prop.jsx"></Code>
			</Section>

			<Section title="Match as default branch">
				<p>
					A <mark>&lt;Match/&gt;</mark> without <mark>when</mark>{' '}
					becomes the implicit fallback inside{' '}
					<mark>&lt;Switch/&gt;</mark>. By itself{' '}
					<mark>Match</mark> is an identity component — its job
					is to carry the <mark>when</mark> and{' '}
					<mark>children</mark> props that <mark>Switch</mark>{' '}
					reads.
				</p>
				<Code url="/pages/@components/switch/match-default.jsx"></Code>
			</Section>

			<Section title="Discriminated union">
				<p>
					When a value carries a <mark>kind</mark> (or{' '}
					<mark>type</mark>/<mark>tag</mark>/...) field, each{' '}
					<mark>Match</mark> checks for that variant — perfect
					for state machines, result types, or remote-data
					lifecycles. The body for each branch gets the value
					through the children render-prop, so it can read the
					variant-specific fields without re-narrowing.
				</p>
				<Code url="/pages/@components/switch/discriminated-union.jsx"></Code>
			</Section>

			<Section title="Switch/Match testing">
				<Code url="/pages/@components/switch/test.jsx"></Code>
			</Section>
		</>
	)
}
