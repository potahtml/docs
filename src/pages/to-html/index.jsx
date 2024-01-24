import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="toHTML">
				Creates and returns HTML elements for anything you pass to it.
				It returns a children rendered or an array of childrens
				rendered. Reactivity will work properly as long as you move
				the group together.
			</Header>

			<Section title="Snippet">
				<Code url="/pages/to-html/snippet.jsx"></Code>
			</Section>
		</>
	)
}
