import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="autofocus">
				<mark>autofocus</mark> is a plugin for focusing the field.
				Sometimes the built-in autofocus wont focus a field for
				whatever reason.
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/@plugins/autofocus/snippet.jsx"></Code>
			</Section>
		</>
	)
}
