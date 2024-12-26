import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Component Library / Alert">
				Alerts are used to display messages that require attention
			</Header>

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
							<td>show</td>
							<td>boolean</td>
							<td>false</td>
							<td>to tell if the alert is open</td>
						</tr>
						<tr>
							<td>closable</td>
							<td>boolean</td>
							<td>false</td>
							<td>displays a close button to close the alert</td>
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
							<td>open</td>
							<td>to open the alert</td>
						</tr>
						<tr>
							<td>close</td>
							<td>to close the alert</td>
						</tr>
						<tr>
							<td>toggle</td>
							<td>to toggle alert</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="::part">
				<p>::part is used to override the styles of the component</p>
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
							<td>pota-alert::part(animation-open)</td>
							<td>
								to change the <mark>animation-name</mark> for the open
								animation
							</td>
						</tr>
						<tr>
							<td>pota-alert::part(animation-close)</td>
							<td>
								to change the <mark>animation-name</mark> for the
								close animation
							</td>
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

			<Section title="Open By Default">
				<p>
					Use <mark>show</mark> attribute to open the alert by default
				</p>
				<Code
					code={`

import { render} from 'pota'

import 'pota/components/alert'

render(
	<main>
		<pota-alert show>This Alert is opened by default</pota-alert>
	</main>)`}
				/>
			</Section>

			<Section title="Close Button">
				<p>
					<mark>closable</mark> can be used to display a close button
				</p>
				<Code
					code={`

import { render} from 'pota'

import 'pota/components/alert'

render(
	<main>
		<pota-alert show closable>Click the X to close the alert.</pota-alert>
	</main>)`}
				/>
			</Section>

			<Section title="Toggle, Open and Close">
				<p>
					The alert element provides the methods <mark>toggle</mark>,{' '}
					<mark>open</mark> and <mark>close</mark>.
				</p>
				<Code
					code={`

import { render, ref} from 'pota'

import 'pota/components/alert'

const element = ref()

render(
	<main>

		<button on:click={() => element().toggle()}>toggle</button>
		<button on:click={() => element().open()}>open</button>
		<button on:click={() => element().close()}>close</button>
		<pota-alert ref={element}>
			Use \`element.toggle()\` to toggle the alert. Use \`element.open()\`
			to open the alert. Use \`element.close()\` to close the alert.
		</pota-alert>

	</main>,
)
					`}
				/>
			</Section>

			<Section title="Open and Close events">
				<p>
					You may listen for the
					<mark>open</mark> and <mark>close</mark> events.
				</p>
				<Code
					code={`

import { render, ref, effect, addEvent} from 'pota'

import 'pota/components/alert'

const element = ref()

effect(()=>{
	if(element()){
		addEvent(element(), 'open', () => render(<div>open dispatched</div>))
		addEvent(element(), 'close', () => render(<div>close dispatched</div>))
	}
})

render(
	<main>

		<button on:click={() => element().toggle()}>toggle</button>
		<button on:click={() => element().open()}>open</button>
		<button on:click={() => element().close()}>close</button>
		<pota-alert ref={element}>
			Listening for \`open\` and \`close\` events
		</pota-alert>
	</main>,
)
					`}
				/>
			</Section>

			<Section title="Variants">
				<p>
					Variants can be used to style the alert with some predefined
					colors.
				</p>
				<Code
					code={`

import { render } from 'pota'

import 'pota/components/alert'


render(
	<main>

		<pota-alert
			show
			variant="neutral"
		>
			Use \`variant="neutral"\` to use neutral colors
		</pota-alert>
		<pota-alert
			show
			variant="primary"
		>
			Use \`variant="primary"\` to use primary colors
		</pota-alert>
		<pota-alert
			show
			variant="success"
		>
			Use \`variant="success"\` to use success colors
		</pota-alert>
		<pota-alert
			show
			variant="warning"
		>
			Use \`variant="warning"\` to use warning colors
		</pota-alert>
		<pota-alert
			show
			variant="danger"
		>
			Use \`variant="danger"\` to use danger colors
		</pota-alert>
		<hr />

	</main>,
)
					`}
				/>
			</Section>

			<Section title="Custom Animation">
				<p>Animations can be changed using ::parts as follow</p>
				<Code
					code={`

import { render } from 'pota'
import { css } from 'pota/std'

import 'pota/components/alert'

render(
	<main>


		<pota-alert
			show
			class="custom"
		>
			Changing the animation to run slower than default
		</pota-alert>


			{css\`
/* custom animations */
pota-alert.custom::part(base) {
	animation: pota-scale-fade-out 1s ease-in;
}
pota-alert.custom::part(animation-open) {
	animation: pota-scale-fade-in 1s ease-in;
}
pota-alert.custom::part(animation-close) {
	animation: pota-scale-fade-out 1s ease-in;
}
\`}

	</main>,
)
					`}
				/>
			</Section>
		</>
	)
}
