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
				<p>
					Click any name for the worked example and full
					signature.
				</p>
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
							<td>
								<a href="/Reactivity/signal">signal</a>
							</td>
							<td>
								(initialValue?, {'{ equals?: false | (a, b) => boolean }'})
							</td>
							<td>
								<mark>
									[read, write, update] & {'{ read, write, update }'}
								</mark>
							</td>
							<td>
								reactive value. Destructure as a tuple or
								access by name — same callables either way.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/memo">memo</a>
							</td>
							<td>fn</td>
							<td>signal</td>
							<td>
								read-only signal that updates when{' '}
								<mark>fn</mark>'s tracked reads change. Lazy
								— never runs if never read.
							</td>
						</tr>

						<tr>
							<td>
								<a href="/Reactivity/derived">derived</a>
							</td>
							<td>(...fn)</td>
							<td>signal</td>
							<td>
								lazy, writable <mark>memo</mark> that unwraps
								functions and promises recursively. Manual
								writes override until a source re-fires.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/externalSignal">externalSignal</a>
							</td>
							<td>(initialValue, options?)</td>
							<td>signal</td>
							<td>
								signal whose <mark>write</mark> patches arrays
								of objects by <mark>id</mark>, preserving
								references for unchanged items.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/root">root</a>
							</td>
							<td>{`(dispose => ...)`}</td>
							<td>return value of fn</td>
							<td>
								new top-level tracking scope. The callback
								receives a <mark>dispose</mark> function that
								tears down everything created inside.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/effect">effect</a>
							</td>
							<td>fn</td>
							<td>void</td>
							<td>
								runs <mark>fn</mark> once, then again on every
								tracked change. Scheduled — see{' '}
								<mark>syncEffect</mark> for synchronous
								re-runs.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/on">on</a>
							</td>
							<td>(depend, fn)</td>
							<td>void</td>
							<td>
								effect with explicit deps. Only{' '}
								<mark>depend</mark> is tracked;{' '}
								<mark>fn</mark> runs untracked on each change.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/syncEffect">syncEffect</a>
							</td>
							<td>fn</td>
							<td>void</td>
							<td>
								like <mark>effect</mark>, but re-runs
								synchronously instead of being queued.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/asyncEffect">asyncEffect</a>
							</td>
							<td>{`(previous: Promise<any> | undefined) => any`}</td>
							<td>void</td>
							<td>
								effect for async work. Receives the previous
								run's promise — <mark>await</mark> it to
								serialise.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/listener">listener</a>
							</td>
							<td>()</td>
							<td>current listener | undefined</td>
							<td>
								the currently-running reactive listener, or{' '}
								<mark>undefined</mark>. Introspection helper.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/untrack">untrack</a>
							</td>
							<td>fn</td>
							<td>return value of fn</td>
							<td>
								runs <mark>fn</mark> without subscribing to
								any signal it reads.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/batch">batch</a>
							</td>
							<td>fn</td>
							<td>return value of fn</td>
							<td>
								groups writes so dependents re-run once at the
								end of <mark>fn</mark>.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/action">action</a>
							</td>
							<td>(...cbs)</td>
							<td>function</td>
							<td>
								pipeline factory. Each stage receives the
								previous resolved value; cancels on owner
								disposal.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/catchError">catchError</a>
							</td>
							<td>(fn, onError)</td>
							<td>return value of fn | undefined</td>
							<td>
								programmatic error boundary. Synchronous and
								reactive throws inside <mark>fn</mark> route
								to <mark>onError</mark>.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/cleanup">cleanup</a>
							</td>
							<td>fn</td>
							<td>fn</td>
							<td>
								runs <mark>fn</mark> when the current scope
								disposes. LIFO order.
							</td>
						</tr>

						<tr>
							<td>
								<a href="/Reactivity/owned">owned</a>
							</td>
							<td>(fn, onCancel?)</td>
							<td>function</td>
							<td>
								captures the current owner. The wrapped
								function re-runs under that owner if alive,
								or calls <mark>onCancel</mark> if disposed.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/withValue">withValue</a>
							</td>
							<td>(value, fn)</td>
							<td>void</td>
							<td>
								resolves a value / signal / promise / array
								and calls <mark>fn(resolved)</mark>; re-runs
								reactively when needed.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/isResolved">isResolved</a>
							</td>
							<td>(...deriveds)</td>
							<td>boolean</td>
							<td>
								<mark>true</mark> once every passed{' '}
								<mark>derived</mark> has committed at least
								once.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/map">map</a>
							</td>
							<td>(iterable, callback, noSort?, fallback?, reactiveIndex?)</td>
							<td>rendered output</td>
							<td>
								reactive <mark>array.map</mark>. Re-runs the
								callback only for added/removed/changed
								entries. Powers <mark>&lt;For/&gt;</mark>.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
