import { html, propsProxy, render } from 'pota'

/**
 * Use a propsProxy to use lit style attributes/properties on the html
 * function
 */

propsProxy(prop => {
  const name = prop.name
  if (name.startsWith('.')) {
    // lit like property
    prop.name = name.replace(/^./, 'prop:')
  } else if (name.startsWith('?')) {
    // lit like boolean
    prop.name = name.replace(/^\?/, 'bool:')
  } else if (!name.includes(':') && !name.startsWith('on')) {
    /**
     * Default to attributes when the name is not namespaced and when
     * doesnt start with "on" (for event listeners)
     */
    prop.name = 'attr:' + name
  }
})

function App() {
  return html`<div
    .aproperty="3"
    ?aboolean="hola"
    boolean="${true}"
    onClick="${console.log}"
  >
    props tests
  </div>`
}

render(App)
