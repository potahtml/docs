import { render, signal } from 'pota'
import { Match, Switch } from 'pota/components'

function App() {
  const [remote, setRemote] = signal({ kind: 'idle' })

  return (
    <div>
      <button on:click={() => setRemote({ kind: 'idle' })}>
        idle
      </button>
      <button on:click={() => setRemote({ kind: 'loading' })}>
        loading
      </button>
      <button
        on:click={() =>
          setRemote({ kind: 'error', message: 'network down' })
        }
      >
        error
      </button>
      <button
        on:click={() =>
          setRemote({ kind: 'ok', items: ['a', 'b', 'c'] })
        }
      >
        ok
      </button>

      <Switch>
        <Match when={() => remote().kind === 'idle'}>
          <p>nothing yet — pick something</p>
        </Match>
        <Match when={() => remote().kind === 'loading'}>
          <p>loading…</p>
        </Match>
        <Match when={() => remote().kind === 'error' && remote()}>
          {e => <p>error: {() => e().message}</p>}
        </Match>
        <Match when={() => remote().kind === 'ok' && remote()}>
          {r => <p>got {() => r().items.length} items</p>}
        </Match>
      </Switch>
    </div>
  )
}

render(App)
