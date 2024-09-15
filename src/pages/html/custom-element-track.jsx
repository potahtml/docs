import { render, signal } from 'pota'
import { html } from 'pota/html'

const [read, write] = signal(true)

function recurse(name) {
  render(<div>{name}</div>)
  write(!read())
}

class CustomElement extends HTMLElement {
  static observedAttributes = ['string-attribute']

  constructor() {
    super()
    recurse('constructor')
  }
  connectedCallback() {
    recurse('Custom element added to page.')
  }

  disconnectedCallback() {
    recurse('Custom element removed from page.')
  }

  adoptedCallback() {
    recurse('Custom element moved to new page.')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    recurse(`Attribute ${name} has changed.`)
  }
  set boolean(value) {
    recurse(`boolean has changed.`, value)
  }
}

customElements.define('custom-element', CustomElement)

render(
  () =>
    html` <custom-element
      attr:string-attribute="lala"
      boolean="${true}"
    >
      Test
    </custom-element>`,
)
