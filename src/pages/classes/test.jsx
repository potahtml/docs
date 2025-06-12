import { render, Pota } from 'pota'

class MyComponent extends Pota {
  props = {
    some: 'something',
    children: 'quack',
  }
  ready() {
    render(<div>ready callback!</div>)
  }
  cleanup() {
    render(<div>cleanup callback!</div>)
  }
  render() {
    return <main>{this.props.children}</main>
  }
}

const dispose = render(
  <MyComponent some="lala">hello from class!</MyComponent>,
)

render(
  <button
    name="button"
    on:click={dispose}
  >
    dispose
  </button>,
)
