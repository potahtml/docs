import { render, signal } from 'pota'
import { Show } from 'pota/components'

function Example() {
  const showing = signal(Math.random())

  setInterval(() => {
    showing.write(Math.random())
  }, 1_000)

  return <Show when={showing.read}>{value => value}</Show>
}

render(Example)
