import { A } from 'pota/components'
import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="attributes / properties">
				Describes behavior with attributes and properties.
			</Header>

			<Section title="Attributes vs Properties">
				<p>
					pota defaults to attributes since <mark>v0.18.184</mark>.
					Namespace <mark>prop:</mark> can be used when in need for
					setting a property.
				</p>

				<p>
					<Code
						code={`const test = <video prop:srcObject={o}/>`}
						render={false}
					></Code>
				</p>
			</Section>

			<Section title="Deleting">
				<p>
					On a <mark>property</mark>, deleting means setting the value
					to <mark>null</mark> when the passed value is{' '}
					<mark>null</mark> or <mark>undefined</mark>.
				</p>
				<p>
					On an <mark>attribute</mark>, deleting means removing the
					attribute when the passed value is <mark>false</mark> ,{' '}
					<mark>null</mark> or <mark>undefined</mark>.
				</p>
			</Section>

			<Section title="Children">
				<p>
					<mark>children</mark> as an attribute will be used as long
					as the node on where it's defined doesn't have any{' '}
					<mark>childNodes</mark>.
				</p>
			</Section>

			<Section title="xmlns">
				<p>
					The <mark>xmlns</mark> attribute is copied to children.
					Which means it supports by default most kinds if not all
					xmls: SVG, MathML, with its fancy namespaces.
				</p>
			</Section>

			<Section title="Events">
				<p>
					Events such <mark>on:__</mark> are case sensitive
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
