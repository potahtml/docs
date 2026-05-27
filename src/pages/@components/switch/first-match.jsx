import { render, signal } from 'pota'
import { Match, Switch } from 'pota/components'

function App() {
  const status = signal('loading')

  return (
    <div>
      <button on:click={() => status.write('loading')}>loading</button>
      <button on:click={() => status.write('success')}>success</button>
      <button on:click={() => status.write('error')}>error</button>

      <Switch fallback={<p>unknown</p>}>
        <Match when={() => status.read() === 'loading'}>
          <p>loading…</p>
        </Match>
        <Match when={() => status.read() === 'success'}>
          <p>done!</p>
        </Match>
        <Match when={() => status.read() === 'error'}>
          <p>oh no</p>
        </Match>
      </Switch>
    </div>
  )
}

render(App)
