import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="propsSplit">
				<p>
					The <mark>propsSplit</mark> function helps to ungroup
					objects. You may use destructuring instead as this library
					doesnt use getters. This API is provided for convencience.
				</p>
			</Header>

			<Section title="Snippet">
				<Code
					url="/pages/props/split/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Split and Merge Props Test">
				<Code url="/pages/props/split/test.jsx"></Code>
			</Section>
		</>
	)
}
