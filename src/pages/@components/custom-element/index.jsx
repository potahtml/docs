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
					function;{' '}
					<mark>this.query()</mark> looks up shadow children;{' '}
					<mark>this.emit()</mark> dispatches a custom event.
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
					On construct it will attach a <mark>shadowRoot</mark> in
					mode open. If the constructor has a <mark>static</mark>{' '}
					array field named <mark>styleSheets</mark>, then, the{' '}
					<mark>shadowRoot</mark> will adopt the stylesheets. Example:
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
							<td>query</td>
							<td>Method</td>
							<td>
								<mark>selector</mark>
							</td>
							<td>
								Alias for <mark>element.querySelector</mark>
							</td>
						</tr>
						<tr>
							<td>html</td>
							<td>Setter</td>
							<td>
								<mark>Component</mark>
							</td>
							<td>
								<mark>html</mark> is a setter that can be used with a{' '}
								<mark>string</mark> or any{' '}
								<mark>
									<a href="/Component">Component</a>
								</mark>
								. The result will replace childrens on the{' '}
								<mark>shadowRoot</mark>.
							</td>
						</tr>
						<tr>
							<td>hidden</td>
							<td>Setter</td>
							<td>
								<mark>boolean</mark>
							</td>
							<td>
								Adds the <mark>hidden</mark> attribute when the
								assigned value is truthy and removes it otherwise.
								Assign each time you want a change — the setter
								does not subscribe to a signal.
							</td>
						</tr>
						<tr>
							<td>emit</td>
							<td>Method</td>
							<td>
								<mark>eventName, [data]</mark>
							</td>
							<td>
								Method to dispatch an event from a custom element.
							</td>
						</tr>
						<tr>
							<td>hasSlot</td>
							<td>Method</td>
							<td>
								<mark>slotName</mark>
							</td>
							<td>
								Returns a boolean indicating if a slot is present.
								TODO: This should return a signal instead.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
