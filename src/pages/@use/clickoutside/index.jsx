import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:clickoutside">
				Runs the callback on a <mark>pointerdown</mark> anywhere
				outside the element. "Outside" means{' '}
				<mark>!node.contains(event.target)</mark>, so clicks inside
				descendants (including rendered portals that end up inside
				the node) don't fire.
			</Header>

			<p>
				Companion: <mark>use:clickoutsideonce</mark> is the same
				but auto-removes after the first match — useful for
				dismissible overlays.
			</p>

			<Section title="Snippet">
				<Code url="/pages/@use/clickoutside/snippet.jsx"></Code>
			</Section>
		</>
	)
}
