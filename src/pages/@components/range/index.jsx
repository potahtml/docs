import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Range ...</Tag>}>For ranges..</Header>

			<Section title="Simple Test">
				<p>
					Use a <mark>Range</mark> to display some values, blink
					updates
				</p>
				<Code url="/pages/@components/range/simple.jsx"></Code>
			</Section>
		</>
	)
}
