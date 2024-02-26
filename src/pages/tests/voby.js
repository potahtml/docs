//TODO: Test that portals are suspendable

/* IMPORT */
/*
import * as Voby from 'voby'
import {
	Dynamic,
	ErrorBoundary,
	For,
	If,
	KeepAlive,
	Portal,
	Suspense,
	Switch,
	Ternary,
} from 'voby'
import {
	useContext,
	useEffect,
	useInterval,
	useMemo,
	usePromise,
	useResource,
	useTimeout,
} from 'voby'
import {
	$,
	createContext,
	createDirective,
	hmr,
	html,
	lazy,
	render,
	renderToString,
	store,
	template,
} from 'voby'


globalThis.Voby = Voby*/

import {
	effect,
	memo,
	mutable,
	render,
	signal,
	Show,
	Portal,
	context,
	Dynamic,
	Switch,
	Match,
	Pota,
	For,
	renderEffect,
} from 'pota'
import { html } from 'pota/html'

function $(val) {
	const [read, write] = signal(val)
	return (...args) => (args.length > 0 ? write(...args) : read())
}

const useEffect = effect
const useInterval = setInterval
const useTimeout = setTimeout
const useMemo = memo
const store = mutable
const createContext = context
const If = Show
const Ternary = Show
Switch.Case = Match
const usePromise = async function (r) {
	return $(r)
}

const KeepAlive = props => props.children

const renderToString = () => {}
/* HELPERS */

const TEST_INTERVAL = 500 // Lowering this makes it easier to spot some memory leaks

const assert = (result, message) => {
	console.assert(result, message)
}

const random = () => {
	// It's important for testing that 0, 1 or reused numbers are never returned

	const value = Math.random()

	if (value === 0 || value === 1) return random()

	return value
}

const randomBigInt = () => {
	return BigInt(Math.floor(random() * 10000))
}

const randomColor = () => {
	return `#${Math.floor(random() * 0xffffff)
		.toString(16)
		.padStart(6, '0')}`
}

const TestSnapshots = ({ Component, props }) => {
	const ref = $()
	let index = -1
	let htmlPrev = ''
	let ticks = 0
	let done = false
	const getHTML = () => {
		const element = ref()
		if (!element) return ''
		return element.innerHTML
	}
	const getSnapshot = html => {
		const htmlWithoutTitle = html.replace(
			/<h3>[a-zA-Z0-9 -]*<\/h3>/,
			'',
		)
		const htmlWithRandom = htmlWithoutTitle.replace(
			/0\.\d+/g,
			'{random}',
		)
		const htmlWitRandomBigint = htmlWithRandom.replace(
			/(?<!\d)(0|[1-9][0-9]?[0-9]?[0-9]?|10000)n/g,
			'{random-bigint}n',
		)
		const htmlWithRandomHex = htmlWitRandomBigint.replace(
			/#[a-fA-F0-9]{6,8}/g,
			'{random-color}',
		)
		return htmlWithRandomHex
	}
	const tick = () => {
		if (done) return
		const indexPrev = index
		ticks += 1
		index = (index + 1) % Component.test.snapshots.length
		if (index < indexPrev && Component.test.wrap === false) {
			done = true
			return
		}
		const expectedSnapshot = Component.test.snapshots[index]
		const actualHTML = getHTML()
		const actualSnapshot = getSnapshot(actualHTML)
		assert(
			actualSnapshot === expectedSnapshot,
			`[${Component.name}]: Expected '${actualSnapshot}' to be equal to '${expectedSnapshot}'`,
		)
		if (expectedSnapshot.includes('{random}')) {
			assert(
				actualHTML !== htmlPrev,
				`[${Component.name}]: Expected to find different {random} values in the HTML`,
			)
		}
		if (expectedSnapshot.includes('{random-bigint}')) {
			assert(
				actualHTML !== htmlPrev,
				`[${Component.name}]: Expected to find different {random-bigint} values in the HTML`,
			)
		}
		if (expectedSnapshot.includes('{random-color}')) {
			assert(
				actualHTML !== htmlPrev,
				`[${Component.name}]: Expected to find different {random-color} values in the HTML`,
			)
		}
		htmlPrev = actualHTML
	}
	const noUpdate = () => {
		assert(
			false,
			`[${Component.name}]: Expected no updates to ever happen`,
		)
	}
	const yesUpdate = () => {
		if (Component.test.static) return
		if (ticks > 1) return
		assert(false, `[${Component.name}]: Expected at least one update`)
	}
	useEffect(() => {
		const root = ref()
		if (!root) return
		tick()
		const timeoutId = setTimeout(yesUpdate, 1500)
		const onMutation = Component.test.static ? noUpdate : tick
		const observer = new MutationObserver(onMutation)
		const options = {
			attributes: true,
			childList: true,
			characterData: true,
			subtree: true,
		}
		observer.observe(root, options)
		return () => observer.disconnect()
	})
	return (
		<div ref={ref}>
			<Component {...props} />
		</div>
	)
}

/* MAIN */

//TODO: Test that error boundaries wrapped around built-in components work
//TODO: Test template with all sorts of supported props
//TODO: Automate all tests
//TODO: Enable all tests

const TestNullStatic = () => {
	return (
		<>
			<h3>Null - Static</h3>
			<p>{null}</p>
		</>
	)
}

TestNullStatic.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestNullObservable = () => {
	const o = $(null)
	const toggle = () => o(prev => (prev === null ? '' : null))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Null - Observable</h3>
			<p>{o}</p>
		</>
	)
}

TestNullObservable.test = {
	static: false,
	snapshots: ['<p><!----></p>', '<p></p>'],
}

const TestNullFunction = () => {
	const o = $(null)
	const toggle = () => o(prev => (prev === null ? '' : null))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Null - Function</h3>
			<p>{() => o()}</p>
		</>
	)
}

TestNullFunction.test = {
	static: false,
	snapshots: ['<p><!----></p>', '<p></p>'],
}

const TestNullRemoval = () => {
	const o = $(null)
	const toggle = () => o(prev => (prev === null ? '' : null))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Null - Removal</h3>
			<p>({o})</p>
		</>
	)
}

TestNullRemoval.test = {
	static: false,
	snapshots: ['<p>(<!---->)</p>', '<p>()</p>'],
}

const TestUndefinedStatic = () => {
	return (
		<>
			<h3>Undefined - Static</h3>
			<p>{undefined}</p>
		</>
	)
}

TestUndefinedStatic.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestUndefinedObservable = () => {
	const o = $(undefined)
	const toggle = () =>
		o(prev => (prev === undefined ? '' : undefined))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Undefined - Observable</h3>
			<p>{o}</p>
		</>
	)
}

TestUndefinedObservable.test = {
	static: false,
	snapshots: ['<p><!----></p>', '<p></p>'],
}

const TestUndefinedFunction = () => {
	const o = $(undefined)
	const toggle = () =>
		o(prev => (prev === undefined ? '' : undefined))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Undefined - Function</h3>
			<p>{() => o()}</p>
		</>
	)
}

TestUndefinedFunction.test = {
	static: false,
	snapshots: ['<p><!----></p>', '<p></p>'],
}

const TestUndefinedRemoval = () => {
	const o = $(undefined)
	const toggle = () =>
		o(prev => (prev === undefined ? '' : undefined))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Undefined - Removal</h3>
			<p>({o})</p>
		</>
	)
}

TestUndefinedRemoval.test = {
	static: false,
	snapshots: ['<p>(<!---->)</p>', '<p>()</p>'],
}

const TestBooleanStatic = () => {
	return (
		<>
			<h3>Boolean - Static</h3>
			<p>
				{true}
				{false}
			</p>
		</>
	)
}

TestBooleanStatic.test = {
	static: true,
	snapshots: ['<p><!----></p>'],
}

const TestBooleanObservable = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Boolean - Observable</h3>
			<p>{o}</p>
		</>
	)
}

TestBooleanObservable.test = {
	static: true,
	snapshots: ['<p><!----></p>'],
}

const TestBooleanFunction = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Boolean - Function</h3>
			<p>{() => o()}</p>
		</>
	)
}

TestBooleanFunction.test = {
	static: true,
	snapshots: ['<p><!----></p>'],
}

const TestBooleanRemoval = () => {
	const o = $(true)
	const toggle = () => o(prev => (prev ? null : true))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Boolean - Removal</h3>
			<p>({o})</p>
		</>
	)
}

TestBooleanRemoval.test = {
	static: true,
	snapshots: ['<p>(<!---->)</p>'],
}

const TestSymbolStatic = () => {
	return (
		<>
			<h3>Symbol - Static</h3>
			<p>{Symbol()}</p>
		</>
	)
}

TestSymbolStatic.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestSymbolObservable = () => {
	const o = $(Symbol())
	const randomize = () => o(Symbol())
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Symbol - Observable</h3>
			<p>{o}</p>
		</>
	)
}

TestSymbolObservable.test = {
	static: true,
	snapshots: ['<p><!----></p>'],
}

const TestSymbolFunction = () => {
	const o = $(Symbol())
	const randomize = () => o(Symbol())
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Symbol - Function</h3>
			<p>{() => o()}</p>
		</>
	)
}

TestSymbolFunction.test = {
	static: true,
	snapshots: ['<p><!----></p>'],
}

const TestSymbolRemoval = () => {
	const o = $(Symbol())
	const randomize = () => o(prev => (prev ? null : Symbol()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Symbol - Removal</h3>
			<p>({o})</p>
		</>
	)
}

TestSymbolRemoval.test = {
	static: true,
	snapshots: ['<p>(<!---->)</p>'],
}

const TestNumberStatic = () => {
	return (
		<>
			<h3>Number - Static</h3>
			<p>{123}</p>
		</>
	)
}

TestNumberStatic.test = {
	static: true,
	snapshots: ['<p>123</p>'],
}

const TestNumberObservable = () => {
	const o = $(random())
	const randomize = () => o(random())
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Number - Observable</h3>
			<p>{o}</p>
		</>
	)
}

TestNumberObservable.test = {
	static: false,
	snapshots: ['<p>{random}</p>'],
}

const TestNumberFunction = () => {
	const o = $(random())
	const randomize = () => o(random())
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Number - Function</h3>
			<p>{() => o()}</p>
		</>
	)
}

TestNumberFunction.test = {
	static: false,
	snapshots: ['<p>{random}</p>'],
}

const TestNumberRemoval = () => {
	const o = $(random())
	const randomize = () => o(prev => (prev ? null : random()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Number - Removal</h3>
			<p>({o})</p>
		</>
	)
}

TestNumberRemoval.test = {
	static: false,
	snapshots: ['<p>({random})</p>', '<p>(<!---->)</p>'],
}

const TestBigIntStatic = () => {
	return (
		<>
			<h3>BigInt - Static</h3>
			<p>{123123n}n</p>
		</>
	)
}

TestBigIntStatic.test = {
	static: true,
	snapshots: ['<p>123123n</p>'],
}

const TestBigIntObservable = () => {
	const o = $(randomBigInt())
	const randomize = () => o(randomBigInt())
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>BigInt - Observable</h3>
			<p>{o}n</p>
		</>
	)
}

TestBigIntObservable.test = {
	static: false,
	snapshots: ['<p>{random-bigint}n</p>'],
}

const TestBigIntFunction = () => {
	const o = $(randomBigInt())
	const randomize = () => o(randomBigInt())
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>BigInt - Function</h3>
			<p>{() => o()}n</p>
		</>
	)
}

TestBigIntFunction.test = {
	static: false,
	snapshots: ['<p>{random-bigint}n</p>'],
}

const TestBigIntRemoval = () => {
	const o = $(randomBigInt())
	const randomize = () => o(prev => (prev ? null : randomBigInt()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>BigInt - Removal</h3>
			<p>({o}n)</p>
		</>
	)
}

TestBigIntRemoval.test = {
	static: false,
	snapshots: ['<p>({random-bigint}n)</p>', '<p>(<!---->n)</p>'],
}

const TestStringStatic = () => {
	return (
		<>
			<h3>String - Static</h3>
			<p>{'string'}</p>
		</>
	)
}

TestStringStatic.test = {
	static: true,
	snapshots: ['<p>string</p>'],
}

const TestStringObservable = () => {
	const o = $(String(random()))
	const randomize = () => o(String(random()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>String - Observable</h3>
			<p>{o}</p>
		</>
	)
}

TestStringObservable.test = {
	static: false,
	snapshots: ['<p>{random}</p>'],
}

const TestStringObservableStatic = () => {
	const o = $(String(random()))
	const randomize = () => o(String(random()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>String - Observable Static</h3>
			<p>{o()}</p>
		</>
	)
}

TestStringObservableStatic.test = {
	static: true,
	snapshots: ['<p>{random}</p>'],
}

const TestStringObservableDeepStatic = () => {
	return useMemo(() => {
		const Deep = () => {
			const o = $(String(random()))
			const randomize = () => o(String(random()))
			useInterval(randomize, TEST_INTERVAL)
			return (
				<>
					<h3>String - Observable Deep Static</h3>
					<p>{o()}</p>
				</>
			)
		}
		return <Deep />
	})
}

TestStringObservableDeepStatic.test = {
	static: true,
	snapshots: ['<p>{random}</p>'],
}

const TestStringFunction = () => {
	const o = $(String(random()))
	const randomize = () => o(String(random()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>String - Function</h3>
			<p>{() => o()}</p>
		</>
	)
}

TestStringFunction.test = {
	static: false,
	snapshots: ['<p>{random}</p>'],
}

const TestStringRemoval = () => {
	const o = $(String(random()))
	const randomize = () => o(prev => (prev ? null : String(random())))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>String - Removal</h3>
			<p>({o})</p>
		</>
	)
}

TestStringRemoval.test = {
	static: false,
	snapshots: ['<p>({random})</p>', '<p>(<!---->)</p>'],
}

const TestAttributeStatic = () => {
	return (
		<>
			<h3>Attribute - Static</h3>
			<p data-color="red">content</p>
		</>
	)
}

TestAttributeStatic.test = {
	static: true,
	snapshots: ['<p data-color="red">content</p>'],
}

const TestAttributeObservable = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? 'blue' : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Attribute - Observable</h3>
			<p data-color={o}>content</p>
		</>
	)
}

TestAttributeObservable.test = {
	static: false,
	snapshots: [
		'<p data-color="red">content</p>',
		'<p data-color="blue">content</p>',
	],
}

const TestAttributeObservableBoolean = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Attribute - Observable Boolean</h3>
			<p data-red={o}>content</p>
		</>
	)
}

TestAttributeObservableBoolean.test = {
	static: false,
	snapshots: [
		'<p data-red="">content</p>',
		'<p data-red="false">content</p>',
	],
}

const TestAttributeFunction = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? 'blue' : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Attribute - Function</h3>
			<p data-color={() => `dark${o()}`}>content</p>
		</>
	)
}

TestAttributeFunction.test = {
	static: false,
	snapshots: [
		'<p data-color="darkred">content</p>',
		'<p data-color="darkblue">content</p>',
	],
}

const TestAttributeFunctionBoolean = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Attribute - Function Boolean</h3>
			<p data-red={() => !o()}>content</p>
		</>
	)
}

TestAttributeFunctionBoolean.test = {
	static: false,
	snapshots: [
		'<p data-red="false">content</p>',
		'<p data-red="">content</p>',
	],
}

const TestAttributeRemoval = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? null : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Attribute - Removal</h3>
			<p data-color={o}>content</p>
		</>
	)
}

TestAttributeRemoval.test = {
	static: false,
	snapshots: ['<p data-color="red">content</p>', '<p>content</p>'],
}

const TestAttributeBooleanStatic = () => {
	return (
		<>
			<h3>Attribute Boolan - Static</h3>
			<p disabled={true}>content</p>
			<p disabled={false}>content</p>
		</>
	)
}

TestAttributeBooleanStatic.test = {
	static: true,
	snapshots: ['<p disabled="">content</p><p>content</p>'],
}

const TestPropertyCheckedStatic = () => {
	return (
		<>
			<h3>Property - Checked Static</h3>
			<p>
				<input
					type="checkbox"
					checked={true}
				/>
			</p>
		</>
	)
}

const TestPropertyCheckedObservable = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Property - Checked Observable</h3>
			<p>
				<input
					type="checkbox"
					checked={o}
				/>
			</p>
		</>
	)
}

const TestPropertyCheckedFunction = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Property - Checked Function</h3>
			<p>
				<input
					type="checkbox"
					checked={() => o()}
				/>
			</p>
		</>
	)
}

const TestPropertyCheckedRemoval = () => {
	const o = $(true)
	const toggle = () => o(prev => (prev ? null : true))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Property - Checked Removal</h3>
			<p>
				<input
					type="checkbox"
					checked={o}
				/>
			</p>
		</>
	)
}

const TestPropertyValueStatic = () => {
	return (
		<>
			<h3>Property - Value Static</h3>
			<p>
				<input value="value" />
			</p>
		</>
	)
}

const TestPropertyValueObservable = () => {
	const o = $(String(random()))
	const randomize = () => o(String(random()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Property - Value Observable</h3>
			<p>
				<input value={o} />
			</p>
		</>
	)
}

const TestPropertyValueFunction = () => {
	const o = $(String(random()))
	const randomize = () => o(String(random()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Property - Value Function</h3>
			<p>
				<input value={() => o()} />
			</p>
		</>
	)
}

const TestPropertyValueRemoval = () => {
	const o = $(String(random()))
	const randomize = () => o(prev => (prev ? null : String(random())))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Property - Value Removal</h3>
			<p>
				<input value={o} />
			</p>
		</>
	)
}

const TestInputLabelFor = () => {
	const o = $(String(random()))
	const randomize = () => o(prev => (prev ? null : String(random())))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>Input - Label For</h3>
			<p>
				<label htmlFor="for-target">htmlFor</label>
			</p>
			<p>
				<label for="for-target">for</label>
			</p>
			<p>
				<input id="for-target" />
			</p>
		</>
	)
}

const TestInputForm = () => {
	return (
		<>
			<h3>Input - Input Form</h3>
			{/*<input form={undefined} />*/}
			{/*<input form={null} />*/}
			<input form="foo" />
		</>
	)
}

TestInputForm.test = {
	static: true,
	snapshots: ['<input><input><input form="foo">'],
}

const TestCheckboxIndeterminateToggle = () => {
	const o = $(false)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Checkbox - Indeterminate Toggle</h3>
			<input
				type="checkbox"
				indeterminate={o}
			/>
			<input
				type="checkbox"
				checked
				indeterminate={o}
			/>
		</>
	)
}

TestCheckboxIndeterminateToggle.test = {
	static: true,
	snapshots: ['<input type="checkbox"><input type="checkbox">'],
}

const TestProgressIndeterminateToggle = () => {
	const o = $(0.25)
	const values = [0.25, null, 0.5, undefined]
	const cycle = () =>
		o(prev => values[(values.indexOf(prev) + 1) % values.length])
	useInterval(cycle, TEST_INTERVAL)
	return (
		<>
			<h3>Progress - Indeterminate Toggle</h3>
			<progress value={o} />
		</>
	)
}

TestProgressIndeterminateToggle.test = {
	static: false,
	snapshots: [
		'<progress value="{random}"></progress>',
		'<progress></progress>',
		'<progress value="{random}"></progress>',
		'<progress></progress>',
	],
}

