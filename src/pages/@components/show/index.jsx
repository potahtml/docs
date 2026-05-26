import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Show ...</Tag>}>
				Renders its children when <mark>when</mark> is truthy.
				For reactivity, pass <mark>when</mark> as a function —
				static values short-circuit and never re-evaluate. If{' '}
				<mark>children</mark> is a callback, it receives a signal
				that carries the current truthy value, so you can keep
				reading fresh values without tearing down the tree.
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
							<td>when</td>
							<td>any</td>
							<td>
								once <mark>when</mark> becomes truthy, it will show
								its children
							</td>
						</tr>
						<tr>
							<td>fallback?</td>
							<td>any</td>
							<td>
								a thing to render as fallback when the condition is
								falsy
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/show/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Toggle">
				<p>
					<mark>Show</mark> mounts its children when{' '}
					<mark>when</mark> is truthy and <mark>fallback</mark>{' '}
					otherwise. Pass the <em>reader</em> ({' '}
					<mark>visible</mark>) so the condition stays reactive —
					calling <mark>visible()</mark> would be a one-time
					snapshot.
				</p>
				<Code url="/pages/@components/show/toggle.jsx"></Code>
			</Section>

			<Section title="Show with destructured value">
				<p>
					When <mark>when</mark> is truthy, <mark>Show</mark>{' '}
					invokes the children function with a reactive accessor
					for the value — useful when downstream code needs the
					value (and TypeScript knows it's non-null inside the
					branch).
				</p>
				<Code url="/pages/@components/show/destructured.jsx"></Code>
			</Section>

			<Section title="Auth gate">
				<p>
					<mark>Show</mark> is the natural primitive for "render
					this only when the user is authenticated, else fall
					back". Combining it with{' '}
					<mark>&lt;Navigate/&gt;</mark> turns the fallback into a
					redirect — no inline conditionals, the intent reads
					top-to-bottom.
				</p>
				<Code url="/pages/@components/show/auth-gate.jsx"></Code>
			</Section>

			<Section title="Static true/false">
				<p>Test using static values</p>
				<Code url="/pages/@components/show/static.jsx"></Code>
			</Section>

			<Section title="Reactive Value">
				<p>Test using a signal and also the signal value</p>

				<Code url="/pages/@components/show/reactive.jsx">
					The signal that's being called won't be reactive because
					instead of passing to <mark>when</mark> a function we are
					passing the signal value which is a boolean
				</Code>
			</Section>

			<Section title="Rendering">
				<p>How many times a children renders by a toggling signal</p>
				<Code url="/pages/@components/show/rendering.jsx">
					Children are unmounted and effectively disposed
				</Code>
			</Section>

			<Section title="Avoiding Re-rendering">
				<p>
					Using the <mark>children</mark> helper we can avoid re
					rendering
				</p>
				<Code url="/pages/@components/show/avoid-rendering.jsx">
					We use the <mark>children</mark> helper to memo the result
					of a component
				</Code>
			</Section>

			<Section title="Fallback">
				<p>
					A fallback renders a component when the condition becomes{' '}
					<mark>false</mark>
				</p>
				<Code url="/pages/@components/show/fallback.jsx">
					Fallbacks use <mark>memo</mark> which are lazy, so these
					don't need to use the children helper
				</Code>
			</Section>

			<Section title="Fallback Signal">
				<p>Tests a signal for a fallback.</p>
				<Code url="/pages/@components/show/fallback-signal.jsx"></Code>
			</Section>

			<Section title="Callback">
				<p>Using the value from the condition in a callback</p>
				<Code url="/pages/@components/show/callback.jsx">
					<mark>Show</mark> callbacks receive a read-only signal, a
					memo
				</Code>
			</Section>

			<Section title="Callbacks">
				<p>Children are arrays, so the callbacks can be placed anywhere</p>
				<Code url="/pages/@components/show/callbacks.jsx">
					The third callback needs to return a function for it to be
					reactive
				</Code>
			</Section>

			<Section title="Callbacks Null">
				<p>
					Test what happens when a value for a callback becomes null
				</p>
				<Code url="/pages/@components/show/callbacks-null.jsx"></Code>
			</Section>

			<Section title="Show In Between">
				<p>In between 2 elements and in between 2 text nodes</p>
				<Code url="/pages/@components/show/between.jsx">
					Sandwich, it keeps the position
				</Code>
			</Section>
		</>
	)
}
