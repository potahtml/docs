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
template, // (props)=> template\`<div>\${props.children}</div>\`

// reactivity
signal, // const [read, write] = signal(initialValue)
root, // root(fn)
effect, // effect(fn)
renderEffect, // renderEffect(fn)
memo, // memo(fn)
lazyMemo, // lazyMemo(fn)
batch, // batch(fn)
untrack, // untrack(fn)
cleanup, // cleanup(fn)
onCleanup, // onCleanup(fn)
onReady, // onReady(fn)
context, // const use = Context({}); let value = use(); use({newValue}, fn)
map, // map([1, 2, 3], (item, index) => [item, index])
withOwner, // const owned = withOwner(); owned(fn)

// events
addEventListener, // addEventListener(el, 'click', fn, delegated=true)
removeEventListener, // removeEventListener(el, 'click', fn, delegated=true)

// components
Component, // class MyC extends Component { render(props){} onReady(){} onCleanup(){} }
lazy, // const Com = lazy(()=>import('yey.jsx')) <Comp some={true}/>
resolve, // const cache = resolve(() => props.children)
toHTML, // const DocFragment = toHTML(props.children)

// props
propsPlugin, // propsPlugin('red', function(node, propName, propValue, props){node.style.color = 'red'}) <div red/>
propsPluginNS, // propsPluginNS('red', function(node, propName, propValue, props){node.style.color = 'red'}) <div red:moo/>
propsSplit, // const [newProps, children, divProps] = propsSplit(props, ['children'], ['id', 'class'])
ref, // const button = ref(); <div ref={button}.. /> effect(()=>button())

// JSX Components
Collapse, // <Collapse when={true}/>
Dynamic, // <Dynamic component="div" children="Hola"/>
For, // <For each={[1, 2, 3]} children={[item => item * 1, item => item * 2]} />
Head, // <Head><title>Hello World</title></Head>
Show, // <Show when={true} fallback="ouch"/>
Switch, Match,// <Switch fallback="ouch"><Match when={true}/></Switch>
Portal, // <Portal mount={document.body}>Hola</Portal>

getValue, // getValue(signalMaybe)
version // "0.2.0"
} from 'pota'
`}
	/>
)
