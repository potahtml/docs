import { render, signal } from 'pota'
import { Show } from 'pota/components'

function Example() {
  const [showing, setShowing, updateShowing] = signal(true)

  setInterval(() => {
    updateShowing(showing => !showing)
  }, 1_000)

  let rendered = 0
  function CountRenders() {
    rendered++
    return <span>This component rendered {rendered} times</span>
  }

  return (
    <Show when={showing}>
      <CountRenders />
    </Show>
  )
}

render(Example)
