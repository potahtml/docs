import { render, signal } from 'pota'
import { Match, Switch } from 'pota/components'

function App() {
  const role = signal('guest')

  return (
    <div>
      <button on:click={() => role.write('admin')}>admin</button>
      <button on:click={() => role.write('user')}>user</button>
      <button on:click={() => role.write('guest')}>guest</button>

      <Switch>
        <Match when={() => role.read() === 'admin'}>
          <p>full access</p>
        </Match>
        <Match when={() => role.read() === 'user'}>
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
