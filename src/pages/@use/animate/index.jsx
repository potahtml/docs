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
  animateClassTo,  // animateClassTo(el, oldClass, newClass) → Promise<void>
  animatePartTo,   // animatePartTo(el, oldPart,  newPart)   → Promise<void>
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
