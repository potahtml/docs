import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="on:__">
				<mark>on:__</mark> is for native and custom events such{' '}
				<mark>on:click</mark>. Events <b>are</b> case-sensitive. It
				also accepts arrays of handlers.
			</Header>

			<Section title="Using Native Events">
				<Code url="/pages/@props/event-listener-native/test.jsx"></Code>
			</Section>
		</>
	)
}