const TestSelectStaticOption = () => {
	const ref = $()

	const assert = () => {
		console.assert(ref()?.value === 'bar')
	}
	setTimeout(assert, 1)
	return (
		<>
			<h3>Select - Static Option</h3>
			<select
				ref={ref}
				name="select-static-option"
			>
				<option
					value="foo"
					selected={false}
				>
					foo
				</option>
				<option
					value="bar"
					selected={true}
				>
					bar
				</option>
				<option
					value="baz"
					selected={false}
				>
					baz
				</option>
				<option
					value="qux"
					selected={false}
				>
					qux
				</option>
			</select>
		</>
	)
}

TestSelectStaticOption.test = {
	static: true,
	snapshots: [
		'<select name="select-static-option"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>',
	],
}

const TestSelectStaticValue = () => {
	const ref = $()
	const assert = () => {
		console.assert(ref()?.value === 'bar')
	}
	setTimeout(assert, 1)
	return (
		<>
			<h3>Select - Static Value</h3>
			<select
				ref={ref}
				name="select-static-value"
				value="bar"
			>
				<option value="foo">foo</option>
				<option value="bar">bar</option>
				<option value="baz">baz</option>
				<option value="qux">qux</option>
			</select>
		</>
	)
}

TestSelectStaticValue.test = {
	static: true,
	snapshots: [
		'<select name="select-static-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>',
	],
}

const TestSelectObservableOption = () => {
	const ref = $()
	const branch = $(true)
	const assert = () => {
		console.log(ref()?.value, branch())
		console.assert(ref()?.value === (branch() ? 'bar' : 'qux'))
	}
	const toggle = () => branch(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	useInterval(assert, TEST_INTERVAL)
	setTimeout(assert, 1)
	return (
		<>
			<h3>Select - Observable Option</h3>
			<select
				ref={ref}
				name="select-observable-option"
			>
				<option
					value="foo"
					selected={false}
				>
					foo
				</option>
				<option
					value="bar"
					selected={branch}
				>
					bar
				</option>
				<option
					value="baz"
					selected={false}
				>
					baz
				</option>
				<option
					value="qux"
					selected={() => !branch()}
				>
					qux
				</option>
			</select>
		</>
	)
}

TestSelectObservableOption.test = {
	static: true,
	snapshots: [
		'<select name="select-observable-option"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>',
	],
}

const TestSelectObservableValue = () => {
	const ref = $()
	const value = $('bar')
	const assert = () => console.assert(ref()?.value === value())
	const toggle = () => value(prev => (prev === 'bar' ? 'qux' : 'bar'))
	useInterval(toggle, TEST_INTERVAL)
	useInterval(assert, TEST_INTERVAL)
	setTimeout(assert, 1)
	return (
		<>
			<h3>Select - Observable Value</h3>
			<select
				ref={ref}
				name="select-observable-value"
				value={value}
			>
				<option value="foo">foo</option>
				<option value="bar">bar</option>
				<option value="baz">baz</option>
				<option value="qux">qux</option>
			</select>
		</>
	)
}

TestSelectObservableValue.test = {
	static: true,
	snapshots: [
		'<select name="select-observable-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>',
	],
}

const TestIdStatic = () => {
	return (
		<>
			<h3>ID - Static</h3>
			<p id="foo">content</p>
		</>
	)
}

TestIdStatic.test = {
	static: true,
	snapshots: ['<p id="foo">content</p>'],
}

const TestIdObservable = () => {
	const o = $('foo')
	const toggle = () => o(prev => (prev === 'foo' ? 'bar' : 'foo'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>ID - Observable</h3>
			<p id={o}>content</p>
		</>
	)
}

TestIdObservable.test = {
	static: false,
	snapshots: ['<p id="foo">content</p>', '<p id="bar">content</p>'],
}

const TestIdFunction = () => {
	const o = $('foo')
	const toggle = () => o(prev => (prev === 'foo' ? 'bar' : 'foo'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>ID - Function</h3>
			<p id={() => o()}>content</p>
		</>
	)
}

TestIdFunction.test = {
	static: false,
	snapshots: ['<p id="foo">content</p>', '<p id="bar">content</p>'],
}

const TestIdRemoval = () => {
	const o = $('foo')
	const toggle = () => o(prev => (prev ? null : 'foo'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>ID - Removal</h3>
			<p id={o}>content</p>
		</>
	)
}

TestIdRemoval.test = {
	static: false,
	snapshots: ['<p id="foo">content</p>', '<p>content</p>'],
}

const TestClassNameStatic = () => {
	return (
		<>
			<h3>ClassName - Static</h3>
			<p className="red">content</p>
		</>
	)
}

TestClassNameStatic.test = {
	static: true,
	snapshots: ['<p>content</p>'],
}

const TestClassNameObservable = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? 'blue' : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>ClassName - Observable</h3>
			<p className={o}>content</p>
		</>
	)
}

TestClassNameObservable.test = {
	static: true,
	snapshots: ['<p>content</p>'],
}

const TestClassNameFunction = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? 'blue' : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>ClassName - Function</h3>
			<p className={() => o()}>content</p>
		</>
	)
}

TestClassNameFunction.test = {
	static: true,
	snapshots: ['<p>content</p>'],
}

const TestClassStatic = () => {
	return (
		<>
			<h3>Class - Static</h3>
			<p class={{ red: true, blue: false }}>content</p>
		</>
	)
}

TestClassStatic.test = {
	static: true,
	snapshots: ['<p class="red">content</p>'],
}

const TestClassStaticString = () => {
	return (
		<>
			<h3>Class - Static String</h3>
			<p class="red">content</p>
		</>
	)
}

TestClassStaticString.test = {
	static: true,
	snapshots: ['<p class="red">content</p>'],
}

const TestClassObservable = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Class - Observable</h3>
			<p class={{ red: o }}>content</p>
		</>
	)
}

TestClassObservable.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="">content</p>',
	],
}

const TestClassObservableString = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? 'blue' : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Class - Observable String</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassObservableString.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassFunction = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Class - Function Boolean</h3>
			<p class={{ red: () => o() }}>content</p>
		</>
	)
}

TestClassFunction.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="">content</p>',
	],
}

const TestClassFunctionString = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? 'blue' : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Class - Function String</h3>
			<p class={() => o()}>content</p>
		</>
	)
}

TestClassFunctionString.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassRemoval = () => {
	const o = $(true)
	const toggle = () => o(prev => (prev ? null : true))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Class - Removal</h3>
			<p class={{ red: o }}>content</p>
		</>
	)
}

TestClassRemoval.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="">content</p>',
	],
}

const TestClassRemovalString = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev ? null : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Class - Removal String</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassRemovalString.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="">content</p>',
	],
}

const TestClassesArrayStatic = () => {
	return (
		<>
			<h3>Classes - Array Static</h3>
			<p
				class={[
					'red',
					false && 'blue',
					null && 'blue',
					undefined && 'blue',
				]}
			>
				content
			</p>
		</>
	)
}

TestClassesArrayStatic.test = {
	static: true,
	snapshots: ['<p class="red">content</p>'],
}

const TestClassesArrayStaticMultiple = () => {
	return (
		<>
			<h3>Classes - Array Static Multiple</h3>
			<p class={['red bold']}>content</p>
		</>
	)
}

TestClassesArrayStaticMultiple.test = {
	static: true,
	snapshots: ['<p class="red bold">content</p>'],
}

const TestClassesArrayObservable = () => {
	const o = $(['red', false])
	const toggle = () =>
		o(prev => (prev[0] ? [false, 'blue'] : ['red', false]))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Observable</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesArrayObservable.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesArrayObservableMultiple = () => {
	const o = $(['red bold', false])
	const toggle = () =>
		o(prev => (prev[0] ? [false, 'blue'] : ['red bold', false]))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Observable Multiple</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesArrayObservableMultiple.test = {
	static: false,
	snapshots: [
		'<p class="red bold">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesArrayObservableValue = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? 'blue' : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Observable Value</h3>
			<p class={[o]}>content</p>
		</>
	)
}

TestClassesArrayObservableValue.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesArrayFunction = () => {
	const o = $(['red', false])
	const toggle = () =>
		o(prev => (prev[0] ? [false, 'blue'] : ['red', false]))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Function</h3>
			<p class={() => o()}>content</p>
		</>
	)
}

TestClassesArrayFunction.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesArrayFunctionMultiple = () => {
	const o = $(['red bold', false])
	const toggle = () =>
		o(prev => (prev[0] ? [false, 'blue'] : ['red bold', false]))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Function Multiple</h3>
			<p class={() => o()}>content</p>
		</>
	)
}

TestClassesArrayFunctionMultiple.test = {
	static: false,
	snapshots: [
		'<p class="red bold">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesArrayFunctionValue = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? 'blue' : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Function Value</h3>
			<p class={[() => o()]}>content</p>
		</>
	)
}

