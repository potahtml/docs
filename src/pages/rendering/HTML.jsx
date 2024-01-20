import { Code, Header, Section } from '#main'

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
					It comes in two flavours
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

						render(test)
 					`}
				>
					Global User defined component. Defining it on the exported{' '}
					<mark>html</mark> will make the component global (accessible
					when importinig <mark>html</mark> from other files)
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
					output and updates what has changed, even if the values used
					are not reactive. It does so by looping in a{' '}
					<mark>requestAnimationFrame</mark>
				</p>
				<Code
					code={`
						import { render, htmlEffect } from 'pota'

						let num = 0
						const div = htmlEffect(
						  html =>
						    html\`<div>value is \${num}</div>\`
						)
						setInterval(() => num++, 1000)

						console.log(div)

						render(div)
 					`}
				>
					by default <mark>htmlEffect</mark> returns{' '}
					<mark>HTMLElement</mark>, it could be changed to return
					<mark>Function</mark> by passing{' '}
					<mark>{'{wrap:true}'}</mark> as second argument to the
					htmlEffect
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
			<Section title="Custom Element">
				<p>Custom Element Tracking Test</p>
				<Code url="/pages/rendering/html/custom-element-track.jsx"></Code>
			</Section>
		</>
	)
}
