import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="Reactivity">
				The renderer doesnt provide its own reactivity. It uses{' '}
				<a href="https://github.com/solidjs/solid">Solid</a> by
				default and could be changed for{' '}
				<a href="https://github.com/vobyjs/oby">Oby</a> or{' '}
				<a href="https://github.com/fabiospampinato/flimsy">Flimsy</a>
			</Header>

			<p>
				However, a subset of the reactive library is exposed and
				re-exported with slightly changes. You MUST import from the
				renderer itself and not from the reactive library because the
				renderer decorates them with useful information to be able to
				render efficiently and as expected. It also provides the
				abstraction, benefice of being able to switch the reactive
				library in use.
			</p>

			<p>
				Primitives will be added out of necessity in a sensible and
				abstracted API. Because of this, most <mark>options</mark> has
				been dropped from the original primitives.
			</p>

			<Section title="Snippet">
				<Code
					url="/pages/api/reactivity/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Reactive Functions">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>argument</th>
							<th>returns</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>signal</td>
							<td>initialValue </td>
							<td>[read, write] </td>
							<td>tuple to read and write values from/to a signal</td>
						</tr>
						<tr>
							<td>mutable</td>
							<td>object</td>
							<td>object</td>
							<td>
								it replaces already exsisting object properties with
								setters/getters. NOTE: new properties wont be
								tracked/mutable
							</td>
						</tr>
						<tr>
							<td>memo</td>
							<td>fn</td>
							<td>signal</td>
							<td>
								read-only signal that will update when the return
								value of the function changes
							</td>
						</tr>
						<tr>
							<td>root</td>
							<td>fn</td>
							<td>dispose function</td>
							<td>creates a new tracking scope</td>
						</tr>
						<tr>
							<td>renderEffect</td>
							<td>fn</td>
							<td>void</td>
							<td>
								function to re-run when dependencies change. the
								difference with an effect is that an effect may run at
								a later point in time while a renderEffect is
								garanteed to run right away.
							</td>
						</tr>
						<tr>
							<td>effect</td>
							<td>fn</td>
							<td>void</td>

							<td>function to re-run when dependencies change</td>
						</tr>
						<tr>
							<td>batch</td>
							<td>fn</td>
							<td>void</td>

							<td>batches changes</td>
						</tr>
						<tr>
							<td>cleanup</td>
							<td>fn</td>
							<td>void</td>

							<td>
								cleanup callback for when the reactive context is
								disposed
							</td>
						</tr>
						<tr>
							<td>
								<a href="/api/lazyMemo">lazyMemo</a>
							</td>
							<td>fn</td>
							<td>signal</td>
							<td>
								like a memo but the function wont run unless is used
							</td>
						</tr>
						<tr>
							<td>withOwner</td>
							<td>void</td>
							<td>(fnToRun)=>fnToRun()</td>
							<td>
								returns a function that holds the owner on the scope.
								If you call it by passing a function it will run the
								function with that owner
							</td>
						</tr>
						<tr>
							<td>
								<a href="/api/map">map</a>
							</td>
							<td>map(Iterable, callback)</td>
							<td>void</td>
							<td>
								reactive version of <mark>array.map</mark> for
								iterables
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
