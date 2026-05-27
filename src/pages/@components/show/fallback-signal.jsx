import { render, signal } from 'pota'
import { Show } from 'pota/components'

function Example() {
  const showing = signal(true)

  setInterval(() => {
    showing.update(showing => !showing)
  }, 1_000)

  const fallback = signal(Math.random())

  setInterval(() => {
    fallback.write(Math.random())
  }, 1_000)

  return (
    <Show
      when={showing.read}
      fallback={fallback.read}
    >
      Hey
    </Show>
  )
}

render(Example)
