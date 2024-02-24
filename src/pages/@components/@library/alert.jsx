import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Component Library / Alert">
				Alerts are used to display messages that require attention
			</Header>

			<Section title="Examples">
				<Code
					code={`

import { render, ref, effect, addEventListener } from 'pota'

import 'pota/components/alert'

const element = ref()

effect(() => {
	if (element()) {
		// listeners for when the element open/close
		addEventListener(element(), 'open', e =>
			console.log('alert is open', e),
		)
		addEventListener(element(), 'close', e =>
			console.log('alert is closed', e),
		)
	}
})
render(
	<main>
		<pota-alert>Alerts arent shown by default</pota-alert>
		<hr />

		<pota-alert open>
			Use \`open\` attribute to show the alert by default
		</pota-alert>
		<hr />

		<pota-alert
			open
			closable
		>
			Use \`closable\` attribute to show a\`close\` button
		</pota-alert>
		<hr />

		<button onClick={() => element().toggle()}>toggle</button>
		<button onClick={() => element().show()}>show</button>
		<button onClick={() => element().hide()}>hide</button>
		<pota-alert ref={element}>
			Use \`element.toggle()\` to toggle the alert. Use \`element.show()\`
			to show the alert. Use \`element.hide()\` to hide the alert.
		</pota-alert>
		<hr />

		<pota-alert
			open
			variant="neutral"
		>
			Use \`variant="neutral"\` to show neutral colors
		</pota-alert>
		<pota-alert
			open
			variant="primary"
		>
			Use \`variant="primary"\` to show primary colors
		</pota-alert>
		<pota-alert
			open
			variant="success"
		>
			Use \`variant="success"\` to show success colors
		</pota-alert>
		<pota-alert
			open
			variant="warning"
		>
			Use \`variant="warning"\` to show warning colors
		</pota-alert>
		<pota-alert
			open
			variant="danger"
		>
			Use \`variant="danger"\` to show danger colors
		</pota-alert>
		<hr />

		<pota-alert
			open
			class="custom"
		>
			custom animation
		</pota-alert>

		<style>
			{\`
/* custom animations */
pota-alert.custom::part(base) {
	animation: scale-fade-out 1s ease-in;
}
pota-alert.custom::part(animation-show) {
	animation: scale-fade-in 1s ease-in;
}
pota-alert.custom::part(animation-hide) {
	animation: scale-fade-out 1s ease-in;
}
\`}
		</style>
	</main>,
)
					`}
				/>
			</Section>

			<Section title="Attributes / Properties">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>type</th>
							<th>default</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>open</td>
							<td>boolean</td>
							<td>false</td>
							<td>to tell if the alert is open</td>
						</tr>
						<tr>
							<td>closable</td>
							<td>boolean</td>
							<td>false</td>
							<td>shows a close button to hide the alert</td>
						</tr>
						<tr>
							<td>duration</td>
							<td>number</td>
							<td>Infinity</td>
							<td>used to close the alert after a timeout</td>
						</tr>
						<tr>
							<td>variant</td>
							<td>primary | success | neutral | warning | danger</td>
							<td>neutral</td>
							<td>modify alert style color</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Methods">
				<table>
					<thead>
						<tr>
							<th>name</th>

							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>show</td>
							<td>to show the alert</td>
						</tr>
						<tr>
							<td>hide</td>
							<td>to hide the alert</td>
						</tr>
						<tr>
							<td>toggle</td>
							<td>to toggle alert</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="::part">
				<p>::part is used to overide the styles of the component</p>
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>pota-alert::part(base)</td>
							<td>the component base</td>
						</tr>
						<tr>
							<td>pota-alert::part(icon-base)</td>
							<td>the icon base</td>
						</tr>
						<tr>
							<td>pota-alert::part(message-base)</td>
							<td>the message base</td>
						</tr>
						<tr>
							<td>pota-alert::part(close-base)</td>
							<td>the close base</td>
						</tr>
						<tr>
							<td>pota-alert::part(close)</td>
							<td>the close button</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="slot">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>default</td>
							<td>the alert message</td>
						</tr>
						<tr>
							<td>icon</td>
							<td>the message icon</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Events">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>open</td>
							<td>emitted when the alert opens</td>
						</tr>
						<tr>
							<td>close</td>
							<td>emitted when the alert closes</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Animations">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>pota-alert::part(animation-show)</td>
							<td>
								to change the <mark>animation-name</mark> for the show
								animation
							</td>
						</tr>
						<tr>
							<td>pota-alert::part(animation-hide)</td>
							<td>
								to change the <mark>animation-name</mark> for the
								close animation
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
