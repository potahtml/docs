import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:bind">
				<mark>use:bind</mark> is a plugin for binding the value of a
				form field to a signal. It also accepts arrays.
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@use/bind/snippet.jsx"></Code>
			</Section>
		</>
	)
}