TestClassesArrayFunctionValue.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesArrayStore = () => {
	const o = store(['red', false])
	const toggle = () => {
		if (o[0]) {
			o[0] = false
			o[1] = 'blue'
		} else {
			o[0] = 'red'
			o[1] = false
		}
	}
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Store</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesArrayStore.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesArrayStoreMultiple = () => {
	const o = store(['red bold', false])
	const toggle = () => {
		if (o[0]) {
			o[0] = false
			o[1] = 'blue'
		} else {
			o[0] = 'red bold'
			o[1] = false
		}
	}
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Store Multiple</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesArrayStoreMultiple.test = {
	static: false,
	snapshots: [
		'<p class="red bold">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesArrayNestedStatic = () => {
	const o = $(['red', ['bold', { italic: true }]])
	return (
		<>
			<h3>Classes - Array Nested Static</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesArrayNestedStatic.test = {
	static: true,
	snapshots: ['<p class="red bold italic">content</p>'],
}

const TestClassesArrayRemoval = () => {
	const o = $(['red', false])
	const toggle = () => o(prev => (prev ? null : ['red', false]))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Removal</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesArrayRemoval.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="">content</p>',
	],
}

const TestClassesArrayRemovalMultiple = () => {
	const o = $(['red bold', false])
	const toggle = () => o(prev => (prev ? null : ['red bold', false]))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Removal Multiple</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesArrayRemovalMultiple.test = {
	static: false,
	snapshots: [
		'<p class="red bold">content</p>',
		'<p class="">content</p>',
	],
}

const TestClassesArrayCleanup = () => {
	const o = $(['red'])
	const toggle = () =>
		o(prev => (prev[0] === 'red' ? ['blue'] : ['red']))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Array Cleanup</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesArrayCleanup.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesObjectStatic = () => {
	return (
		<>
			<h3>Classes - Object Static</h3>
			<p class={{ red: true, blue: false }}>content</p>
		</>
	)
}

TestClassesObjectStatic.test = {
	static: true,
	snapshots: ['<p class="red">content</p>'],
}

const TestClassesObjectStaticMultiple = () => {
	return (
		<>
			<h3>Classes - Object Static Multiple</h3>
			<p class={{ 'red bold': true }}>content</p>
		</>
	)
}

TestClassesObjectStaticMultiple.test = {
	static: true,
	snapshots: ['<p class="red bold">content</p>'],
}

const TestClassesObjectObservable = () => {
	const o = $({ red: true, blue: false })
	const toggle = () =>
		o(prev =>
			prev.red
				? { red: false, blue: true }
				: { red: true, blue: false },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Observable</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesObjectObservable.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesObjectObservableMultiple = () => {
	const o = $({ 'red bold': true, blue: false })
	const toggle = () =>
		o(prev =>
			prev['red bold']
				? { 'red bold': false, blue: true }
				: { 'red bold': true, blue: false },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Observable Multiple</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesObjectObservableMultiple.test = {
	static: false,
	snapshots: [
		'<p class="red bold">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesObjectFunction = () => {
	const o = $({ red: true, blue: false })
	const toggle = () =>
		o(prev =>
			prev.red
				? { red: false, blue: true }
				: { red: true, blue: false },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Function</h3>
			<p class={() => o()}>content</p>
		</>
	)
}

TestClassesObjectFunction.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesObjectFunctionMultiple = () => {
	const o = $({ 'red bold': true, blue: false })
	const toggle = () =>
		o(prev =>
			prev['red bold']
				? { 'red bold': false, blue: true }
				: { 'red bold': true, blue: false },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Function Multiple</h3>
			<p class={() => o()}>content</p>
		</>
	)
}

TestClassesObjectFunctionMultiple.test = {
	static: false,
	snapshots: [
		'<p class="red bold">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesObjectStore = () => {
	const o = store({ red: true, blue: false })
	const toggle = () => {
		if (o.red) {
			o.red = false
			o.blue = true
		} else {
			o.red = true
			o.blue = false
		}
	}
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Store</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesObjectStore.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesObjectStoreMultiple = () => {
	const o = store({ 'red bold': true, blue: false })
	const toggle = () => {
		if (o['red bold']) {
			o['red bold'] = false
			o.blue = true
		} else {
			o['red bold'] = true
			o.blue = false
		}
	}
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Store Multiple</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesObjectStoreMultiple.test = {
	static: false,
	snapshots: [
		'<p class="red bold">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestClassesObjectRemoval = () => {
	const o = $({
		red: true,
		blue: false,
	})
	const toggle = () =>
		o(prev => (prev ? null : { red: true, blue: false }))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Removal</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesObjectRemoval.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="">content</p>',
	],
}

const TestClassesObjectRemovalMultiple = () => {
	const o = $({
		'red bold': true,
		blue: false,
	})
	const toggle = () =>
		o(prev => (prev ? null : { 'red bold': true, blue: false }))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Removal Multiple</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesObjectRemovalMultiple.test = {
	static: false,
	snapshots: [
		'<p class="red bold">content</p>',
		'<p class="">content</p>',
	],
}

const TestClassesObjectCleanup = () => {
	const o = $({ red: true })
	const toggle = () =>
		o(prev => (prev.red ? { blue: true } : { red: true }))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Classes - Object Cleanup</h3>
			<p class={o}>content</p>
		</>
	)
}

TestClassesObjectCleanup.test = {
	static: false,
	snapshots: [
		'<p class="red">content</p>',
		'<p class="blue">content</p>',
	],
}

const TestStyleStatic = () => {
	return (
		<>
			<h3>Style - Static</h3>
			<p style={{ color: 'green' }}>content</p>
		</>
	)
}

TestStyleStatic.test = {
	static: true,
	snapshots: ['<p style="color: green;">content</p>'],
}

const TestStyleStaticNumeric = () => {
	return (
		<>
			<h3>Style - Static Numeric</h3>
			<p style={{ flexGrow: 1, height: 50 }}>content</p>
		</>
	)
}

TestStyleStaticNumeric.test = {
	static: true,
	snapshots: ['<p style="flex-grow: 1; height: 50px;">content</p>'],
}

const TestStyleStaticString = () => {
	return (
		<>
			<h3>Style - Static String</h3>
			<p style="flex-grow: 1; height: 50px;">content</p>
		</>
	)
}

TestStyleStaticString.test = {
	static: true,
	snapshots: ['<p style="flex-grow: 1; height: 50px;">content</p>'],
}

const TestStyleStaticVariable = () => {
	return (
		<>
			<h3>Style - Static Variable</h3>
			<p
				style={{
					color: 'var(--color)',
					'--color': 'green',
					'--foo': undefined,
					'--bar': null,
				}}
			>
				content
			</p>
		</>
	)
}

TestStyleStaticVariable.test = {
	static: true,
	snapshots: [
		'<p style="color: var(--color); --color: green;">content</p>',
	],
}

const TestStyleObservable = () => {
	const o = $('green')
	const toggle = () =>
		o(prev => (prev === 'green' ? 'orange' : 'green'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Observable</h3>
			<p style={{ color: o }}>content</p>
		</>
	)
}

TestStyleObservable.test = {
	static: false,
	snapshots: [
		'<p style="color: green;">content</p>',
		'<p style="color: orange;">content</p>',
	],
}

const TestStyleObservableNumeric = () => {
	const o = $({ flexGrow: 1, width: 50 })
	const toggle = () =>
		o(prev =>
			prev.flexGrow === 1
				? { flexGrow: 2, width: 100 }
				: { flexGrow: 1, width: 50 },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Observable Numeric</h3>
			<p style={o}>content</p>
		</>
	)
}

TestStyleObservableNumeric.test = {
	static: false,
	snapshots: [
		'<p style="flex-grow: 1; width: 50px;">content</p>',
		'<p style="flex-grow: 2; width: 100px;">content</p>',
	],
}

const TestStyleObservableString = () => {
	const o = $('color: green')
	const toggle = () =>
		o(prev =>
			prev === 'color: green' ? 'color: orange' : 'color: green',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Observable String</h3>
			<p style={o}>content</p>
		</>
	)
}

TestStyleObservableString.test = {
	static: false,
	snapshots: [
		'<p style="color: green">content</p>',
		'<p style="color: orange">content</p>',
	],
}

const TestStyleObservableVariable = () => {
	const o = $('green')
	const toggle = () =>
		o(prev => (prev === 'orange' ? 'green' : 'orange'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Observable Variable</h3>
			<p style={{ color: 'var(--color)', '--color': o }}>content</p>
		</>
	)
}

TestStyleObservableVariable.test = {
	static: false,
	snapshots: [
		'<p style="color: var(--color); --color: green;">content</p>',
		'<p style="color: var(--color); --color: orange;">content</p>',
	],
}

const TestStyleFunction = () => {
	const o = $('green')
	const toggle = () =>
		o(prev => (prev === 'green' ? 'orange' : 'green'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Function</h3>
			<p style={{ color: () => o() }}>content</p>
		</>
	)
}

TestStyleFunction.test = {
	static: false,
	snapshots: [
		'<p style="color: green;">content</p>',
		'<p style="color: orange;">content</p>',
	],
}

const TestStyleFunctionNumeric = () => {
	const o = $({ flexGrow: 1, width: 50 })
	const toggle = () =>
		o(prev =>
			prev.flexGrow === 1
				? { flexGrow: 2, width: 100 }
				: { flexGrow: 1, width: 50 },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Function Numeric</h3>
			<p style={() => o()}>content</p>
		</>
	)
}

TestStyleFunctionNumeric.test = {
	static: false,
	snapshots: [
		'<p style="flex-grow: 1; width: 50px;">content</p>',
		'<p style="flex-grow: 2; width: 100px;">content</p>',
	],
}

const TestStyleFunctionString = () => {
	const o = $('color: green')
	const toggle = () =>
		o(prev =>
			prev === 'color: green' ? 'color: orange' : 'color: green',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Function String</h3>
			<p style={() => o()}>content</p>
		</>
	)
}

TestStyleFunctionString.test = {
	static: false,
	snapshots: [
		'<p style="color: green">content</p>',
		'<p style="color: orange">content</p>',
	],
}

const TestStyleFunctionVariable = () => {
	const o = $('green')
	const toggle = () =>
		o(prev => (prev === 'orange' ? 'green' : 'orange'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Function Variable</h3>
			<p style={{ color: 'var(--color)', '--color': () => o() }}>
				content
			</p>
		</>
	)
}

TestStyleFunctionVariable.test = {
	static: false,
	snapshots: [
		'<p style="color: var(--color); --color: green;">content</p>',
		'<p style="color: var(--color); --color: orange;">content</p>',
	],
}

const TestStyleRemoval = () => {
	const o = $('green')
	const toggle = () => o(prev => (prev ? null : 'green'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Style - Removal</h3>
			<p style={{ color: o }}>content</p>
		</>
	)
}

TestStyleRemoval.test = {
	static: false,
	snapshots: [
		'<p style="color: green;">content</p>',
		'<p style="">content</p>',
	],
}

const TestStylesStatic = () => {
	return (
		<>
			<h3>Styles - Static</h3>
			<p style={{ color: 'green' }}>content</p>
		</>
	)
}

TestStylesStatic.test = {
	static: true,
	snapshots: ['<p style="color: green;">content</p>'],
}

const TestStylesObservable = () => {
	const o = $({ color: 'orange', fontWeight: 'normal' })
	const toggle = () =>
		o(prev =>
			prev.color === 'orange'
				? { color: 'green', fontWeight: 'bold' }
				: { color: 'orange', fontWeight: 'normal' },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Styles - Observable</h3>
			<p style={o}>content</p>
		</>
	)
}

TestStylesObservable.test = {
	static: false,
	snapshots: [
		'<p style="color: orange; font-weight: normal;">content</p>',
		'<p style="color: green; font-weight: bold;">content</p>',
	],
}

const TestStylesFunction = () => {
	const o = $({ color: 'orange', fontWeight: 'normal' })
	const toggle = () =>
		o(prev =>
			prev.color === 'orange'
				? { color: 'green', fontWeight: 'bold' }
				: { color: 'orange', fontWeight: 'normal' },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Styles - Function</h3>
			<p style={() => o()}>content</p>
		</>
	)
}

TestStylesFunction.test = {
	static: false,
	snapshots: [
		'<p style="color: orange; font-weight: normal;">content</p>',
		'<p style="color: green; font-weight: bold;">content</p>',
	],
}

const TestStylesStore = () => {
	const o = store({ color: 'orange', fontWeight: 'normal' })
	const toggle = () => {
		if (o.color === 'orange') {
			o.color = 'green'
			o.fontWeight = 'bold'
		} else {
			o.color = 'orange'
			o.fontWeight = 'normal'
		}
	}
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Styles - Store</h3>
			<p style={o}>content</p>
		</>
	)
}

TestStylesStore.test = {
	static: false,
	snapshots: [
		'<p style="color: orange; font-weight: normal;">content</p>',
		'<p style="color: green; font-weight: bold;">content</p>',
	],
}

const TestStylesRemoval = () => {
	const o = $({
		color: 'orange',
		fontWeight: 'normal',
	})
	const toggle = () =>
		o(prev =>
			prev ? null : { color: 'orange', fontWeight: 'normal' },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Styles - Removal</h3>
			<p style={o}>content</p>
		</>
	)
}

TestStylesRemoval.test = {
	static: false,
	snapshots: [
		'<p style="color: orange; font-weight: normal;">content</p>',
		'<p style="">content</p>',
	],
}

const TestStylesCleanup = () => {
	const o = $({
		color: 'orange',
		fontWeight: 'bold',
	})
	const toggle = () =>
		o(prev =>
			prev.color === 'orange'
				? { fontStyle: 'italic', textDecoration: 'line-through' }
				: { color: 'orange', fontWeight: 'bold' },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Styles - Observable Cleanup</h3>
			<p style={o}>content</p>
		</>
	)
}

TestStylesCleanup.test = {
	static: false,
	snapshots: [
		'<p style="color: orange; font-weight: bold;">content</p>',
		'<p style="font-style: italic; text-decoration: line-through;">content</p>',
	],
}

const TestStylesMixed = () => {
	return (
		<>
			<h3>Styles - Mixed</h3>
			<div
				style={[{ color: 'red' }, [{ fontStyle: () => 'italic' }]]}
			>
				example
			</div>
		</>
	)
}

TestStylesMixed.test = {
	static: true,
	snapshots: [
		'<div style="color: red; font-style: italic;">example</div>',
	],
}

const TestHTMLFunctionStatic = () => {
	return (
		<>
			<h3>HTML - Function - Static</h3>
			{html`
				<show when=${true}>
					<p>${random()}</p>
				</show>
			`}
		</>
	)
}

TestHTMLFunctionStatic.test = {
	static: true,
	snapshots: ['<p>{random}</p>'],
}

const TestHTMLFunctionStaticRegistry = () => {
	const P = () => {
		return <p>{random()}</p>
	}
	html.define({ If: Show, P })
	return (
		<>
			<h3>HTML - Function - Static Registry</h3>
			{html`
				<If when=${true}>
					<p />
				</If>
			`}
		</>
	)
}

TestHTMLFunctionStaticRegistry.test = {
	static: true,
	snapshots: ['<p>{random}</p>'],
}

const TestHTMLInnerHTMLStatic = () => {
	return (
		<>
			<h3>HTML - innerHTML - Static</h3>
			<p innerHTML="<b>danger</b>" />
		</>
	)
}

TestHTMLInnerHTMLStatic.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLInnerHTMLObservable = () => {
	const o = $('<b>danger1</b>')
	const toggle = () =>
		o(prev =>
			prev === '<b>danger1</b>' ? '<b>danger2</b>' : '<b>danger1</b>',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - innerHTML - Observable</h3>
			<p innerHTML={o} />
		</>
	)
}

TestHTMLInnerHTMLObservable.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLInnerHTMLFunction = () => {
	const o = $('<b>danger1</b>')
	const toggle = () =>
		o(prev =>
			prev === '<b>danger1</b>' ? '<b>danger2</b>' : '<b>danger1</b>',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - innerHTML - Function</h3>
			<p innerHTML={() => o()} />
		</>
	)
}

TestHTMLInnerHTMLFunction.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLOuterHTMLStatic = () => {
	return (
		<>
			<h3>HTML - outerHTML - Static</h3>
			<p outerHTML="<b>danger</b>" />
		</>
	)
}

TestHTMLOuterHTMLStatic.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLOuterHTMLObservable = () => {
	const o = $('<b>danger1</b>')
	const toggle = () =>
		o(prev =>
			prev === '<b>danger1</b>' ? '<b>danger2</b>' : '<b>danger1</b>',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - outerHTML - Observable</h3>
			<p outerHTML={o} />
		</>
	)
}

TestHTMLOuterHTMLObservable.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLOuterHTMLFunction = () => {
	const o = $('<b>danger1</b>')
	const toggle = () =>
		o(prev =>
			prev === '<b>danger1</b>' ? '<b>danger2</b>' : '<b>danger1</b>',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - outerHTML - Function</h3>
			<p outerHTML={() => o()} />
		</>
	)
}

TestHTMLOuterHTMLFunction.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLTextContentStatic = () => {
	return (
		<>
			<h3>HTML - textContent - Static</h3>
			<p textContent="<b>danger</b>" />
		</>
	)
}

TestHTMLTextContentStatic.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLTextContentObservable = () => {
	const o = $('<b>danger1</b>')
	const toggle = () =>
		o(prev =>
			prev === '<b>danger1</b>' ? '<b>danger2</b>' : '<b>danger1</b>',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - textContent - Observable</h3>
			<p textContent={o} />
		</>
	)
}

TestHTMLTextContentObservable.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLTextContentFunction = () => {
	const o = $('<b>danger1</b>')
	const toggle = () =>
		o(prev =>
			prev === '<b>danger1</b>' ? '<b>danger2</b>' : '<b>danger1</b>',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - textContent - Function</h3>
			<p textContent={() => o()} />
		</>
	)
}

TestHTMLTextContentFunction.test = {
	static: true,
	snapshots: ['<p></p>'],
}

const TestHTMLDangerouslySetInnerHTMLStatic = () => {
	return (
		<>
			<h3>HTML - dangerouslySetInnerHTML - Static</h3>
			<p dangerouslySetInnerHTML={{ __html: '<i>danger</i>' }} />
		</>
	)
}

TestHTMLDangerouslySetInnerHTMLStatic.test = {
	static: true,
	snapshots: ['<p><i>danger</i></p>'],
}

const TestHTMLDangerouslySetInnerHTMLObservable = () => {
	const o = $({ __html: '<i>danger</i>' })
	const toggle = () =>
		o(prev =>
			prev.__html === '<i>danger</i>'
				? { __html: '<b>danger</b>' }
				: { __html: '<i>danger</i>' },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - dangerouslySetInnerHTML - Observable</h3>
			<p dangerouslySetInnerHTML={o} />
		</>
	)
}

TestHTMLDangerouslySetInnerHTMLObservable.test = {
	static: false,
	snapshots: ['<p><i>danger</i></p>', '<p><b>danger</b></p>'],
}

const TestHTMLDangerouslySetInnerHTMLObservableString = () => {
	const o = $('<i>danger</i>')
	const toggle = () =>
		o(prev =>
			prev === '<i>danger</i>' ? '<b>danger</b>' : '<i>danger</i>',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - dangerouslySetInnerHTML - Observable String</h3>
			<p dangerouslySetInnerHTML={{ __html: o }} />
		</>
	)
}

TestHTMLDangerouslySetInnerHTMLObservableString.test = {
	static: false,
	snapshots: ['<p><i>danger</i></p>', '<p><b>danger</b></p>'],
}

const TestHTMLDangerouslySetInnerHTMLFunction = () => {
	const o = $({ __html: '<i>danger</i>' })
	const toggle = () =>
		o(prev =>
			prev.__html === '<i>danger</i>'
				? { __html: '<b>danger</b>' }
				: { __html: '<i>danger</i>' },
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - dangerouslySetInnerHTML - Function</h3>
			<p dangerouslySetInnerHTML={() => o()} />
		</>
	)
}

TestHTMLDangerouslySetInnerHTMLFunction.test = {
	static: false,
	snapshots: ['<p><i>danger</i></p>', '<p><b>danger</b></p>'],
}

const TestHTMLDangerouslySetInnerHTMLFunctionString = () => {
	const o = $('<i>danger</i>')
	const toggle = () =>
		o(prev =>
			prev === '<i>danger</i>' ? '<b>danger</b>' : '<i>danger</i>',
		)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>HTML - dangerouslySetInnerHTML - Function String</h3>
			<p dangerouslySetInnerHTML={{ __html: () => o() }} />
		</>
	)
}

TestHTMLDangerouslySetInnerHTMLFunctionString.test = {
	static: false,
	snapshots: ['<p><i>danger</i></p>', '<p><b>danger</b></p>'],
}

const TestDirective = () => {
	const model = (element, arg1, arg2) => {
		renderEffect(
			() => {
				const value = `${arg1} - ${arg2}`
				element.value = value
				element.setAttribute('value', value)
			},
			{ sync: true },
		)
	}
	const Model = createDirective('model', model)
	return (
		<>
			<h3>Directive</h3>
			<Model.Provider>
				<input
					value="foo"
					use:model={['bar', 'baz']}
				/>
			</Model.Provider>
		</>
	)
}

TestDirective.test = {
	static: true,
	snapshots: ['<input value="bar - baz">'],
}

const TestDirectiveRegisterLocal = () => {
	const model = (element, arg1, arg2) => {
		renderEffect(
			() => {
				const value = `${arg1} - ${arg2}`
				element.value = value
				element.setAttribute('value', value)
			},
			{ sync: true },
		)
	}
	const Model = createDirective('modelLocal', model)
	Model.register()
	return (
		<>
			<h3>Directive</h3>
			<input
				value="foo"
				use:modelLocal={['bar', 'baz']}
			/>
		</>
	)
}

TestDirectiveRegisterLocal.test = {
	static: true,
	snapshots: ['<input value="bar - baz">'],
}

const TestDirectiveSingleArgument = () => {
	const model = (element, arg1) => {
		renderEffect(
			() => {
				const value = `${arg1}`
				element.value = value
				element.setAttribute('value', value)
			},
			{ sync: true },
		)
	}
	const Model = createDirective('model', model)
	return (
		<>
			<h3>Directive - Single Argument</h3>
			<Model.Provider>
				<input
					value="foo"
					use:model="bar"
				/>
			</Model.Provider>
		</>
	)
}

TestDirectiveSingleArgument.test = {
	static: true,
	snapshots: ['<input value="bar">'],
}

const TestDirectiveRef = () => {
	const model = (element, arg1) => {
		renderEffect(
			() => {
				const value = `${arg1}`
				element.value = value
				element.setAttribute('value', value)
			},
			{ sync: true },
		)
	}
	const Model = createDirective('model', model)
	return (
		<>
			<h3>Directive - Ref</h3>
			<input
				ref={Model.ref('bar')}
				value="foo"
			/>
		</>
	)
}

TestDirectiveRef.test = {
	static: true,
	snapshots: ['<input value="bar">'],
}

const TestEventClickStatic = () => {
	const o = $(0)
	const increment = () => o(prev => prev + 1)
	return (
		<>
			<h3>Event - Click Static</h3>
			<p>
				<button onClick={increment}>{o}</button>
			</p>
		</>
	)
}

const TestEventClickObservable = () => {
	const o = $(0)
	const onClick = $(() => {})
	const plus2 = () =>
		o(prev => {
			onClick(() => minus1)
			return prev + 2
		})
	const minus1 = () =>
		o(prev => {
			onClick(() => plus2)
			return prev - 1
		})
	onClick(() => plus2)
	return (
		<>
			<h3>Event - Click Observable</h3>
			<p>
				<button onClick={onClick}>{o}</button>
			</p>
		</>
	)
}

const TestEventClickRemoval = () => {
	const o = $(0)
	const onClick = $(() => {})
	const increment = () =>
		o(prev => {
			onClick(() => null)
			return prev + 1
		})
	onClick(() => increment)
	return (
		<>
			<h3>Event - Click Removal</h3>
			<p>
				<button onClick={onClick}>{o}</button>
			</p>
		</>
	)
}

const TestEventClickCaptureStatic = () => {
	const o = $(0)
	const increment = () => o(prev => prev + 1)
	return (
		<>
			<h3>Event - Click Capture Static</h3>
			<p>
				<button onClickCapture={increment}>{o}</button>
			</p>
		</>
	)
}

const TestEventClickCaptureObservable = () => {
	const o = $(0)
	const onClick = $(() => {})
	const plus2 = () =>
		o(prev => {
			onClick(() => minus1)
			return prev + 2
		})
	const minus1 = () =>
		o(prev => {
			onClick(() => plus2)
			return prev - 1
		})
	onClick(() => plus2)
	return (
		<>
			<h3>Event - Click Capture Observable</h3>
			<p>
				<button onClickCapture={onClick}>{o}</button>
			</p>
		</>
	)
}

const TestEventClickCaptureRemoval = () => {
	const o = $(0)
	const onClick = $(() => {})
	const increment = () =>
		o(prev => {
			onClick(() => null)
			return prev + 1
		})
	onClick(() => increment)
	return (
		<>
			<h3>Event - Click Capture Removal</h3>
			<p>
				<button onClickCapture={onClick}>{o}</button>
			</p>
		</>
	)
}

const TestEventClickAndClickCaptureStatic = () => {
	const o = $(0)
	const increment = () => o(prev => prev + 1)
	return (
		<>
			<h3>Event - Click & Click Capture Static</h3>
			<p>
				<button
					onClick={increment}
					onClickCapture={increment}
				>
					{o}
				</button>
			</p>
		</>
	)
}

const TestEventClickStopPropagation = () => {
	const outer = $(0)
	const inner = $(0)
	const incrementOuter = () => outer(prev => prev + 1)
	const incrementInner = event => {
		event.stopPropagation()
		inner(prev => prev + 1)
	}
	return (
		<>
			<h3>Event - Click - Stop Propagation</h3>
			<p>
				<button onClick={incrementOuter}>
					{outer}
					<button onClick={incrementInner}>{inner}</button>
				</button>
			</p>
		</>
	)
}

const TestEventClickStopImmediatePropagation = () => {
	const outer = $(0)
	const inner = $(0)
	const incrementOuter = () => outer(prev => prev + 1)
	const incrementInner = event => {
		event.stopImmediatePropagation()
		inner(prev => prev + 1)
	}
	return (
		<>
			<h3>Event - Click - Stop Immediate Propagation</h3>
			<p>
				<button onClick={incrementOuter}>
					{outer}
					<button onClick={incrementInner}>{inner}</button>
				</button>
			</p>
		</>
	)
}

const TestEventEnterStopPropagation = () => {
	const outer = $(0)
	const inner = $(0)
	const incrementOuter = () => outer(prev => prev + 1)
	const incrementInner = event => {
		event.stopPropagation()
		inner(prev => prev + 1)
	}
	return (
		<>
			<h3>Event - Enter - Stop Propagation</h3>
			<p>
				<button onMouseEnter={incrementOuter}>
					{outer}
					<button onMouseEnter={incrementInner}>{inner}</button>
				</button>
			</p>
		</>
	)
}

const TestEventEnterStopImmediatePropagation = () => {
	const outer = $(0)
	const inner = $(0)
	const incrementOuter = () => outer(prev => prev + 1)
	const incrementInner = event => {
		event.stopImmediatePropagation()
		inner(prev => prev + 1)
	}
	return (
		<>
			<h3>Event - Enter - Stop Immediate Propagation</h3>
			<p>
				<button onMouseEnter={incrementOuter}>
					{outer}
					<button onMouseEnter={incrementInner}>{inner}</button>
				</button>
			</p>
		</>
	)
}

const TestEventEnterAndEnterCaptureStatic = () => {
	const o = $(0)
	const increment = () => o(prev => prev + 1)
	return (
		<>
			<h3>Event - Enter & Enter Capture Static</h3>
			<p>
				<button
					onMouseEnter={increment}
					onMouseEnterCapture={increment}
				>
					{o}
				</button>
			</p>
		</>
	)
}

const TestEventMiddleClickStatic = () => {
	const o = $(0)
	const increment = () => o(prev => prev + 1)
	return (
		<>
			<h3>Event - Middle Click Static</h3>
			<p>
				<button onMiddleClick={increment}>{o}</button>
			</p>
		</>
	)
}

const TestEventMiddleClickCaptureStatic = () => {
	const o = $(0)
	const increment = () => o(prev => prev + 1)
	return (
		<>
			<h3>Event - Middle Click Capture Static</h3>
			<p>
				<button onMiddleClickCapture={increment}>{o}</button>
			</p>
		</>
	)
}

const TestEventTargetCurrentTarget = () => {
	return (
		<>
			<h3>Event - Target - Current Target</h3>
			<div
				onClick={e =>
					console.log({
						element: 'div',
						target: e.target,
						currentTarget: e.currentTarget,
					})
				}
			>
				<p>paragraph</p>
				<ul
					onClick={e =>
						console.log({
							element: 'ul',
							target: e.target,
							currentTarget: e.currentTarget,
						})
					}
				>
					<li>one</li>
					<li
						onClick={e =>
							console.log({
								element: 'li',
								target: e.target,
								currentTarget: e.currentTarget,
							})
						}
					>
						two
					</li>
					<li>three</li>
				</ul>
			</div>
		</>
	)
}

const TestABCD = () => {
	const AB = () => {
		const a = <i>a</i>
		const b = <u>b</u>
		const component = $(a)
		const toggle = () => component(() => (component() === a ? b : a))
		useInterval(toggle, TEST_INTERVAL / 2)
		return component
	}
	const CD = () => {
		const c = <b>c</b>
		const d = <span>d</span>
		const component = $(c)
		const toggle = () => component(() => (component() === c ? d : c))
		useInterval(toggle, TEST_INTERVAL / 2)
		return component
	}
	const ab = <AB />
	const cd = <CD />
	const component = $(ab)
	const toggle = () => component(() => (component() === ab ? cd : ab))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Children - ABCD</h3>
			<p>{component}</p>
		</>
	)
}

TestABCD.test = {
	static: false,
	snapshots: [
		'<p><i>a</i></p>',
		'<p><u>b</u></p>',
		'<p><b>c</b></p>',
		'<p><span>d</span></p>',
	],
}

const TestChildrenBoolean = () => {
	const Custom = ({ children }) => {
		return <p>{Number(children)}</p>
	}
	return (
		<>
			<h3>Children - Boolean</h3>
			<Custom>{true}</Custom>
			<Custom>{false}</Custom>
		</>
	)
}

TestChildrenBoolean.test = {
	static: true,
	snapshots: ['<p>1</p><p>0</p>'],
}

const TestChildrenSymbol = () => {
	const Custom = ({ children }) => {
		return <p>{typeof children}</p>
	}
	return (
		<>
			<h3>Children - Boolean</h3>
			<Custom>{Symbol()}</Custom>
		</>
	)
}

TestChildrenSymbol.test = {
	static: true,
	snapshots: ['<p>symbol</p>'],
}

const TestChildOverReexecution = () => {
	const count = $(0)
	const increment = () => count(prev => Math.min(3, prev + 1))
	let executions = 0
	useTimeout(increment, TEST_INTERVAL)
	return (
		<>
			<h3>Child - OverReexecution</h3>
			<div>{() => (executions += 1)}</div>
			{count}
		</>
	)
}

TestChildOverReexecution.test = {
	static: false,
	snapshots: [
		'<div>1</div>0',
		'<div>1</div>1',
		'<div>1</div>2',
		'<div>1</div>3',
	],
}

const TestCleanupInner = () => {
	const page = $(true)
	const togglePage = () => page(prev => !prev)
	const Page1 = () => {
		setTimeout(togglePage, TEST_INTERVAL)
		return (
			<>
				<p>page1</p>
				<button onClick={togglePage}>Toggle Page</button>
			</>
		)
	}
	const Page2 = () => {
		const bool = $(true)
		const toggle = () => bool(prev => !prev)
		setTimeout(toggle, TEST_INTERVAL)
		setTimeout(togglePage, TEST_INTERVAL * 2)
		return (
			<>
				<show when={bool}>
					<p>page2 - true</p>
				</show>
				<show when={() => !bool()}>
					<p>page2 - false</p>
				</show>
				<button onClick={toggle}>Toggle</button>
				<button onClick={togglePage}>Toggle Page</button>
			</>
		)
	}
	return () => {
		const Page = page() ? Page1 : Page2
		return (
			<>
				<h3>Cleanup - Inner</h3>
				<Page />
			</>
		)
	}
}

TestCleanupInner.test = {
	static: false,
	snapshots: [
		//TODO: Double-check that this is correct
		'<p>page1</p><button>Toggle Page</button>',
		'<p>page2 - true</p><!----><button>Toggle</button><button>Toggle Page</button>',
		'<!----><p>page2 - false</p><button>Toggle</button><button>Toggle Page</button>',
	],
}

const TestCleanupInnerPortal = () => {
	return (
		<Portal>
			<TestCleanupInner />
		</Portal>
	)
}

TestCleanupInnerPortal.test = {
	static: true,
	snapshots: ['<!---->'],
}

const TestContextDynamicContext = () => {
	const UseContext = createContext('default')

	const DynamicFragment = props => {
		const ctx = UseContext()
		return (
			<>
				<p>{ctx}</p>
				<p>{props.children}</p>
				<Dynamic component="p">{props.children}</Dynamic>
				<Dynamic
					component="p"
					children={props.children}
				/>
			</>
		)
	}

	return (
		<>
			<h3>Dynamic - Context</h3>
			<UseContext.Provider value="context">
				<DynamicFragment>
					<DynamicFragment />
				</DynamicFragment>
			</UseContext.Provider>
		</>
	)
}

TestContextDynamicContext.test = {
	static: true,
	snapshots: [
		'<p>context</p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p>',
	],
}

const TestDynamicHeading = () => {
	const level = $(1)
	const increment = () => level((level() + 1) % 7 || 1)
	useInterval(increment, TEST_INTERVAL)
	return (
		<>
			<h3>Dynamic - Heading</h3>
			{() => (
				<Dynamic component={`h${level()}`}>Level: {level}</Dynamic>
			)}
		</>
	)
}

TestDynamicHeading.test = {
	static: false,
	snapshots: [
		'<h1>Level: 1</h1>',
		'<h2>Level: 2</h2>',
		'<h3>Level: 3</h3>',
		'<h4>Level: 4</h4>',
		'<h5>Level: 5</h5>',
		'<h6>Level: 6</h6>',
	],
}

const TestDynamicObservableComponent = () => {
	const level = $(1)
	const component = useMemo(() => `h${level()}`)
	const increment = () => level((level() + 1) % 7 || 1)
	useInterval(increment, TEST_INTERVAL)
	return (
		<>
			<h3>Dynamic - Observable Component</h3>
			<Dynamic component={component}>Level: {level}</Dynamic>
		</>
	)
}

TestDynamicObservableComponent.test = {
	static: false,
	snapshots: [
		'<h1>Level: 1</h1>',
		'<h2>Level: 2</h2>',
		'<h3>Level: 3</h3>',
		'<h4>Level: 4</h4>',
		'<h5>Level: 5</h5>',
		'<h6>Level: 6</h6>',
	],
}

const TestDynamicFunctionComponent = () => {
	const level = $(1)
	const component = () => `h${level()}`
	const increment = () => level((level() + 1) % 7 || 1)
	useInterval(increment, TEST_INTERVAL)
	return (
		<>
			<h3>Dynamic - Function Component</h3>
			<Dynamic component={component}>Level: {level}</Dynamic>
		</>
	)
}

TestDynamicFunctionComponent.test = {
	static: true,
	snapshots: ['h1'],
}

const TestDynamicObservableProps = () => {
	const red = { class: 'red' }
	const blue = { class: 'blue' }
	const props = $(red)
	const toggle = () => props(prev => (prev === red ? blue : red))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Dynamic - Observable Props</h3>
			<Dynamic
				component="h5"
				props={props}
			>
				Content
			</Dynamic>
		</>
	)
}

TestDynamicObservableProps.test = {
	static: false,
	snapshots: [
		'<h5 class="red">Content</h5>',
		'<h5 class="blue">Content</h5>',
	],
}

const TestDynamicFunctionProps = () => {
	const red = { class: 'red' }
	const blue = { class: 'blue' }
	const props = $(red)
	const toggle = () => props(prev => (prev === red ? blue : red))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Dynamic - Function Props</h3>
			<Dynamic
				component="h5"
				props={props}
			>
				Content
			</Dynamic>
		</>
	)
}

TestDynamicFunctionProps.test = {
	static: false,
	snapshots: [
		'<h5 class="red">Content</h5>',
		'<h5 class="blue">Content</h5>',
	],
}

const TestDynamicObservableChildren = () => {
	const o = $(random())
	const update = () => o(random())
	useInterval(update, TEST_INTERVAL)
	return (
		<>
			<h3>Dynamic - Observable Children</h3>
			<Dynamic component="h5">{o}</Dynamic>
		</>
	)
}

TestDynamicObservableChildren.test = {
	static: false,
	snapshots: ['<h5>{random}</h5>'],
}

const TestDynamicStoreProps = () => {
	let count = 1
	const props = store({ class: 'red' })
	const toggle = () =>
		(props.class = props.class === 'red' ? 'blue' : 'red')
	setInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Dynamic - Store Props</h3>
			<Dynamic
				component="div"
				props={props}
			>
				<p>{() => count++}</p>
			</Dynamic>
		</>
	)
}

TestDynamicStoreProps.test = {
	staic: false,
	snapshots: [
		'<div class="red"><p>1</p></div>',
		'<div class="blue"><p>1</p></div>',
	],
}

const TestIfStatic = () => {
	return (
		<>
			<h3>If - Static</h3>
			<If when={true}>
				<p>true</p>
			</If>
			<If when={false}>
				<p>false</p>
			</If>
		</>
	)
}

TestIfStatic.test = {
	static: true,
	snapshots: ['<p>true</p>'],
}

const TestIfObservable = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>If - Observable</h3>
			<p>
				(<If when={o}>content</If>)
			</p>
		</>
	)
}

TestIfObservable.test = {
	static: false,
	snapshots: ['<p>(content)</p>', '<p>(<!---->)</p>'],
}

const TestIfFunction = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>If - Function</h3>
			<p>
				(<If when={() => o()}>content</If>)
			</p>
		</>
	)
}

TestIfFunction.test = {
	static: false,
	snapshots: ['<p>(content)</p>', '<p>(<!---->)</p>'],
}

const TestIfFunctionUntracked = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<If when={true}>
			Noop
			<If
				when={o}
				fallback="fallback"
			>
				{() => <button onClick={() => o(false)}>Close {o()}</button>}
			</If>
		</If>
	)
}

TestIfFunctionUntracked.test = {
	static: false,
	snapshots: ['Noop<button>Close </button>', 'Noopfallback'],
}

const TestIfFunctionUntrackedUnnarrowed = () => {
	const o = $(true)
	const content = $(0)
	const increment = () => content(prev => (prev + 1) % 3)
	useInterval(increment, TEST_INTERVAL)
	return (
		<>
			<h3>If - Function Untracked Unnarrowed</h3>
			<p>
				(<If when={o}>{() => content()}</If>)
			</p>
		</>
	)
}

TestIfFunctionUntrackedUnnarrowed.test = {
	static: true,
	snapshots: ['<p>(0)</p>'],
}

const TestIfFunctionUntrackedNarrowed = () => {
	const o = $(true)
	const content = $(0)
	const increment = () => content(prev => (prev + 1) % 3)
	useInterval(increment, TEST_INTERVAL)
	return (
		<>
			<h3>If - Function Untracked Narrowed</h3>
			<p>
				(<If when={o}>{value => content()}</If>)
			</p>
		</>
	)
}

TestIfFunctionUntrackedNarrowed.test = {
	static: true,
	snapshots: ['<p>(0)</p>'],
}

const TestIfNestedFunctionUnnarrowed = () => {
	const o = $(true)
	const content = $(0)
	const increment = () => content(prev => (prev + 1) % 3)
	useInterval(increment, TEST_INTERVAL)
	return (
		<>
			<h3>If - Nested Function Unnarrowed</h3>
			<p>
				(<If when={o}>{() => () => content()}</If>)
			</p>
		</>
	)
}

TestIfNestedFunctionUnnarrowed.test = {
	static: false,
	snapshots: ['<p>(0)</p>', '<p>(1)</p>', '<p>(2)</p>'],
}

const TestIfNestedFunctionNarrowed = () => {
	const o = $(true)
	const content = $(0)
	const increment = () => content(prev => (prev + 1) % 3)
	useInterval(increment, TEST_INTERVAL)
	return (
		<>
			<h3>If - Nested Function Narrowed</h3>
			<p>
				(<If when={o}>{value => () => content()}</If>)
			</p>
		</>
	)
}

TestIfNestedFunctionNarrowed.test = {
	static: false,
	snapshots: ['<p>(0)</p>', '<p>(1)</p>', '<p>(2)</p>'],
}

const TestIfChildrenObservable = () => {
	const o = $(String(random()))
	const randomize = () => o(String(random()))
	useInterval(randomize, TEST_INTERVAL)
	return (
		<>
			<h3>If - Children Observable</h3>
			<If when={true}>{o}</If>
		</>
	)
}

TestIfChildrenObservable.test = {
	static: false,
	snapshots: ['{random}'],
}

const TestIfChildrenObservableStatic = () => {
	const Content = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>{o()}</p>
	}
	return (
		<>
			<h3>If - Children Observable Static</h3>
			<If when={true}>
				<Content />
			</If>
		</>
	)
}

TestIfChildrenObservableStatic.test = {
	static: true,
	snapshots: ['<p>{random}</p>'],
}

const TestIfChildrenFunction = () => {
	const Content = value => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>{o()}</p>
	}
	return (
		<>
			<h3>If - Children Function</h3>
			<If when={true}>{Content}</If>
		</>
	)
}

TestIfChildrenFunction.test = {
	static: true,
	snapshots: ['<p>{random}</p>'],
}

const TestIfChildrenFunctionObservable = () => {
	const o = $(Math.random())
	const toggle = () => o(prev => (prev ? false : Math.random()))
	useInterval(toggle, TEST_INTERVAL)
	const Content = ({ value }) => {
		return <p>Value: {value}</p>
	}
	return (
		<>
			<h3>If - Children Function Observable</h3>
			<If when={o}>{value => <Content value={value} />}</If>
		</>
	)
}

TestIfChildrenFunctionObservable.test = {
	static: false,
	snapshots: ['<p>Value: {random}</p>', '<!---->'],
}

const TestIfFallbackStatic = () => {
	return (
		<>
			<h3>If - Fallback Static</h3>
			<If
				when={false}
				fallback={<p>Fallback!</p>}
			>
				Children
			</If>
		</>
	)
}

TestIfFallbackStatic.test = {
	static: true,
	snapshots: ['<p>Fallback!</p>'],
}

const TestIfFallbackObservable = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		return <p>Fallback: {o}</p>
	}
	return (
		<>
			<h3>If - Fallback Observable</h3>
			<If
				when={false}
				fallback={<Fallback />}
			>
				Children
			</If>
		</>
	)
}

TestIfFallbackObservable.test = {
	static: false,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestIfFallbackObservableStatic = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Fallback: {o()}</p>
	}
	return (
		<>
			<h3>If - Fallback Observable Static</h3>
			<If
				when={false}
				fallback={<Fallback />}
			>
				Children
			</If>
		</>
	)
}

TestIfFallbackObservableStatic.test = {
	static: true,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestIfFallbackFunction = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Fallback: {o()}</p>
	}
	return (
		<>
			<h3>If - Fallback Function</h3>
			<If
				when={false}
				fallback={Fallback}
			>
				Children
			</If>
		</>
	)
}

TestIfFallbackFunction.test = {
	static: false,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestIfRace = () => {
	const data = $({ deep: 'hi' })
	const visible = $(true)
	setTimeout(() => {
		data(null)
		visible(false)
	})
	return (
		<>
			<h3>If - Race</h3>
			<If when={visible}>
				<div>{() => data().deep}</div>
			</If>
		</>
	)
}

TestIfRace.test = {
	static: false,
	snapshots: ['<div>hi</div>', ''],
}

const TestKeepAliveStatic = () => {
	return (
		<>
			<h3>KeepAlive - Static</h3>
			<KeepAlive id="static">
				<p>123</p>
			</KeepAlive>
		</>
	)
}

TestKeepAliveStatic.test = {
	static: true,
	snapshots: ['<p>123</p>'],
}

const TestKeepAliveObservable = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)

	return (
		<>
			<h3>KeepAlive - Observable</h3>
			<If when={o}>
				<KeepAlive id="observable-1">
					<p>{() => Math.random()}</p>
				</KeepAlive>
			</If>
			<If when={o}>
				<KeepAlive
					id="observable-2"
					ttl={100}
				>
					<p>{() => Math.random()}</p>
				</KeepAlive>
			</If>
		</>
	)
}

