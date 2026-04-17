import { A } from 'pota/components'
import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="attributes / properties">
				How pota decides whether an unnamespaced prop writes to an
				attribute or a property, and the conventions that fall out
				of it.
			</Header>

			<Section title="Attributes vs Properties">
				<p>
					Since <mark>v0.18.184</mark>, pota defaults to setting
					<em> attributes</em>. Use the <mark>prop:</mark>{' '}
					namespace to force a property assignment — typical
					cases: <mark>value</mark> and <mark>checked</mark> on
					form inputs, <mark>srcObject</mark> on media,{' '}
					<mark>innerHTML</mark>, or any custom-element property
					that expects a non-string value.
				</p>

				<p>
					<Code
						code={`const test = <video prop:srcObject={o}/>`}
						render={false}
					></Code>
				</p>
			</Section>

			<Section title="Deleting">
				<ul>
					<li>
						<b>property</b> (<mark>prop:*</mark>): assigning{' '}
						<mark>null</mark> or <mark>undefined</mark> sets the
						property to <mark>null</mark>.
					</li>
					<li>
						<b>attribute</b> (default): passing <mark>false</mark>,{' '}
						<mark>null</mark> or <mark>undefined</mark> removes
						the attribute. <mark>true</mark> sets it to the empty
						string.
					</li>
				</ul>
			</Section>

			<Section title="Children">
				<p>
					Passing <mark>children</mark> as a prop is only honoured
					when the element has no explicit child nodes in JSX. If
					both are set, the explicit <mark>childNodes</mark> win
					and the <mark>children</mark> prop is ignored.
				</p>
			</Section>

			<Section title="xmlns">
				<p>
					The <mark>xmlns</mark> attribute is inherited by
					children, so SVG, MathML, and other XML dialects work
					out of the box with their own namespaces — no special
					wrapper needed.
				</p>
			</Section>

			<Section title="Events">
				<p>
					Event names in <mark>on:*</mark> are case-sensitive —{' '}
					<mark>on:click</mark> and <mark>on:Click</mark> bind
					different events. This matches how custom events are
					typically named.
				</p>
			</Section>

			<Section title="Props With Default Behavior">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<mark>
									<a href="/use/ref">use:ref</a>
								</mark>
							</td>
							<td>callback to get a reference to the element</td>
						</tr>
						<tr>
							<td>
								<mark>
									<A
										href="/use/:page"
										params={{ page: 'connected' }}
									>
										use:connected
									</A>
								</mark>
							</td>
							<td>connected adds a callback to the mount event</td>
						</tr>
						<tr>
							<td>
								<mark>
									<A
										href="/use/:page"
										params={{ page: 'disconnected' }}
									>
										use:disconnected
									</A>
								</mark>
							</td>
							<td>
								disconnected adds a callback to the unmount event
							</td>
						</tr>
						<tr>
							<td>
								<mark>
									<a href="/props/class%3A__">class</a>
								</mark>
							</td>
							<td>sets classes in the element in various ways</td>
						</tr>
						<tr>
							<td>
								<mark>
									<a href="/props/style%3A__">style</a>
								</mark>
							</td>
							<td>sets styles in the element in various ways</td>
						</tr>
						<tr>
							<td>
								<mark>
									<a href="/props/css">use:css</a>
								</mark>
							</td>
							<td>
								<mark>
									{
										'<span use:css="class{color:green} class:hover{color:red}"/>'
									}
								</mark>{' '}
								becomes{' '}
								<mark>{'<span class="c1ywn32bqhvrzp"/>'}</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="SVG">
				<p>test: SVG + xlink</p>
				<Code url="/pages/@props/attributes-properties/test-xml.jsx"></Code>
			</Section>
			<Section title="Showing XML Test">
				<p>
					Testing if keeps the parent xmlns using a toggling{' '}
					<mark>Show</mark>
				</p>
				<Code url="/pages/@props/attributes-properties/xmlns.jsx"></Code>
			</Section>
		</>
	)
}
