import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="resize">
				<mark>pota/use/resize</mark> exposes both
				document-level viewport size (window{' '}
				<mark>resize</mark> event) and element-level resize (
				<mark>ResizeObserver</mark>) behind the same{' '}
				<mark>use* / on*</mark> Emitter pattern, plus a{' '}
				<mark>resize</mark> ref factory for per-element use.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  // document / viewport
  documentSize,
  onDocumentSize,
  useDocumentSize,

  // element-level (ResizeObserver)
  useElementSize,
  onElementSize,
  resize,
} from 'pota/use/resize'`}
					render={false}
				/>
			</Section>

			<Section title="Element resize via use:ref">
				<p>
					<mark>resize(handler)</mark> is the most concise
					form: attach with <mark>use:ref</mark> and the
					handler receives each{' '}
					<mark>ResizeObserverEntry</mark>. Multiple
					subscribers on the same node share a single
					observer.
				</p>
				<Code url="/pages/@use/resize/element.jsx"></Code>
			</Section>

			<Section title="Module-level pair (Emitter)">
				<p>
					When you already have a node reference,{' '}
					<mark>useElementSize(node)</mark> gives you a
					signal accessor that re-runs effects on every
					change; <mark>onElementSize(node, fn)</mark>{' '}
					registers a callback. The callback is{' '}
					<em>not</em> invoked with the pre-observer
					placeholder — only with real entries.
				</p>
				<Code url="/pages/@use/resize/snippet.jsx"></Code>
			</Section>

			<Section title="Viewport size">
				<p>
					<mark>useDocumentSize()</mark> tracks the document
					element's <mark>clientWidth</mark>/
					<mark>clientHeight</mark>; the Emitter is shared,
					so any number of subscribers attach a single
					window <mark>resize</mark> listener.
				</p>
				<Code
					code={`import { documentSize, useDocumentSize } from 'pota/use/resize'

documentSize()      // { width, height } snapshot
const size = useDocumentSize()
// size() in an effect re-runs on every window resize`}
					render={false}
				/>
			</Section>
		</>
	)
}
