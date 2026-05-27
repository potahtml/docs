import { render, signal } from 'pota'
import { CustomElement, customElement } from 'pota/components'

class CounterEl extends CustomElement {
  static styleSheets = [`button { font-weight: bold }`]

  count = signal(0)

  connectedCallback() {
    this.html = () => (
      <button on:click={() => this.bump()}>
        count: <span class="n">{this.count.read}</span>
      </button>
    )
  }

  bump() {
    this.count.update(n => n + 1)
    this.emit('changed', { detail: this.count.read() })
  }
}

customElement('my-counter', CounterEl)

const last = signal(0)

render(
  <>
    <my-counter on:changed={e => last.write(e.detail)} />
    <span> last 'changed' detail: {last.read}</span>
  </>,
)
