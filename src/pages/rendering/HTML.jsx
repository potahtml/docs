import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="HTML">
				<mark>HTML</mark> is a handy function that returns `html` to
				make components from cached tagged templates. Provides a
				registry of user components. It can be used to avoid a build
				step. It allows to register user defined tags (with `
				<mark>
					html.register(
					{'{'}ComponentName{'}'})
				</mark>
				`) that are defined by JavaScript functions.
			</Header>
			<p>
				<b>
					Notes on <mark>html</mark>:
				</b>
			</p>
			<ol>
				<li>
					<mark>children</mark> as an attribute will work as long as
					the node doesnt have any <mark>childNodes</mark> (just like
					in JSX). It must be totally empty
				</li>
				<li>
					It could return a function in the case of a single child
					node. It could return a single node when its a text node, it
					could return an array of nodes/functions
				</li>

				<li>
					<mark>html.register</mark> the registry is case insensitive,
				</li>
				<li>
					<mark>html.register</mark> it is possible to register a
					function named <mark>div</mark> and make all divs behave
					differently. This is a warning, NOT recommendation.
				</li>
			</ol>

			<Section title="Snippet">
				<Code
					url="/pages/rendering/html/snippet.jsx"
					render={false}
				></Code>
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
