import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="animate">
				<mark>pota/use/animate</mark> swaps CSS classes (or
				<mark> part</mark> tokens) on an element and returns a
				promise that resolves when the resulting CSS animation
				finishes — or immediately, if no animation is running.
				Useful for chaining state changes after an{' '}
				<mark>enter</mark> / <mark>exit</mark> transition
				without watching <mark>animationend</mark> by hand.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  animateClassTo,     // animateClassTo(el, oldClass, newClass) → Promise<void>
  animatePartTo,      // animatePartTo(el, oldPart,  newPart)   → Promise<void>
  stopAnimations,     // stopAnimations(el) → Animation[] (the ones canceled)
  documentKeyframes,  // documentKeyframes() → { [name]: CSSRuleList }
  useAnimationFrame,  // useAnimationFrame(fn) → { start, stop }
} from 'pota/use/animate'`}
					render={false}
				/>
			</Section>

			<Section title="How it works">
				<ol>
					<li>
						Schedules the swap on{' '}
						<mark>requestAnimationFrame</mark> so the class
						change is observed by the next paint.
					</li>
					<li>
						Removes <mark>oldClass</mark> (or{' '}
						<mark>oldPart</mark>) and adds the new one.
					</li>
					<li>
						If <mark>element.getAnimations()</mark> reports
						at least one running animation, waits for{' '}
						<mark>animationend</mark> on that element via{' '}
						<a href="/use/event">waitEvent</a>; otherwise
						resolves immediately. That makes it safe to{' '}
						<mark>await</mark> when the swap may or may not
						produce a transition.
					</li>
				</ol>
			</Section>

			<Section title="animateClassTo — fade between states">
				<Code url="/pages/@use/animate/class-to.jsx"></Code>
			</Section>

			<Section title="stopAnimations — cancel everything running on an element">
				<p>
					<mark>stopAnimations(element)</mark> calls{' '}
					<mark>.cancel()</mark> on every animation reported by{' '}
					<mark>element.getAnimations()</mark> — CSS animations,
					CSS transitions, and Web Animations API instances —
					and returns the array that was canceled. Useful before
					swapping classes to make sure a previous transition
					doesn't fight the new one. <mark>await</mark>{' '}
					<mark>Promise.all(...)</mark> on the returned list's{' '}
					<mark>.finished</mark> if you need to wait for the
					cancellation to settle.
				</p>
				<Code
					code={`import { stopAnimations } from 'pota/use/animate'

const cancelled = stopAnimations(card)
// re-trigger from a clean state
card.classList.add('pulse')`}
					render={false}
				/>
			</Section>

			<Section title="documentKeyframes — introspect @keyframes rules">
				<p>
					<mark>documentKeyframes()</mark> walks both{' '}
					<mark>document.styleSheets</mark> and{' '}
					<mark>document.adoptedStyleSheets</mark> and returns a
					map of every <mark>@keyframes</mark> rule keyed by
					name. Cross-origin stylesheets are skipped silently
					(reading their <mark>cssRules</mark> throws). Intended
					for inspection / tooling — not for runtime hot paths.
				</p>
				<Code
					code={`import { documentKeyframes } from 'pota/use/animate'

const map = documentKeyframes()
Object.keys(map)            // ['fade-in', 'pulse', ...]
map['fade-in']              // CSSRuleList of the keyframe steps`}
					render={false}
				/>
			</Section>

			<Section title="useAnimationFrame — owned rAF loop">
				<p>
					<mark>useAnimationFrame(fn)</mark> drives{' '}
					<mark>fn(timestamp)</mark> once per animation frame.
					Returns <mark>{`{ start, stop }`}</mark>; does{' '}
					<em>not</em> start automatically; auto-stops on scope
					dispose. <mark>fn</mark> may call <mark>stop()</mark>{' '}
					(or <mark>start()</mark>) to break out of or restart
					the loop synchronously — the next frame is scheduled
					before <mark>fn</mark> runs so the cancel inside takes
					effect immediately.
				</p>
				<Code
					code={`import { useAnimationFrame } from 'pota/use/animate'

const loop = useAnimationFrame(t => {
  // draw at frame timestamp t
})
loop.start()
// loop.stop() to pause; auto-stops on dispose`}
					render={false}
				/>
			</Section>

			<Section title="animatePartTo — same shape, but with parts">
				<p>
					<mark>animatePartTo</mark> is the{' '}
					<mark>part</mark> equivalent — useful when you're
					styling shadow-DOM custom elements from outside
					with <mark>::part(...)</mark> selectors.
				</p>
				<Code
					code={`import { animatePartTo } from 'pota/use/animate'

await animatePartTo(card, 'idle', 'pulse')
card.dispatchEvent(new CustomEvent('pulse-done'))`}
					render={false}
				/>
			</Section>
		</>
	)
}
