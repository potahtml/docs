import { render, signal } from 'pota'

const [read, write] = signal(true)

function recurse(name) {
  console.log(name)
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
    recurse('Attribute has changed.')
  }
  set boolean(value) {
    recurse('boolean has changed.')
  }
}

customElements.define('custom-element', CustomElement)

render(() => (
  <custom-element
    string-attribute="lala"
    boolean={true}
  >
    Test
  </custom-element>
))
