import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:fullscreen">
				<mark>use:fullscreen</mark> can fullscreen the element on
				which the prop was added or an arbitraty element given as
				value
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@use/fullscreen/snippet.jsx"></Code>
			</Section>
		</>
	)
}
