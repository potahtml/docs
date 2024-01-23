import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="setBool">
				<mark>setBool</mark> is a helper for setting boolean
				attributes that may come from reactive values. When the value
				is thruty, it sets an empty attribute. When the value is falsy
				it removes the attribute
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/set-bool/snippet.jsx"></Code>
			</Section>
		</>
	)
}
