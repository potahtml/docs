import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="fullscreen">
				<mark>fullscreen(target?)</mark> from{' '}
				<mark>pota/use/fullscreen</mark> returns a ref function
				that toggles fullscreen on click. With no argument the
				element it's attached to goes fullscreen. Pass an
				element, or a function returning one, to target
				something else (e.g. a button that fullscreens a nearby{' '}
				<mark>&lt;video&gt;</mark>).
			</Header>

			<Section title="Toggle fullscreen on a stage">
				<p>
					<mark>fullscreen()</mark> toggles the element
					itself; pass a function to choose a different
					target (the example fullscreens a sibling stage
					element). The <mark>useFullscreen()</mark> accessor
					reports the current fullscreen element (or{' '}
					<mark>null</mark>).
				</p>
				<Code url="/pages/@use/fullscreen/stage.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@use/fullscreen/snippet.jsx"></Code>
			</Section>
		</>
	)
}
