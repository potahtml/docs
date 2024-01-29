import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Anatomy of a Signals Based Reactive Renderer">
				<p>
					We are going to implement from scratch the core parts:
					rendering, node creation and disposal, of a signals based
					reactive web renderer.
				</p>
			</Header>
			<p>
				In case you dont know what Signals are, here there are a few
				links:
				<ol>
					<li>
						<a href="https://www.youtube.com/watch?v=Jp7QBjY5K34">
							Ryan K Carniato - Revolutionary Signals (video)
						</a>
					</li>
					<li>
						<a href="https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf">
							A Hands-on Introduction to Fine-Grained Reactivity
						</a>
					</li>
					<li>
						<a href="https://dev.to/this-is-learning/making-the-case-for-signals-in-javascript-4c7i">
							Making the Case for Signals in JavaScript
						</a>
					</li>
				</ol>
			</p>
			<Section title="Introduction">
				<p>
					With Signals, it may be a bit confusing at first how things
					work. This is an attempt to illustrate the rendering aspect,
					with what I learned writing{' '}
					<a href="https://github.com/potahtml/pota">pota</a> and
					reading{' '}
					<a href="https://github.com/ryansolid/dom-expressions">
						dom-expressions
					</a>{' '}
					and <a href="https://github.com/vobyjs/voby">voby</a>.
				</p>
				<p>
					For the Signals library, we are going to use{' '}
					<a href="https://github.com/fabiospampinato/flimsy">
						flimsy
					</a>
					, which is a small and educative library that implements and
					documents the reactive core of{' '}
					<a href="https://www.solidjs.com/">Solid</a>. Flimsy is
					around 212~ LOC, code worth a read. The renderer we are
					going to implement, lets call it clumsy, is around 100~ LOC.
				</p>

				<p>
					The explorations will get progressively more complicated
					revisiting and updating what we already wrote. While this
					doesn't cover everything, its an initial kick for further
					articles.
				</p>
			</Section>

			<Section title="insert">
				<p>
					We need a function with the purpose to insert{' '}
					<mark>Nodes</mark> in a parent.
				</p>
				<p></p>
				<Code
					code={`
					const insert = (child, parent) => {
						parent.append(child)
					}

					const div = document.createElement('div')
					div.textContent = 'Hello World'

					insert(div, document.body)
					`}
					render={true}
				>
					This function will be used whenever we have a proper Node.
				</Code>
			</Section>
			<Section title="create">
				<p>
					We also need a function to create nodes from any kind of
					data. The created nodes are inserted in the document with
					<mark>insert</mark>
				</p>
				<p></p>
				<Code
					code={`
					const insert = (child, parent) => {
						parent.append(child)
					}

					const create = (child, parent) => {

						insert(document.createTextNode(child), parent)
					}


					create("Hello World ", document.body)
					create(2 +2 , document.body)
					`}
					render={true}
				></Code>
				<p></p>

				<p>That's a bit too simplistic, lets make it more fancy</p>
				<p>
					<ol>
						<li>
							Avoiding <mark>null</mark> and <mark>undefined</mark>
						</li>
						<li>
							Allowing <mark>functions</mark>, by calling the function
							and recursing with the returned value
						</li>
					</ol>
				</p>
				<p></p>

				<Code
					code={`
					const create = (child, parent) => {
						if (child === null || child === undefined) {
							return
						}

						if (typeof child === 'function') {
							return create(
								 child(),
								parent,
							)
						}

						return insert(document.createTextNode(child), parent)
					}
					`}
					render={false}
				></Code>
				<p></p>
			</Section>
			<Section title="Placeholders">
				<p>
					Now lets add support for <mark>Promises</mark>, by checking
					if <mark>then</mark> is in the child when it is an object.
				</p>
				<p></p>
				<Code
					code={`
									const insert = (child, parent) => {
						parent.append(child)
					}


					const create = (child, parent) => {
						if (child === null || child === undefined) {
							return
						}

						if (typeof child === 'function') {
							return create(
								 child(),
								parent,
							)
						}

						if(typeof child ==='object'){
						if ("then" in child) {
							return child.then((result) => {
								return create(
									 result,
									parent,
								)
							})
						}
					}


						return insert(document.createTextNode(child), parent)
					}

					create("1", document.body)
					create(new Promise((resolve)=>{ setTimeout(()=>resolve("2"), 500)}) , document.body)
					create("3", document.body)
					`}
					render={true}
				>
					Output should have been 123 instead of 132!
				</Code>
				<p></p>
				<p>
					As the promise is async and fulfills at a later point in
					time, our child will be created at an unexpected position in
					the document.
				</p>
				<p>
					To solve this problem, we can create an invisible
					placeholder, add it to the document right away, and hold it
					to use as a marker for the place on which the children
					should be inserted once the promise fulfills.
				</p>
				<p>
					We will have first to update our <mark>insert</mark>{' '}
					function to allow inserting nodes at a relative
					position(using placeholders) instead of just appending to
					the parent.
				</p>
				<p></p>
				<Code
					code={`
					const insert = (child, parent, relative) => {
						relative ? relative.before(child) : parent.append(child)
						return child
					}

					`}
					render={false}
				>
					Insert the <mark>child</mark> before the placeholder
				</Code>
				<p></p>
				<p>
					Now we can create a function to create placeholders. Notice
					how we are returning the child on <mark>insert</mark> so on
					this function we can just do{' '}
					<mark>return create(placeholder</mark>
				</p>
				<p></p>
				<Code
					code={`
						const placeholder = (parent, relative) =>{
							const placeholder = document.createElement('span')
							placeholder.style.color = 'aquamarine'
							placeholder.textContent = 'placeholder'
	return create(placeholder, parent, relative)
}
					`}
					render={false}
				>
					The placeholder is created, immediately inserted and
					returned for use
				</Code>
				<p></p>
				<p>
					Then we need to update the code that inserts the promise to
					use a placeholder
				</p>
				<p></p>
				<Code
					code={`
						if(typeof child ==='object'){
						if ("then" in child) {
							relative = placeholder(parent, relative)

							return child.then((result) => {
								  create(
									 result,
									parent,
									relative
								)
							})
						}}
					`}
					render={false}
				></Code>
				<p></p>
				<p>
					Putting everything together, after also adding support for
					inserting the placeholder, it should just work.
				</p>
				<p></p>
				<Code
					code={`
const insert = (child, parent, relative) => {
	relative ? relative.before(child) : parent.append(child);
	return child;
};
const placeholder = (parent, relative) => {
	const placeholder = document.createElement("span");
	placeholder.style.color = "aquamarine";
	placeholder.textContent = "placeholder";
	return create(placeholder, parent, relative);
};
const create = (child, parent, relative) => {
	if (child === null || child === undefined) {
		return;
	}

	if (child instanceof Node) {
		return insert(child, parent, relative);
	}

	if (typeof child === "function") {
		return create(child(), parent, relative);
	}

	if (typeof child === "object") {
		if ("then" in child) {
			relative = placeholder(parent, relative);

			return child.then((result) => {
				create(result, parent, relative);
			});
		}
	}

	return insert(document.createTextNode(child), parent, relative);
};

create("1", document.body);
create(
	new Promise((resolve) => {
		setTimeout(() => resolve("2"), 500);
	}),
	document.body,
);
create("3", document.body);


					`}
					render={true}
				>
					Everything on its place, order is now 123
				</Code>
				<p></p>
				<p>
					However, using a <mark>span</mark> as a placeholder is
					visible. We can use a <mark>comment</mark> or an{' '}
					<mark>empty text node</mark> instead. Personally, I prefer
					empty text nodes because these are also <em>invisible</em>{' '}
					in the developer console.
				</p>
				<p></p>
				<Code
					code={`

// an empty text node its invisible
const placeholder = (parent, relative) => {
	const placeholder = document.createTextNode("");
	return create(placeholder, parent, relative);
};

// a comment is still invisible but seen on the dev tools
// which could be useful for debugging
const placeholder = (parent, relative) => {
	const placeholder = document.createComment("placeholder")
	return create(placeholder, parent, relative);
};



					`}
					render={false}
				>
					Typical placeholders
				</Code>
				<p></p>
			</Section>
			<Section title="Signals and Reactivity">
				<p>
					Now that we have learned how to keep stuff in position in
					the document we can introduce Signals
				</p>
				<p>
					A Signal is a <mark>function</mark> that holds a value that
					may or may not change over time. If you are rendering the
					result of a signal and it updates, you want to render it in
					the same position it was, just like we did with the
					promises.
				</p>
				<p></p>
				<Code
					code={`
					import {signal, create} from 'x/articles/anatomy/anatomy-1.js'

 const [readSignal, writeSignal] = signal(0)

writeSignal(100)

// update signal value every 1 second
setInterval(()=>writeSignal(value=>value+1), 1_000)

create(readSignal, document.body)

					`}
					render={true}
				>
					We learned already how to render functions and{' '}
					<mark>readSignal</mark> is a function, so it will render
					with the code we wrote
				</Code>
				<p></p>
				<p>
					It's rendering but not updating its value. Lets take a look
					to the code we use to render a function
				</p>
				<p></p>
				<Code
					code={`
					if (typeof child === "function") {
		return create(child(), parent, relative);
	}

					`}
					render={false}
				></Code>
				<p></p>
				<p>
					We will need to use an <mark>effect</mark>, so when the
					value of the signal changes, what has been rendered updates
					too. Fine-Grained updates.
				</p>
				<blockquote>
					An <b>effect</b> it's a function that tracks signals reads,
					and re-runs but only when the signals change.
				</blockquote>
				<p></p>
				<p>
					On this case <mark>child</mark> is the signal that we want
					to track
				</p>
				<p></p>
				<Code
					code={`
					if (typeof child === "function") {
						let node
						renderEffect(()=>{
							node = create(child(), parent, relative);
						})
						return node
					}

					`}
					render={false}
				></Code>
				<p></p>
				<blockquote>
					A <b>renderEffect</b> it's just like an effect, but
					immediately executes. Reactive systems may choose to hold
					the execution of regular effects, to collect first, useful
					information that improves the system performance. The order
					on which effects execute, is not warranted by the reactive
					system, again, to improve its performance.
					<br />
					<br />
					By immediately executing with a <mark>renderEffect</mark>,
					we ensure the correct order of execution, allowing us to
					render the DOM in the order that we expect.
				</blockquote>
				<p></p>
				<p>
					Testing our newly added <mark>renderEffect</mark>, now the
					signal change should be updating the DOM
				</p>
				<p></p>
				<Code
					code={`
					import {signal, create} from 'x/articles/anatomy/anatomy-2.js'

 const [readSignal, writeSignal] = signal(0)

writeSignal(100)

// update signal value every 1 second
setInterval(()=>writeSignal(value=>value+1), 2_000)

setInterval(()=>document.body.textContent = '-', 10_000)

create(readSignal, document.body)

					`}
					render={true}
				>
					As expected, the signal change it's triggering an update,
					but we are not removing the old node.
				</Code>
				<p></p>
				<p>
					To remove the old node, we can use a <mark>cleanup</mark>{' '}
					function, which runs when the reactive scope its disposed.
					(tracked places on where the signals were used are
					invalidated)
				</p>
				<p>
					We can ensure that by adding <mark>cleanup</mark> on our
					<mark>insert</mark> function
				</p>
				<p></p>

				<Code
					code={`
					export const insert = (child, parent, relative) => {
	relative ? relative.before(child) : parent.append(child)
	cleanup(()=>child.remove())
	return child
}

					`}
					render={false}
				></Code>

				<p></p>
				<p>Now with the added cleanup should work as expected</p>
				<p></p>
				<Code
					code={`
					import {signal, create} from 'x/articles/anatomy/anatomy-3.js'

 const [readSignal, writeSignal] = signal(0)

writeSignal(0)

// update signal value every 1 second
setInterval(()=>writeSignal(value=>value+1), 1_000)

create(readSignal, document.body)

					`}
					render={true}
				></Code>
				<p></p>
				<p>
					Well, not that fast, if we test a code similar to the
					promises we saw before, we will see stuff renders out of
					order after it updates
				</p>
				<p></p>

				<Code
					code={`
					import {signal, create} from 'x/articles/anatomy/anatomy-3.js'

 const [readSignal, writeSignal] = signal(0)

writeSignal(0)

// update signal value every 1 second
setInterval(()=>writeSignal(value=>value+1), 1_000)

create("- before signal - ", document.body)
create(readSignal, document.body)
create("- after signal - ", document.body)

					`}
					render={true}
				>
					Notice how the number renders at the correct position the
					first time, but it gets pushed to the end of the document
					after an update(hint: you can press "re-run" button to
					refresh the demo output)
				</Code>
				<p></p>
				<p>Placeholders to the rescue.</p>
				<p></p>

				<Code
					code={`

	if (typeof child === 'function') {
		let node
		relative = placeholder(parent, relative)
		renderEffect(() => {
			node = create(child(), parent, relative)
		})
		return node
	}
					`}
					render={false}
				></Code>
				<p></p>
				<p>
					The nodes created will keep their original position by
					inserting them relative to the placeholder. Lets try again
					to see
				</p>
				<p></p>

				<Code
					code={`
					import {signal, create} from 'x/articles/anatomy/anatomy-4.js'

 const [readSignal, writeSignal] = signal(0)

writeSignal(0)

// update signal value every 1 second
setInterval(()=>writeSignal(value=>value+1), 1_000)

create("- before signal - ", document.body)
create(readSignal, document.body)
create("- after signal - ", document.body)

					`}
					render={true}
				>
					The placeholder is still there, but the signal is in between
					the text as we expect
				</Code>
				<p></p>

				<p>
					We wrote two of the common internal functions,{' '}
					<mark>insert</mark> and <mark>create</mark>.
				</p>
			</Section>

			<Section title="render">
				<p>
					The <mark>render</mark> function, it's the one that creates
					a detached tracking scope (a <mark>root</mark> that doesn't
					dispose when the parent scope disposes), to hold all nodes
					created under it. It can be disposed of by calling the
					function that returns, unmounting all the nodes we created
					with it.
				</p>
				<p></p>
				<Code
					code={`
					import {root, create, cleanup} from 'x/articles/anatomy/anatomy-4.js'

					  const render = (child, parent = document.body) => {
	const dispose = root(disposer => {
		create(child, parent)
		return disposer
	})
	cleanup(dispose)
	return dispose
}

const dispose = 	render('hello world!', document.body)

setTimeout(dispose, 5_000)
					`}
					render={true}
				>
					Render the text "hello world" and dispose it after five
					seconds
				</Code>
				<p></p>
				<p></p>
			</Section>
			<Section title="Source Code">
				<p>
					The code used on this article is on{' '}
					<a href="https://github.com/potahtml/docs/tree/master/src/pages/%40articles/anatomy">
						github
					</a>
					. An implementation supporting slightly more data-types to
					render, it's on the file named{' '}
					<a href="https://github.com/potahtml/docs/tree/master/src/pages/%40articles/anatomy/clumsy.js">
						clumsy.js
					</a>
					.<p></p>
					For a real world reactive renderer implementation, you can
					take a look at{' '}
					<a href="https://github.com/potahtml/pota/blob/master/src/renderer/">
						pota
					</a>{' '}
					renderer, <a href="https://github.com/vobyjs/voby">voby</a>{' '}
					or{' '}
					<a href="https://github.com/ryansolid/dom-expressions/tree/main/packages/dom-expressions">
						dom-expressions
					</a>
					.<p></p>
					If you enjoy this topic you can join{' '}
					<a href="https://discord.gg/solidjs">SolidJS</a> Discord and
					we can chat!
				</p>
				<p></p>
				<blockquote>
					Clumsy, partner in mischief with flimsy
				</blockquote>
				<p></p>
			</Section>
		</>
	)
}
