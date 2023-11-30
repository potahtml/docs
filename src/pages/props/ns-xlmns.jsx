import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="ns:__ / xmlns">
				The <mark>xmlns</mark> attribute is copied to children. Which
				means it supports by default most kinds of xmls: SVG, MathML,
				with its fancy namespaces.
			</Header>

			<Section title="SVG">
				<p>SVG + xlink</p>
				<Code url="/pages/props/ns-xml/test-xml.jsx"></Code>
			</Section>

			<Section title="Showing XML Test">
				<p>
					Testing if keeps the parent xmlns using a toggling{' '}
					<mark>Show</mark>
				</p>
				<Code url="/pages/props/ns-xml/xmlns.jsx"></Code>
			</Section>
		</>
	)
}
