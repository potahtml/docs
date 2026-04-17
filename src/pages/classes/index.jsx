import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Classes">
				If a component class fits your use case, extend{' '}
				<mark>Pota</mark> and render the class as you would any
				component.
			</Header>

			<p>
				If the subclass defines a <mark>ready()</mark> or{' '}
				<mark>cleanup()</mark> method, pota calls them at the
				matching lifecycle points — you don't need to register them
				manually.
			</p>

			<Section title="Example">
				<p>Testing a Class</p>
				<Code url="/pages/classes/test.jsx"></Code>
			</Section>
		</>
	)
}
