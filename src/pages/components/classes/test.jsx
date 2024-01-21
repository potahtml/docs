import { render, Pota } from 'pota'

class MyComponent extends Pota {
  onReady() {
    render(<div>onReady callback!</div>)
  }
  onCleanup() {
    render(<div>onCleanup callback!</div>)
  }
  render(props) {
    return (
      <main>
        {props.children} {props.some}
      </main>
    )
  }
}

const dispose = render(
  <MyComponent some="prop test">hello from class!</MyComponent>,
)

render(
  <button
    name="button"
    onClick={dispose}
  >
    dispose
  </button>,
)
