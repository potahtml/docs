import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title='Custom Elements "Everywhere" Tests'>
				Suit of tests from{' '}
				<a href="https://github.com/webcomponents/custom-elements-everywhere">
					Custom Elements "Everywhere"
				</a>
				. For <mark>Custom Elements</mark> information please refer to
				this <a href="/CustomElement/">page</a> instead.
			</Header>

			<Section title="Basic: can display a Custom Element with no children">
				<p>
					<Code
						code={`
import { render } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

render(() => <ce-without-children />);

const rendered = document.body.innerHTML.trim();

render(
	<div>
		did it render? {rendered === "<ce-without-children></ce-without-children>"}
	</div>,
);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Basic: can display a Custom Element with children in a Shadow Root">
				<p>
					<Code
						code={`

import { render } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

render(() => <ce-with-children />);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Basic: can display a Custom Element with children in a Shadow Root and pass in Light DOM children">
				<p>
					<Code
						code={`
import { render } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

render(() => <ce-with-children>hola</ce-with-children>);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Basic: can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element">
				<p>
					<Code
						code={`
import { render, signal } from "pota";
import { Show } from "pota/web";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const [show, setShow, updateShow] = signal(true);
const toggle = () => updateShow((value) => !value);

render(
	<>
		<button onClick={toggle}>toggle</button>
		<Show when={show} fallback={<div id="dummy">Dummy view</div>}>
			<ce-with-children id="wc">hola!</ce-with-children>
		</Show>
	</>,
);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Basic: will pass boolean data as either an attribute or a property">
				<p>
					<Code
						code={`
import { render, ref } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const data = {
	bool: true,
	num: 42,
	str: "Pota",
	arr: ["P", "o", "t", "a"],
	obj: { org: "potahtml", repo: "pota" },
	camelCaseObj: { label: "passed" },
};

const wc = ref();
render(() => (
	<ce-with-properties
		ref={wc}
		bool={data.bool}
		num={data.num}
		str={data.str}
		arr={data.arr}
		obj={data.obj}
		camelCaseObj={data.camelCaseObj}
	/>
));

const element = wc();

render(
	<p>
		has attribute \`bool \`? {element.hasAttribute("bool")},{" "}
		{element.getAttribute("bool")}
	</p>,
);
render(
	<p>
		has property \`bool \`? {"bool" in element} {element.bool}
	</p>,
);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Basic: will pass numeric data as either an attribute or a property">
				<p>
					<Code
						code={`
import { render, ref } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const data = {
	bool: true,
	num: 42,
	str: "Pota",
	arr: ["P", "o", "t", "a"],
	obj: { org: "potahtml", repo: "pota" },
	camelCaseObj: { label: "passed" },
};

const wc = ref();
render(() => (
	<ce-with-properties
		ref={wc}
		bool={data.bool}
		num={data.num}
		str={data.str}
		arr={data.arr}
		obj={data.obj}
		camelCaseObj={data.camelCaseObj}
	/>
));

const element = wc();

render(
	<p>
		has attribute \`num\`? {element.hasAttribute("num")},{" "}
		{element.getAttribute("num")}
	</p>,
);
render(
	<p>
		has property \`num\`? {"num" in element} {element.num}
	</p>,
);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Basic: will pass string data as either an attribute or a property">
				<p>
					<Code
						code={`
import { render, ref } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const data = {
	bool: true,
	num: 42,
	str: "Pota",
	arr: ["P", "o", "t", "a"],
	obj: { org: "potahtml", repo: "pota" },
	camelCaseObj: { label: "passed" },
};

const wc = ref();
render(() => (
	<ce-with-properties
		ref={wc}
		bool={data.bool}
		num={data.num}
		str={data.str}
		arr={data.arr}
		obj={data.obj}
		camelCaseObj={data.camelCaseObj}
	/>
));

const element = wc();

render(
	<p>
		has attribute \`str\`? {element.hasAttribute("str")},{" "}
		{element.getAttribute("str")}
	</p>,
);
render(
	<p>
		has property \`str\`? {"str" in element} {element.str}
	</p>,
);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Basic: can imperatively listen to a DOM event dispatched by a Custom Element">
				<p>
					<Code
						code={`
import { render, ref, signal } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const [eventHandled, setHandled] = signal(false);
const handleTestEvent = () => setHandled(true);

const wc = ref();
render(() => (
	<>
		<div>{() => eventHandled().toString()}</div>
		<ce-with-event ref={wc} id="wc" on:camelEvent={handleTestEvent} />
	</>
));
const element = wc();

render(() => <button onClick={() => element.click()}>try it out</button>);

  					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Advanced: Attributes & properties">
				<p>
					<Code
						code={`
import { render, ref } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const data = {
	bool: true,
	num: 42,
	str: "Pota",
	arr: ["P", "o", "t", "a"],
	obj: { org: "potahtml", repo: "pota" },
	camelCaseObj: { label: "passed" },
};

const wc = ref();
render(() => (
	<ce-with-properties
		ref={wc}
		bool={data.bool}
		num={data.num}
		str={data.str}
		arr={data.arr}
		obj={data.obj}
		camelCaseObj={data.camelCaseObj}
	/>
));
const element = wc();

const arr = element.arr;

render(
	<p>
		is arr an array? {Array.isArray(arr)} {arr}
	</p>,
);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Advanced: Will pass object data as a property">
				<p>
					<Code
						code={`

import { render, ref } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const data = {
	bool: true,
	num: 42,
	str: "Pota",
	arr: ["P", "o", "t", "a"],
	obj: { org: "potahtml", repo: "pota" },
	camelCaseObj: { label: "passed" },
};

const wc = ref();
render(() => (
	<ce-with-properties
		ref={wc}
		bool={data.bool}
		num={data.num}
		str={data.str}
		arr={data.arr}
		obj={data.obj}
		camelCaseObj={data.camelCaseObj}
	/>
));
const element = wc();

const obj = element.obj;

render(<p> is data an object? {typeof obj === "object"}</p>);

render(<p> {JSON.stringify(obj)}</p>);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Advanced: Will pass object data to a camelCase-named property">
				<p>
					<Code
						code={`

import { render, ref } from "pota";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const data = {
	bool: true,
	num: 42,
	str: "Pota",
	arr: ["P", "o", "t", "a"],
	obj: { org: "potahtml", repo: "pota" },
	camelCaseObj: { label: "passed" },
};

const wc = ref();
render(() => (
	<ce-with-properties
		ref={wc}
		bool={data.bool}
		num={data.num}
		str={data.str}
		arr={data.arr}
		obj={data.obj}
		camelCaseObj={data.camelCaseObj}
	/>
));
const element = wc();

const camelCaseObj = element.camelCaseObj;

render(<p> label is: {camelCaseObj.label}</p>);

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>

			<Section title="Advanced: Can declaratively listen to a lowercase DOM event dispatched by a Custom Element">
				<p>
					<b>Note</b>: this test handles all the cases because the
					others are just duplicates checking for each different{' '}
					<mark>true</mark>
				</p>
				<p>
					<Code
						code={`
import { render, ref } from "pota";
import { signalify } from "pota/store";
import "/pages/%40components/custom-element/custom-elements-everywhere/custom-elements.js";

const state = signalify({
		lowercaseHandled: false,
		kebabHandled: false,
		camelHandled: false,
		capsHandled: false,
		pascalHandled: false,
	}),
	handleLowercaseEvent = () => (state.lowercaseHandled = true),
	handleKebabEvent = () => (state.kebabHandled = true),
	handleCamelEvent = () => (state.camelHandled = true),
	handleCapsEvent = () => (state.capsHandled = true),
	handlePascalEvent = () => (state.pascalHandled = true);

const wc = ref();
render(() => (
	<>
		<div id="lowercase">{() => state.lowercaseHandled.toString()}</div>
		<div id="kebab">{() => state.kebabHandled.toString()}</div>
		<div id="camel">{() => state.camelHandled.toString()}</div>
		<div id="caps">{() => state.capsHandled.toString()}</div>
		<div id="pascal">{() => state.pascalHandled.toString()}</div>
		<ce-with-event
			ref={wc}
			id="wc"
			on:lowercaseevent={handleLowercaseEvent}
			on:kebab-event={handleKebabEvent}
			on:camelEvent={handleCamelEvent}
			on:CAPSevent={handleCapsEvent}
			on:PascalEvent={handlePascalEvent}
		/>
	</>
));

const element = wc();

element.click();

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>
			<Section title="Reactive: Will recurse when creating a custom element in an effect?">
				<p>
					Reactive libraries should untrack custom elements callbacks.
				</p>
				<p>
					<Code
						code={`
import {
	render,
	signal,
	effect,
	untrack,
	setAttribute,
	setProperty,
} from "pota";

const [read, write] = signal(true);

function recurse(name) {
	console.log(name);
	write(!read());
}

class CustomElement extends HTMLElement {
	static observedAttributes = ["string-attribute"];

	constructor() {
		super();
		recurse("constructor");
	}
	connectedCallback() {
		recurse("Custom element added to page.");
	}

	disconnectedCallback() {
		recurse("Custom element removed from page.");
	}

	adoptedCallback() {
		recurse("Custom element moved to new page.");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		recurse("Attribute has changed.");
	}
	set boolean(value) {
		recurse("boolean has changed.");
	}
}

customElements.define("custom-element", CustomElement);

/** Make sure the test is done inside an effect */

let dispose

effect(() => {
	// if the reactive lib tracks any custom element callbacks, it will recurse.

	/**
	 * "document.createElement" is not controlled by the reactive libs, so
	 * just untrack it.
	 */
	const element = untrack(() => document.createElement("custom-element"));

	/** Reactive lib shouldnt cause tracking when setting an attribute */
	setAttribute(element, "string-attribute", "lalala 2");

	/** Reactive lib shouldnt cause tracking when setting a property */
	setProperty(element, "boolean", true);

	/** Reactive lib shouldnt cause tracking when rendering */
	dispose = render(element);

	/** Reactive lib shouldnt cause tracking when removed */
	dispose()
});

 					`}
					>
						Yep
					</Code>
				</p>
			</Section>
		</>
	)
}
