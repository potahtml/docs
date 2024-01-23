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
					It comes in two flavors
					<ol>
						<li>
							one returns an <mark>HTMLElement</mark> <b>PROS</b>:
							very easy to use the HTMLElement. <b>CONS</b>: doesnt
							play nicely with nested reactivity and context.
						</li>
						<li>
							the other returns a <mark>Function</mark>. <b>PROS</b>:
							plays nicely with nested reactivity and reactive
							context. <b>CONS</b>: you get a function instead of an
							HTMLElement.
						</li>
					</ol>
				</p>
			</Header>

			<Section title="As HTMLElement">
				<Code
					code={`
						import {  html, render } from 'pota'

						// this returns a real div
						const div = html\`<div>div contents</div>\`

						render(div instanceof Node)
						render(div)
					`}
				>
					By default, export <mark>html</mark> (in lowercase) will
					return <b>HTMLElement</b> when used
				</Code>
				<ol>
					<li>
						returns <mark>HTMLElement</mark>
					</li>
				</ol>
			</Section>

			<Section title="As Function">
				<Code
					code={`
						import { HTML, render } from 'pota'

						// create new \`html\` instance
						const html = HTML()

						// this returns a function
						const component = html\`<div>div contents</div>\`

						render(typeof component === 'function')
						render(component)
					`}
				>
					Creating <mark>html</mark> (in lowercase) from{' '}
					<mark>HTML</mark> (in uppercase). Output will be in
					functions
				</Code>
				<ol>
					<li>
						returns <mark>Function</mark>
					</li>
				</ol>
			</Section>

			<Section title="Defining a Global User Component">
				<Code
					code={`
						import { html, render } from 'pota'

						html.define({Test:()=>'hello world!'})

 						const test = html\`<div>div contents <test/></div>\`

 						console.log(test)

						render(test)
 					`}
				>
					Global User defined component. Defining it on the exported{' '}
					<mark>html</mark> will make the component global (accessible
					when importing <mark>html</mark> from other files)
				</Code>
				<ol>
					<li>
						registry of user defined components is <b>global</b>
					</li>
				</ol>
			</Section>

			<Section title="Defining a Local User Component">
				<Code
					code={`
						import { HTML, render } from 'pota'

						const html = HTML()

						html.define({Test:()=>'hello world!'})

 						const test = html\`<div>div contents <test/></div>\`

 						console.log(test)

						render(test)
 					`}
				>
					Similar, to not pollute the registry one may import{' '}
					<mark>HTML</mark> and create a new <mark>html</mark>{' '}
					instance that its local to the file
				</Code>
				<ol>
					<li>
						registry of user defined components is <b>local</b>
					</li>
				</ol>
			</Section>

			<Section title="htmlEffect">
				<p>
					An <mark>htmlEffect</mark> is similar to a regular{' '}
					<mark>effect</mark>. It creates and cache the html for the
					output and updates what has changed using signals for the
					interpolated values.
				</p>
				<Code
					code={`
						import { render, htmlEffect, signal, mutable } from 'pota'

const data = mutable({ test: 0 })

const div = htmlEffect(html => {
  return html\`<div>value is \${data.test}</div>\`
})

setInterval(() => data.test++, 1000)

console.log(div)

render(div)

 					`}
				></Code>
				<p>
					Nested <mark>html</mark>
				</p>
				<Code
					code={`
						import { render, htmlEffect, mutable } from 'pota'

const data = mutable({ test: 0 })

const div = htmlEffect(
  html => {
    const double = html\`<div>double is \${data.test*2}</div>\`

    return html\`<div>value is \${data.test} \${double}</div>\`
  }
)

setInterval(() => data.test++, 1000)

render(div)


 					`}
				>
					An example nesting
				</Code>
			</Section>

			<Section title="Function vs HTMLElement">
				<Code
					code={`
						import { HTML, render } from 'pota'

						const html1 = HTML({wrap:true})

 						const componentFunction = html1\`<div>div contents</div>\`

						const html2 = HTML({wrap:false})

 						const aRealDiv = html2\`<div>div contents</div>\`

						console.log([componentFunction, aRealDiv])

						render([componentFunction, aRealDiv])
 					`}
				>
					Choose what to receive from <mark>html</mark> by defining
					the option <mark>wrap</mark>
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
						on <mark>html.define</mark> the registry is case
						insensitive
					</li>
					<li>
						on <mark>html.define</mark> it is possible to define a
						component named <mark>div</mark>, and make all divs behave
						differently. This is a warning, NOT a recommendation.
					</li>
				</ol>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/html/snippet.jsx"
					render={false}
				></Code>
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
