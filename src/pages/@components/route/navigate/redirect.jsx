import { render, signal } from 'pota'
import { Navigate, Route, Show } from 'pota/components'

function App() {
  const loggedIn = signal(false)

  return (
    <div>
      <button on:click={() => loggedIn.write(true)}>log in</button>

      <Route path="/protected">
        <Show
          when={loggedIn.read}
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
