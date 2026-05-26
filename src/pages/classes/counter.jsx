import { Pota, render, signal } from 'pota'

class Counter extends Pota {
  count = signal(0)

  ready() {
    console.log('counter mounted')
  }

  cleanup() {
    console.log('counter unmounted')
  }

  render(props) {
    return (
      <button on:click={() => this.count.update(n => n + 1)}>
        {props.label}: {this.count.read}
      </button>
    )
  }
}

render(<Counter label="clicks" />)
