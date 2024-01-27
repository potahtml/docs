import {
  addEventListener,
  removeEventListener,
  render,
  ref,
} from 'pota'

function Example() {
  const button = ref()

  const handler = () =>
    render(<div>You have click me!</div>, button())

  const add = () => {
    addEventListener(button(), 'click', handler)
  }
  const remove = () => {
    removeEventListener(button(), 'click', handler)
  }

  return (
    <main>
      <button
        name="button"
        onClick={add}
      >
        add event
      </button>
      <button
        name="button"
        onClick={remove}
      >
        remove event
      </button>
      <button
        name="button"
        ref={button}
      >
        click me
      </button>
    </main>
  )
}

render(Example)
