import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="intersection">
				<mark>pota/use/intersection</mark> wraps{' '}
				<mark>IntersectionObserver</mark> behind the same{' '}
				<mark>use* / on*</mark> pair you find on other
				document-level emitters (
				<a href="/use/fullscreen">fullscreen</a>,{' '}
				<a href="/use/orientation">orientation</a>, etc.), plus
				two ref factories you can attach with{' '}
				<a href="/use/ref">use:ref</a>.
			</Header>

			<p>
				Multiple subscribers on the same node share one
				observer. Cleanup happens automatically when the owning
				scope disposes — the observer disconnects once the last
				subscriber unmounts.
			</p>

			<Section title="Exports">
				<Code
					code={`import {
  // module-level (Emitter pair, signal-backed)
  useVisible,    // useVisible(node, opts?) → signal accessor
  onVisible,     // onVisible(node, fn, opts?)

  // ref factories
  visible,       // visible(handler, opts?) → (node) => void
  lazyImage,     // lazyImage({ src?, rootMargin? }?) → (node) => void
} from 'pota/use/intersection'`}
					render={false}
				/>
			</Section>

			<Section title="Reveal-on-scroll">
				<p>
					Attach <mark>visible(handler)</mark> with{' '}
					<mark>use:ref</mark> and the handler fires with each{' '}
					<mark>IntersectionObserverEntry</mark> change. The
					second argument is forwarded to{' '}
					<mark>IntersectionObserver</mark> as the options
					bag (<mark>root</mark>, <mark>rootMargin</mark>,{' '}
					<mark>threshold</mark>), plus a pota-specific{' '}
					<mark>once</mark>: when <mark>true</mark>, the
					handler fires once on the first intersection and
					then auto-unsubscribes. Handy for{' '}
					<mark>reveal-on-scroll</mark> styles that only need
					to flip a class once.
				</p>
				<Code url="/pages/@use/intersection/reveal.jsx"></Code>
			</Section>

			<Section title="Lazy-loading images">
				<p>
					<mark>lazyImage()</mark> is a one-shot factory for{' '}
					<mark>&lt;img&gt;</mark>: it swaps{' '}
					<mark>src</mark> from <mark>data-src</mark> (or{' '}
					<mark>opts.src</mark>) the first time the element
					enters the viewport, then disconnects the observer.
				</p>
				<Code url="/pages/@use/intersection/lazy.jsx"></Code>
			</Section>

			<Section title="Module-level pair (Emitter)">
				<p>
					When you have a ref to a node already (e.g. from{' '}
					<a href="/use/ref">use:ref</a>), use{' '}
					<mark>useVisible(node)</mark> for a signal
					accessor that re-runs effects on every change, or{' '}
					<mark>onVisible(node, fn)</mark> for a side-effect
					callback.
				</p>
				<Code url="/pages/@use/intersection/snippet.jsx"></Code>
			</Section>
		</>
	)
}
