import { render, signal } from 'pota'
import { Match, Switch } from 'pota/components'

function App() {
  const [status, setStatus] = signal('loading')

  return (
    <div>
      <button on:click={() => setStatus('loading')}>loading</button>
      <button on:click={() => setStatus('success')}>success</button>
      <button on:click={() => setStatus('error')}>error</button>

      <Switch fallback={<p>unknown</p>}>
        <Match when={() => status() === 'loading'}>
          <p>loading…</p>
        </Match>
        <Match when={() => status() === 'success'}>
          <p>done!</p>
        </Match>
        <Match when={() => status() === 'error'}>
          <p>oh no</p>
        </Match>
      </Switch>
    </div>
  )
}

render(App)
