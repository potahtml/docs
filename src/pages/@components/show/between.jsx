import { render, signal } from 'pota'
import { Show } from 'pota/components'

function Example() {
  // signal toggles every 1 second
  const showing = signal(true)

  setInterval(() => {
    showing.update(showing => !showing)
  }, 1_000)

  return (
    <>
      <span class="render">1</span>
      <Show when={showing.read}>
        <span class="render">2</span>
      </Show>
      <span class="render">3</span>
      <hr />1<Show when={showing.read}>2</Show>3
    </>
  )
}

render(Example)
