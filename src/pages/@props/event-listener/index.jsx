import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="addEvent / removeEvent">
				Imperative event-listener helpers. Use them outside JSX (in
				effects, lifecycles, or standalone code) when you need
				<mark> DOM.addEventListener</mark>-like control but tied to
				the reactive scope.
			</Header>

			<Section title="addEvent Arguments">
				<p>
					Returns an <mark>off()</mark> function that removes the
					listener. The same removal is <em>also</em> registered
					as a <mark>cleanup</mark> on the current reactive scope,
					so the listener is torn down automatically when the
					scope is disposed — you don't have to call{' '}
					<mark>off()</mark> manually in most cases.
				</p>
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
							<td>node</td>
							<td>node</td>
							<td>
								reference to the node on which to add the event
								listener
							</td>
						</tr>
						<tr>
							<td>type</td>
							<td>string</td>
							<td>
								event listener to add, example <mark>click</mark>.
								Types are case sensitive, as regular event listeners
							</td>
						</tr>
						<tr>
							<td>handler</td>
							<td>
								fn |{' '}
								{
									'{handleEvent:fn, once?:bool, passive?:bool, etc?:bool}'
								}
							</td>
							<td>handler to run once the event is triggered</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="removeEvent Arguments">
				<p>
					Returns a handy <mark>on</mark> function that uses no
					arguments, to add the event back
				</p>
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
							<td>node</td>
							<td>node</td>
							<td>
								reference to the node from which to remove the event
								listener
							</td>
						</tr>
						<tr>
							<td>type</td>
							<td>string</td>
							<td>
								event listener to remove, example <mark>click</mark>.
								Types are case sensitive, as regular event listeners
							</td>
						</tr>
						<tr>
							<td>handler</td>
							<td>
								fn |{' '}
								{
									'{handleEvent:fn, once?:bool, passive?:bool, etc?:bool}'
								}
							</td>
							<td>
								reference to the handler that has been added using{' '}
								<mark>addEvent</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Auto-detach on disposal">
				<p>
					<mark>addEvent(target, type, handler)</mark> adds the
					listener and registers a cleanup that removes it when
					the surrounding owner disposes — saving you the
					manual{' '}
					<mark>cleanup(() =&gt; removeEventListener(...))</mark>{' '}
					dance. Helpful for global listeners (
					<mark>window</mark>/<mark>document</mark>) that
					components add to react to outside interactions.
				</p>
				<Code url="/pages/@props/event-listener/add-event.jsx"></Code>
			</Section>

			<Section title="Detach early with removeEvent">
				<p>
					<mark>removeEvent(node, type, handler)</mark> removes
					the listener and returns an <mark>on</mark> function
					that re-attaches it. Reach for it when you need to
					detach earlier than the owner's cleanup would — e.g.
					once a one-shot condition is met.
				</p>
				<Code url="/pages/@props/event-listener/remove-event.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@props/event-listener/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Test Events Listeners">
				<Code url="/pages/@props/event-listener/test.jsx"></Code>
			</Section>
		</>
	)
}
