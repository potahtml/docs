import { render, signal } from 'pota'
import { Show } from 'pota/components'

function App() {
  const visible = signal(true)

  return (
    <div>
      <button on:click={() => visible.update(v => !v)}>
        toggle
      </button>
      <Show when={visible.read} fallback={<p>hidden</p>}>
        <p>hello</p>
      </Show>
    </div>
  )
}

render(App)
