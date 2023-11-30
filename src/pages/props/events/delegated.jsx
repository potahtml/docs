import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="on__">
				<mark>on__</mark> is for delegated events. For native events
				see <mark>on:__</mark>. Delegated events are attached to the{' '}
				<mark>document</mark>, then dispatched to the relevant
				elements by walking the target parentNode.{' '}
				<mark>currentTarget</mark> is updated to the relevant target.
			</Header>

			<p>
				Handlers can carry aditional arguments/data in the form of
				arrays.
			</p>

			<Section title="Using Delegated Events">
				<Code url="/pages/props/events/delegate/test.jsx"></Code>
			</Section>

			<Section title="Removal of Delegated Events on Disposal">
				<p>Disposal test</p>
				<Code url="/pages/props/events/delegate/disposal.jsx"></Code>
			</Section>

			<Section title="Stop Propagation">
				<p>Testing stop propagation</p>
				<Code url="/pages/props/events/delegate/stop-propagation.jsx"></Code>
			</Section>
		</>
	)
}
