import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="resolve">
				<p>
					Utility to resolve <mark>props.children</mark>. It returns a
					memo. This utility helps to unwrap the functions contained
					on them. It does in a memo so functions are unwrapped only
					once.
				</p>
			</Header>

			<p>
				<mark>props.children</mark> is <em>most of the time</em> an
				array of functions/components and/or data. It does not contain
				HTML, it is created when in need, once you return either
				`props.children` or a new set of children.
			</p>

			<p>
				Unlike Solid, <mark>props.children</mark> is not a getter. You
				do not need the resolve helper to use props.children unless
				you are attempting to run the possible functions/components in
				them, or to do caching to prevent re renders. There's no
				downside on using, accessing or modifying{' '}
				<mark>props.children</mark> many times.
			</p>
			<p>
				The resolve helper causes tracking and changes the
				context/scope on which things run.
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
							<td>fn</td>
							<td>fn</td>
							<td>The function holding the children.</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/rendering/resolve/snippet.jsx"></Code>
			</Section>

			<Section title="Children Caching">
				<p>Filter children without causing re-renders</p>
				<Code url="/pages/rendering/resolve/resolve-helper.jsx">
					Filter the menu and count how many times the children
					rendered.
				</Code>
			</Section>
		</>
	)
}
