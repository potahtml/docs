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
    return <span>This fallback rendered {rendered} times</span>
  }

  return (
    <Show
      when={showing}
      fallback={CountRenders}
    >
      Hey
    </Show>
  )
}

render(Example)
