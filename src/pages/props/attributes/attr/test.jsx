import { render, signal } from 'pota'

customElements.define(
  'custom-show',
  class extends HTMLElement {
    constructor() {
      super(), this.attachShadow({ mode: 'open' }), this.show()
    }
    hide() {
      this.shadowRoot.innerHTML = `<template><slot/></template>`
    }
    show() {
      this.shadowRoot.innerHTML = `<slot/>`
    }
    attributeChangedCallback(name, oldValue, newValue) {
      newValue === 'true' ? this.show() : this.hide()
    }
    static get observedAttributes() {
      return ['when']
    }
  },
)

function App() {
  const [showing, setShowing] = signal(true)
  setInterval(() => setShowing(showing => !showing), 1_000)

  return (
    <main>
      <custom-show prop:when={showing}>content prop</custom-show>
      <hr />
      <custom-show attr:when={showing}>content attr</custom-show>
      <hr />

      <custom-show p:when={showing}>content p</custom-show>
      <hr />
      <custom-show a:when={showing}>content a</custom-show>
      <hr />

      <custom-show when={showing}>content</custom-show>
      <hr />
    </main>
  )
}

render(App)
