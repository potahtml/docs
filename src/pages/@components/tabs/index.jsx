import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Tabs ...</Tag>}>
				Accesible, nestable <mark>Tabs</mark> component by{' '}
				<a href="https://github.com/boredofnames">@boredofnames</a>.
			</Header>

			<ul>
				<li>
					<mark>labels</mark> are wrapped in a <mark>nav</mark>{' '}
					element
				</li>
				<li>
					a <mark>label</mark> is a <mark>button</mark> element
				</li>
				<li>
					<mark>panels</mark> are not wrapped
				</li>
				<li>
					a <mark>panel</mark> is a <mark>section</mark> element
				</li>
				<li>props are forwarded to the elements</li>
				<li>
					<mark>Tabs.selected</mark> is a <mark>function</mark> that
					returns the signal to the selected tab
				</li>
			</ul>

			<Section title="Snippet">
				<Code url="/pages/@components/tabs/snippet.jsx"></Code>
			</Section>
		</>
	)
}
