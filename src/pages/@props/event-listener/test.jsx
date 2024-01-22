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
    addEventListener(button(), 'click', handler, true)
    addEventListener(button(), 'click', handler, false)
  }
  const remove = () => {
    removeEventListener(button(), 'click', handler, true)
    removeEventListener(button(), 'click', handler, false)
  }

  return (
    <main>
      <div>
        It adds 1 delegated and 1 native. So will display double.
      </div>
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
