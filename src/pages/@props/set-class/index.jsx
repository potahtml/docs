import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="setClass">
				<mark>setClass</mark> is a helper for setting css classes that
				may come from reactive values
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/set-class/snippet.jsx"></Code>
			</Section>
		</>
	)
}
