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
					It comes in two flavors that you can choose
					<ol>
						<li>
							1. Returns a <mark>Node/Element</mark> or an{' '}
							<mark>Array</mark> of <mark>Node/Element</mark>.{' '}
							<ol>
								<li>
									<b>PROS</b>: very easy to use the Element when is a
									single children or if you dont mind the array.{' '}
								</li>
								<li>
									<b>CONS</b>: doesn't play nicely with nested
									reactivity and context as elements have to be
									created before returning, which means that if you
									nest the result in a context then it wont be using
									the context value as the element is already created.
								</li>
							</ol>
						</li>
						<li>
							2. Behaves as any other component, it could return{' '}
							<mark>Node/Element/Function/Array</mark>.{' '}
							<ol>
								<li>
									<b>PROS</b>: plays nicely with nested reactivity and
									reactive context.{' '}
								</li>
								<li>
									<b>CONS</b>: you dont get an Element.
								</li>
							</ol>
						</li>
					</ol>
				</p>
			</Header>

			<Section title="As HTMLElement">
				<Code
					code={`
						import { html, render } from 'pota'

						// this returns a real div
						const div = html\`<div>div contents</div>\`

						render(div instanceof Node)
						render(div)
					`}
				>
					By default, export <mark>html</mark> (in lowercase) will
					return <b>Element/Node</b> or <b>(Element/Node)[]</b>
				</Code>
			</Section>

			<Section title="As Component">
				<Code
					code={`
						import { HTML, render } from 'pota'

						// create new \`html\` instance
						const html = HTML({ unwrap: false })

						// this returns a function
						const component = html\`<div>div contents</div>\`

						render(typeof component === 'function')
						render(component)
					`}
				>
					Notice the argument <mark>{'{ unwrap: false }'}</mark>
				</Code>
			</Section>

			<Section title="Defining a Global User Component">
				<Code
					code={`
						import { html, render } from 'pota'

						html.define({test:()=>'hello world!'})

						const test = html\`<div><test/> div contents </div>\`

 						console.log(test)

						render(test)
 					`}
				>
					Global User defined component. By defining it on the
					exported <mark>html</mark> it will make the component global
					(accessible when importing <mark>html</mark> from other
					files)
				</Code>
			</Section>

			<Section title="Defining a Local User Component">
				<Code
					code={`
						import { HTML, render } from 'pota'

						const html = HTML()

						html.define({test:()=>'hello world!'})

						const test = html\`<div><test/> div contents</div>\`

 						console.log(test)

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
						import { html, render } from 'pota'


 						const test = html\`<for each="\${[1, 2, 3]}">\${val => val*2}</for>\`

						render(test)
 					`}
				>
					Predefined components are: <mark>collapse</mark>,{' '}
					<mark>dynamic</mark>, <mark>for</mark>, <mark>head</mark>,{' '}
					<mark>portal</mark>, <mark>promised</mark>,{' '}
					<mark>show</mark>, <mark>switch</mark>
				</Code>
			</Section>

			<Section title="htmlEffect">
				<p>
					An <mark>htmlEffect</mark> is similar to a regular{' '}
					<mark>effect</mark>. It creates and cache the html for the
					output and updates what has changed using signals for the
					interpolated values. It tracks the interpolated values and
					updates the template, and also it tracks the body of the
					function that you pass to the effect to re-run it.
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
				>
					The function reruns whenever <mark>data.test</mark> changes.
				</Code>

				<Code
					code={`
						import { render, htmlEffect, signal, mutable } from 'pota'

						const data = mutable({ test: 0 })

						const div = htmlEffect(html => {
							console.log('re-running')
							data.test
						  return html\`<div>test</div>\`
						})

						setInterval(() => data.test++, 1000)

						console.log(div)

						render(div)

 					`}
				>
					The effect re-runs because reading <mark>data.test</mark>{' '}
					causes tracking even if unused in the template.
				</Code>

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
					Nested <mark>html</mark> test
				</Code>

				<Code
					code={`
						import { render, htmlEffect, signal } from 'pota'

						const [read, write] = signal(0)

						setInterval(() => {
						  console.log('updating the signal')
						  write(value => value + 1)
						}, 1000)

						// to check if we are reusing nodes
						const nodes = new Set()

						function Component() {
						  return htmlEffect(html => {
						    console.log('running the effect')
						    // VALUE
						    const value = html\`<div>value \${read()}</div>\`
						    // log if we saw this node before
						    console.log(value, nodes.has(value), value instanceof Node)
						    nodes.add(value)

						    // DOBLE
						    const double = html\`<div>double \${read() * 2}</div>\`
						    // log if we saw this node before
						    console.log(double, nodes.has(double), double instanceof Node)
						    nodes.add(double)

						    // NEST
						    const result = html\`<div>result  \${value} \${double}</div>\`
						    // log if we saw this node before
						    console.log(result, nodes.has(result), result instanceof Node)
						    nodes.add(result)

						    return result
						  })
						}

						const dispose = render(Component)

						setTimeout(() => {
						  console.log('disposing')
						  dispose()
						  render('disposed')
						}, 5000)


 					`}
				>
					Test for return types and diposal
				</Code>

				<Code
					code={`
						import { render, html, htmlEffect, signal, mutable } from 'pota'

						const data = mutable({ test: 0 })

						html.define({test:(props)=><div style="color:green">{props.children}</div>})

						const div = htmlEffect(html => {
							return html\`<test><div>test \${data.test}</div></test>\`
						})

						setInterval(() => data.test++, 1000)

						console.log(div)

						render(div)


 					`}
				>
					The <mark>html</mark> passed on the effect uses the global
					registry.
				</Code>
			</Section>

			<Section title="Component vs Element">
				<Code
					code={`
						import { HTML, render } from 'pota'

						const html1 = HTML({unwrap:false})

 						const component = html1\`<div>div contents</div>\`

						const html2 = HTML({unwrap:true})

 						const aRealDiv = html2\`<div>div contents</div>\`

						console.log([component, typeof component, aRealDiv, aRealDiv instanceof Node])

						render([component, typeof component, aRealDiv, aRealDiv instanceof Node])
 					`}
				>
					Choose what to receive from <mark>html</mark> by defining
					the option <mark>unwrap</mark>. Defaults to `true`
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
							is case <b>insensitive</b>
						</u>
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
