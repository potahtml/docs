import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:clipboard">
				<mark>use:clipboard</mark> can copy to the cliboard, the
				return value of a function, a static/dynamic string set as the
				value of the prop, and the element <mark>innerText</mark>
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@use/clipboard/snippet.jsx"></Code>
			</Section>
		</>
	)
}
