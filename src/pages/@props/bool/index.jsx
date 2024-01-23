import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="bool:__">
				Forces the attribute to be assigned as empty when thurthy and
				its removed when falsy
			</Header>

			<Section title="Snippet">
				<p>bool attribute test</p>
				<Code url="/pages/@props/bool/snippet.jsx"></Code>
			</Section>
		</>
	)
}
