import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="setStyle">
				<mark>setStyle</mark> is a helper for setting attributes that
				may come from reactive values
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/set-style/snippet.jsx"></Code>
			</Section>
		</>
	)
}