TestKeepAliveObservable.test = {
	static: false,
	snapshots: ['<p>{random}</p><p>{random}</p>', '<!----><!---->'],
}

const TestTernaryStatic = () => {
	return (
		<>
			<h3>Ternary - Static</h3>
			<Ternary when={true}>
				<p>true (1)</p>
				<p>false (1)</p>
			</Ternary>
			<Ternary when={false}>
				<p>true (2)</p>
				<p>false (2)</p>
			</Ternary>
		</>
	)
}

TestTernaryStatic.test = {
	static: true,
	snapshots: ['<p>true (1)</p><p>false (2)</p>'],
}

const TestTernaryStaticInline = () => {
	return (
		<>
			<h3>Ternary - Static Inline</h3>
			<Ternary when={true}>
				<p>true (1)</p>
				<p>false (1)</p>
			</Ternary>
			<Ternary when={false}>
				<p>true (2)</p>
				<p>false (2)</p>
			</Ternary>
		</>
	)
}

TestTernaryStaticInline.test = {
	static: true,
	snapshots: ['<p>true (1)</p><p>false (2)</p>'],
}

const TestTernaryObservable = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Ternary - Observable</h3>
			<Ternary when={o}>
				<p>true</p>
				<p>false</p>
			</Ternary>
		</>
	)
}

TestTernaryObservable.test = {
	static: false,
	snapshots: ['<p>true</p>', '<p>false</p>'],
}

const TestTernaryObservableChildren = () => {
	const AB = () => {
		const a = <i>a</i>
		const b = <u>b</u>
		const component = $(a)
		const toggle = () => component(() => (component() === a ? b : a))
		useInterval(toggle, TEST_INTERVAL / 2)
		return component
	}
	const CD = () => {
		const c = <b>c</b>
		const d = <span>d</span>
		const component = $(c)
		const toggle = () => component(() => (component() === c ? d : c))
		useInterval(toggle, TEST_INTERVAL / 2)
		return component
	}
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Ternary - Observable Children</h3>
			<Ternary when={o}>
				<AB />
				<CD />
			</Ternary>
		</>
	)
}

TestTernaryObservableChildren.test = {
	static: false,
	snapshots: ['<i>a</i>', '<u>b</u>', '<b>c</b>', '<span>d</span>'],
}

const TestTernaryFunction = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Ternary - Function</h3>
			<Ternary when={() => !o()}>
				<p>true</p>
				<p>false</p>
			</Ternary>
		</>
	)
}

TestTernaryFunction.test = {
	static: false,
	snapshots: ['<p>false</p>', '<p>true</p>'],
}

const TestTernaryChildrenObservableStatic = () => {
	const True = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>True: {o()}</p>
	}
	const False = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>False: {o()}</p>
	}
	return (
		<>
			<h3>Ternary - Children Observable Static</h3>
			<Ternary when={true}>
				<True />
				<False />
			</Ternary>
			<Ternary when={false}>
				<True />
				<False />
			</Ternary>
		</>
	)
}

TestTernaryChildrenObservableStatic.test = {
	static: true,
	snapshots: ['<p>True: {random}</p><p>False: {random}</p>'],
}

const TestTernaryChildrenFunction = () => {
	const True = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>True: {o()}</p>
	}
	const False = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>False: {o()}</p>
	}
	return (
		<>
			<h3>Ternary - Children Function</h3>
			<Ternary when={true}>
				{True}
				{False}
			</Ternary>
			<Ternary when={false}>
				{True}
				{False}
			</Ternary>
		</>
	)
}

TestTernaryChildrenFunction.test = {
	static: false,
	snapshots: ['<p>True: {random}</p><p>False: {random}</p>'],
}

