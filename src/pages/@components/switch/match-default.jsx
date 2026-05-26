import { render, signal } from 'pota'
import { Match, Switch } from 'pota/components'

function App() {
  const [role, setRole] = signal('guest')

  return (
    <div>
      <button on:click={() => setRole('admin')}>admin</button>
      <button on:click={() => setRole('user')}>user</button>
      <button on:click={() => setRole('guest')}>guest</button>

      <Switch>
        <Match when={() => role() === 'admin'}>
          <p>full access</p>
        </Match>
        <Match when={() => role() === 'user'}>
          <p>limited access</p>
        </Match>
        <Match>
          <p>please sign in</p>
        </Match>
      </Switch>
    </div>
  )
}

render(App)
