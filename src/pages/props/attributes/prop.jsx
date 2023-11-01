import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="prop:__">
				<p>
					Forces the attribute to be assigned to the Element as a
					property.
				</p>
			</Header>

			<Section title="Textarea">
				<p>Setting the value on a textarea</p>
				<Code url="/pages/props/attributes/prop/test.jsx"></Code>
			</Section>

			<Section title="Extended">
				<p>Some special properties</p>
				<Code url="/pages/props/attributes/prop/test2.jsx"></Code>
			</Section>
		</>
	)
}
