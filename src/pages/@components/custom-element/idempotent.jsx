import { customElement } from 'pota/components'

class HelloEl extends HTMLElement {
  connectedCallback() {
    this.textContent = 'hello, world'
  }
}

customElement('x-hello', HelloEl)

// idempotent: calling again with a different class is a no-op
customElement('x-hello', class extends HTMLElement {})

document.body.append(document.createElement('x-hello'))
