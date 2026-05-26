import { render, signal } from 'pota'
import { Navigate, Route, Show } from 'pota/components'

function App() {
  const [user, setUser] = signal(null)

  return (
    <div>
      <button on:click={() => setUser({ name: 'Ada' })}>
        log in as Ada
      </button>
      <button on:click={() => setUser(null)}>log out</button>

      <Route path="/dashboard">
        <Show
          when={user}
          fallback={<Navigate path="/login" replace />}
        >
          {u => <p>welcome, {() => u().name}</p>}
        </Show>
      </Route>

      <Route path="/login">
        <p>please log in</p>
      </Route>
    </div>
  )
}

render(App)
