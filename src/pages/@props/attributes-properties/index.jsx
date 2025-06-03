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
					<mark>setProperty</mark> will be used when any of the
					following is true:
				</p>

				<ol>
					<li>
						<mark>tagName</mark> has a dash (as custom-elements do)
						and <mark>propName</mark> is a setter
					</li>
					<li>
						the value is different than <mark>string</mark> and
						element has a <mark>propName</mark> setter
					</li>
				</ol>

				<p>
					While this does not work for every situation, it's a
					sensible default that works in most cases. To change this
					behavior see the next section
				</p>
			</Section>

			<Section title="Namespace To Force Props Type">
				<p>A namespace can be used to force the prop kind</p>

				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Kind</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<mark>prop:name</mark>
							</td>
							<td>
								<mark>setProperty</mark>
							</td>
							<td>will always set it as a property</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Deleting">
				<p>
					On a <mark>property</mark>, deleting means setting the value
					to <mark>null</mark> when the new value is <mark>null</mark>{' '}
					or <mark>undefined</mark>.
				</p>
				<p>
					On an <mark>attribute</mark>, deleting means removing the
					attribute when the new value is <mark>null</mark> or{' '}
					<mark>undefined</mark>.
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
									<a href="/props/ref">ref</a>
								</mark>
							</td>
							<td>callback to get a reference to the element</td>
						</tr>
						<tr>
							<td>
								<mark>
									<A
										href="/props/:page"
										params={{ page: 'on:mount' }}
									>
										on:mount
									</A>
								</mark>
							</td>
							<td>on:mount adds a callback to the mount event</td>
						</tr>
						<tr>
							<td>
								<mark>
									<A
										href="/props/:page"
										params={{ page: 'on:unmount' }}
									>
										on:unmount
									</A>
								</mark>
							</td>
							<td>on:unmount adds a callback to the unmount event</td>
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
								<mark>var</mark>
							</td>
							<td>sets a css var in the element</td>
						</tr>
						<tr>
							<td>
								<mark>plugin:css</mark>
							</td>
							<td>
								<mark>
									{
										'<span plugin:css="class{color:green} class:hover{color:red}"/>'
									}
								</mark>{' '}
								becomes{' '}
								<mark>{'<span class="class-styles-applied"/>'}</mark>
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
