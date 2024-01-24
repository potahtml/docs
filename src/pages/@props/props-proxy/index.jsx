import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="propsProxy">
				<mark>propsProxy</mark> allows to change on the fly the name
				and/or value of a prop
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/props-proxy/snippet.jsx">
					Shows how to make attributes/properties lit-alike
				</Code>
			</Section>
		</>
	)
}
