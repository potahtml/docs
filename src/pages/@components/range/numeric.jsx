import { render, signal } from 'pota'
import { Range } from 'pota/components'

function App() {
  const [stop, , updateStop] = signal(5)

  return (
    <div>
      <button on:click={() => updateStop(n => n + 1)}>+</button>
      <button on:click={() => updateStop(n => Math.max(0, n - 1))}>
        −
      </button>
      <ul>
        <Range start={1} stop={stop}>
          {n => <li>row {n}</li>}
        </Range>
      </ul>
    </div>
  )
}

render(App)
