import { render, Show, signal } from 'pota'

function Example() {
  const [showing, setShowing] = signal(Math.random())

  setInterval(() => {
    setShowing(Math.random())
  }, 1_000)

  return (
    <Show when={showing}>
      <div>The value is:</div>
      {value => value}
      <hr />
      <div>The value will be static if used as is</div>
      {value => value()}
      <hr />
      <div>Is the value above .5?</div>
      {value => () => value() > 0.5}
      <hr />
      <div class="render">this will blink if its re-rendering</div>
    </Show>
  )
}

render(Example)
