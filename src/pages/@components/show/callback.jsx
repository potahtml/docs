import { render, signal } from 'pota'
import { Show } from 'pota/components'

function Example() {
  const [showing, setShowing] = signal(Math.random())

  setInterval(() => {
    setShowing(Math.random())
  }, 1_000)

  return <Show when={showing}>{value => value}</Show>
}

render(Example)
