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
  }
  const remove = () => {
    removeEventListener(button(), 'click', handler, true)
  }

  return (
    <main>
      <button onClick={add}>add event</button>
      <button onClick={remove}>remove event</button>
      <button ref={button}>click me</button>
    </main>
  )
}

render(Example)
