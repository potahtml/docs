import { render, signal } from 'pota'
import { Show } from 'pota/components'

function App() {
  const [user, setUser] = signal(null)

  return (
    <div>
      <button on:click={() => setUser({ name: 'Ada' })}>
        log in
      </button>
      <button on:click={() => setUser(null)}>log out</button>
      <Show when={user} fallback={<p>not logged in</p>}>
        {u => <p>welcome, {() => u().name}</p>}
      </Show>
    </div>
  )
}

render(App)
