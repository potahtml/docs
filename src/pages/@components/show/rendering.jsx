import { render, signal } from 'pota'
import { Show } from 'pota/components'

function Example() {
  const showing = signal(true)

  setInterval(() => {
    showing.update(showing => !showing)
  }, 1_000)

  let rendered = 0
  function CountRenders() {
    rendered++
    return <span>This component rendered {rendered} times</span>
  }

  return (
    <Show when={showing.read}>
      <CountRenders />
    </Show>
  )
}

render(Example)
