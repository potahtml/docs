import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="template">
				<p>
					Handy function to make components from cached tagged
					templates. The functionality is very basic and only supports
					native elements as strings.
				</p>
			</Header>

			<Section title="No JSX">
				<p>Making a tagged component</p>
				<Code url="/pages/rendering/template/usage.jsx"></Code>
			</Section>

			<Section title="Reactive Tagged Template">
				<p>Making a reactive tagged template without using JSX</p>
				<Code url="/pages/rendering/template/template.jsx"></Code>
			</Section>

			<Section title="Reactive Tagged Template With JSX">
				<p>Making a reactive tagged template that uses JSX</p>
				<Code url="/pages/rendering/template/jsx.jsx"></Code>
			</Section>
		</>
	)
}
