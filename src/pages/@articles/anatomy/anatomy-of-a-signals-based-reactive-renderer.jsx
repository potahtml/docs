import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Anatomy of a Signals Based Reactive Renderer">
				<p>
					We are going to implement from scratch the core parts of a
					signals based reactive web renderer: rendering,
					placeholders, node creation and node disposal.
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
					doesn't cover everything, it's an initial kick for further
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
					This function will be used whenever we have a proper{' '}
					<mark>Node</mark>.
				</Code>
			</Section>
			<Section title="create">
				<p>
					We also need a function to create nodes from any kind of
					data. The created nodes are inserted in the document with{' '}
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

				<p>
					That's a bit too simplistic, lets make it more fancy by
					adding more data-types
				</p>
				<p>
					<ol>
						<li>
							Avoiding <mark>null</mark> and <mark>undefined</mark> by
							returning early
						</li>
						<li>
							Allowing <mark>Nodes</mark> by inserting them directly
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

if (child instanceof Node) {
		return insert(child, parent, relative);
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
				>
					{' '}
					Note how we had to add <mark>return</mark> statements to
					avoid the other conditions.
				</Code>
			</Section>
			<Section title="Placeholders">
				<p>
					Now lets add support for <mark>Promises</mark>, by checking
					if <mark>then</mark> it's in the child, when child it's an
					<mark>object</mark>.
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

if (child instanceof Node) {
		return insert(child, parent, relative);
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
								  create(
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
					should have been inserted once the promise fulfills.
				</p>
				<p>
					We will have first to update our <mark>insert</mark>{' '}
					function to allow inserting nodes at a relative position
					(using placeholders), instead of just appending to the
					parent.
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
					Insert the <mark>child</mark> before the placeholder, and
					return the added <mark>child</mark>
				</Code>
				<p></p>
				<p>Now we can define a function to create placeholders.</p>
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
				<p>Putting everything together, it should just work.</p>
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
					Everything on its place, order is now 123 as expected
				</Code>
				<p></p>
				<p>
					However, we are using a visible <mark>span</mark> to
					illustrate how a placeholder works. We can use a{' '}
					<mark>comment</mark> or an <mark>empty text node</mark>{' '}
					instead, to hide it from the screen.
				</p>
				<p>
					For debugging, a <mark>comment</mark> it's useful because
					it's visible on the developer tools and can carry debugging
					text. Once we are done, we can switch to an{' '}
					<mark>empty text node</mark> to make it <em>invisible</em>{' '}
					in the developer tools.
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
const placeholder = (parent, relative) => {
	const placeholder = document.createComment(" -debug info- ")
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
					Now that we know how to render functions, and keep stuff in
					position in the document we can introduce Signals
				</p>
				<p>
					A Signal is a <mark>function</mark> that holds a value that
					may or may not change over time. If you are rendering the
					result of a signal and the value updates, you want to render
					it in the same position it was, just like we did with the
					promises.
				</p>
				<p></p>
				<Code
					code={`
					import {signal, create} from 'x/articles/anatomy/anatomy-1.js'

 const [readSignal, writeSignal] = signal(0)

writeSignal(100)

create(readSignal, document.body)

const button = document.createElement('button')
button.textContent = 'add 1 to signal'
button.onclick = () => writeSignal(value=>value+1)

create(button, document.body)

					`}
					render={true}
				>
					We learned already how to render functions, and{' '}
					<mark>readSignal</mark> is a function, so it will render
					with the code we wrote
				</Code>
				<p></p>
				<p>
					However, it's rendering but not updating its value when we
					click the button. Lets take a look to the code we use to
					render a function
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
					In this case, <mark>child</mark> is the signal that we want
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
					information that improves the system performance.
					<br />
					<br />
					<u>
						The order on which effects execute is not warranted by the
						reactive system
					</u>
					, again, to improve its performance.
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

create(readSignal, document.body)

const button = document.createElement('button')
button.textContent = 'add 1 to signal'
button.onclick = () => writeSignal(value=>value+1)

create(button, document.body)


					`}
					render={true}
				>
					The signal change it's triggering an update, but we are not
					removing the old node.
				</Code>
				<p></p>
				<p>
					To remove the old node, we can use a <mark>cleanup</mark>{' '}
					function, which runs when the tracking scope its disposed.
				</p>
				<p></p>
				<blockquote>
					An <b>effect/renderEffect</b> creates a tracking scope, that
					keeps tracks of which signals have been read. When any of
					the signals read change, the reactive scope is invalidated,{' '}
					<mark>cleanup</mark> callbacks run, and the{' '}
					<mark>effect</mark> function is re-executed
				</blockquote>
				<p></p>
				<p>
					We can ensure the old node is removed by adding{' '}
					<mark>cleanup</mark> on our
					<mark>insert</mark> function. That way, when the tracking
					scope is invalidated, our node is removed from the document.
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
				<p>Now with the added cleanup it should work as expected</p>
				<p></p>
				<Code
					code={`
					import {signal, create} from 'x/articles/anatomy/anatomy-3.js'

 const [readSignal, writeSignal] = signal(0)

writeSignal(100)

create(readSignal, document.body)


const button = document.createElement('button')
button.textContent = 'add 1 to signal'
button.onclick = () => writeSignal(value=>value+1)

create(button, document.body)


					`}
					render={true}
				></Code>
				<p></p>
				<p>
					Well, not that fast, the number is moving to the end of the
					document, a problem similar to the promises we saw before.
					Placeholders to the rescue.
				</p>

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
				>
					The signal will keep its position by inserting relative to
					the placeholder.
				</Code>
				<p></p>
				<p>Lets try again to see</p>
				<p></p>

				<Code
					code={`
					import {signal, create} from 'x/articles/anatomy/anatomy-4.js'

 const [readSignal, writeSignal] = signal(0)

writeSignal(100)

create(readSignal, document.body)


const button = document.createElement('button')
button.textContent = 'add 1 to signal'
button.onclick = () => writeSignal(value=>value+1)

create(button, document.body)

					`}
					render={true}
				>
					The placeholder keeps the signal in position
				</Code>
				<p></p>

				<p>
					We wrote two of the common internal functions,{' '}
					<mark>insert</mark> and <mark>create</mark>, while
					considering their position in the document with{' '}
					<mark>placeholders</mark>.
				</p>
			</Section>

			<Section title="render">
				<p>
					The <mark>render</mark> function, it's the one that creates
					a detached tracking scope (a <mark>root</mark> that doesn't
					dispose when the parent scope disposes), to hold all nodes
					created under it. It can be disposed, by calling the
					function that returns, unmounting all the nodes we created
					with it.
				</p>
				<p></p>
				<Code
					code={`
					import {root, create, cleanup} from 'x/articles/anatomy/anatomy-5.js'

					  const render = (child, parent = document.body) => {
	const dispose = root(disposer => {
		create(child, parent)
		return disposer
	})
	cleanup(dispose)
	return dispose
}




function App(){

	return create('Hello World', document.body)


}

const dispose  = 	render(App, document.body)


	const button = document.createElement('button')
button.textContent = 'unmount created nodes'
button.onclick = dispose

create(button, document.body)




					`}
					render={true}
				></Code>
				<p></p>
			</Section>
			<Section title="Source Code">
				<p>
					The code used of this article it's on{' '}
					<a href="https://github.com/potahtml/docs/tree/master/src/pages/%40articles/anatomy">
						github
					</a>
					. For a real world reactive renderer implementation, you can
					take a look at{' '}
					<a href="https://github.com/potahtml/pota/blob/master/src/renderer/">
						pota
					</a>
					, <a href="https://github.com/vobyjs/voby">voby</a> or{' '}
					<a href="https://github.com/ryansolid/dom-expressions/tree/main/packages/dom-expressions">
						dom-expressions
					</a>
					.<p></p>
					If you enjoy this topic you can join{' '}
					<a href="https://discord.gg/solidjs">SolidJS</a> Discord to
					chat!
				</p>
				<p></p>
				<p></p>
				<blockquote>
					Clumsy, partner in mischief with flimsy
				</blockquote>
				<p></p>
				<p></p>
			</Section>
		</>
	)
}
