import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Custom Element">
				Includes information about Custom Elements on the context of
				the renderer.
			</Header>

			<Section title="Attributes vs Properties">
				<p>
					Please refer to the page{' '}
					<a href="/props/attributes-properties">
						Attributes and Properties
					</a>
				</p>
			</Section>

			<Section title="Subclass CustomElement">
				<p>
					Extend <mark>CustomElement</mark> for a web component
					with shadow DOM. <mark>connectedCallback</mark>{' '}
					assigns <mark>this.html</mark> with a JSX-yielding
					function; <mark>this.emit()</mark> dispatches a
					custom event. Anything else — querying shadow
					children, toggling <mark>hidden</mark>, inspecting
					slots — uses the standard DOM APIs directly.
				</p>
				<Code url="/pages/@components/custom-element/counter.jsx"></Code>
			</Section>

			<Section title="Idempotent registration">
				<p>
					<mark>customElement(name, ctor, options?)</mark> calls{' '}
					<mark>customElements.define(name, ctor, options)</mark>{' '}
					only if <mark>name</mark> isn't already registered.
					Safer than calling <mark>define</mark> directly during
					HMR or when a module is imported more than once.
				</p>
				<Code url="/pages/@components/custom-element/idempotent.jsx"></Code>
			</Section>

			<Section title="customElement (factory)">
				<p>
					<mark>customElement(name, constructor, options?)</mark>{' '}
					registers a custom element with{' '}
					<mark>customElements.define</mark>, but only if the tag
					name has not been defined yet. This makes it safe to call
					from modules that may be imported more than once (hot
					reload, multiple entry points) without throwing a{' '}
					<mark>NotSupportedError</mark>.
				</p>
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>type</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>name</td>
							<td>string</td>
							<td>tag name — must contain a hyphen</td>
						</tr>
						<tr>
							<td>constructor</td>
							<td>CustomElementConstructor</td>
							<td>
								class extending <mark>HTMLElement</mark> (or{' '}
								<mark>CustomElement</mark> from{' '}
								<mark>pota/components</mark>)
							</td>
						</tr>
						<tr>
							<td>options?</td>
							<td>ElementDefinitionOptions</td>
							<td>
								forwarded to <mark>customElements.define</mark>{' '}
								(for example <mark>{'{ extends: "button" }'}</mark>
								)
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="CustomElement Class">
				<p>
					The <mark>CustomElement</mark> Class provides an API for
					common needed things on Custom Elements. It was developed
					to be used as a base class for a pota components library.
				</p>

				<p>
					On construct it attaches an open{' '}
					<mark>shadowRoot</mark> and adopts the stylesheets
					listed in the two static class fields —{' '}
					<mark>baseStyleSheets</mark> (intended for a shared
					reset / design-system layer) then{' '}
					<mark>styleSheets</mark> (per-element). Both accept
					<mark>CSSStyleSheet</mark> instances or raw CSS
					strings. Example:
				</p>

				<Code
					code={`
import { render } from 'pota'
import { CustomElement, customElement } from 'pota/components'
import { css } from 'pota/use/css'

class MyElement extends CustomElement {
	static styleSheets = [css\`:host { color: aqua; }\`]

	constructor() {
		super()
		this.html = 'hello <b><slot/></b>!'
		setTimeout(() => {
			this.html = <b>JSX Component takes over!</b>
		}, 2000)
	}
}

customElement('hello-world', MyElement)

render(<hello-world>World</hello-world>)
				`}
				>
					You may click re-run to see it in action
				</Code>

				<p>
					Adopting extra stylesheets at runtime isn't a method on
					the instance — import <mark>addStyleSheets</mark> from{' '}
					<mark>pota/use/css</mark> and call it with the shadow
					root. URLs and inline CSS strings are both accepted;
					URL fetches are cached so siblings share the same{' '}
					<mark>CSSStyleSheet</mark>.
				</p>

				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>kind</th>
							<th>argument</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>baseStyleSheets</td>
							<td>Static field</td>
							<td>
								<mark>(CSSStyleSheet | string)[]</mark>
							</td>
							<td>
								Stylesheets adopted into the shadow root
								before <mark>styleSheets</mark>. Intended
								for a shared reset / design-system layer.
							</td>
						</tr>
						<tr>
							<td>styleSheets</td>
							<td>Static field</td>
							<td>
								<mark>(CSSStyleSheet | string)[]</mark>
							</td>
							<td>
								Per-element stylesheets, adopted after{' '}
								<mark>baseStyleSheets</mark>.
							</td>
						</tr>
						<tr>
							<td>html</td>
							<td>Setter</td>
							<td>
								<mark>string | Component</mark>
							</td>
							<td>
								Assign a <mark>string</mark> to write{' '}
								<mark>shadowRoot.innerHTML</mark>; assign a{' '}
								<a href="/Component">Component</a> (or pass
								a falsy value to fall back to{' '}
								<mark>&lt;slot/&gt;</mark>) to replace the
								shadow root's children with the rendered
								tree.
							</td>
						</tr>
						<tr>
							<td>emit</td>
							<td>Method</td>
							<td>
								<mark>eventName, [init]</mark>
							</td>
							<td>
								Dispatches a <mark>CustomEvent</mark> from
								the element. The second argument is the
								standard <mark>CustomEventInit</mark> bag
								(<mark>{`{ detail, bubbles, composed, cancelable }`}</mark>
								).
							</td>
						</tr>
					</tbody>
				</table>

				<p>
					For anything else — querying shadow children,
					toggling attributes, observing slot changes — use
					the standard DOM APIs directly:{' '}
					<mark>this.shadowRoot.querySelector(...)</mark>,{' '}
					<mark>this.toggleAttribute('hidden', flag)</mark>,{' '}
					<mark>
						this.shadowRoot.addEventListener('slotchange', fn)
					</mark>
					.
				</p>
			</Section>
		</>
	)
}
