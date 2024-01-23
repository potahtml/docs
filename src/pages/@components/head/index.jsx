import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Head ...</Tag>}>
				Renders its children on <mark>document.head</mark>. It
				replaces any <mark>title</mark> and <mark>meta</mark> with{' '}
				<mark>content</mark>, <mark>property</mark>, or{' '}
				<mark>rel="canonical"</mark> attributes, as these tags should
				be unique.
			</Header>

			<Section title="Snippet">
				<Code
					url="/pages/@components/head/snippet.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
