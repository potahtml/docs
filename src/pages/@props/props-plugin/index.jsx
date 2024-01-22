import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="propsPlugin">
				<mark>propsPlugin</mark> and <mark>propsPluginNS</mark> sets a
				custom prop that can be used on any element globally. This
				empowers JSX/HTML by allowing you to add custom behaviour via
				props.
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/props-plugin/snippet.jsx"></Code>
			</Section>
		</>
	)
}
