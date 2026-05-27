import { render, signal } from 'pota'
import { Show } from 'pota/components'

function App() {
  const user = signal(null)

  return (
    <div>
      <button on:click={() => user.write({ name: 'Ada' })}>
        log in
      </button>
      <button on:click={() => user.write(null)}>log out</button>
      <Show when={user.read} fallback={<p>not logged in</p>}>
        {u => <p>welcome, {() => u().name}</p>}
      </Show>
    </div>
  )
}

render(App)
