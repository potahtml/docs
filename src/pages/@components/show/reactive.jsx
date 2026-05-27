import { render, signal } from 'pota'
import { Show } from 'pota/components'

function Example() {
  const showing = signal(true)

  setInterval(() => {
    showing.update(showing => !showing)
  }, 1_000)

  return (
    <>
      <Show when={showing.read}>This is reactive</Show> -{' '}
      <Show when={showing.read()}>This is not reactive</Show>
    </>
  )
}

render(Example)
