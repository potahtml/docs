import { render, signal } from 'pota'
import { Match, Switch } from 'pota/components'

function App() {
  const [result, setResult] = signal({ kind: 'ok', value: 42 })

  return (
    <div>
      <button
        on:click={() =>
          setResult({
            kind: 'ok',
            value: Math.floor(Math.random() * 100),
          })
        }
      >
        ok
      </button>
      <button
        on:click={() => setResult({ kind: 'err', message: 'bad' })}
      >
        err
      </button>
      <Switch>
        <Match when={() => result().kind === 'ok' && result()}>
          {r => <p>got value: {() => r().value}</p>}
        </Match>
        <Match when={() => result().kind === 'err' && result()}>
          {r => <p>error: {() => r().message}</p>}
        </Match>
      </Switch>
    </div>
  )
}

render(App)
