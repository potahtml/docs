import { render, Show, signal } from 'pota'

function Example() {
  const [showing, setShowing] = signal(Math.random())

  setInterval(() => {
    setShowing(Math.random())
  }, 1_000)

  return <Show when={showing}>{value => value}</Show>
}

render(Example)
