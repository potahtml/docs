import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="scroll">
				<mark>pota/use/scroll</mark> exports{' '}
				<mark>scrollIntoView</mark> as a ref factory plus a
				handful of imperative scrolling helpers — element
				targeting, hash-driven scroll, and scroll-to-top.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  // ref factory
  scrollIntoView,

  // imperative helpers
  scrollToElement,
  scrollToSelector,
  scrollToSelectorWithFallback,
  scrollToLocationHash,
  scrollToTop,
} from 'pota/use/scroll'`}
					render={false}
				/>
			</Section>

			<Section title="scrollIntoView — on mount">
				<p>
					<mark>scrollIntoView(opts?)</mark> returns a ref
					function that calls{' '}
					<mark>node.scrollIntoView(opts)</mark> after the
					element is mounted. Options are forwarded verbatim
					to the DOM method — pass{' '}
					<mark>{`{ behavior: 'smooth', block: 'center' }`}</mark>{' '}
					for a centered scroll, or a boolean to use the
					two-argument form.
				</p>
				<Code url="/pages/@use/scroll/into-view.jsx"></Code>
			</Section>

			<Section title="Imperative helpers">
				<p>
					Use the imperative helpers when you don't have a
					ref-factory opportunity — handling a click,
					responding to a route change, etc.
				</p>
				<ul>
					<li>
						<mark>scrollToElement(node)</mark> — reset{' '}
						<mark>scrollTop</mark> and call{' '}
						<mark>scrollIntoView(true)</mark>
					</li>
					<li>
						<mark>scrollToSelector(selector)</mark> — find
						via <mark>querySelector</mark>; returns{' '}
						<mark>true</mark> on success
					</li>
					<li>
						<mark>scrollToSelectorWithFallback(selector)</mark>{' '}
						— same, falls back to{' '}
						<mark>scrollToTop()</mark> on miss
					</li>
					<li>
						<mark>scrollToLocationHash()</mark> — scrolls
						to <mark>window.location.hash</mark> if a match
						exists
					</li>
					<li>
						<mark>scrollToTop()</mark> —{' '}
						<mark>{`window.scrollTo({ top: 0 })`}</mark>
					</li>
				</ul>
			</Section>
		</>
	)
}
