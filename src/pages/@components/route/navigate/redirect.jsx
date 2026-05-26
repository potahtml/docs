import { render, signal } from 'pota'
import { Navigate, Route, Show } from 'pota/components'

function App() {
  const [loggedIn, setLoggedIn] = signal(false)

  return (
    <div>
      <button on:click={() => setLoggedIn(true)}>log in</button>

      <Route path="/protected">
        <Show
          when={loggedIn}
          fallback={<Navigate path="/login" replace />}
        >
          <p>secret content</p>
        </Show>
      </Route>

      <Route path="/login">
        <p>please log in</p>
      </Route>
    </div>
  )
}

render(App)
