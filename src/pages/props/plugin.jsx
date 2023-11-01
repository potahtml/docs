import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="propsPlugin">
				<p>
					<mark>propsPlugin</mark> sets a custom prop that can be used
					on any JSX element. This empowers JSX by allowing you to add
					custom behaviour via props, globally.
				</p>
			</Header>

			<Section title="Snippet">
				<Code url="/pages/props/plugin/snippet.jsx"></Code>
			</Section>
		</>
	)
}
