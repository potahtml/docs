import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="propsSplit">
				The <mark>propsSplit</mark> function helps to ungroup objects.
				You may use destructuring instead as this library doesnt use
				getters. This API is provided for convencience.
			</Header>

			<Section title="Snippet">
				<Code
					url="/pages/@props/props-split/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Split and Merge Props Test">
				<Code url="/pages/@props/props-split/test.jsx"></Code>
			</Section>
		</>
	)
}
