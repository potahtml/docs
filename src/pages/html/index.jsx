import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="HTML">
				<p>
					Set of utilities to create components from cached tagged
					templates. Inspired and influenced by{' '}
					<a href="https://github.com/trusktr">@trusktr</a>
				</p>
				<p>
					Unlike <mark>HTML</mark>, attributes, tags and components{' '}
					<u>are case sensitive</u>. The <mark>html</mark> function
					matches the use of <mark>JSX</mark>.
				</p>
			</Header>

			<Section title="Snippet">
				<Code
					url="/pages/html/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Value">
				<Code
					code={`
						import { render } from 'pota'
						import { html } from 'pota/html'

 						const test = html\`<div>div contents</div>\`

						render(typeof test === 'function')
 						render(test)
					`}
				>
					Used to return a real element, but not anymore.
				</Code>
			</Section>

			<Section title="Defining a Global User Component">
				<Code
					code={`
						import { render } from 'pota'
						import { html } from 'pota/html'

						html.define({test:()=>'hello world!'})

						const test = html\`<div><test/> div contents </div>\`


						render(test)
 					`}
				>
					By defining a user component on the exported{' '}
					<mark>html</mark> it will make the component global
					(accessible when importing <mark>html</mark> from other
					files)
				</Code>
			</Section>

			<Section title="Defining a Local User Component">
				<Code
					code={`
						import { render } from 'pota'
						import { HTML } from 'pota/html'

						const html = HTML()

						html.define({test:()=>'hello world!'})

						const test = html\`<div><test/> div contents</div>\`


						render(test)
 					`}
				>
					To not pollute the registry one may import <mark>HTML</mark>{' '}
					and create a an instance of <mark>html</mark> that its local
					to the file
				</Code>
			</Section>

			<Section title="Predefined Components">
				<Code
					code={`
						import { render } from 'pota'
						import { html } from 'pota/html'


 						const test = html\`<For each="\${[1, 2, 3]}">\${val => val*2}</For>\`

						render(test)
 					`}
				>
					Predefined components are: <mark>Collapse</mark>,{' '}
					<mark>Dynamic</mark>, <mark>For</mark>, <mark>Head</mark>,{' '}
					<mark>Portal</mark>, <mark>Show</mark>, <mark>Switch</mark>
				</Code>
			</Section>

			<Section title="Notes">
				<ol>
					<li>
						<mark>children</mark> as an attribute will be used as long
						as the node doesnt have any <mark>childNodes</mark> (just
						like in JSX). It must be totally empty, or else the
						children attribute will be ignored
					</li>
					<li>
						on <mark>html.define</mark> the registry{' '}
						<u>
							is case <b>sensitive</b>
						</u>
					</li>
					<li>
						on <mark>html.define</mark> it is possible to define a
						component named <mark>div</mark>, and make all divs behave
						differently. This is a warning, not a recommendation.
					</li>
				</ol>
			</Section>

			<Section title="No JSX">
				<p>Making a tagged component</p>
				<Code url="/pages/html/usage.jsx"></Code>
			</Section>
			<Section title="Reactive Tagged Template">
				<p>Making a reactive tagged template without using JSX</p>
				<Code url="/pages/html/template.jsx"></Code>
			</Section>
			<Section title="Reactive Tagged Template With JSX">
				<p>Making a reactive tagged template that uses JSX</p>
				<Code url="/pages/html/jsx.jsx"></Code>
			</Section>
			<Section title="Custom Component">
				<p>Making a custom component</p>
				<Code url="/pages/html/custom-element.jsx"></Code>
			</Section>
			<Section title="Show Off">
				<p>
					Testing the <mark>Show</mark> component
				</p>
				<Code url="/pages/html/show-off.jsx"></Code>
			</Section>
			<Section title="Nested Show">
				<p>Nesting components with callbacks</p>
				<Code url="/pages/html/nested-show-off.jsx"></Code>
			</Section>
			<Section title="Attributes test">
				<p>Attributes and properties</p>
				<Code url="/pages/html/attributes-properties.jsx"></Code>
			</Section>
			<Section title="Two html">
				<p>One calling the other</p>
				<Code url="/pages/html/custom-element-functions.jsx"></Code>
			</Section>
			<Section title="Custom Element">
				<p>When is called the custom element constructor?</p>
				<Code url="/pages/html/custom-element-constructor.jsx"></Code>
			</Section>
			<Section title="Context">
				<p>Display context value while nested</p>
				<Code url="/pages/html/context.jsx"></Code>
			</Section>
			<Section title="Custom Element">
				<p>Custom Element Tracking Test</p>
				<Code url="/pages/html/custom-element-track.jsx"></Code>
			</Section>
		</>
	)
}
