export * from './lib/bench.jsx'
export * from './lib/code.jsx'
export * from './lib/headings.jsx'
export * from './lib/tag.jsx'
export * from './lib/section.jsx'
export * from './lib/header.jsx'

import { Code } from './lib/code.jsx'

export const CHEATSHEET = (
	<Code
		render={false}
		preview={true}
		code={`// CHEATSHEET
import {
// rendering
render, // render(thing, targetEl=document.body, {clear:false, relative:false})
create, // const Fancy = create((props)=>[1, 2, 3, props.children])
customElement, // customElement("fancy-element", class Fancy extends HTMLElement{})
HTML, // const html = HTML({wrap:true/false}); (props)=> html\`<div>\${props.children}</div>\` // () => div
html, // (props)=> html\`<div>\${props.children}</div>\` // <div/>
css, // (props)=> css\`button { padding: \${props.padding} }\`

// reactivity
signal, // const [read, write] = signal(initialValue)
mutable, // const state = mutable({some:true, thing:'bla'}) // only tracks first level
mutableDeep, // const state = mutableDeep({some:{thing:{deep:true}}}) // tracks all levels

root, // root(fn)
effect, // effect(fn)
renderEffect, // renderEffect(fn)
htmlEffect, // htmlEffect((html)=> html\`<div>\${some.non.reactive.object}</div>\`, {wrap:true/false}) // div/fn
memo, // memo(fn)
writable, // const m = writable(fn); m(true) // now "m" is "true" till memo reruns
batch, // batch(fn)
untrack, // untrack(fn)
cleanup, // cleanup(fn)
onCleanup, // onCleanup(fn)
onReady, // onReady(fn)
context, // const use = Context({}); let value = use(); use({newValue}, fn)
map, // map([1, 2, 3], (item, index) => [item, index])
withOwner, // const owned = withOwner(); owned(fn)
withValue, // withValue(signal, value => console.log(value))

// events
addEventListener, // addEventListener(el, 'click', fn, delegated=true)
removeEventListener, // removeEventListener(el, 'click', fn, delegated=true)

// components
Component, // class MyC extends Component { render(props){} onReady(){} onCleanup(){} }
lazy, // const Com = lazy(()=>import('yey.jsx')) <Comp some={true}/>
resolve, // const cache = resolve(() => props.children)
toHTML, // const DocFragment = toHTML(props.children)

// components utilitites
makeCallback, // makeCallback(props.children) === ()=>props.children
markComponent, // markComponent(()=> <b>this doesnt track</b>)
isComponent, // isComponent(fn) // true for non-tracking components
isReactive, // isReactive(fn) // true for signals

// props
ref, // const button = ref(); <div ref={button}.. /> effect(()=>button())

setAttribute, // setAttribute(node, 'data-active', signal, ns)
setProperty, // setProperty(node, 'hidden', signal)
setStyle, // setStyle(node, 'color', signal)
setBool, // setBool(node, 'disabled', signal)

propsPlugin, // propsPlugin('red', function(node, propName, propValue, props){node.style.color = 'red'}) <div red/>
propsPluginNS, // propsPluginNS('red', function(node, propName, propValue, props){node.style.color = 'red'}) <div red:moo/>
propsSplit, // const [newProps, children, divProps] = propsSplit(props, ['children'], ['id', 'class'])

// JSX Components
Show, // <Show when={true} fallback="ouch"/>
Collapse, // <Collapse when={true}/>
Dynamic, // <Dynamic component="div" children="Hola"/>
Promised, // <Promised children={()=> new Promise(...)} fallback="Loading.."/> or Promised(()=> new Promise(...), 'Loading..')
For, // <For each={[1, 2, 3]} children={[item => item * 1, item => item * 2]} />
Head, // <Head><title>Hello World</title></Head>
Switch, Match,// <Switch fallback="ouch"><Match when={true}/></Switch>
Portal, // <Portal mount={document.body}>Hola</Portal>

getValue, // getValue(signalMaybe)

// pota version
version
} from 'pota'
`}
	/>
)

export const prettierConfig = {
	parser: 'babel',
	printWidth: 55,
	useTabs: false,
	tabWidth: 2,
	semi: false,
	singleQuote: true,
	quoteProps: 'as-needed',
	jsxSingleQuote: false,
	trailingComma: 'none',
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'avoid',
	proseWrap: 'never',
	endOfLine: 'lf',
	singleAttributePerLine: true,
}
