import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Classes">
				If for some reason make sense to use a component class, you
				may do so by extending <mark>Pota</mark>
			</Header>

			<p>
				A class, automatically registers the methods{' '}
				<mark>onReady</mark> and <mark>onCleanup</mark>
			</p>

			<Section title="Example">
				<p>Testing a Class</p>
				<Code url="/pages/classes/test.jsx"></Code>
			</Section>
		</>
	)
}
