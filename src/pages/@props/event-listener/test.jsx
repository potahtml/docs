import { addEvent, ref, removeEvent, render } from 'pota'

function Example() {
  const button = ref()

  const handler = () =>
    render(<div>You have click me!</div>, button())

  const add = () => {
    addEvent(button(), 'click', handler)
  }
  const remove = () => {
    removeEvent(button(), 'click', handler)
  }

  return (
    <main>
      <button
        name="button"
        on:click={add}
        on:mount={add}
      >
        add event
      </button>
      <button
        name="button"
        on:click={remove}
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
        on:click={{
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
