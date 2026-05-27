import { render, signal } from 'pota'
import { Match, Switch } from 'pota/components'

function App() {
  const remote = signal({ kind: 'idle' })

  return (
    <div>
      <button on:click={() => remote.write({ kind: 'idle' })}>
        idle
      </button>
      <button on:click={() => remote.write({ kind: 'loading' })}>
        loading
      </button>
      <button
        on:click={() =>
          remote.write({ kind: 'error', message: 'network down' })
        }
      >
        error
      </button>
      <button
        on:click={() =>
          remote.write({ kind: 'ok', items: ['a', 'b', 'c'] })
        }
      >
        ok
      </button>

      <Switch>
        <Match when={() => remote.read().kind === 'idle'}>
          <p>nothing yet — pick something</p>
        </Match>
        <Match when={() => remote.read().kind === 'loading'}>
          <p>loading…</p>
        </Match>
        <Match when={() => remote.read().kind === 'error' && remote.read()}>
          {e => <p>error: {() => e().message}</p>}
        </Match>
        <Match when={() => remote.read().kind === 'ok' && remote.read()}>
          {r => <p>got {() => r().items.length} items</p>}
        </Match>
      </Switch>
    </div>
  )
}

render(App)
