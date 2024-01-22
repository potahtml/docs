import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="attributes / properties">
				Describes <mark>pota</mark> behaviour with attributes and
				properties
			</Header>
			<Section title="Attributes vs Properties">
				<p>
					Will use <mark>setProperty</mark> when the value is{' '}
					<mark>boolean</mark>
					and doesn't have a dash <mark>-</mark> in the name. Else, it
					will use <mark>setAttribute</mark>. While this doesnt work
					for every situation, its a sensible default that works in
					most cases. To change this behaviour see{' '}
					<a href="#Namespace-To-Force-Props-Type">
						Namespace To Force Props Type
					</a>
				</p>
			</Section>

			<Section title="Namespace To Force Props Type">
				<p> A namespace can be used to force the prop type.</p>
				<p>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Kind</th>
								<th>Description</th>
							</tr>
						</thead>
						<tr>
							<td>
								<mark>attr:name</mark>
							</td>
							<td>
								<mark>setAttribute</mark>
							</td>
							<td>will always add it as an attribute</td>
						</tr>
						<tr>
							<td>
								<mark>prop:name</mark>
							</td>
							<td>
								<mark>setProperty</mark>
							</td>
							<td>will always set it as a property</td>
						</tr>
						<tr>
							<td>
								<mark>bool:name</mark>
							</td>
							<td>
								<mark>setAttribute</mark>
							</td>
							<td>adds/remove based on truthy/falsy</td>
						</tr>
					</table>
				</p>
				<p>
					<b>See</b>: <a href="/props/attr%3A__">attr:__</a>,{' '}
					<a href="/props/prop%3A__">prop:__</a>,{' '}
					<a href="/props/bool%3A__">bool:__</a> and{' '}
					<a href="/props/setAttribute">setAttribute</a>,{' '}
					<a href="/props/setProperty">setProperty</a>,{' '}
					<a href="/props/setBool">setBool</a>
				</p>
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

			<Section title="Locked To Properties">
				<p>
					<mark>value</mark>, <mark>textContent</mark>,{' '}
					<mark>innerText</mark>, <mark>innerHTML</mark> are locked to
					always use <mark>setProperty</mark>
				</p>
			</Section>

			<Section title="Reserved Names">
				<p>
					Reserved names are the following: <mark>children</mark>. It
					cannot be overridden via a <mark>propsPlugin</mark>.
					Everything else can be changed. <b>Note</b>:{' '}
					<mark>children</mark> as an attribute will be used as long
					as the node on where it's used doesn't have any{' '}
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
					Events using the <mark>on__</mark> form will be delegated.
					these are case insensitive.
				</p>
				<p>
					Events using the <mark>on:__</mark> form will be attached to
					the element. These are case sensitive.
				</p>
			</Section>

			<Section title="Props With Default Behavior">
				<p>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Description</th>
							</tr>
						</thead>
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
									<a href="/props/class%3A__">class</a>
								</mark>
							</td>
							<td>sets classes in the element in various ways</td>
						</tr>
						<tr>
							<td>
								<mark>var</mark>
							</td>
							<td>sets a css var in the element</td>
						</tr>
						<tr>
							<td>
								<mark>
									<a href="/props/onMount">onMount</a>
								</mark>
							</td>
							<td>onMount adds a callback to the mount event</td>
						</tr>
						<tr>
							<td>
								<mark>
									<a href="/props/onUnmount">onUnmount</a>
								</mark>
							</td>
							<td>onUnmount adds a callback to the unmount event</td>
						</tr>
						<tr>
							<td>
								<mark>
									<a href="/props/ref">ref</a>
								</mark>
							</td>
							<td>callback to get a reference of the element</td>
						</tr>
					</table>
				</p>
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
