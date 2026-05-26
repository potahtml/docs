import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Emitter">
				<mark>Emitter</mark> from{' '}
				<mark>pota/use/emitter</mark> is the small class behind
				every <mark>useX</mark> / <mark>onX</mark> pair in pota
				(<a href="/use/fullscreen">fullscreen</a>,{' '}
				<a href="/use/visibility">visibility</a>,{' '}
				<a href="/use/orientation">orientation</a>,{' '}
				<a href="/use/resize">resize</a>,{' '}
				<a href="/use/focus">focus</a>, and the element-keyed
				observers in <a href="/use/intersection">intersection</a>{' '}
				/ <a href="/use/mutation">mutation</a>). It wraps an
				event/observer source as a signal-backed reactive
				value, sets it up on the first subscriber, and tears
				it down when the last subscriber's owner cleans up.
			</Header>

			<Section title="Constructor">
				<Code
					code={`import { Emitter } from 'pota/use/emitter'

const e = new Emitter({
  on: dispatch => {
    // first subscriber arrived — set up source
    const handler = arg => dispatch(arg)
    target.addEventListener('something', handler)

    // return a teardown — called when the last subscriber leaves
    return () => target.removeEventListener('something', handler)
  },
  initialValue: () => readSourceSynchronously(),
})`}
					render={false}
				/>
				<p>
					<mark>on</mark> is called the first time someone
					subscribes; it receives a <mark>dispatch</mark>{' '}
					function it should call whenever the source produces
					a new value. The function returned from{' '}
					<mark>on</mark> is the teardown, called when the
					last subscriber unmounts.
				</p>
				<p>
					<mark>initialValue</mark> is optional. Without it,
					the first reactive read sees{' '}
					<mark>undefined</mark> until the source fires. With
					it, subscribers get a usable value immediately. Pass
					a function so the read happens lazily, inside the
					emitter's setup (not at module load).
				</p>
			</Section>

			<Section title="Public API">
				<Code
					code={`const value = e.use()      // signal accessor — re-runs effects on change
e.on(value => {})         // side-effect callback — fired on change`}
					render={false}
				/>
				<p>
					<mark>use()</mark> returns a signal accessor — read
					it from inside an <mark>effect</mark> or directly in
					JSX (as a function) to track the value.{' '}
					<mark>on(fn)</mark> wraps the same accessor in an
					effect and forwards the value to your callback.
					Either form counts as one subscriber.
				</p>
			</Section>

			<Section title="Lifecycle (subscriber counting)">
				<p>
					<mark>Emitter</mark> counts active subscribers.{' '}
					<mark>on</mark> runs once when the counter goes
					from <mark>0 → 1</mark>; the returned teardown
					runs when it falls back to <mark>0</mark>. Multiple
					components can call <mark>use()</mark> /{' '}
					<mark>on()</mark> and share the underlying source.
				</p>
				<p>
					Each <mark>use</mark> / <mark>on</mark> call
					registers a <mark>cleanup</mark> in the current
					reactive scope, so disposal happens automatically
					when the owning component or root unmounts. Don't
					manually subscribe outside of a tracked scope.
				</p>
			</Section>

			<Section title="Document-level emitter (single instance)">
				<p>
					Document-singletons — visibility, orientation,
					fullscreen, document size — instantiate one{' '}
					<mark>Emitter</mark> at module load and destructure
					the pair:
				</p>
				<Code
					code={`import { Emitter } from 'pota/use/emitter'

export const { on: onDocumentVisible, use: useDocumentVisible } =
  new Emitter({
    on: dispatch => {
      const handler = () => dispatch(document.visibilityState === 'visible')
      document.addEventListener('visibilitychange', handler)
      return () => document.removeEventListener('visibilitychange', handler)
    },
    initialValue: () => document.visibilityState === 'visible',
  })`}
					render={false}
				/>
			</Section>

			<Section title="Element-level emitter (one per node)">
				<p>
					For per-element observers, key an Emitter per node
					(here with a <mark>WeakMap</mark>) so multiple
					subscribers on the same element share one observer
					and disconnect together:
				</p>
				<Code
					code={`import { Emitter } from 'pota/use/emitter'

const emitters = new WeakMap()

const getEmitter = node => {
  let e = emitters.get(node)
  if (!e) {
    e = new Emitter({
      on: dispatch => {
        const io = new IntersectionObserver(
          entries => dispatch(entries[0]),
        )
        io.observe(node)
        return () => io.disconnect()
      },
    })
    emitters.set(node, e)
  }
  return e
}

export const useVisible = node => getEmitter(node).use()
export const onVisible = (node, fn) =>
  getEmitter(node).on(entry => {
    if (entry !== undefined) fn(entry)
  })`}
					render={false}
				/>
				<p>
					This is the pattern used by{' '}
					<a href="/use/intersection">intersection</a>,{' '}
					<a href="/use/mutation">mutation</a>, and the
					element-level half of{' '}
					<a href="/use/resize">resize</a>.
				</p>
			</Section>

			<Section title="Initial-undefined quirk">
				<p>
					If <mark>initialValue</mark> is omitted, the signal
					is initialized to <mark>undefined</mark>. The first
					effect run sees that placeholder before the source
					has fired. Two ways to handle it:
				</p>
				<ol>
					<li>
						Provide <mark>initialValue</mark> when a
						synchronous read of the source is possible
						(visibility, orientation, fullscreen — see{' '}
						<a href="/use/visibility">visibility</a> for
						the pattern).
					</li>
					<li>
						Filter at the public API: the{' '}
						<mark>on*</mark> wrappers in{' '}
						<a href="/use/intersection">intersection</a> /{' '}
						<a href="/use/mutation">mutation</a> guard with{' '}
						<mark>{`if (entry !== undefined) fn(entry)`}</mark>{' '}
						because observers can't be read synchronously
						before they fire.
					</li>
				</ol>
			</Section>
		</>
	)
}
