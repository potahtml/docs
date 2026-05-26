import { render, signal } from 'pota'
import { Errored, Match, Switch } from 'pota/components'

function Bomb() {
  throw new Error('kaboom')
}

function App() {
  const [which, setWhich] = signal('static')

  return (
    <div>
      <button on:click={() => setWhich('static')}>static jsx</button>
      <button on:click={() => setWhich('value')}>plain value</button>
      <button on:click={() => setWhich('function')}>
        function with reset
      </button>

      <Switch>
        <Match when={() => which() === 'static'}>
          <Errored fallback={<p>oh no, an error happened</p>}>
            <Bomb />
          </Errored>
        </Match>
        <Match when={() => which() === 'value'}>
          <Errored fallback="— ">
            <Bomb />
          </Errored>
        </Match>
        <Match when={() => which() === 'function'}>
          <Errored
            fallback={(err, reset) => (
              <div>
                <p>{err.message}</p>
                <button on:click={reset}>retry</button>
              </div>
            )}
          >
            <Bomb />
          </Errored>
        </Match>
      </Switch>
    </div>
  )
}

render(App)
