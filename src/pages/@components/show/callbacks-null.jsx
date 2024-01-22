import { render, Show, signal } from 'pota'

function Example() {
  const [showing, setShowing] = signal({
    username: Math.random(),
  })

  setInterval(() => {
    setShowing({ username: Math.random() })
  }, 1_000)

  setInterval(() => {
    setShowing(null)
  }, 8_000)

  function Test(props) {
    return props.children
  }
  return (
    <Show when={showing}>
      <div>The value is:</div>
      {value => () => value().username}
      <hr />
      <div>The value will be static if used as is</div>
      {value => <Test>{value().username}</Test>}
      <hr />
      <div>Is the value above .5?</div>
      {value => () => value().username > 0.5}
      <hr />
      <div class="render">this will blink if its re-rendering</div>
    </Show>
  )
}

render(Example)
