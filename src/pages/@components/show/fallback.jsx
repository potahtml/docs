import { render, signal } from 'pota'
import { Show } from 'pota/web'

function Example() {
  const [showing, setShowing] = signal(true)

  setInterval(() => {
    setShowing(showing => !showing)
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
