import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="resolve">
				Helper that runs the functions inside{' '}
				<mark>props.children</mark> and returns a memo of the
				result. The unwrapping happens inside a memo, so each
				function runs at most once per change.
			</Header>

			<p>
				<mark>props.children</mark> is typically an array of
				functions, components and plain data. It is <em>not</em>{' '}
				HTML; the elements are created when children are returned
				— either by handing <mark>props.children</mark> back as-is
				or by returning a new tree that references them.
			</p>

			<p>
				Unlike Solid, <mark>props.children</mark> is not a getter.
				You don't need <mark>resolve</mark> to consume children —
				reach for it when you need to run the functions inside (to
				inspect them, or to avoid re-running them on every read).
				Accessing or modifying <mark>props.children</mark>{' '}
				directly as many times as you want has no cost.
			</p>
			<p>
				<mark>resolve</mark> creates a memo owned by the caller, so
				anything it reads becomes a dependency of that memo — not
				of the surrounding effect. That matters when the caller is
				itself an effect and you want the resolve to be the
				tracking boundary.
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
							<td>function holding the children.</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/resolve/snippet.jsx"></Code>
			</Section>

			<Section title="Inspect resolved children">
				<p>
					<mark>resolve(children)</mark> returns a memo that
					recursively unwraps function children — useful when a
					wrapper component needs to look at its children
					(count them, filter them, peek at their props)
					without breaking reactivity. Reading{' '}
					<mark>kids()</mark> re-runs only when child output
					actually changes.
				</p>
				<Code url="/pages/resolve/inspect.jsx"></Code>
			</Section>

			<Section title="Children Caching">
				<p>Filter children without causing re-renders</p>
				<Code url="/pages/resolve/resolve-helper.jsx">
					Filter the menu and count how many times the children
					rendered.
				</Code>
			</Section>
		</>
	)
}
