import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="effect">
				<mark>effect(fn)</mark> runs <mark>fn</mark> once and again
				every time anything it read changes. Use it for
				side-effects that mirror reactive state into the outside
				world — logging, persistence, subscriptions, third-party
				libraries. Prefer{' '}
				<a href="/Reactivity/memo">memo</a> /{' '}
				<a href="/Reactivity/derived">derived</a> when you can
				derive a value instead of imperatively pushing it.
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
							<td>fn</td>
							<td>() {'=>'} void</td>
							<td>
								function whose tracked reads become the effect's
								dependencies. Re-runs after any tracked signal
								changes — scheduled, not synchronous (use{' '}
								<a href="/Reactivity/syncEffect">syncEffect</a>{' '}
								if you need synchronous re-runs).
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> <mark>void</mark>. The effect lives until
					its owner is disposed; pair imperative setup with{' '}
					<a href="/cleanup">cleanup</a> to detach listeners or
					timers when the scope tears down. For deferred
					callbacks (timers, promise continuations) that should
					become no-ops once the owner is gone, see{' '}
					<a href="/Reactivity/owned">owned</a>.
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@reactivity/effect/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Log on change">
				<p>
					Run a side-effect every time tracked state updates. Each
					click fires the effect — the console line lands{' '}
					<em>after</em> the click handler returns because effects
					are scheduled.
				</p>
				<Code url="/pages/@reactivity/effect/log.jsx"></Code>
			</Section>

			<Section title="Persist a signal to localStorage">
				<p>
					The effect re-runs whenever <mark>theme()</mark>{' '}
					changes and writes the new value to storage. The initial
					run also performs the first write, so the stored value
					stays in sync from the moment the component mounts.
				</p>
				<Code url="/pages/@reactivity/effect/storage.jsx"></Code>
			</Section>

			<Section title="Subscribe with cleanup">
				<p>
					<mark>cleanup</mark> registers a callback to run when the
					surrounding owner is disposed (a parent unmount, a
					re-rendered branch, or <mark>render()</mark>'s returned
					disposer being called). It's the right place to detach
					listeners or cancel subscriptions opened inside an
					effect.
				</p>
				<Code url="/pages/@reactivity/effect/subscribe.jsx">
					Move the pointer to see <mark>x</mark>/<mark>y</mark>{' '}
					update; unmount the app and the listener detaches.
				</Code>
			</Section>

			<Section title="Debounced effect">
				<p>
					When an effect should react to rapid signal changes
					(typing in a search box, dragging a slider) but the
					side-effect is expensive, debounce it.{' '}
					<a href="/use/time">useTimeout</a> from{' '}
					<mark>pota/use/time</mark> is owner-aware: its returned
					timer cancels automatically when the surrounding scope
					disposes. Restarting the timer on every change
					implements debounce.
				</p>
				<Code url="/pages/@reactivity/effect/debounced.jsx"></Code>
			</Section>
		</>
	)
}
