import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="html">
				<mark>html</mark> or <mark>template</mark>, is a handy
				function to make components from cached tagged templates.
			</Header>

			<Section title="No JSX">
				<p>Making a tagged component</p>
				<Code url="/pages/rendering/html/usage.jsx"></Code>
			</Section>

			<Section title="Reactive Tagged Template">
				<p>Making a reactive tagged template without using JSX</p>
				<Code url="/pages/rendering/html/template.jsx"></Code>
			</Section>

			<Section title="Reactive Tagged Template With JSX">
				<p>Making a reactive tagged template that uses JSX</p>
				<Code url="/pages/rendering/html/jsx.jsx"></Code>
			</Section>

			<Section title="Custom Element">
				<p>Making a custom element</p>
				<Code url="/pages/rendering/html/custom-element.jsx"></Code>
			</Section>
		</>
	)
}
