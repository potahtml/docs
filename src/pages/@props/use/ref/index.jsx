import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:ref">
				<mark>ref</mark> is a small helper for getting a reference to
				an element via an attribute. It's a signal that can be used in
				places like effects. The ref will be set as soon as the
				element is created, before childrens are created. Be aware
				that properties like <mark>clientWidth</mark> may return 0.
				See mounted ref example here.
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/use/ref/snippet.jsx"></Code>
			</Section>

			<Section title="Mounted Ref">
				<Code url="/pages/@props/use/ref/mounted.jsx"></Code>
			</Section>
		</>
	)
}
