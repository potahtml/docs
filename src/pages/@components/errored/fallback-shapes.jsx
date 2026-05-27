import { render, signal } from 'pota'
import { Errored, Match, Switch } from 'pota/components'

function Bomb() {
  throw new Error('kaboom')
}

function App() {
  const which = signal('static')

  return (
    <div>
      <button on:click={() => which.write('static')}>static jsx</button>
      <button on:click={() => which.write('value')}>plain value</button>
      <button on:click={() => which.write('function')}>
        function with reset
      </button>

      <Switch>
        <Match when={() => which.read() === 'static'}>
          <Errored fallback={<p>oh no, an error happened</p>}>
            <Bomb />
          </Errored>
        </Match>
        <Match when={() => which.read() === 'value'}>
          <Errored fallback="— ">
            <Bomb />
          </Errored>
        </Match>
        <Match when={() => which.read() === 'function'}>
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
