import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Range ...</Tag>}>
				Similar to python <mark>range</mark>, this component runs a
				loop based on <mark>start</mark>, <mark>stop</mark>, and{' '}
				<mark>step</mark> parameters, and passes the current index to
				the callback(s).
			</Header>

			<Section title="Simple Test">
				<p>
					Use a <mark>Range</mark> to display some values
				</p>
				<Code url="/pages/@components/range/simple.jsx"></Code>
			</Section>
		</>
	)
}
