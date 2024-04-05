import { render, signal, resolve } from 'pota'
import { Show } from 'pota/web'

function Example() {
  const [showing, setShowing] = signal(true)

  setInterval(() => {
    setShowing(showing => !showing)
  }, 1_000)

  let rendered = 0
  function CountRenders() {
    rendered++
    return <span>This component rendered {rendered} times</span>
  }

  const Test = resolve(() => CountRenders)

  return (
    <Show when={showing}>
      <Test />
    </Show>
  )
}

render(Example)
