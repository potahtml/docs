import { render, signal } from 'pota'
import { Show } from 'pota/web'

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
