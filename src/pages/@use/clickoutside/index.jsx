import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:clickoutside">
				<mark>use:clickoutside</mark> runs a function when clicking
				outside the element
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@use/clickoutside/snippet.jsx"></Code>
			</Section>
		</>
	)
}
