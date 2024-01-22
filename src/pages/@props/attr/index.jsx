import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="attr:__">
				Forces the attribute to be assigned to the Element as an
				attribute.
			</Header>

			<Section title="Custom Web Component">
				<p>
					Toggles an attribute based on a signal on a custom web
					element
				</p>
				<Code url="/pages/@props/attr/test.jsx"></Code>
			</Section>

			<Section title="Extended">
				<p>Some special properties</p>
				<Code url="/pages/@props/prop/test2.jsx"></Code>
			</Section>
		</>
	)
}
