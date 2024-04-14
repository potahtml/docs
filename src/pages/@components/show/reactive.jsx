import { render, signal } from 'pota'
import { Show } from 'pota/web'

function Example() {
  const [showing, setShowing, updateShowing] = signal(true)

  setInterval(() => {
    updateShowing(showing => !showing)
  }, 1_000)

  return (
    <>
      <Show when={showing}>This is reactive</Show> -{' '}
      <Show when={showing()}>This is not reactive</Show>
    </>
  )
}

render(Example)
