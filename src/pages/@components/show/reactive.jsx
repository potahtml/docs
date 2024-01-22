import { render, Show, signal } from 'pota'

function Example() {
  const [showing, setShowing] = signal(true)

  setInterval(() => {
    setShowing(showing => !showing)
  }, 1_000)

  return (
    <>
      <Show when={showing}>This is reactive</Show> -{' '}
      <Show when={showing()}>This is not reactive</Show>
    </>
  )
}

render(Example)
