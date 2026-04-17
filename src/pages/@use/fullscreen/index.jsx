import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:fullscreen">
				Click handler that toggles fullscreen. With no value, the
				element the prop is on goes fullscreen. Pass an element, a
				selector, or a function returning one to target something
				else (e.g. a button that fullscreens a nearby{' '}
				<mark>&lt;video&gt;</mark>).
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@use/fullscreen/snippet.jsx"></Code>
			</Section>
		</>
	)
}
