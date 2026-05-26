import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="mutation">
				<mark>pota/use/mutation</mark> wraps{' '}
				<mark>MutationObserver</mark> behind the same{' '}
				<mark>use* / on*</mark> pair as the other emitter
				modules, plus a <mark>mutated</mark> ref factory you
				attach with <a href="/use/ref">use:ref</a>.
			</Header>

			<p>
				Default <mark>init</mark> is{' '}
				<mark>{`{ childList: true, subtree: true }`}</mark>.
				Pass your own to narrow the scope (attribute changes
				only, character data, specific attribute filter, etc.).
				Multiple subscribers on the same node share one
				observer.
			</p>

			<Section title="Exports">
				<Code
					code={`import {
  // module-level (Emitter pair, signal-backed)
  useMutations, // useMutations(node, init?) → signal accessor
  onMutations,  // onMutations(node, fn, init?)

  // ref factory
  mutated,      // mutated(handler, init?) → (node) => void
} from 'pota/use/mutation'`}
					render={false}
				/>
			</Section>

			<Section title="React to descendant changes">
				<p>
					Attach <mark>mutated(handler)</mark> to a container
					and the handler fires with each batch of{' '}
					<mark>MutationRecord</mark>s. The init bag is
					forwarded verbatim to <mark>MutationObserver</mark>.
				</p>
				<Code url="/pages/@use/mutation/snippet.jsx"></Code>
			</Section>

			<Section title="Attribute-only observation">
				<p>
					Pass a custom <mark>init</mark> to observe only
					attribute changes. Useful for syncing one element's
					state with another, or auditing reactive class /
					style writes.
				</p>
				<Code url="/pages/@use/mutation/attributes.jsx"></Code>
			</Section>
		</>
	)
}
