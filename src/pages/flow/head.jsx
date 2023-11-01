import { Code, Header, Section, Tag } from '#main'

export default function () {
	return (
		<>
			<Header title={<Tag>Head ...</Tag>}>
				<p>
					Renders its children on <mark>document.head</mark>. It
					replaces any <mark>title</mark> and <mark>meta</mark> with{' '}
					<mark>content</mark> and <mark>property</mark> attributes ,
					as these tags should be unique.
				</p>
			</Header>

			<Section title="Snippet">
				<Code url="/pages/flow/head/snippet.jsx"></Code>
			</Section>
		</>
	)
}
