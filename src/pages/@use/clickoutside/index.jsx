import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="clickOutside">
				<mark>clickOutside(handler)</mark> from{' '}
				<mark>pota/use/clickoutside</mark> returns a ref
				function. Attach it with <mark>use:ref</mark> and the
				handler runs on a <mark>pointerdown</mark> anywhere
				outside the element. "Outside" means{' '}
				<mark>!node.contains(event.target)</mark>, so clicks
				inside descendants (including rendered portals that end
				up inside the node) don't fire.
			</Header>

			<p>
				Pass <mark>{`{ once: true }`}</mark> for single-shot
				dismissal — the listener auto-removes after the first
				match.
			</p>

			<Section title="Close a popover on outside click">
				<p>
					The handler runs whenever a{' '}
					<mark>pointerdown</mark> lands outside the element
					it's attached to. Cleanup is automatic: the
					listener is bound to the element's reactive scope
					and detaches when the element unmounts.
				</p>
				<Code url="/pages/@use/clickoutside/popover.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@use/clickoutside/snippet.jsx"></Code>
			</Section>

			<Section title="Companion: escape">
				<p>
					<mark>escape(handler)</mark>, also exported from{' '}
					<mark>pota/use/clickoutside</mark>, fires when the
					<mark>Escape</mark> key is pressed anywhere in the
					document. Compose it with <mark>clickOutside</mark>{' '}
					for the standard "close-on-outside-click or
					Escape" dismissal pattern.
				</p>
				<Code url="/pages/@use/clickoutside/escape.jsx"></Code>
			</Section>
		</>
	)
}
