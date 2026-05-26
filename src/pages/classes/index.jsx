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

			<Section title="Counter class component">
				<p>
					Define a <mark>render(props)</mark> method and instances
					are created automatically when JSX uses the class. If
					you also define <mark>ready()</mark> or{' '}
					<mark>cleanup()</mark> methods, the renderer wires them
					up for you. The instance has <mark>this.props</mark>{' '}
					available; signals stored as instance fields work the
					same as in function components.
				</p>
				<Code url="/pages/classes/counter.jsx"></Code>
			</Section>

			<Section title="Example">
				<p>Testing a Class</p>
				<Code url="/pages/classes/test.jsx"></Code>
			</Section>
		</>
	)
}
