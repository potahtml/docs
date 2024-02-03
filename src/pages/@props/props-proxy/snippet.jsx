import { propsProxy, render } from 'pota'
import { html } from 'pota/html'

/**
 * Lit-alike attributes/properties on the html function
 *
 * NOTE: pota/html already provides lit-style attributes/properties !
 */

propsProxy(prop => {
  const name = prop.name
  if (name.startsWith('.')) {
    // as property
    prop.name = name.replace(/^./, 'prop:')
  } else if (name.startsWith('?')) {
    // as boolean
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
    Lit-alike attributes/properties tests
  </div>`
}

render(App)
