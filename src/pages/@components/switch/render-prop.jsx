import { render, signal } from 'pota'
import { Match, Switch } from 'pota/components'

function App() {
  const result = signal({ kind: 'ok', value: 42 })

  return (
    <div>
      <button
        on:click={() =>
          result.write({
            kind: 'ok',
            value: Math.floor(Math.random() * 100),
          })
        }
      >
        ok
      </button>
      <button
        on:click={() => result.write({ kind: 'err', message: 'bad' })}
      >
        err
      </button>
      <Switch>
        <Match when={() => result.read().kind === 'ok' && result.read()}>
          {r => <p>got value: {() => r().value}</p>}
        </Match>
        <Match when={() => result.read().kind === 'err' && result.read()}>
          {r => <p>error: {() => r().message}</p>}
        </Match>
      </Switch>
    </div>
  )
}

render(App)
