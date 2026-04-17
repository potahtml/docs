import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Reactivity">
				Reactive primitives are introduced as needed through a clean
				and abstracted API. It currently leverages a customized
				version of the SolidJS Core, refactored to classes.
			</Header>

			<Section title="Reactive Functions">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>arguments</th>
							<th>returns</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>signal</td>
							<td>
								(initialValue?, {'{ equals?: false | (a, b) => boolean }'})
							</td>
							<td>
								<mark>
									[read, write, update] & {'{ read, write, update }'}
								</mark>
							</td>
							<td>
								creates a signal. The return value doubles as a tuple
								(<mark>[read, write, update]</mark>) and an object (
								<mark>{'{ read, write, update }'}</mark>), so
								destructure whichever form you prefer.{' '}
								<mark>read()</mark> returns the current value;{' '}
								<mark>write(next)</mark> assigns a new value and
								returns <mark>true</mark> when it changed.{' '}
								<mark>update(fn)</mark> calls <mark>fn(prev)</mark>{' '}
								<em>without</em> tracking and writes the returned
								value — prefer it over <mark>write</mark> whenever
								the new value depends on the old, so you don't
								re-read the signal (and don't track the read).
								Pass <mark>equals: false</mark> to notify on every
								write (even when the value is the same), or a
								custom comparator.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/memo">memo</a>
							</td>
							<td>fn</td>
							<td>signal</td>
							<td>
								read-only signal that will update when the return
								value of the function changes, memos are lazy
							</td>
						</tr>

						<tr>
							<td>derived</td>
							<td>(...fn)</td>
							<td>signal</td>
							<td>
								lazy, writable version of <mark>memo</mark> that
								unwraps and tracks functions and promises
								recursively. The function won't run unless the
								result is read; writing to the returned signal
								overrides the computed value.
							</td>
						</tr>
						<tr>
							<td>externalSignal</td>
							<td>(initialValue, options?)</td>
							<td>signal</td>
							<td>
								signal tailored for arrays of objects with an{' '}
								<mark>id</mark> key. Writing patches by{' '}
								<mark>id</mark>, preserving references for items
								that are unchanged. Useful for syncing server data
								without introducing a store.
							</td>
						</tr>
						<tr>
							<td>root</td>
							<td>{`(dispose => ...)`}</td>
							<td>return value of fn</td>
							<td>
								creates a new top-level tracking scope. The callback
								receives a <mark>dispose</mark> function that tears
								down everything created inside. Reactive work that
								outlives a component (long-lived subscriptions,
								imperative rendering) belongs in a{' '}
								<mark>root</mark>.
							</td>
						</tr>
						<tr>
							<td>effect</td>
							<td>fn</td>
							<td>void</td>
							<td>
								runs <mark>fn</mark> once immediately, then again
								whenever any signal it reads changes. Effects are
								scheduled — they may run later in the microtask
								queue; use <mark>syncEffect</mark> if you need
								synchronous execution.
							</td>
						</tr>
						<tr>
							<td>on</td>
							<td>(depend, fn)</td>
							<td>void</td>
							<td>
								effect with explicit dependencies. Only{' '}
								<mark>depend</mark> is tracked; <mark>fn</mark> runs
								untracked each time <mark>depend</mark> changes.
								Handy when the handler reads other signals you
								don't want as dependencies.
							</td>
						</tr>
						<tr>
							<td>syncEffect</td>
							<td>fn</td>
							<td>void</td>
							<td>
								like <mark>effect</mark>, but runs synchronously
								whenever a dependency changes instead of being queued
								for the next scheduler tick. Use when you need the
								side effect to land before the current call returns.
							</td>
						</tr>
						<tr>
							<td>asyncEffect</td>
							<td>{`(previous: Promise<any> | undefined) => any`}</td>
							<td>void</td>
							<td>
								effect for async work, serialised by default. On each
								run the callback receives the promise from the
								previous run (or <mark>undefined</mark> on the first
								run); <mark>await</mark> it to ensure the previous
								async run finishes before starting new work.
							</td>
						</tr>
						<tr>
							<td>listener</td>
							<td>()</td>
							<td>current listener | undefined</td>
							<td>
								returns the currently-running reactive listener (the
								tracking scope an inner computation is inside), or{' '}
								<mark>undefined</mark> if there is none. Useful for
								introspection.
							</td>
						</tr>
						<tr>
							<td>untrack</td>
							<td>fn</td>
							<td>return value of fn</td>
							<td>
								runs <mark>fn</mark> without establishing reactive
								dependencies on anything it reads
							</td>
						</tr>
						<tr>
							<td>batch</td>
							<td>fn</td>
							<td>return value of fn</td>
							<td>
								groups writes so dependents re-run once at the end
								of <mark>fn</mark> instead of after each individual
								write.
							</td>
						</tr>
						<tr>
							<td>action</td>
							<td>(...cbs)</td>
							<td>function</td>
							<td>
								builds an action handler. Returns a function that,
								when called, runs <mark>cbs[0]</mark> with the
								received args and chains the remaining callbacks as
								continuations, unwrapping any returned functions or
								promises recursively. Cancels automatically if the
								owner is disposed — handy for async event handlers.
							</td>
						</tr>
						<tr>
							<td>catchError</td>
							<td>(fn, onError)</td>
							<td>return value of fn | undefined</td>
							<td>
								runs <mark>fn</mark> inside an error boundary. If it
								throws (synchronously or via a reactive dependency),{' '}
								<mark>onError(err)</mark> is called and the error
								does not bubble. Returns the value of{' '}
								<mark>fn</mark>, or <mark>undefined</mark> if it
								threw.
							</td>
						</tr>
						<tr>
							<td>cleanup</td>
							<td>fn</td>
							<td>fn</td>
							<td>
								registers <mark>fn</mark> to run when the current
								reactive scope is disposed. Returns the same function
								so you can keep a reference. Callbacks run in
								reverse-registration order (LIFO).
							</td>
						</tr>

						<tr>
							<td>owned</td>
							<td>(fn, onCancel?)</td>
							<td>function</td>
							<td>
								captures the current owner and returns a function
								bound to it. Calling that function re-runs{' '}
								<mark>fn</mark> under the captured owner, as long as
								the owner hasn't been disposed. If the owner is
								disposed before the function is called,{' '}
								<mark>onCancel</mark> runs instead. Useful for
								scheduling work (timers, promises, events) that must
								not outlive the component that scheduled it.
							</td>
						</tr>
						<tr>
							<td>withValue</td>
							<td>(value, fn)</td>
							<td>void</td>
							<td>
								resolves <mark>value</mark> and calls{' '}
								<mark>fn(resolved)</mark>. Functions are unwrapped
								inside an effect (so <mark>fn</mark> re-runs on
								change); promises and arrays of functions/promises
								are resolved recursively. Plain values call{' '}
								<mark>fn</mark> immediately.
							</td>
						</tr>
						<tr>
							<td>isResolved</td>
							<td>(...deriveds)</td>
							<td>boolean</td>
							<td>
								<mark>true</mark> once every passed{' '}
								<mark>derived</mark> has resolved at least once.
								Useful with <mark>Suspense</mark> to know when
								async-driven derived values are ready.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/map">map</a>
							</td>
							<td>(iterable, callback, noSort?, fallback?, reactiveIndex?)</td>
							<td>rendered output</td>
							<td>
								reactive equivalent of <mark>array.map</mark>. Tracks
								an iterable (array, set, map, signal returning one)
								and only re-runs <mark>callback</mark> for
								added/removed/changed entries — existing rows keep
								their state. Powers the <mark>&lt;For/&gt;</mark>{' '}
								component.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
