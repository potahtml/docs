import { render, signal } from 'pota'
import { Errored } from 'pota/components'

function Risky() {
  throw new Error('something broke')
}

function App() {
  const [show, , updateShow] = signal(false)

  return (
    <div>
      <button on:click={() => updateShow(s => !s)}>toggle</button>
      <Errored
        fallback={(err, reset) => (
          <div>
            <p>error: {err.message}</p>
            <button on:click={reset}>retry</button>
          </div>
        )}
      >
        {() => (show() ? <Risky /> : <p>safe</p>)}
      </Errored>
    </div>
  )
}

render(App)
