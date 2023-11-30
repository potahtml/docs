import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="on:__">
				<mark>on:__</mark> is for native events. For delegated events
				see <mark>on__</mark>. Native events are attached to the{' '}
				<mark>element</mark> only once. Native events <b>are</b>{' '}
				case-sensitive.
			</Header>

			<p>
				Handlers can carry aditional arguments/data in the form of
				arrays.
			</p>

			<Section title="Using Native Events">
				<Code url="/pages/props/events/native/test.jsx"></Code>
			</Section>

			<Section title="Stop Propagation">
				<p>Testing stop propagation</p>
				<Code url="/pages/props/events/delegate/stop-propagation.jsx"></Code>
			</Section>
		</>
	)
}
