import { render, signal } from 'pota'
import { Range } from 'pota/components'

function App() {
  const stop = signal(5)

  return (
    <div>
      <button on:click={() => stop.update(n => n + 1)}>+</button>
      <button on:click={() => stop.update(n => Math.max(0, n - 1))}>
        −
      </button>
      <ul>
        <Range start={1} stop={stop.read}>
          {n => <li>row {n}</li>}
        </Range>
      </ul>
    </div>
  )
}

render(App)
