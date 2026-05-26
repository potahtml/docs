import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="event">
				<mark>pota/use/event</mark> collects small, low-level
				helpers for working with DOM events: stop helpers you
				can drop into <mark>on:*</mark> handlers, a{' '}
				<mark>CustomEvent</mark> emitter, a promise-based{' '}
				<mark>waitEvent</mark>, and explicit{' '}
				<mark>addEventListener</mark> /{' '}
				<mark>removeEventListener</mark> wrappers that accept
				options objects.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  // stop helpers
  preventDefault,
  stopPropagation,
  stopImmediatePropagation,
  stopEvent,           // all three of the above, in one call

  // dispatch
  emit,                // emit(node, name, data?) → CustomEvent
  waitEvent,           // waitEvent(element, name) → Promise<Event>

  // native add/remove with options support
  addEventNative,
  removeEventNative,
  passiveEvent,        // wrap a handler as { handleEvent, passive: true }
} from 'pota/use/event'`}
					render={false}
				/>
			</Section>

			<Section title="Stop helpers">
				<p>
					Each takes an event and calls the corresponding
					method. <mark>stopEvent(e)</mark> does all three.
					Useful as one-liner handler bodies — or composed
					with other handlers.
				</p>
				<Code url="/pages/@use/event/stop.jsx"></Code>
			</Section>

			<Section title="Custom events with emit">
				<p>
					<mark>emit(node, name, init?)</mark> dispatches a{' '}
					<mark>CustomEvent</mark>. <mark>bubbles</mark>,{' '}
					<mark>cancelable</mark>, and <mark>composed</mark>{' '}
					default to <mark>true</mark>; override by passing
					them in <mark>init</mark>. Listen as you would any
					event: <mark>on:my-event=&#123;handler&#125;</mark>.
				</p>
				<Code url="/pages/@use/event/emit.jsx"></Code>
			</Section>

			<Section title="Promise-based waitEvent">
				<p>
					<mark>waitEvent(element, name)</mark> resolves with
					the next matching event from <mark>element</mark>{' '}
					and removes its listener. If a new{' '}
					<mark>waitEvent</mark> is requested for the same
					element / event before the old one fires, the
					earlier promise is rejected and its listener
					removed — preventing duplicate{' '}
					<mark>transitionend</mark> /{' '}
					<mark>animationend</mark> handlers from piling up.
				</p>
				<Code
					code={`import { waitEvent } from 'pota/use/event'

await waitEvent(element, 'transitionend')
// continue once the transition has completed`}
					render={false}
				/>
			</Section>

			<Section title="Listener add/remove with options">
				<p>
					<mark>addEventNative</mark> and{' '}
					<mark>removeEventNative</mark> are thin wrappers
					over <mark>addEventListener</mark> /{' '}
					<mark>removeEventListener</mark> that accept either
					a plain function or a handler object — when an
					object is passed, the object itself doubles as the
					options bag. Pair with <mark>passiveEvent(fn)</mark>{' '}
					to get a passive listener without writing the
					object literal yourself.
				</p>
				<Code
					code={`import {
  addEventNative,
  removeEventNative,
  passiveEvent,
} from 'pota/use/event'

const handler = passiveEvent(e => console.log('wheel', e.deltaY))

addEventNative(window, 'wheel', handler)
// later:
removeEventNative(window, 'wheel', handler)`}
					render={false}
				/>
				<p>
					These exist because the framework's <mark>on:*</mark>{' '}
					prop already handles JSX events idiomatically — use{' '}
					<mark>addEventNative</mark> when you need a listener
					outside of a JSX element (window / document /
					manually-acquired nodes).
				</p>
			</Section>
		</>
	)
}
