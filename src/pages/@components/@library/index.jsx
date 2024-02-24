import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Component Library">
				The Component Library uses custom elements to provide
				behaviour and basic styling for some very common things.
			</Header>

			<p>
				The library is influenced (with modifications) by{' '}
				<a href="https://shoelace.style/">shoelace</a> adapted for
				pota.
			</p>

			<Section title="alert">
				<ol>
					<li>
						<p>
							<a href="/Components/Library/alert">Alerts</a> are used
							to display messages that require attention
						</p>
					</li>
				</ol>

				<Code
					preview={false}
					code={`
import { render } from 'pota'

import 'pota/components/alert'


render(
	<main>
		<pota-alert open closable>This is an Alert message that can be closed</pota-alert>
	</main>)
					`}
				></Code>
			</Section>
		</>
	)
}