const TestSwitchStatic = () => {
	return (
		<>
			<h3>Switch - Static</h3>
			<Switch when={2}>
				<Match when={0}>
					<p>0</p>
				</Match>
				<Match when={1}>
					<p>1</p>
				</Match>
				<Match when={2}>
					<p>2</p>
				</Match>
				<Switch.Default>
					<p>default</p>
				</Switch.Default>
			</Switch>
		</>
	)
}

TestSwitchStatic.test = {
	static: true,
	snapshots: ['<p>2</p>'],
}

const TestSwitchObservable = () => {
	const o = $(0)
	const toggle = () => o(prev => (prev + 1) % 4)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Switch - Observable</h3>
			<Switch when={o}>
				<Match when={0}>
					<p>0</p>
				</Match>
				<Match when={1}>
					<p>1</p>
				</Match>
				<Match when={2}>
					<p>2</p>
				</Match>
				<Switch.Default>
					<p>default</p>
				</Switch.Default>
			</Switch>
		</>
	)
}

TestSwitchObservable.test = {
	static: false,
	snapshots: ['<p>0</p>', '<p>1</p>', '<p>2</p>', '<p>default</p>'],
}

const TestSwitchObservableComplex = () => {
	const o = $(0)
	const toggle = () => o(prev => (prev + 1) % 4)
	const o2 = $(2)
	const toggle2 = () => o2(prev => (prev + 1) % 5)
	const o3 = $(4)
	const toggle3 = () => o3(prev => (prev + 1) % 4)
	useInterval(toggle, TEST_INTERVAL)
	useInterval(toggle2, TEST_INTERVAL)
	useInterval(toggle3, TEST_INTERVAL)
	return (
		<>
			<h3>Switch - Observable Complex</h3>
			<Switch when={o}>
				<Switch.Case when={0}>
					<p>1 - 0</p>
				</Switch.Case>
				<Switch.Case when={1}>
					<p>1 - 1</p>
				</Switch.Case>
				<Switch.Case when={2}>
					<p>1 - 2</p>
				</Switch.Case>
			</Switch>
			<Switch when={o2}>
				<Switch.Case when={0}>
					<p>2 - 0</p>
				</Switch.Case>
				<Switch.Case when={1}>
					<p>2 - 1</p>
				</Switch.Case>
				<Switch.Case when={2}>
					<p>2 - 2</p>
				</Switch.Case>
			</Switch>
			<Switch when={o3}>
				<Switch.Case when={0}>
					<p>3 - 0</p>
				</Switch.Case>
				<Switch.Case when={1}>
					<p>3 - 1</p>
				</Switch.Case>
				<Switch.Case when={2}>
					<p>3 - 2</p>
				</Switch.Case>
			</Switch>
		</>
	)
}

const TestSwitchFunction = () => {
	const o = $(0)
	const toggle = () => o(prev => (prev + 1) % 4)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Switch - Function</h3>
			<Switch when={() => o()}>
				<Switch.Case when={0}>
					<p>0</p>
				</Switch.Case>
				<Switch.Case when={1}>
					<p>1</p>
				</Switch.Case>
				<Switch.Case when={2}>
					<p>2</p>
				</Switch.Case>
				<Switch.Default>
					<p>default</p>
				</Switch.Default>
			</Switch>
		</>
	)
}

TestSwitchFunction.test = {
	static: false,
	snapshots: ['<p>0</p>', '<p>1</p>', '<p>2</p>', '<p>default</p>'],
}

const TestSwitchCaseObservableStatic = () => {
	const Case = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Case: {o()}</p>
	}
	return (
		<>
			<h3>Switch - Case Observable Static</h3>
			<Switch when={0}>
				<Switch.Case when={0}>
					<Case />
				</Switch.Case>
				<Switch.Default>
					<p>default</p>
				</Switch.Default>
			</Switch>
		</>
	)
}

TestSwitchCaseObservableStatic.test = {
	static: true,
	snapshots: ['<p>Case: {random}</p>'],
}

const TestSwitchCaseFunction = () => {
	const Case = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Case: {o()}</p>
	}
	return (
		<>
			<h3>Switch - Case Function</h3>
			<Switch when={0}>
				<Switch.Case when={0}>{Case}</Switch.Case>
				<Switch.Default>
					<p>default</p>
				</Switch.Default>
			</Switch>
		</>
	)
}

TestSwitchCaseFunction.test = {
	static: false,
	snapshots: ['<p>Case: {random}</p>'],
}

const TestSwitchDefaultObservableStatic = () => {
	const Default = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Default: {o()}</p>
	}
	return (
		<>
			<h3>Switch - Default Observable Static</h3>
			<Switch when={-1}>
				<Switch.Case when={0}>
					<p>case</p>
				</Switch.Case>
				<Switch.Default>
					<Default />
				</Switch.Default>
			</Switch>
		</>
	)
}

TestSwitchDefaultObservableStatic.test = {
	static: true,
	snapshots: ['<p>Default: {random}</p>'],
}

const TestSwitchDefaultFunction = () => {
	const Default = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Default: {o()}</p>
	}
	return (
		<>
			<h3>Switch - Default Function</h3>
			<Switch when={-1}>
				<Switch.Case when={0}>
					<p>case</p>
				</Switch.Case>
				<Switch.Default>{Default}</Switch.Default>
			</Switch>
		</>
	)
}

TestSwitchDefaultFunction.test = {
	static: false,
	snapshots: ['<p>Default: {random}</p>'],
}

const TestSwitchFallbackObservableStatic = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Fallback: {o()}</p>
	}
	return (
		<>
			<h3>Switch - Fallback Observable Static</h3>
			<Switch
				when={-1}
				fallback={<Fallback />}
			>
				<Switch.Case when={0}>
					<p>case</p>
				</Switch.Case>
			</Switch>
		</>
	)
}

TestSwitchFallbackObservableStatic.test = {
	static: true,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestSwitchFallbackFunction = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Fallback: {o()}</p>
	}
	return (
		<>
			<h3>Switch - Fallback Function</h3>
			<Switch
				when={-1}
				fallback={Fallback}
			>
				<Switch.Case when={0}>
					<p>case</p>
				</Switch.Case>
			</Switch>
		</>
	)
}

TestSwitchFallbackFunction.test = {
	static: false,
	snapshots: ['<p>Fallback: {random}</p>'],
}

class Component {
	constructor(props) {
		this.props = props
		this.state = {}
	}
	render(props) {
		throw new Error('Missing render function')
	}
	static call(thiz, props) {
		const instance = new thiz(props)
		return instance.render(instance.props, instance.state)
	}
}

class TestableComponent extends Pota {
	static test = {
		static: true,
		snapshots: [''],
	}
}

class TestComponentStatic extends TestableComponent {
	render() {
		return (
			<>
				<h3>Component - Static</h3>
				<p>content</p>
			</>
		)
	}
}

TestComponentStatic.test = {
	static: true,
	snapshots: ['<p>content</p>'],
}

class TestComponentStaticProps extends TestableComponent {
	render(props) {
		return (
			<>
				<h3>Component - Static Props</h3>
				<p>{props.value}</p>
			</>
		)
	}
}

TestComponentStaticProps.test = {
	static: true,
	snapshots: ['<p>{random}</p>'],
}

class TestComponentStaticRenderProps extends TestableComponent {
	render(props) {
		return (
			<>
				<h3>Component - Static Render Props</h3>
				<p>{props.value}</p>
			</>
		)
	}
}

TestComponentStaticRenderProps.test = {
	static: true,
	snapshots: ['<p>{random}</p>'],
}

class TestComponentStaticRenderState extends TestableComponent {
	constructor(props) {
		super(props)
		this.state.multiplier = 0
	}
	render(props, state) {
		return (
			<>
				<h3>Component - Static Render State</h3>
				<p>{props.value * this.state.multiplier}</p>
			</>
		)
	}
}

TestComponentStaticRenderState.test = {
	static: true,
	snapshots: ['<p>0</p>'],
}

class TestComponentObservable extends TestableComponent {
	getRandom() {
		return random()
	}
	render() {
		const o = $(this.getRandom())
		const randomize = () => o(this.getRandom())
		useInterval(randomize, TEST_INTERVAL)
		return (
			<>
				<h3>Component - Observable</h3>
				<p>{o}</p>
			</>
		)
	}
}

TestComponentObservable.test = {
	static: false,
	snapshots: ['<p>{random}</p>'],
}

class TestComponentFunction extends TestableComponent {
	getRandom() {
		return random()
	}
	render() {
		const o = $(this.getRandom())
		const randomize = () => o(this.getRandom())
		useInterval(randomize, TEST_INTERVAL)
		return (
			<>
				<h3>Component - Function</h3>
				<p>{() => o()}</p>
			</>
		)
	}
}

TestComponentFunction.test = {
	static: false,
	snapshots: ['<p>{random}</p>'],
}

const TestTabIndexBooleanStatic = () => {
	return (
		<>
			<h3>TabIndex - Boolean - Static</h3>
			<p tabIndex={true}>true</p>
			<p tabIndex={false}>false</p>
		</>
	)
}

TestTabIndexBooleanStatic.test = {
	static: true,
	snapshots: ['<p tabindex="0">true</p><p>false</p>'],
}

const TestTabIndexBooleanObservable = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>TabIndex - Boolean - Observable</h3>
			<p tabIndex={o}>content</p>
		</>
	)
}

TestTabIndexBooleanObservable.test = {
	static: false,
	snapshots: ['<p tabindex="0">content</p>', '<p>content</p>'],
}

const TestTabIndexBooleanFunction = () => {
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>TabIndex - Boolean - Function</h3>
			<p tabIndex={() => o()}>content</p>
		</>
	)
}

TestTabIndexBooleanFunction.test = {
	static: false,
	snapshots: ['<p tabindex="0">content</p>', '<p>content</p>'],
}

