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

			<Section title="CustomElement Class">
				<p>
					The <mark>CustomElement</mark> Class provides an API for
					common needed things on Custom Elements. Its was developed
					to be used on the{' '}
					<a href="/Components/Library/">Components Library</a>.
				</p>

				<p>
					On construct it will attach a <mark>shadowRoot</mark> in
					mode open. If the constructor has a <mark>static</mark>{' '}
					array field named <mark>styleSheets</mark>, then, the{' '}
					<mark>shadowRoot</mark> will adopt the stylesheets. Example:
				</p>

				<Code
					code={`
import {CustomElement, customElement, css, render} from 'pota'

class MyElement extends CustomElement{
	static styleSheets = [css\`:host{ color:aqua; }\`]

	constructor(){
		super()
		this.html = 'hello <b><slot/></b>!'
		setTimeout(()=>{
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
							<td>addStyleSheets</td>
							<td>Method</td>
							<td>
								<mark>(CSSStyleSheet|urls)[] </mark>
							</td>
							<td>
								Given an array containing <mark>CSSStyleSheet</mark>{' '}
								or urls, it will append the stylesheets to{' '}
								<mark>document.adoptedStyleSheets</mark>. When it's an
								URL it will <mark>fetch</mark>, create a{' '}
								<mark>CSSStyleSheet</mark> and cache it for the given
								URL. So different Custom Elements all share the same
								CSSStyleSheet.
							</td>
						</tr>
						<tr>
							<td>addStyleSheetExternal</td>
							<td>Method</td>
							<td>
								<mark>url</mark>
							</td>
							<td>
								Helper for <mark>addStyleSheets</mark>. See above
							</td>
						</tr>
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
								<mark>boolean | signal</mark>
							</td>
							<td>
								<mark>hidden</mark> is a setter that will check the
								value passed for truthiness and add or remove an
								attribute named <mark>hidden</mark> on the Element.
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
