import { render, signal } from 'pota'
import { Show } from 'pota/web'

function Example() {
  const [showing, setShowing] = signal(true)

  setInterval(() => {
    setShowing(showing => !showing)
  }, 1_000)

  const [fallback, setFallback] = signal(Math.random())

  setInterval(() => {
    setFallback(Math.random())
  }, 1_000)

  return (
    <Show
      when={showing}
      fallback={fallback}
    >
      Hey
    </Show>
  )
}

render(Example)
