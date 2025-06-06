import { render, signal } from 'pota'
import { xml } from 'pota/xml'

const [read, write] = signal(true)

function recurse(name) {
  render(<div>{name}</div>)
  write(!read())
}

class CustomElement extends HTMLElement {
  static observedAttributes = ['string-attribute', 'stringattribute']

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
    recurse(
      `Attribute ${name} has changed. oldValue: ${newValue}, newValue: ${newValue}, `,
    )
  }
  set boolean(value) {
    recurse(`boolean has changed. ${value}`)
  }

  set propcasetest(value) {
    recurse(`propcasetest has changed. ${value}`)
  }
  set propCASEtest(value) {
    recurse(`propCASEtest has changed. ${value}`)
  }
}

customElements.define('custom-element', CustomElement)

render(
  () =>
    xml` <custom-element
      string-attribute="lala"
      stringattribute="lala"
      boolean="${true}"
      propcasetest="lala1"
      propCASEtest="lala2"
    >
      Test
    </custom-element>`,
)
