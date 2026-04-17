import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="on:__">
				Attaches a native or custom event listener. The part after{' '}
				<mark>on:</mark> is the event name and is{' '}
				<strong>case-sensitive</strong> (<mark>on:click</mark> and{' '}
				<mark>on:Click</mark> listen to different events). The
				value can be a function, an object with{' '}
				<mark>{'{ handleEvent, once?, passive?, capture? }'}</mark>
				, or an array of either to register multiple handlers on
				the same event.
			</Header>

			<Section title="Using Native Events">
				<Code url="/pages/@props/event-listener-native/test.jsx"></Code>
			</Section>
		</>
	)
}
