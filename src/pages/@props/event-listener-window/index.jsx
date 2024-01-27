import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="on__">
				<mark>on__</mark> is for adding events that are present on{' '}
				<mark>window</mark>. For adding custom events see{' '}
				<mark>
					<a href="/props/on%3A__">on:__</a>
				</mark>
			</Header>

			<Section title="Using Window Events">
				<Code url="/pages/@props/event-listener-window/test.jsx"></Code>
			</Section>
		</>
	)
}
