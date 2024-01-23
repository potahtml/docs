import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="bind">
				<mark>bind</mark> is a plugin for binding the value of a form
				field to a signal
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/@plugins/bind/snippet.jsx"></Code>
			</Section>
		</>
	)
}
