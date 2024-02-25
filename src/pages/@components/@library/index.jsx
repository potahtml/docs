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
				<a href="https://shoelace.style/">shoelace</a>, adapted and
				ported to pota.
			</p>

			<Section title="Themes">
				<p>
					Themes are not included by default. Dark and light themes,
					can be included as follows.
				</p>
				<Code
					render={false}
					code={`
import 'pota/components/theme-dark'
import 'pota/components/theme-light'

 `}
				></Code>
				<p>
					Switch between themes by assigning the classes{' '}
					<mark>pota-theme-dark</mark> and{' '}
					<mark>pota-theme-light</mark> to a specific element, or to
					the <mark>html</mark> or <mark>body</mark> in case the whole
					thing should be themed.
				</p>
				<Code
					render={true}
					code={`
import 'pota/components/theme-light'
import 'pota/components/theme-dark'

import 'pota/components/alert'

import {render} from 'pota'

render(
	<main class="pota-theme-dark">
 			<pota-alert show >This is a dark alert!</pota-alert>

			<pota-alert show class="pota-theme-light">This is a light alert!</pota-alert>
 	</main>)

 `}
				></Code>
				<p>
					To change a built-in theme, override one of the following
					selectors.
				</p>
				<code>
					<pre>
						:root, :root.pota-theme-dark, .pota-theme-dark{' '}
						{`
{ /* your theme here */}\n\n`}
						:root, :root.pota-theme-light, .pota-theme-light{' '}
						{`
{ /* your theme here */}`}
					</pre>
				</code>
				<p>
					To code your own theme, you can take as base one of the
					built-in themes, and name the selector according.{' '}
				</p>
				<code>
					<pre>
						:root, :root.pota-theme-super, .pota-theme-super{' '}
						{`
{ /* your theme here */}`}
					</pre>
				</code>
				<p>
					<mark>:root</mark> is to use the theme as default.{' '}
					<mark>:root.pota-theme-super</mark> is to allow switching
					themes based on the class name of the <mark>html/body</mark>{' '}
					tags. <mark>.pota-theme-super</mark> for in case an element
					wants to be styled with a specific theme.
				</p>
			</Section>

			<Section title="Animations">
				<p>
					Predefined animations are included when a component use an
					animation. Using the component <mark>alert</mark> will
					include the animations <mark>pota-scale-fade-out</mark> and{' '}
					<mark>pota-scale-fade-in</mark>. Refer to this{' '}
					<a href="https://github.com/potahtml/pota/blob/master/src/components/library/%40theme/animations.js">
						file
					</a>{' '}
					for the full list of animations.
				</p>

				<Code
					render={true}
					code={`
import 'pota/components/alert'

import {render} from 'pota'

render(
	<main>
		<pota-alert show>This is an Alert message!</pota-alert>
	</main>)
					`}
				>
					The alert will appear with a<mark>pota-scale-fade-in</mark>{' '}
					animation. <b>Note</b>: The alert is <mark>dark</mark>{' '}
					because the playground already includes the theme.
				</Code>

				<p>
					Animations can be changed using{' '}
					<mark>
						<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/::part">
							::parts
						</a>
					</mark>
					. The documentation of each component details the
					information needed to style each <mark>::part</mark>.
				</p>
			</Section>

			<Section title="alert">
				<ol>
					<li>
						<p>
							<a href="/Components/Library/alert">Alert</a> - Used to
							display messages that require attention
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
		<pota-alert show closable>This is an alert message that can be closed</pota-alert>
	</main>)
					`}
				></Code>
			</Section>

			<Section title="Events">
				<p>
					Some components dispatch events in special situations. You
					may listen for these events in the same way you would do
					with a regular html element. Each component documentation
					page details the information needed about these events.
				</p>
			</Section>
			<Section title="Design Tokens">
				<p>
					Reusable <mark>tokens</mark> are shared across all
					components to style these uniformly and consistently.
				</p>
				<p>
					<mark>tokens</mark> describe things like spacing, font-size,
					transition delays, and shades of colors without actually
					referencing a specific color (such: primary, success,
					warning, danger and neutral).
				</p>
				<p>
					<mark>tokens</mark> are defined as <mark>css vars</mark>{' '}
					which makes customizing a token trivial.
				</p>
				<p>
					At the moment, the list of tokens is huge, and the port of
					shoelace to pota has not been completed yet. Please refer to
					this{' '}
					<a href="https://github.com/potahtml/pota/blob/master/src/components/library/%40theme/tokens.js">
						file
					</a>{' '}
					for a list of tokens.
				</p>
			</Section>
		</>
	)
}
