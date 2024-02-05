import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="pasteTextPlain">
				<mark>pasteTextPlain</mark> is a plugin for forcing pasting as
				text/plain
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/@plugins/pasteTextPlain/snippet.jsx"></Code>
			</Section>
		</>
	)
}