const TestForStatic = () => {
	const values = [1, 2, 3]
	return (
		<>
			<h3>For - Static</h3>
			<For values={values}>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForStatic.test = {
	static: true,
	snapshots: ['<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'],
}

const TestForObservables = () => {
	const v1 = $(1)
	const v2 = $(2)
	const v3 = $(3)
	const values = [v1, v2, v3]
	useInterval(() => {
		v1((v1() + 1) % 5)
		v2((v2() + 1) % 5)
		v3((v3() + 1) % 5)
	}, TEST_INTERVAL)
	return (
		<>
			<h3>For - Observables</h3>
			<For values={values}>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForObservables.test = {
	static: false,
	snapshots: [
		'<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>',
		'<p>Value: 2</p><p>Value: 3</p><p>Value: 4</p>',
		'<p>Value: 3</p><p>Value: 4</p><p>Value: 0</p>',
		'<p>Value: 4</p><p>Value: 0</p><p>Value: 1</p>',
		'<p>Value: 0</p><p>Value: 1</p><p>Value: 2</p>',
	],
}

const TestForObservablesStatic = () => {
	const v1 = $(1)
	const v2 = $(2)
	const v3 = $(3)
	const values = [v1, v2, v3]
	useInterval(() => {
		v1((v1() + 1) % 5)
		v2((v2() + 1) % 5)
		v3((v3() + 1) % 5)
	}, TEST_INTERVAL)
	return (
		<>
			<h3>For - Observables Static</h3>
			<For values={values}>
				{value => {
					value()
					return <p>Value: {value()}</p>
				}}
			</For>
		</>
	)
}

TestForObservablesStatic.test = {
	static: true,
	snapshots: ['<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'],
}

const TestForObservableObservables = () => {
	const v1 = $(1)
	const v2 = $(2)
	const v3 = $(3)
	const v4 = $(4)
	const v5 = $(5)
	const values = $([v1, v2, v3, v4, v5])
	useInterval(() => {
		v1(v1() + 1)
		v2(v2() + 1)
		v3(v3() + 1)
		v4(v4() + 1)
		v5(v5() + 1)
		values(
			values()
				.slice()
				.sort(() => 0.5 - random()),
		)
	}, TEST_INTERVAL)
	return (
		<>
			<h3>For - Observable Observables</h3>
			<For values={values}>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

const TestForFunctionObservables = () => {
	const v1 = $(1)
	const v2 = $(2)
	const v3 = $(3)
	const values = [v1, v2, v3]
	useInterval(() => {
		v1((v1() + 1) % 5)
		v2((v2() + 1) % 5)
		v3((v3() + 1) % 5)
	}, TEST_INTERVAL)
	return (
		<>
			<h3>For - Function Observables</h3>
			<For values={() => values}>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForFunctionObservables.test = {
	static: false,
	snapshots: [
		'<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>',
		'<p>Value: 2</p><p>Value: 3</p><p>Value: 4</p>',
		'<p>Value: 3</p><p>Value: 4</p><p>Value: 0</p>',
		'<p>Value: 4</p><p>Value: 0</p><p>Value: 1</p>',
		'<p>Value: 0</p><p>Value: 1</p><p>Value: 2</p>',
	],
}

const TestForRandom = () => {
	const values = $([random(), random(), random()])
	const update = () => values([random(), random(), random()])
	useInterval(update, TEST_INTERVAL)
	return (
		<>
			<h3>For - Random Only Child</h3>
			<For values={values}>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForRandom.test = {
	static: false,
	snapshots: [
		'<p>Value: {random}</p><p>Value: {random}</p><p>Value: {random}</p>',
	],
}

const TestForRandomOnlyChild = () => {
	const values = $([random(), random(), random()])
	const update = () => values([random(), random(), random()])
	useInterval(update, TEST_INTERVAL)
	return (
		<>
			<h3>For - Random</h3>
			<For values={values}>
				{value => {
					return <p>{value}</p>
				}}
			</For>
		</>
	)
}

TestForRandomOnlyChild.test = {
	static: false,
	snapshots: ['<p>{random}</p><p>{random}</p><p>{random}</p>'],
}

const TestForFallbackStatic = () => {
	return (
		<>
			<h3>For - Fallback Static</h3>
			<For
				values={[]}
				fallback={<div>Fallback!</div>}
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForFallbackStatic.test = {
	static: true,
	snapshots: ['<div>Fallback!</div>'],
}

const TestForFallbackObservable = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		return (
			<>
				<p>Fallback: {o}</p>
			</>
		)
	}
	return (
		<>
			<h3>For - Fallback Observable</h3>
			<For
				values={[]}
				fallback={<Fallback />}
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForFallbackObservable.test = {
	static: false,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestForFallbackObservableStatic = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return (
			<>
				<p>Fallback: {o()}</p>
			</>
		)
	}
	return (
		<>
			<h3>For - Fallback Observable Static</h3>
			<For
				values={[]}
				fallback={<Fallback />}
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForFallbackObservableStatic.test = {
	static: true,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestForFallbackFunction = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return (
			<>
				<p>Fallback: {o()}</p>
			</>
		)
	}
	return (
		<>
			<h3>For - Fallback Function</h3>
			<For
				values={[]}
				fallback={Fallback}
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForFallbackFunction.test = {
	static: false,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestForUnkeyedStatic = () => {
	const values = [1, 2, 3]
	return (
		<>
			<h3>For - Unkeyed - Static</h3>
			<For
				values={values}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedStatic.test = {
	static: true,
	snapshots: ['<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'],
}

const TestForUnkeyedObservables = () => {
	const v1 = $(1)
	const v2 = $(2)
	const v3 = $(3)
	const values = [v1, v2, v3]
	useInterval(() => {
		v1((v1() + 1) % 5)
		v2((v2() + 1) % 5)
		v3((v3() + 1) % 5)
	}, TEST_INTERVAL)
	return (
		<>
			<h3>For - Unkeyed - Observables</h3>
			<For
				values={values}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedObservables.test = {
	static: false,
	snapshots: [
		'<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>',
		'<p>Value: 2</p><p>Value: 3</p><p>Value: 4</p>',
		'<p>Value: 3</p><p>Value: 4</p><p>Value: 0</p>',
		'<p>Value: 4</p><p>Value: 0</p><p>Value: 1</p>',
		'<p>Value: 0</p><p>Value: 1</p><p>Value: 2</p>',
	],
}

const TestForUnkeyedObservablesStatic = () => {
	const v1 = $(1)
	const v2 = $(2)
	const v3 = $(3)
	const values = [v1, v2, v3]
	useInterval(() => {
		v1((v1() + 1) % 5)
		v2((v2() + 1) % 5)
		v3((v3() + 1) % 5)
	}, TEST_INTERVAL)
	return (
		<>
			<h3>For - Unkeyed - Observables Static</h3>
			<For
				values={values}
				unkeyed
			>
				{value => {
					value()
					return <p>Value: {value()}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedObservablesStatic.test = {
	static: true,
	snapshots: ['<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'],
}

const TestForUnkeyedObservableObservables = () => {
	const v1 = $(1)
	const v2 = $(2)
	const v3 = $(3)
	const v4 = $(4)
	const v5 = $(5)
	const values = $([v1, v2, v3, v4, v5])
	useInterval(() => {
		v1(v1() + 1)
		v2(v2() + 1)
		v3(v3() + 1)
		v4(v4() + 1)
		v5(v5() + 1)
		values(
			values()
				.slice()
				.sort(() => 0.5 - random()),
		)
	}, TEST_INTERVAL)
	return (
		<>
			<h3>For - Unkeyed - Observable Observables</h3>
			<For
				values={values}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

const TestForUnkeyedFunctionObservables = () => {
	const v1 = $(1)
	const v2 = $(2)
	const v3 = $(3)
	const values = [v1, v2, v3]
	useInterval(() => {
		v1((v1() + 1) % 5)
		v2((v2() + 1) % 5)
		v3((v3() + 1) % 5)
	}, TEST_INTERVAL)
	return (
		<>
			<h3>For - Unkeyed - Function Observables</h3>
			<For
				values={() => values}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedFunctionObservables.test = {
	static: false,
	snapshots: [
		'<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>',
		'<p>Value: 2</p><p>Value: 3</p><p>Value: 4</p>',
		'<p>Value: 3</p><p>Value: 4</p><p>Value: 0</p>',
		'<p>Value: 4</p><p>Value: 0</p><p>Value: 1</p>',
		'<p>Value: 0</p><p>Value: 1</p><p>Value: 2</p>',
	],
}

const TestForUnkeyedRandom = () => {
	const values = $([random(), random(), random()])
	const update = () => values([random(), random(), random()])
	useInterval(update, TEST_INTERVAL)
	return (
		<>
			<h3>For - Unkeyed - Random</h3>
			<For
				values={values}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedRandom.test = {
	static: false,
	snapshots: [
		'<p>Value: {random}</p><p>Value: {random}</p><p>Value: {random}</p>',
	],
}

const TestForUnkeyedRandomOnlyChild = () => {
	const values = $([random(), random(), random()])
	const update = () => values([random(), random(), random()])
	useInterval(update, TEST_INTERVAL)
	return (
		<>
			<h3>For - Unkeyed - Random Only Child</h3>
			<For
				values={values}
				unkeyed
			>
				{value => {
					return <p>{value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedRandomOnlyChild.test = {
	static: false,
	snapshots: ['<p>{random}</p><p>{random}</p><p>{random}</p>'],
}

const TestForUnkeyedFallbackStatic = () => {
	return (
		<>
			<h3>For - Unkeyed - Fallback Static</h3>
			<For
				values={[]}
				fallback={<div>Fallback!</div>}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedFallbackStatic.test = {
	static: true,
	snapshots: ['<div>Fallback!</div>'],
}

const TestForUnkeyedFallbackObservable = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		return (
			<>
				<p>Fallback: {o}</p>
			</>
		)
	}
	return (
		<>
			<h3>For - Unkeyed - Fallback Observable</h3>
			<For
				values={[]}
				fallback={<Fallback />}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedFallbackObservable.test = {
	static: false,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestForUnkeyedFallbackObservableStatic = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return (
			<>
				<p>Fallback: {o()}</p>
			</>
		)
	}
	return (
		<>
			<h3>For - Unkeyed - Fallback Observable Static</h3>
			<For
				values={[]}
				fallback={<Fallback />}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedFallbackObservableStatic.test = {
	static: true,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestForUnkeyedFallbackFunction = () => {
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return (
			<>
				<p>Fallback: {o()}</p>
			</>
		)
	}
	return (
		<>
			<h3>For - Unkeyed - Fallback Function</h3>
			<For
				values={[]}
				fallback={Fallback}
				unkeyed
			>
				{value => {
					return <p>Value: {value}</p>
				}}
			</For>
		</>
	)
}

TestForUnkeyedFallbackFunction.test = {
	static: false,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestFragmentStatic = () => {
	return (
		<>
			<h3>Fragment - Static</h3>
			<p>content</p>
		</>
	)
}

TestFragmentStatic.test = {
	static: true,
	snapshots: ['<p>content</p>'],
}

const TestFragmentStaticComponent = () => {
	return (
		<>
			<h3>Fragment - Static Component</h3>
			<p>content</p>
		</>
	)
}

TestFragmentStaticComponent.test = {
	static: true,
	snapshots: ['<p>content</p>'],
}

const TestFragmentStaticDeep = () => {
	return (
		<>
			<h3>Fragment - Static Deep</h3>
			<>
				<p>first</p>
			</>
			<>
				<p>second</p>
			</>
			<>
				<>
					<>
						<>
							<p>deep</p>
						</>
					</>
				</>
			</>
		</>
	)
}

TestFragmentStaticDeep.test = {
	static: true,
	snapshots: ['<p>first</p><p>second</p><p>deep</p>'],
}

const TestErrorBoundary = () => {
	const Erroring = () => {
		const o = $(true)
		const toggle = () => o(prev => !prev)
		useTimeout(toggle, TEST_INTERVAL)
		return useMemo(() => {
			if (o()) return <p>content</p>
			throw new Error('Custom error')
		})
	}
	const Fallback = ({ error, reset }) => {
		useTimeout(reset, TEST_INTERVAL)
		return <p>Error caught: {error.message}</p>
	}
	return (
		<>
			<h3>Error Boundary</h3>
			<ErrorBoundary fallback={Fallback}>
				<Erroring />
			</ErrorBoundary>
		</>
	)
}

TestErrorBoundary.test = {
	static: false,
	snapshots: ['<p>content</p>', '<p>Error caught: Custom error</p>'],
}

const TestErrorBoundaryChildrenObservableStatic = () => {
	const Children = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Children: {o()}</p>
	}
	const Fallback = () => {
		return <p>Fallback!</p>
	}
	return (
		<>
			<h3>Error Boundary - Children Observable Static</h3>
			<ErrorBoundary fallback={<Fallback />}>
				<Children />
			</ErrorBoundary>
		</>
	)
}

TestErrorBoundaryChildrenObservableStatic.test = {
	static: true,
	snapshots: ['<p>Children: {random}</p>'],
}

const TestErrorBoundaryChildrenFunction = () => {
	const Children = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Children: {o()}</p>
	}
	const Fallback = () => {
		return <p>Fallback!</p>
	}
	return (
		<>
			<h3>Error Boundary - Children Function</h3>
			<ErrorBoundary fallback={<Fallback />}>
				{Children}
			</ErrorBoundary>
		</>
	)
}

TestErrorBoundaryChildrenFunction.test = {
	static: false,
	snapshots: ['<p>Children: {random}</p>'],
}

const TestErrorBoundaryFallbackObservableStatic = () => {
	const Children = () => {
		throw new Error()
	}
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Fallback: {o()}</p>
	}
	return (
		<>
			<h3>Error Boundary - Fallback Observable Static</h3>
			<ErrorBoundary fallback={<Fallback />}>
				<Children />
			</ErrorBoundary>
		</>
	)
}

TestErrorBoundaryFallbackObservableStatic.test = {
	static: true,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestErrorBoundaryFallbackFunction = () => {
	const Children = () => {
		throw new Error()
	}
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Fallback: {o()}</p>
	}
	return (
		<>
			<h3>Error Boundary - Fallback Function</h3>
			<ErrorBoundary fallback={Fallback}>
				<Children />
			</ErrorBoundary>
		</>
	)
}

TestErrorBoundaryFallbackFunction.test = {
	static: true,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestChildren = () => {
	const A = ({ children }) => {
		return <div class="A">{children}</div>
	}
	const B = ({ children }) => {
		return <div class="B">{children}</div>
	}
	const C = ({ children }) => {
		return <div class="C">{children}</div>
	}
	return (
		<>
			<h3>Children</h3>
			<A>
				<B>
					<C>
						<p>content</p>
					</C>
				</B>
			</A>
		</>
	)
}

TestChildren.test = {
	static: true,
	snapshots: [
		'<div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>',
	],
}

const TestRef = () => {
	const ref = $()
	renderEffect(
		() => {
			const element = ref()
			if (!element) return
			element.textContent = `Got ref - Has parent: ${!!ref()
				?.parentElement} - Is connected: ${!!ref()?.isConnected}`
		},
		{ sync: true },
	)
	return (
		<>
			<h3>Ref</h3>
			<p ref={ref}>content</p>
		</>
	)
}

TestRef.test = {
	static: true,
	snapshots: [
		'<p>Got ref - Has parent: true - Is connected: true</p>',
	],
}

const TestRefs = () => {
	const ref1 = $()
	const ref2 = $()
	renderEffect(
		() => {
			const element1 = ref1()
			const element2 = ref2()
			if (!element1) return
			if (!element2) return
			const content1 = `Got ref1 - Has parent: ${!!element1.parentElement} - Is connected: ${!!element1.isConnected}`
			const content2 = `Got ref2 - Has parent: ${!!element2.parentElement} - Is connected: ${!!element2.isConnected}`
			element1.textContent = `${content1} / ${content2}`
		},
		{ sync: true },
	)
	return (
		<>
			<h3>Refs</h3>
			<p ref={[ref1, ref2, null, undefined]}>content</p>
		</>
	)
}

TestRefs.test = {
	static: true,
	snapshots: [
		'<p>Got ref1 - Has parent: true - Is connected: true / Got ref2 - Has parent: true - Is connected: true</p>',
	],
}

const TestRefsNested = () => {
	const ref1 = $()
	const ref2 = $()
	renderEffect(
		() => {
			const element1 = ref1()
			const element2 = ref2()
			if (!element1) return
			if (!element2) return
			const content1 = `Got ref1 - Has parent: ${!!element1.parentElement} - Is connected: ${!!element1.isConnected}`
			const content2 = `Got ref2 - Has parent: ${!!element2.parentElement} - Is connected: ${!!element2.isConnected}`
			element1.textContent = `${content1} / ${content2}`
		},
		{ sync: true },
	)
	return (
		<>
			<h3>Refs - Nested</h3>
			<p ref={[ref1, [null, [undefined, ref2]]]}>content</p>
		</>
	)
}

TestRefsNested.test = {
	static: true,
	snapshots: [
		'<p>Got ref1 - Has parent: true - Is connected: true / Got ref2 - Has parent: true - Is connected: true</p>',
	],
}

const TestRefUnmounting = () => {
	const message = $('')
	const mounted = $(true)
	const ref = $()
	const toggle = () => mounted(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	renderEffect(
		() => {
			const element = ref()
			if (element) {
				message(
					`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${
						element.isConnected
					}`,
				)
			} else {
				message(`No ref`)
			}
		},
		{ sync: true },
	)
	return (
		<>
			<h3>Ref - Unmounting</h3>
			<p>{message}</p>
			<If when={mounted}>
				<p ref={ref}>content</p>
			</If>
		</>
	)
}

TestRefUnmounting.test = {
	static: false,
	wrap: false,
	snapshots: [
		'<p>No ref</p><p>content</p>',
		'<p>Got ref - Has parent: true - Is connected: true</p><p>content</p>',
		'<p>Got ref - Has parent: true - Is connected: true</p><!---->',
		'<p>Got ref - Has parent: true - Is connected: true</p><p>content</p>',
		'<p>Got ref - Has parent: true - Is connected: true</p><!---->',
		'<p>Got ref - Has parent: true - Is connected: true</p><p>content</p>',
		'<p>Got ref - Has parent: true - Is connected: true</p><!---->',
	],
}

const TestRefContext = () => {
	const message = $('')
	const Context = createContext(123)
	const Reffed = () => {
		const ref = element =>
			message(
				`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${
					element.isConnected
				} - Context: ${Context()}`,
			)
		return <p ref={ref}>{message}</p>
	}
	return (
		<>
			<h3>Ref - Context</h3>
			<Context.Provider value={321}>
				<Reffed />
			</Context.Provider>
		</>
	)
}

TestRefContext.test = {
	static: false,
	snapshots: [
		'<p></p>',
		'<p>Got ref - Has parent: true - Is connected: true - Context: 321</p>',
	],
}

const TestRefUntrack = () => {
	const o = $(0)
	const increment = () => o(prev => prev + 1)
	useInterval(increment, TEST_INTERVAL)

	const Reffed = hmr(
		() => {},
		() => {
			const ref = element => (element.textContent = o())
			return <p ref={ref}>content</p>
		},
	)

	return (
		<>
			<h3>Ref - Untrack</h3>
			<Reffed />
		</>
	)
}

TestRefUntrack.test = {
	static: true,
	snapshots: ['<p>0</p>'],
}

const TestPromiseResolved = () => {
	const resolved = usePromise(
		new Promise(resolve =>
			setTimeout(() => resolve('Loaded!'), TEST_INTERVAL),
		),
	)
	return (
		<>
			<h3>Promise - Resolved</h3>
			{() => {
				if (resolved().pending) return <p>Pending...</p>
				if (resolved().error) return <p>{resolved().error.message}</p>
				return <p>{resolved().value}</p>
			}}
		</>
	)
}

TestPromiseResolved.test = {
	static: false,
	snapshots: ['<p>Pending...</p>', '<p>Loaded!</p>'],
}

const TestPromiseRejected = () => {
	const rejected = usePromise(
		new Promise((_, reject) =>
			setTimeout(() => reject('Custom Error'), TEST_INTERVAL),
		),
	)
	return (
		<>
			<h3>Promise - Rejected</h3>
			{() => {
				if (rejected().pending) return <p>Pending...</p>
				if (rejected().error) return <p>{rejected().error.message}</p>
				return <p>{rejected().value}</p>
			}}
		</>
	)
}

TestPromiseRejected.test = {
	static: false,
	snapshots: ['<p>Pending...</p>', '<p>Custom Error</p>'],
}

const TestSVGStatic = () => {
	return (
		<>
			<h3>SVG - Static</h3>
			<svg
				viewBox="0 0 50 50"
				width="50px"
				xmlns="http://www.w3.org/2000/svg"
				stroke={randomColor()}
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		</>
	)
}

TestSVGStatic.test = {
	static: true,
	snapshots: [
		'<svg viewBox="0 0 50 50" width="50px" xmlns="http://www.w3.org/2000/svg" stroke="{random-color}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestSVGStaticComplex = () => {
	return (
		<>
			<h3>SVG - Static Complex</h3>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="8.838ex"
				height="2.398ex"
				role="img"
				focusable="false"
				viewBox="0 -966.5 3906.6 1060"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				style="vertical-align: -0.212ex;"
			>
				<defs>
					<path
						id="MJX-1-TEX-N-221A"
						d="M95 178Q89 178 81 186T72 200T103 230T169 280T207 309Q209 311 212 311H213Q219 311 227 294T281 177Q300 134 312 108L397 -77Q398 -77 501 136T707 565T814 786Q820 800 834 800Q841 800 846 794T853 782V776L620 293L385 -193Q381 -200 366 -200Q357 -200 354 -197Q352 -195 256 15L160 225L144 214Q129 202 113 190T95 178Z"
					></path>
					<path
						id="MJX-1-TEX-I-1D44E"
						d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"
					></path>
					<path
						id="MJX-1-TEX-N-32"
						d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"
					></path>
					<path
						id="MJX-1-TEX-N-2B"
						d="M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z"
					></path>
					<path
						id="MJX-1-TEX-I-1D44F"
						d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"
					></path>
				</defs>
				<g
					stroke="currentColor"
					fill="currentColor"
					stroke-width="0"
					transform="scale(1,-1)"
				>
					<g data-mml-node="math">
						<g data-mml-node="msqrt">
							<g transform="translate(853,0)">
								<g data-mml-node="msup">
									<g data-mml-node="mi">
										<use
											data-c="1D44E"
											xlinkHref="#MJX-1-TEX-I-1D44E"
										></use>
									</g>
									<g
										data-mml-node="mn"
										transform="translate(562,289) scale(0.707)"
									>
										<use
											data-c="32"
											xlink:href="#MJX-1-TEX-N-32"
										></use>
									</g>
								</g>
								<g
									data-mml-node="mo"
									transform="translate(1187.8,0)"
								>
									<use
										data-c="2B"
										xlink:href="#MJX-1-TEX-N-2B"
									></use>
								</g>
								<g
									data-mml-node="msup"
									transform="translate(2188,0)"
								>
									<g data-mml-node="mi">
										<use
											data-c="1D44F"
											xlink:href="#MJX-1-TEX-I-1D44F"
										></use>
									</g>
									<g
										data-mml-node="mn"
										transform="translate(462,289) scale(0.707)"
									>
										<use
											data-c="32"
											xlink:href="#MJX-1-TEX-N-32"
										></use>
									</g>
								</g>
							</g>
							<g
								data-mml-node="mo"
								transform="translate(0,106.5)"
							>
								<use
									data-c="221A"
									xlink:href="#MJX-1-TEX-N-221A"
								></use>
							</g>
							<rect
								width="3053.6"
								height="60"
								x="853"
								y="846.5"
							></rect>
						</g>
					</g>
				</g>
			</svg>
		</>
	)
}

const TestSVGStaticCamelCase = () => {
	return (
		<>
			<h3>SVG - Static CamelCase</h3>
			<svg
				viewBox="0 0 50 50"
				width="50px"
				stroke={randomColor()}
				strokeWidth="3"
				edgeMode="foo"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		</>
	)
}

TestSVGStaticCamelCase.test = {
	static: true,
	snapshots: [
		'<svg viewBox="0 0 50 50" width="50px" stroke="{random-color}" stroke-width="3" edgeMode="foo" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestSVGObservable = () => {
	const color = $(randomColor())
	const update = () => color(randomColor())
	useInterval(update, TEST_INTERVAL / 2)
	return (
		<>
			<h3>SVG - Observable</h3>
			<svg
				viewBox="0 0 50 50"
				width="50px"
				stroke={color}
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		</>
	)
}

TestSVGObservable.test = {
	static: false,
	snapshots: [
		'<svg viewBox="0 0 50 50" width="50px" stroke="{random-color}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestSVGFunction = () => {
	const color = $(randomColor())
	const update = () => color(randomColor())
	useInterval(update, TEST_INTERVAL / 2)
	return (
		<>
			<h3>SVG - Function</h3>
			<svg
				viewBox="0 0 50 50"
				width="50px"
				stroke={() => color()}
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		</>
	)
}

TestSVGFunction.test = {
	static: false,
	snapshots: [
		'<svg viewBox="0 0 50 50" width="50px" stroke="{random-color}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestSVGStyleObject = () => {
	return (
		<>
			<h3>SVG - Style Object</h3>
			<svg
				style={{ stroke: 'red', fill: 'pink' }}
				viewBox="0 0 50 50"
				width="50px"
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		</>
	)
}

TestSVGStyleObject.test = {
	static: true,
	snapshots: [
		'<svg viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white" style="stroke: red; fill: pink;"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestSVGStyleString = () => {
	return (
		<>
			<h3>SVG - Style String</h3>
			<svg
				style="stroke: red; fill: pink;"
				viewBox="0 0 50 50"
				width="50px"
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		</>
	)
}

TestSVGStyleString.test = {
	static: true,
	snapshots: [
		'<svg style="stroke: red; fill: pink;" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestSVGClassObject = () => {
	return (
		<>
			<h3>SVG - Class Object</h3>
			<svg
				class={{ red: true }}
				viewBox="0 0 50 50"
				width="50px"
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		</>
	)
}

TestSVGClassObject.test = {
	static: true,
	snapshots: [
		'<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestSVGClassString = () => {
	return (
		<>
			<h3>SVG - Class String</h3>
			<svg
				class="red"
				viewBox="0 0 50 50"
				width="50px"
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		</>
	)
}

TestSVGClassString.test = {
	static: true,
	snapshots: [
		'<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestSVGAttributeRemoval = () => {
	const o = $('red')
	const toggle = () => o(prev => (prev === 'red' ? null : 'red'))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>SVG - Attribute Removal</h3>
			<svg
				class="red"
				viewBox="0 0 50 50"
				width="50px"
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
					version={o}
				/>
			</svg>
		</>
	)
}

TestSVGAttributeRemoval.test = {
	static: false,
	snapshots: [
		'<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20" version="red"></circle></svg>',
		'<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestTemplateExternal = () => {
	const Templated = props => {
		return (
			<div class={props.class}>
				<span>
					outer <span data-color={props.color}>inner</span>
				</span>
			</div>
		)
	}
	return (
		<>
			<h3>Template - External</h3>
			<Templated
				class="red"
				color="blue"
			/>
			<Templated
				class="blue"
				color="red"
			/>
		</>
	)
}

TestTemplateExternal.test = {
	static: true,
	snapshots: [
		'<div class="red"><span>outer <span data-color="blue">inner</span></span></div><div class="blue"><span>outer <span data-color="red">inner</span></span></div>',
	],
}

const TestTemplateSVG = () => {
	const color = $(randomColor())
	const update = () => color(randomColor())
	useInterval(update, TEST_INTERVAL / 2)
	const Templated = props => {
		return (
			<svg
				viewBox="0 0 50 50"
				width="50px"
				stroke={props.color}
				stroke-width="3"
				fill="white"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
				/>
			</svg>
		)
	}
	return (
		<>
			<h3>Template - SVG</h3>
			<Templated color={color} />
		</>
	)
}

TestTemplateSVG.test = {
	static: false,
	snapshots: [
		'<svg viewBox="0 0 50 50" width="50px" stroke="{random-color}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>',
	],
}

const TestContextComponents = () => {
	const Context = createContext('')
	return (
		<>
			<h3>Context - Components</h3>
			<Context.Provider value="outer">
				{() => {
					const value = Context()
					return <p>{value}</p>
				}}
				<Context.Provider value="inner">
					{() => {
						const value = Context()
						return <p>{value}</p>
					}}
				</Context.Provider>
				{() => {
					const value = Context()
					return <p>{value}</p>
				}}
			</Context.Provider>
		</>
	)
}

TestContextComponents.test = {
	static: true,
	snapshots: ['<p>outer</p><p>inner</p><p>outer</p>'],
}

const TestContextHook = () => {
	const Context = createContext('')
	const Reader = () => {
		const value = Context()
		return <p>{value}</p>
	}
	return (
		<>
			<h3>Context - Hook</h3>
			<Context.Provider value="outer">
				<Reader />
				<Context.Provider value="inner">
					<Reader />
				</Context.Provider>
				<Reader />
			</Context.Provider>
		</>
	)
}

TestContextHook.test = {
	static: true,
	snapshots: ['<p>outer</p><p>inner</p><p>outer</p>'],
}

const TestRenderToString = async () => {
	const App = () => {
		const o = $(123)
		return (
			<div>
				<h3>renderToString</h3>
				<p>{o}</p>
			</div>
		)
	}
	const expected = '<div><h3>renderToString</h3><p>123</p></div>'
	const actual = await renderToString(<App />)
	assert(
		actual === expected,
		`[TestRenderToString]: Expected '${actual}' to be equal to '${expected}'`,
	)
	return actual
}

const TestRenderToStringNested = async () => {
	const App = () => {
		const o = $(123)
		const Content = () => {
			const resource = useResource(async () => {
				return await TestRenderToString()
			})
			return (
				<p>
					{o}
					{resource.value}
				</p>
			)
		}
		return (
			<div>
				<h3>renderToString - Nested</h3>
				<Suspense>
					<Content />
				</Suspense>
			</div>
		)
	}
	const expected =
		'<div><h3>renderToString - Nested</h3><p>123&lt;div&gt;&lt;h3&gt;renderToString&lt;/h3&gt;&lt;p&gt;123&lt;/p&gt;&lt;/div&gt;</p></div>'
	const actual = await renderToString(<App />)
	assert(
		actual === expected,
		`[TestRenderToStringNested]: Expected '${actual}' to be equal to '${expected}'`,
	)
	return actual
}

const TestRenderToStringSuspense = async () => {
	const App = () => {
		const o = $(0)
		const Content = () => {
			const resource = useResource(() => {
				return new Promise(resolve => {
					setTimeout(() => {
						resolve(o(123))
					}, TEST_INTERVAL)
				})
			})
			return (
				<p>
					{o}
					{resource.value}
				</p>
			)
		}
		return (
			<div>
				<h3>renderToString - Suspense</h3>
				<Suspense>
					<Content />
				</Suspense>
			</div>
		)
	}
	const expected =
		'<div><h3>renderToString - Suspense</h3><p>123123</p></div>'
	const actual = await renderToString(<App />)
	assert(
		actual === expected,
		`[TestRenderToStringSuspense]: Expected '${actual}' to be equal to '${expected}'`,
	)
	return actual
}

const TestRenderToStringSuspenseNested = async () => {
	const App = () => {
		const o = $(0)
		const Content = timeout => {
			const resource = useResource(() => {
				return new Promise(resolve => {
					setTimeout(() => {
						resolve(o(123))
					}, timeout)
				})
			})
			return (
				<p>
					{o}
					{resource.value}
				</p>
			)
		}
		return (
			<div>
				<h3>renderToString - Suspense Nested</h3>
				<Suspense>
					<Content interval={TEST_INTERVAL} />
					<Suspense>
						<Content interval={TEST_INTERVAL * 2} />
					</Suspense>
				</Suspense>
			</div>
		)
	}
	const expected =
		'<div><h3>renderToString - Suspense Nested</h3><p>123123</p><p>123123</p></div>'
	const actual = await renderToString(<App />)
	assert(
		actual === expected,
		`[TestRenderToStringSuspenseNested]: Expected '${actual}' to be equal to '${expected}'`,
	)
	return actual
}

const TestPortalStatic = () => {
	return (
		<>
			<h3>Portal - Static</h3>
			<Portal>
				<p>content</p>
			</Portal>
		</>
	)
}

TestPortalStatic.test = {
	static: true,
	snapshots: ['<!---->'],
}

const TestPortalObservable = () => {
	const AB = () => {
		const a = <i>a</i>
		const b = <u>b</u>
		const component = $(a)
		const toggle = () => component(() => (component() === a ? b : a))
		useInterval(toggle, TEST_INTERVAL / 2)
		return component
	}
	const CD = () => {
		const c = <b>c</b>
		const d = <span>d</span>
		const component = $(c)
		const toggle = () => component(() => (component() === c ? d : c))
		useInterval(toggle, TEST_INTERVAL / 2)
		return component
	}
	const ab = <AB />
	const cd = <CD />
	const component = $(ab)
	const toggle = () => component(() => (component() === ab ? cd : ab))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Portal - Observable</h3>
			<Portal>{component}</Portal>
		</>
	)
}

TestPortalObservable.test = {
	static: true,
	snapshots: ['<!---->'],
}

const TestPortalRemoval = () => {
	const Inner = () => {
		const log = () => console.count('portal.inner')
		useInterval(log, TEST_INTERVAL / 4)
		return <p>content</p>
	}
	const Portalized = () => {
		const log = () => console.count('portal')
		useInterval(log, TEST_INTERVAL / 4)
		return (
			<Portal>
				<Inner />
			</Portal>
		)
	}
	const o = $(true)
	const toggle = () => o(prev => (prev ? null : true))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Portal - Removal</h3>
			<If when={o}>
				<Portalized />
			</If>
		</>
	)
}

TestPortalRemoval.test = {
	static: true,
	snapshots: ['<!---->'],
}

const TestPortalMountObservable = () => {
	const div1 = document.createElement('div')
	const div2 = document.createElement('div')
	const mount = $(div1)
	const toggle = () => mount(prev => (prev === div1 ? div2 : div1))
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Portal - Mount Observable</h3>
			{div1}
			{div2}
			<Portal mount={mount}>
				<p>content</p>
			</Portal>
		</>
	)
}

TestPortalMountObservable.test = {
	static: false,
	snapshots: [
		'<div><div><p>content</p></div></div><div></div><!---->',
		'<div></div><div><div><p>content</p></div></div><!---->',
	],
}

const TestPortalWhenObservable = () => {
	const when = $(false)
	const toggle = () => when(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Portal - When Observable</h3>
			<Portal when={when}>
				<p>content</p>
			</Portal>
		</>
	)
}

TestPortalWhenObservable.test = {
	static: false,
	snapshots: ['<p>content</p>', '<!---->'],
}

const TestPortalWrapperStatic = () => {
	return (
		<>
			<h3>Portal - Wrapper Static</h3>
			<Portal wrapper={<div class="custom-wrapper" />}>
				<p>content</p>
			</Portal>
		</>
	)
}

TestPortalWrapperStatic.test = {
	static: true,
	snapshots: ['<!---->'],
}

const TestResourceFallbackValue = () => {
	const resource = useResource(() => {
		throw new Error('Some error')
	})
	return (
		<>
			<h3>Resource - Fallback Value</h3>
			<ErrorBoundary fallback={<p>Error!</p>}>
				<If
					when={() => resource().value}
					fallback={<p>Loading!</p>}
				>
					<p>Loaded!</p>
				</If>
			</ErrorBoundary>
			<ErrorBoundary fallback={<p>Error!</p>}>
				<If
					when={resource.value}
					fallback={<p>Loading!</p>}
				>
					<p>Loaded!</p>
				</If>
			</ErrorBoundary>
		</>
	)
}

TestResourceFallbackValue.test = {
	static: true,
	snapshots: ['<p>Error!</p><p>Error!</p>'],
}

const TestResourceFallbackLatest = () => {
	const resource = useResource(() => {
		throw new Error('Some error')
	})
	return (
		<>
			<h3>Resource - Fallback Latest</h3>
			<ErrorBoundary fallback={<p>Error!</p>}>
				<If
					when={() => resource().latest}
					fallback={<p>Loading!</p>}
				>
					<p>Loaded!</p>
				</If>
			</ErrorBoundary>
			<ErrorBoundary fallback={<p>Error!</p>}>
				<If
					when={resource.latest}
					fallback={<p>Loading!</p>}
				>
					<p>Loaded!</p>
				</If>
			</ErrorBoundary>
		</>
	)
}

TestResourceFallbackLatest.test = {
	static: true,
	snapshots: ['<p>Error!</p><p>Error!</p>'],
}

const TestSuspenseAlwaysValue = () => {
	const Fallback = () => {
		return <p>Loading...</p>
	}
	const Content = () => {
		const resource = useResource(() => {
			return new Promise(() => {})
		})
		return <p>Content! {resource.value}</p>
	}
	return (
		<>
			<h3>Suspense - Always Value</h3>
			<Suspense fallback={<Fallback />}>
				<Content />
			</Suspense>
		</>
	)
}

TestSuspenseAlwaysValue.test = {
	static: true,
	snapshots: ['<p>Loading...</p>'],
}

const TestSuspenseAlwaysLatest = () => {
	const Fallback = () => {
		return <p>Loading...</p>
	}
	const Content = () => {
		const resource = useResource(() => {
			return new Promise(() => {})
		})
		return <p>Content! {resource.latest}</p>
	}
	return (
		<>
			<h3>Suspense - Always Latest</h3>
			<Suspense fallback={<Fallback />}>
				<Content />
			</Suspense>
		</>
	)
}

TestSuspenseAlwaysLatest.test = {
	static: true,
	snapshots: ['<p>Loading...</p>'],
}

const TestSuspenseNever = () => {
	const Fallback = () => {
		return <p>Loading...</p>
	}
	const Content = () => {
		return <p>Content!</p>
	}
	return (
		<>
			<h3>Suspense - Never</h3>
			<Suspense fallback={<Fallback />}>
				<Content />
			</Suspense>
		</>
	)
}

TestSuspenseNever.test = {
	static: true,
	snapshots: ['<p>Content!</p>'],
}

const TestSuspenseNeverRead = () => {
	const Fallback = () => {
		return <p>Loading...</p>
	}
	const Content = () => {
		const resource = useResource(() => {
			return new Promise(() => {})
		})
		return <p>Content!</p>
	}
	return (
		<>
			<h3>Suspense - Never Read</h3>
			<Suspense fallback={<Fallback />}>
				<Content />
			</Suspense>
		</>
	)
}

TestSuspenseNeverRead.test = {
	static: true,
	snapshots: ['<p>Content!</p>'],
}

const TestSuspenseMiddleman = () => {
	const Fallback = () => {
		return <p>Loading...</p>
	}
	const Content = () => {
		const o = $(0)
		const branch = $(false)
		const resource = useResource(() => {
			o()
			return new Promise(resolve => {
				setTimeout(() => {
					branch(true)
				}, TEST_INTERVAL / 2)
			})
		})
		const refetch = () => o(prev => prev + 1)
		useInterval(refetch, TEST_INTERVAL)
		return () => {
			if (branch()) return <p>Middleman!</p>
			return <p>Content! {resource.value}</p>
		}
	}
	return (
		<>
			<h3>Suspense - Middleman</h3>
			<Suspense fallback={<Fallback />}>
				<Content />
			</Suspense>
		</>
	)
}

TestSuspenseMiddleman.test = {
	static: false,
	snapshots: ['<p>Loading...</p>', '<p>Middleman!</p>'],
}

const TestSuspenseObservable = () => {
	const Fallback = () => {
		return <p>Loading...</p>
	}
	const Content = () => {
		const o = $(0)
		const resource = useResource(() => {
			o()
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(123)
				}, TEST_INTERVAL / 2)
			})
		})
		const refetch = () => o(prev => prev + 1)
		useInterval(refetch, TEST_INTERVAL)
		return <p>Content! {resource.value}</p>
	}
	return (
		<>
			<h3>Suspense - Observable</h3>
			<Suspense fallback={<Fallback />}>
				<Content />
			</Suspense>
		</>
	)
}

TestSuspenseObservable.test = {
	static: false,
	snapshots: ['<p>Loading...</p>', '<p>Content! 123</p>'],
}

const TestSuspenseWhen = () => {
	const Fallback = () => {
		return <p>Loading...</p>
	}
	const Content = () => {
		return <p>Content!</p>
	}
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Suspense - When</h3>
			<Suspense
				when={o}
				fallback={<Fallback />}
			>
				<Content />
			</Suspense>
		</>
	)
}

TestSuspenseWhen.test = {
	static: false,
	snapshots: ['<p>Loading...</p>', '<p>Content!</p>'],
}

const TestSuspenseAlive = () => {
	const Fallback = () => {
		return <p>Loading ({random()})...</p>
	}
	const Content = () => {
		return <p>Content ({random()})!</p>
	}
	const o = $(true)
	const toggle = () => o(prev => !prev)
	useInterval(toggle, TEST_INTERVAL)
	return (
		<>
			<h3>Suspense - Alive</h3>
			<Suspense
				when={o}
				fallback={<Fallback />}
			>
				<Content />
			</Suspense>
		</>
	)
}

TestSuspenseAlive.test = {
	static: false,
	snapshots: [
		//TODO: Test this properly, content is static but loading should be dynamic
		'<p>Loading ({random})...</p>',
		'<p>Content ({random})!</p>',
	],
}

const TestSuspenseChildrenInline = () => {
	const resource = useResource(() => {
		return new Promise(resolve => {
			return setTimeout(resolve, TEST_INTERVAL, 123)
		})
	})

	return (
		<>
			<h3>Suspense - Children Inline</h3>
			<Suspense fallback="Loading...">
				{() => resource().value}
			</Suspense>
		</>
	)
}

TestSuspenseChildrenInline.test = {
	static: false,
	snapshots: ['Loading...', '123'],
}

const TestSuspenseChildrenObservableStatic = () => {
	const Children = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Children: {o()}</p>
	}
	const Fallback = () => {
		return <p>Fallback!</p>
	}
	return (
		<>
			<h3>Suspense - Children Observable Static</h3>
			<Suspense fallback={<Fallback />}>
				<Children />
			</Suspense>
		</>
	)
}

TestSuspenseChildrenObservableStatic.test = {
	static: true,
	snapshots: ['<p>Children: {random}</p>'],
}

const TestSuspenseChildrenFunction = () => {
	const Children = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Children: {o()}</p>
	}
	const Fallback = () => {
		return <p>Fallback!</p>
	}
	return (
		<>
			<h3>Suspense - Children Function</h3>
			<Suspense fallback={<Fallback />}>{Children}</Suspense>
		</>
	)
}

TestSuspenseChildrenFunction.test = {
	static: false,
	snapshots: ['<p>Children: {random}</p>'],
}

const TestSuspenseFallbackObservableStatic = () => {
	const Children = () => {
		const resource = useResource(() => {
			return new Promise(() => {})
		})
		return <p>children {resource.value}</p>
	}
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Fallback: {o()}</p>
	}
	return (
		<>
			<h3>Suspense - Fallback Observable Static</h3>
			<Suspense fallback={<Fallback />}>
				<Children />
			</Suspense>
		</>
	)
}

TestSuspenseFallbackObservableStatic.test = {
	static: true,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestSuspenseFallbackFunction = () => {
	const Children = () => {
		const resource = useResource(() => {
			return new Promise(() => {})
		})
		return <p>children {resource.value}</p>
	}
	const Fallback = () => {
		const o = $(String(random()))
		const randomize = () => o(String(random()))
		useInterval(randomize, TEST_INTERVAL)
		o()
		return <p>Fallback: {o()}</p>
	}
	return (
		<>
			<h3>Suspense - Fallback Function</h3>
			<Suspense fallback={Fallback}>
				<Children />
			</Suspense>
		</>
	)
}

TestSuspenseFallbackFunction.test = {
	static: false,
	snapshots: ['<p>Fallback: {random}</p>'],
}

const TestSuspenseCleanup = () => {
	const ChildrenLoop = () => {
		const resource = useResource(() => {
			return new Promise(() => {})
		})
		return <p>Loop! {resource.value}</p>
	}
	const ChildrenPlain = () => {
		return <p>Loaded!</p>
	}
	const Children = () => {
		const o = $(true)
		const toggle = () => o(prev => !prev)
		setTimeout(toggle, TEST_INTERVAL)
		return (
			<Ternary when={o}>
				<ChildrenLoop />
				<ChildrenPlain />
			</Ternary>
		)
	}
	const Fallback = () => {
		return <p>Loading...</p>
	}
	return (
		<>
			<h3>Suspense - Cleanup</h3>
			<Suspense fallback={<Fallback />}>
				<Children />
			</Suspense>
		</>
	)
}

TestSuspenseCleanup.test = {
	static: false,
	snapshots: ['<p>Loading...</p>', '<p>Loaded!</p>'],
}

const TestLazy = () => {
	const Component = () => {
		return <p>Loaded!</p>
	}
	const Fallback = () => {
		return <p>Loading...</p>
	}
	const lazyFetcher = () =>
		new Promise(resolve =>
			setTimeout(
				() => resolve({ default: Component }),
				TEST_INTERVAL,
			),
		)
	const LazyComponent = lazy(lazyFetcher)
	return (
		<>
			<h3>Lazy</h3>
			<Suspense fallback={<Fallback />}>
				<LazyComponent />
			</Suspense>
		</>
	)
}

TestLazy.test = {
	static: false,
	snapshots: ['<p>Loading...</p>', '<p>Loaded!</p>'],
}

const TestNestedArrays = () => {
	const items = $([0, 1, 2])
	const activeItem = $(1)

	const incrementItems = () => {
		items(items => [...items, items.length])
		activeItem(item => item + 1)
	}

	setTimeout(incrementItems, TEST_INTERVAL)
	setTimeout(incrementItems, TEST_INTERVAL * 2)

	return (
		<>
			<h3>Nested Arrays</h3>
			<button onClick={incrementItems}>Increment</button>
			<ul>
				<For values={items}>
					{item => {
						return (
							<>
								<If when={() => activeItem() === item}>
									<li>test</li>
								</If>
								<li>{item}</li>
							</>
						)
					}}
				</For>
			</ul>
		</>
	)
}

TestNestedArrays.test = {
	static: false,
	snapshots: [
		'<button>Increment</button><ul><!----><li>0</li><li>test</li><li>1</li><!----><li>2</li></ul>',
		'<button>Increment</button><ul><!----><li>0</li><!----><li>1</li><li>test</li><li>2</li><!----><li>3</li></ul>',
		'<button>Increment</button><ul><!----><li>0</li><!----><li>1</li><!----><li>2</li><li>test</li><li>3</li><!----><li>4</li></ul>',
	],
}

const TestNestedIfs = () => {
	return (
		<>
			<If when={true}>
				<If when={true}>
					<div>1</div>
					<div>2</div>
				</If>
				<div>Footer</div>
			</If>
		</>
	)
}

TestNestedIfs.test = {
	static: true,
	snapshots: ['<div>1</div><div>2</div><div>Footer</div>'],
}

const TestNestedIfsLazy = () => {
	const o = $(false)
	const toggle = () => o(prev => !prev)
	useTimeout(toggle, TEST_INTERVAL)
	return (
		<>
			<div>before</div>
			<If when={o}>
				<If when={true}>
					<div>inner</div>
				</If>
			</If>
			<div>after</div>
		</>
	)
}

TestNestedIfsLazy.test = {
	static: false,
	snapshots: [
		'<div>before</div><!----><div>after</div>',
		'<div>before</div><div>inner</div><div>after</div>',
	],
}

const TestHMRFor = () => {
	const o = $([1, 2, 3])
	const update = () => o([2, 3, 4])
	setTimeout(update, TEST_INTERVAL)

	const Button = hmr(
		() => {},
		({ value, index }) => {
			return (
				<button>
					{value}, {index}
				</button>
			)
		},
	)

	console.log('what')
	return (
		<>
			<h3>HMR - For</h3>
			<p>prev</p>
			<For values={o}>
				{(item, index) => (
					<Button
						value={item}
						index={index}
					/>
				)}
			</For>
			<p>next</p>
		</>
	)
}

TestHMRFor.test = {
	static: false,
	snapshots: [
		'<p>prev</p><button>1, 0</button><button>2, 1</button><button>3, 2</button><p>next</p>',
		'<p>prev</p><button>2, 0</button><button>3, 1</button><button>4, 2</button><p>next</p>',
	],
}

const Test = () => {
	/*TestRenderToStringNested()
	TestRenderToString()
	TestRenderToStringNested()
	TestRenderToStringSuspense()
	TestRenderToStringSuspenseNested()*/
	return (
		<>
			<TestSnapshots Component={TestNullStatic} />
			<TestSnapshots Component={TestNullObservable} />
			<TestSnapshots Component={TestNullFunction} />
			<TestSnapshots Component={TestNullRemoval} />
			<TestSnapshots Component={TestUndefinedStatic} />
			<TestSnapshots Component={TestUndefinedObservable} />
			<TestSnapshots Component={TestUndefinedFunction} />
			<TestSnapshots Component={TestUndefinedRemoval} />
			<TestSnapshots Component={TestBooleanStatic} />
			<TestSnapshots Component={TestBooleanObservable} />
			<TestSnapshots Component={TestBooleanFunction} />
			<TestSnapshots Component={TestBooleanRemoval} />
			<TestSnapshots Component={TestSymbolStatic} />
			<TestSnapshots Component={TestSymbolObservable} />
			<TestSnapshots Component={TestSymbolFunction} />
			<TestSnapshots Component={TestSymbolRemoval} />
			<TestSnapshots Component={TestNumberStatic} />
			<TestSnapshots Component={TestNumberObservable} />
			<TestSnapshots Component={TestNumberFunction} />
			<TestSnapshots Component={TestNumberRemoval} />
			<TestSnapshots Component={TestBigIntStatic} />
			<TestSnapshots Component={TestBigIntObservable} />
			<TestSnapshots Component={TestBigIntFunction} />
			<TestSnapshots Component={TestBigIntRemoval} />
			<TestSnapshots Component={TestStringStatic} />
			<TestSnapshots Component={TestStringObservable} />
			<TestSnapshots Component={TestStringObservableStatic} />
			<TestSnapshots Component={TestStringObservableDeepStatic} />
			<TestSnapshots Component={TestStringFunction} />
			<TestSnapshots Component={TestStringRemoval} />
			<TestSnapshots Component={TestAttributeStatic} />
			<TestSnapshots Component={TestAttributeObservable} />
			<TestSnapshots Component={TestAttributeObservableBoolean} />
			<TestSnapshots Component={TestAttributeFunction} />
			<TestSnapshots Component={TestAttributeFunctionBoolean} />
			<TestSnapshots Component={TestAttributeRemoval} />
			<TestSnapshots Component={TestAttributeBooleanStatic} />
			<TestPropertyCheckedStatic />
			<TestPropertyCheckedObservable />
			<TestPropertyCheckedFunction />
			<TestPropertyCheckedRemoval />
			<TestPropertyValueStatic />
			<TestPropertyValueObservable />
			<TestPropertyValueFunction />
			<TestPropertyValueRemoval />
			<TestInputLabelFor />
			<TestSnapshots Component={TestInputForm} />
			<TestSnapshots Component={TestCheckboxIndeterminateToggle} />
			<TestSnapshots Component={TestProgressIndeterminateToggle} />
			<TestSnapshots Component={TestSelectStaticOption} />
			<TestSnapshots Component={TestSelectStaticValue} />
			{/*<TestSnapshots Component={TestSelectObservableOption} />*/}
			{/*<TestSnapshots Component={TestSelectObservableValue} />*/}
			<TestSnapshots Component={TestIdStatic} />
			<TestSnapshots Component={TestIdObservable} />
			<TestSnapshots Component={TestIdFunction} />
			<TestSnapshots Component={TestIdRemoval} />
			<TestSnapshots Component={TestClassNameStatic} />
			<TestSnapshots Component={TestClassNameObservable} />
			<TestSnapshots Component={TestClassNameFunction} />
			<TestSnapshots Component={TestClassStatic} />
			<TestSnapshots Component={TestClassStaticString} />
			<TestSnapshots Component={TestClassObservable} />
			<TestSnapshots Component={TestClassObservableString} />
			<TestSnapshots Component={TestClassFunction} />
			<TestSnapshots Component={TestClassFunctionString} />
			<TestSnapshots Component={TestClassRemoval} />
			<TestSnapshots Component={TestClassRemovalString} />
			<TestSnapshots Component={TestClassesArrayStatic} />
			<TestSnapshots Component={TestClassesArrayStaticMultiple} />
			<TestSnapshots Component={TestClassesArrayObservable} />
			<TestSnapshots Component={TestClassesArrayObservableMultiple} />
			<TestSnapshots Component={TestClassesArrayObservableValue} />
			<TestSnapshots Component={TestClassesArrayFunction} />
			<TestSnapshots Component={TestClassesArrayFunctionMultiple} />
			<TestSnapshots Component={TestClassesArrayFunctionValue} />
			<TestSnapshots Component={TestClassesArrayStore} />
			<TestSnapshots Component={TestClassesArrayStoreMultiple} />
			<TestSnapshots Component={TestClassesArrayNestedStatic} />
			<TestSnapshots Component={TestClassesArrayRemoval} />
			<TestSnapshots Component={TestClassesArrayRemovalMultiple} />
			<TestSnapshots Component={TestClassesArrayCleanup} />
			<TestSnapshots Component={TestClassesObjectStatic} />
			<TestSnapshots Component={TestClassesObjectStaticMultiple} />
			<TestSnapshots Component={TestClassesObjectObservable} />
			<TestSnapshots
				Component={TestClassesObjectObservableMultiple}
			/>
			<TestSnapshots Component={TestClassesObjectFunction} />
			<TestSnapshots Component={TestClassesObjectFunctionMultiple} />
			<TestSnapshots Component={TestClassesObjectStore} />
			<TestSnapshots Component={TestClassesObjectStoreMultiple} />
			<TestSnapshots Component={TestClassesObjectRemoval} />
			<TestSnapshots Component={TestClassesObjectRemovalMultiple} />
			<TestSnapshots Component={TestClassesObjectCleanup} />
			<TestSnapshots Component={TestStyleStatic} />
			<TestSnapshots Component={TestStyleStaticNumeric} />
			<TestSnapshots Component={TestStyleStaticString} />
			<TestSnapshots Component={TestStyleStaticVariable} />
			<TestSnapshots Component={TestStyleObservable} />
			<TestSnapshots Component={TestStyleObservableNumeric} />
			<TestSnapshots Component={TestStyleObservableString} />
			<TestSnapshots Component={TestStyleObservableVariable} />
			<TestSnapshots Component={TestStyleFunction} />
			<TestSnapshots Component={TestStyleFunctionNumeric} />
			<TestSnapshots Component={TestStyleFunctionString} />
			<TestSnapshots Component={TestStyleFunctionVariable} />
			<TestSnapshots Component={TestStyleRemoval} />
			<TestSnapshots Component={TestStylesStatic} />
			<TestSnapshots Component={TestStylesObservable} />
			<TestSnapshots Component={TestStylesFunction} />
			<TestSnapshots Component={TestStylesStore} />
			<TestSnapshots Component={TestStylesRemoval} />
			<TestSnapshots Component={TestStylesCleanup} />
			<TestSnapshots Component={TestStylesMixed} />
			<TestSnapshots Component={TestHTMLFunctionStatic} />
			<TestSnapshots Component={TestHTMLFunctionStaticRegistry} />
			<TestSnapshots Component={TestHTMLInnerHTMLStatic} />
			<TestSnapshots Component={TestHTMLInnerHTMLObservable} />
			<TestSnapshots Component={TestHTMLInnerHTMLFunction} />
			<TestSnapshots Component={TestHTMLOuterHTMLStatic} />
			<TestSnapshots Component={TestHTMLOuterHTMLObservable} />
			<TestSnapshots Component={TestHTMLOuterHTMLFunction} />
			<TestSnapshots Component={TestHTMLTextContentStatic} />
			<TestSnapshots Component={TestHTMLTextContentObservable} />
			<TestSnapshots Component={TestHTMLTextContentFunction} />
			<TestSnapshots
				Component={TestHTMLDangerouslySetInnerHTMLStatic}
			/>
			<TestSnapshots
				Component={TestHTMLDangerouslySetInnerHTMLObservable}
			/>
			<TestSnapshots
				Component={TestHTMLDangerouslySetInnerHTMLObservableString}
			/>
			<TestSnapshots
				Component={TestHTMLDangerouslySetInnerHTMLFunction}
			/>
			<TestSnapshots
				Component={TestHTMLDangerouslySetInnerHTMLFunctionString}
			/>
			{/*<TestSnapshots Component={TestDirective} />*/}
			{/*<TestSnapshots Component={TestDirectiveRegisterLocal} />
			<TestSnapshots Component={TestDirectiveSingleArgument} />
			<TestSnapshots Component={TestDirectiveRef} />*/}
			<TestEventClickStatic />
			<TestEventClickObservable />
			<TestEventClickRemoval />
			<TestEventClickCaptureStatic />
			<TestEventClickCaptureObservable />
			<TestEventClickCaptureRemoval />
			<TestEventClickAndClickCaptureStatic />
			<TestEventClickStopPropagation />
			<TestEventClickStopImmediatePropagation />
			<TestEventEnterStopPropagation />
			<TestEventEnterStopImmediatePropagation />
			<TestEventEnterAndEnterCaptureStatic />
			<TestEventMiddleClickStatic />
			<TestEventMiddleClickCaptureStatic />
			<TestEventTargetCurrentTarget />
			<TestSnapshots Component={TestABCD} />
			<TestSnapshots Component={TestChildrenBoolean} />
			<TestSnapshots Component={TestChildrenSymbol} />
			<TestSnapshots Component={TestChildOverReexecution} />
			<TestSnapshots Component={TestCleanupInner} />
			<TestSnapshots Component={TestCleanupInnerPortal} />
			<TestSnapshots Component={TestContextDynamicContext} />
			<TestSnapshots Component={TestDynamicHeading} />
			<TestSnapshots Component={TestDynamicObservableComponent} />
			<TestSnapshots Component={TestDynamicFunctionComponent} />
			<TestSnapshots Component={TestDynamicObservableProps} />
			<TestSnapshots Component={TestDynamicFunctionProps} />
			<TestSnapshots Component={TestDynamicObservableChildren} />
			{/* <TestSnapshots Component={TestDynamicStoreProps} /> */}
			<TestSnapshots Component={TestIfStatic} />
			<TestSnapshots Component={TestIfObservable} />
			<TestSnapshots Component={TestIfFunction} />
			<TestSnapshots Component={TestIfFunctionUntracked} />
			<TestSnapshots Component={TestIfFunctionUntrackedUnnarrowed} />
			<TestSnapshots Component={TestIfFunctionUntrackedNarrowed} />
			<TestSnapshots Component={TestIfNestedFunctionUnnarrowed} />
			<TestSnapshots Component={TestIfNestedFunctionNarrowed} />
			<TestSnapshots Component={TestIfChildrenObservable} />
			<TestSnapshots Component={TestIfChildrenObservableStatic} />
			<TestSnapshots Component={TestIfChildrenFunction} />
			<TestSnapshots Component={TestIfChildrenFunctionObservable} />
			<TestSnapshots Component={TestIfFallbackStatic} />
			<TestSnapshots Component={TestIfFallbackObservable} />
			<TestSnapshots Component={TestIfFallbackObservableStatic} />
			<TestSnapshots Component={TestIfFallbackFunction} />
			{/* <TestSnapshots Component={TestIfRace} /> */}
			<TestSnapshots Component={TestKeepAliveStatic} />
			<TestSnapshots Component={TestKeepAliveObservable} />
			<TestSnapshots Component={TestTernaryStatic} />
			<TestSnapshots Component={TestTernaryStaticInline} />
			<TestSnapshots Component={TestTernaryObservable} />
			<TestSnapshots Component={TestTernaryObservableChildren} />
			<TestSnapshots Component={TestTernaryFunction} />
			<TestSnapshots
				Component={TestTernaryChildrenObservableStatic}
			/>
			<TestSnapshots Component={TestTernaryChildrenFunction} />
			{/*<TestSnapshots Component={TestSwitchStatic} />
			<TestSnapshots Component={TestSwitchObservable} />
			<TestSwitchObservableComplex />
			<TestSnapshots Component={TestSwitchFunction} />
			<TestSnapshots Component={TestSwitchCaseObservableStatic} />
			<TestSnapshots Component={TestSwitchCaseFunction} />
			<TestSnapshots Component={TestSwitchDefaultObservableStatic} />
			<TestSnapshots Component={TestSwitchDefaultFunction} />
			<TestSnapshots Component={TestSwitchFallbackObservableStatic} />
			<TestSnapshots Component={TestSwitchFallbackFunction} />*/}
			<TestSnapshots Component={TestComponentStatic} />
			<TestSnapshots
				Component={TestComponentStaticProps}
				props={{ value: random() }}
			/>
			<TestSnapshots
				Component={TestComponentStaticRenderProps}
				props={{ value: random() }}
			/>
			{/*<TestSnapshots
				Component={TestComponentStaticRenderState}
				props={{ value: random() }}
			/>*/}
			<TestSnapshots Component={TestComponentObservable} />
			<TestSnapshots Component={TestComponentFunction} />
			<TestSnapshots Component={TestTabIndexBooleanStatic} />
			<TestSnapshots Component={TestTabIndexBooleanObservable} />
			<TestSnapshots Component={TestTabIndexBooleanFunction} />
			<TestSnapshots Component={TestForStatic} />
			<TestSnapshots Component={TestForObservables} />
			<TestSnapshots Component={TestForObservablesStatic} />
			<TestForObservableObservables />
			<TestSnapshots Component={TestForFunctionObservables} />
			<TestSnapshots Component={TestForRandom} />
			<TestSnapshots Component={TestForFallbackStatic} />
			<TestSnapshots Component={TestForFallbackObservable} />
			<TestSnapshots Component={TestForFallbackObservableStatic} />
			<TestSnapshots Component={TestForFallbackFunction} />
			<TestSnapshots Component={TestForUnkeyedStatic} />
			<TestSnapshots Component={TestForUnkeyedObservables} />
			<TestSnapshots Component={TestForUnkeyedObservablesStatic} />
			<TestForUnkeyedObservableObservables />
			<TestSnapshots Component={TestForUnkeyedFunctionObservables} />
			<TestSnapshots Component={TestForUnkeyedRandom} />
			<TestSnapshots Component={TestForUnkeyedRandomOnlyChild} />
			<TestSnapshots Component={TestForUnkeyedFallbackStatic} />
			<TestSnapshots Component={TestForUnkeyedFallbackObservable} />
			<TestSnapshots
				Component={TestForUnkeyedFallbackObservableStatic}
			/>
			<TestSnapshots Component={TestForUnkeyedFallbackFunction} />
			<TestSnapshots Component={TestFragmentStatic} />
			<TestSnapshots Component={TestFragmentStaticComponent} />
			<TestSnapshots Component={TestFragmentStaticDeep} />
			{/*	<TestSnapshots Component={TestErrorBoundary} />
			<TestSnapshots
				Component={TestErrorBoundaryChildrenObservableStatic}
			/>
			<TestSnapshots Component={TestErrorBoundaryChildrenFunction} />
			<TestSnapshots
				Component={TestErrorBoundaryFallbackObservableStatic}
			/>
			<TestSnapshots Component={TestErrorBoundaryFallbackFunction} />*/}
			<TestSnapshots Component={TestChildren} />
			<TestSnapshots Component={TestRef} />
			{/*<TestSnapshots Component={TestRefs} />*/}
			{/*<TestSnapshots Component={TestRefsNested} />*/}
			<TestSnapshots Component={TestRefUnmounting} />
			<TestSnapshots Component={TestRefContext} />
			{/*<TestSnapshots Component={TestRefUntrack} />*/}
			{/*<TestSnapshots Component={TestPromiseResolved} />*/}
			{/*<TestSnapshots Component={TestPromiseRejected} />*/}
			<TestSnapshots Component={TestSVGStatic} />
			<TestSVGStaticComplex />
			<TestSnapshots Component={TestSVGStaticCamelCase} />
			<TestSnapshots Component={TestSVGObservable} />
			<TestSnapshots Component={TestSVGFunction} />
			<TestSnapshots Component={TestSVGStyleObject} />
			<TestSnapshots Component={TestSVGStyleString} />
			<TestSnapshots Component={TestSVGClassObject} />
			<TestSnapshots Component={TestSVGClassString} />
			<TestSnapshots Component={TestSVGAttributeRemoval} />
			<TestSnapshots Component={TestTemplateExternal} />
			<TestSnapshots Component={TestTemplateSVG} />
			<TestSnapshots Component={TestContextComponents} />
			<TestSnapshots Component={TestContextHook} />
			<TestSnapshots Component={TestPortalStatic} />
			<TestSnapshots Component={TestPortalObservable} />
			<TestSnapshots Component={TestPortalRemoval} />
			<TestSnapshots Component={TestPortalMountObservable} />
			<TestSnapshots Component={TestPortalWhenObservable} />
			<TestSnapshots Component={TestPortalWrapperStatic} />
			<TestSnapshots Component={TestResourceFallbackValue} />
			<TestSnapshots Component={TestResourceFallbackLatest} />
			<TestSnapshots Component={TestSuspenseAlwaysValue} />
			<TestSnapshots Component={TestSuspenseAlwaysLatest} />
			<TestSnapshots Component={TestSuspenseNever} />
			<TestSnapshots Component={TestSuspenseNeverRead} />
			{/* <TestSnapshots Component={TestSuspenseMiddleman} /> */}
			<TestSnapshots Component={TestSuspenseObservable} />
			<TestSnapshots Component={TestSuspenseWhen} />
			<TestSnapshots Component={TestSuspenseAlive} />
			<TestSnapshots Component={TestSuspenseChildrenInline} />
			<TestSnapshots
				Component={TestSuspenseChildrenObservableStatic}
			/>
			<TestSnapshots Component={TestSuspenseChildrenFunction} />
			<TestSnapshots
				Component={TestSuspenseFallbackObservableStatic}
			/>
			<TestSnapshots Component={TestSuspenseFallbackFunction} />
			{/* <TestSnapshots Component={TestSuspenseCleanup} /> */}
			<TestSnapshots Component={TestLazy} />
			<TestSnapshots Component={TestNestedArrays} />
			<TestSnapshots Component={TestNestedIfs} />
			<TestSnapshots Component={TestNestedIfsLazy} />
			<TestSnapshots Component={TestHMRFor} />
			<hr />
		</>
	)
}

/* RENDER */

render(<Test />, document.getElementById('app'))
