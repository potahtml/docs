import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="signal">
				The leaf primitive of pota's reactive graph. Holds a value,
				notifies observers when it changes. The return doubles as a
				tuple <mark>[read, write, update]</mark> and an object{' '}
				<mark>{'{ read, write, update }'}</mark>, so destructure
				whichever form fits the call site — segregating reads from
				writes is usually clearest. For derived values, reach for{' '}
				<a href="/Reactivity/memo">memo</a> /{' '}
				<a href="/Reactivity/derived">derived</a>; for side-effects
				that mirror a signal,{' '}
				<a href="/Reactivity/effect">effect</a>.
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
							<td>value?</td>
							<td>T</td>
							<td>initial value (default <mark>undefined</mark>)</td>
						</tr>
						<tr>
							<td>options?</td>
							<td>
								{`{ equals?: false | ((prev, next) => boolean) }`}
							</td>
							<td>
								<mark>equals: false</mark> notifies on every write
								(skip the equality check); a custom comparator
								decides what counts as "the same" value
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> a tuple/object with three callables —{' '}
					<mark>read()</mark> reads (and tracks),{' '}
					<mark>write(next)</mark> assigns and returns{' '}
					<mark>true</mark> when the value changed,{' '}
					<mark>update(fn)</mark> reads the previous value{' '}
					<em>without tracking</em> and writes the result of{' '}
					<mark>fn(prev)</mark>.
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@reactivity/signal/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Counter">
				<p>
					<mark>signal(0)</mark> with a button that bumps and
					another that resets. Pass the read function (
					<mark>count</mark>, the function reference, not{' '}
					<mark>count()</mark>) as a JSX child so the renderer
					re-runs it whenever the value changes.{' '}
					<mark>update</mark> receives the previous value;{' '}
					<mark>setCount</mark> replaces it directly.
				</p>
				<Code url="/pages/@reactivity/signal/counter.jsx"></Code>
			</Section>

			<Section title="Toggle">
				<p>
					<mark>update(prev =&gt; next)</mark> is the right call
					when the new value depends on the old — it receives the
					previous value and is wrapped in <mark>untrack</mark>{' '}
					internally so reading inside the updater never creates
					extra subscriptions.
				</p>
				<Code url="/pages/@reactivity/signal/toggle.jsx"></Code>
			</Section>

			<Section title="Custom equality">
				<p>
					Pass <mark>{`{ equals: false }`}</mark> to disable equality
					checks (every write notifies), or{' '}
					<mark>{`{ equals: fn }`}</mark> to define what counts as
					"the same" value. Useful when you store an object but
					only care when a specific field changes.
				</p>
				<Code url="/pages/@reactivity/signal/equals.jsx">
					Renaming Ada with the same <mark>id</mark> doesn't
					re-run the effect; switching to Grace does.
				</Code>
			</Section>

			<Section title="Two-way input binding">
				<p>
					Wire an input to a signal:{' '}
					<mark>prop:value=&#123;name&#125;</mark> binds the DOM
					property to the read function and the{' '}
					<mark>on:input</mark> handler writes back. For a richer
					two-way binding helper, see{' '}
					<a href="/use/bind">use:bind</a>.
				</p>
				<Code url="/pages/@reactivity/signal/binding.jsx"></Code>
			</Section>

			<Section title="Encapsulated counter">
				<p>
					Hide the writer behind a hook-style function that returns
					just a reader and named actions. The signal stays the
					source of truth internally; consumers can't bypass the
					action API to write whatever they like.
				</p>
				<Code url="/pages/@reactivity/signal/encapsulate.jsx"></Code>
			</Section>
		</>
	)
}
