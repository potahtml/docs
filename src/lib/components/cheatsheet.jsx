export const CheatSheetText = `// CHEATSHEET
import {
// rendering
render, // render(thing, target=document.body, {clear:false, relative:false})
Component, // const comp = Component(Fancy, {children:[4,5,6]})

// reactivity
signal, // const [read, write, update] = signal(initialValue)

root, // root(fn)
effect, // effect(fn)
on, // on(fnThatTracks, fnThatDoesntTrack)
syncEffect, // syncEffect(fn)
asyncEffect, // asyncEffect((previousEffect) => await previousEffect)
memo, // memo(fn)
writable, // const m = writable(fn, initialValue); m(true) // now "m" is "true" till fn reruns
batch, // batch(fn)
untrack, // untrack(fn)
cleanup, // cleanup(fn)
cancelCleanup, // cancelCleanup(fn)
ready, // ready(fn)
context, // const use = Context({}); const value = use(); use({newValue}, fn)
map, // map([1, 2, 3], (item, index) => [item, index])
owned, // const ownedFn = owned(fn); ownedFn({foo:"bar"})
withValue, // withValue(signal, value => console.log(value))

// events
addEvent, // const off = addEvent(el, 'click', fn)
removeEvent, // const on = removeEvent(el, 'click', fn)

// components
Pota, // class MyC extends Pota { constructor(props){} ready(){} cleanup(){} render(){} }
lazy, // const Com = lazy(()=>import('yey.jsx'), fallback) <Comp some={true} fallback="oops"/>
resolve, // const cache = resolve(() => props.children)
toHTML, // const nodes = toHTML(props.children) // node|node[]

// components utilitites
makeCallback, // makeCallback(props.children) === (...args)=>props.children
markComponent, // markComponent(()=> <b>this doesnt track</b>)
isComponent, // isComponent(fn) // true for non-tracking components

// props
ref, // const button = ref(); <div use:ref={button}.. /> effect(()=>button())

setAttribute, // setAttribute(node, 'data-active', signal, ns)
setProperty, // setProperty(node, 'hidden', signal)

// css
setStyle, // setStyle(node, 'color', signal)
setClass, // setClass(node, 'selected', signal)

propsPlugin, // propsPlugin('red', function(node, propValue){node.style.color = 'red'}) <div red/>
propsPluginNS, // propsPluginNS('color', function(node, localName, propValue){node.style.color = localName}) <div color:red/>

// pota version
version
} from 'pota'

import {
signalify, // const state = signalify({some:true, thing:'bla'}, [keys]) // only tracks whats defined on first level
mutable, // const state = mutable({some:{thing:{deep:true}}}, copy:boolean) // tracks all levels
merge, // merge(target, source)
replace,  // replace(target, source)
reset // reset(target, source)
} from 'pota/store'

// JSX Components
import {
Show, // <Show when={true} fallback="ouch"/>
Collapse, // <Collapse when={true}/>
Dynamic, // <Dynamic component="div" children="Hola"/>
For, // <For each={[1, 2, 3]} children={[item => item, item => item * 2]} />
Head, // <Head><title>Hello World</title></Head>
Switch, Match,// <Switch fallback="ouch"><Match when={true}/>Hi</Switch>
Portal, // <Portal mount={document.body}>Hola</Portal>
Range, // <Range start={0} stop={10} step={2}>{item=>item}</Range>
Route,// <Route path="/">Hola home</Route>
A,// <A href="/">home</A>
Navigate,// <Navigate path="/" replace={boolean} params={{}} delay={1000} scroll={boolean}>Redirecting..</Navigate>
Suspense,// <Suspense fallback="loadinig">{promise}</Suspense>

// custom element utils
customElement, // customElement("fancy-element", class Fancy extends HTMLElement{})
CustomElement, // class Fancy extends CustomElement{}
} from 'pota/components'

// xml
import {
XML, // const xml = XML(); (props) => xml\`<div>\${props.children}</div>\`
xml, // (props) => xml\`<div>\${props.children}</div>\` // () => <div/>
} from 'pota/xml'


`
