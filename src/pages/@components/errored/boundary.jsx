import { render, signal } from 'pota'
import { Errored } from 'pota/components'

function Risky() {
  throw new Error('something broke')
}

function App() {
  const show = signal(false)

  return (
    <div>
      <button on:click={() => show.update(s => !s)}>toggle</button>
      <Errored
        fallback={(err, reset) => (
          <div>
            <p>error: {err.message}</p>
            <button on:click={reset}>retry</button>
          </div>
        )}
      >
        {() => (show.read() ? <Risky /> : <p>safe</p>)}
      </Errored>
    </div>
  )
}

render(App)
