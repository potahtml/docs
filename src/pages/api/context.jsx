import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="Context">
				<p>
					Context holds data in the reactive context for use in
					reactions or to avoid <em>prop drilling</em>
				</p>
			</Header>

			<Section title="Snippet">
				<Code
					url="/pages/api/context/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Example">
				<p>Using and testing context</p>
				<Code url="/pages/api/context/test.jsx"></Code>
			</Section>

			<Section title="Another Test">
				<Code url="/pages/api/context/provider.jsx"></Code>
			</Section>
		</>
	)
}
