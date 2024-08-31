import {
  addEventListener,
  ref,
  removeEventListener,
  render,
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
        onMount={add}
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
      <button
        name="button"
        onClick={{
          handleEvent: () => render('boo!'),
          once: true,
        }}
      >
        I work only once
      </button>
    </main>
  )
}

render(Example)
