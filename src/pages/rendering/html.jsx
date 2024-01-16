import { Code, Header, Section } from '#main'
import styles from '../../index.module.css'

export default function () {
	return (
		<>
			<Header title="html">
				<mark>html</mark> is a handy function to make components from
				cached tagged templates. It can be used when people want to
				avoid a build step. It allows to register user defined tags
				(with `
				<mark>
					html.register(
					{'{'}ComponentName{'}'})
				</mark>
				`) that are defined by JavaScript functions.
			</Header>

			<b>Notes:</b>

			<ol>
				<li>
					Self-closing tags will work as long as these don't contain
					attributes
				</li>
				<li>
					<mark>children</mark> as an attribute will work as long as
					the node doesnt have any childNodes (just like in JSX). It
					must be totally empty
				</li>
				<li>
					It could return a function in the case of a single child
					node. It could return a single node when its a text node, it
					could return an array of nodes/functions
				</li>
				<li>
					<mark>html.register</mark> the registry is global, so if you
					register two different functions with the same name, the
					last one will overwrite the other
				</li>
				<li>
					<mark>html.register</mark> the registry is case insensitive,
				</li>
				<li>
					<mark>html.register</mark>
					it is possible to register a function named <mark>
						div
					</mark>{' '}
					and make all divs behave differently. NOT recommended
				</li>
			</ol>

			<Section title="Important!">
				<p>
					Self-closing tags are allowed only when these have no
					attributes. If a self closing tag has attributes, then it
					needs to have a closing tag.
				</p>

				<table>
					<tbody>
						<tr>
							<td>
								<mark>{'<MyComponent foo="bar"/>'}</mark>
							</td>
							<td>
								<span class={styles.warning}>
									<b>wrong!</b>
								</span>
							</td>
						</tr>
						<tr>
							<td>
								<mark>{'<MyComponent foo="bar"></MyComponent>'}</mark>
							</td>
							<td>
								<span>
									<b>ok</b>
								</span>
							</td>
						</tr>
						<tr>
							<td>
								<mark>{'<MyComponent />'}</mark>
							</td>
							<td>
								<span>
									<b>ok</b>
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
			<Section title="No JSX">
				<p>Making a tagged component</p>
				<Code url="/pages/rendering/html/usage.jsx"></Code>
			</Section>
			<Section title="Reactive Tagged Template">
				<p>Making a reactive tagged template without using JSX</p>
				<Code url="/pages/rendering/html/template.jsx"></Code>
			</Section>
			<Section title="Reactive Tagged Template With JSX">
				<p>Making a reactive tagged template that uses JSX</p>
				<Code url="/pages/rendering/html/jsx.jsx"></Code>
			</Section>
			<Section title="Custom Component">
				<p>Making a custom component</p>
				<Code url="/pages/rendering/html/custom-element.jsx"></Code>
			</Section>
			<Section title="Show Off">
				<p>
					Testing the <mark>Show</mark> component
				</p>
				<Code url="/pages/rendering/html/show-off.jsx"></Code>
			</Section>
			<Section title="Nested Show">
				<p>Nesting components with callbacks</p>
				<Code url="/pages/rendering/html/nested-show-off.jsx"></Code>
			</Section>
			<Section title="Attributes test">
				<p>Attributes and properties</p>
				<Code url="/pages/rendering/html/attributes-properties.jsx"></Code>
			</Section>
			<Section title="Two html">
				<p>One calling the other</p>
				<Code url="/pages/rendering/html/custom-element-functions.jsx"></Code>
			</Section>
			<Section title="Custom Element">
				<p>When is called the custom element constructor?</p>
				<Code url="/pages/rendering/html/custom-element-constructor.jsx"></Code>
			</Section>
			<Section title="Context">
				<p>Display context value while nested</p>
				<Code url="/pages/rendering/html/context.jsx"></Code>
			</Section>
		</>
	)
}
