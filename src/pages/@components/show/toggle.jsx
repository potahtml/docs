import { render, signal } from 'pota'
import { Show } from 'pota/components'

function App() {
  const [visible, , updateVisible] = signal(true)

  return (
    <div>
      <button on:click={() => updateVisible(v => !v)}>
        toggle
      </button>
      <Show when={visible} fallback={<p>hidden</p>}>
        <p>hello</p>
      </Show>
    </div>
  )
}

render(App)
