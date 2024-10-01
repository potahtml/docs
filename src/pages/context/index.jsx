import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Context">
				Context holds data in the reactive scope for use in reactions,
				or to avoid <em>prop drilling</em>
			</Header>

			<Section title="Snippet">
				<Code
					url="/pages/context/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Example">
				<p>Using and testing context</p>
				<Code url="/pages/context/test.jsx"></Code>
			</Section>

			<Section title="Another Test">
				<Code url="/pages/context/provider.jsx"></Code>
			</Section>
		</>
	)
}
