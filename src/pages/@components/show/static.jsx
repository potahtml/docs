import { render } from 'pota'
import { Show } from 'pota/web'

function Example() {
  return (
    <>
      <Show when={true}>Should show this text!</Show>
      <Show when={false}>Nope!</Show>
      <span> - the end</span>
    </>
  )
}

render(Example)
