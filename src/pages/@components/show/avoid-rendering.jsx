import { render, signal, resolve } from 'pota'
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

  const Test = resolve(() => CountRenders)

  return (
    <Show when={showing.read}>
      <Test />
    </Show>
  )
}

render(Example)
