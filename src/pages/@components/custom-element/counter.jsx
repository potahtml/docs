import { CustomElement, customElement } from 'pota/components'

class CounterEl extends CustomElement {
  static styleSheets = [`button { font-weight: bold }`]

  count = 0

  connectedCallback() {
    this.html = () => (
      <button on:click={() => this.bump()}>
        count: <span class="n">{this.count}</span>
      </button>
    )
  }

  bump() {
    this.count++
    this.query('.n').textContent = this.count
    this.emit('changed', this.count)
  }
}

customElement('my-counter', CounterEl)

document.body.append(new CounterEl())
