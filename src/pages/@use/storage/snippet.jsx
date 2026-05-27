import { render } from 'pota'
import { storage } from 'pota/use/storage'

const store = storage('counter-demo:')
const count = store('count', 0)

function App() {
  return (
    <div>
      <p>persisted count: {count.read}</p>
      <button on:click={() => count.update(n => n + 1)}>
        increment
      </button>
      <button on:click={() => count.write(0)}>reset</button>
      <p>
        <small>reload the page — the count survives</small>
      </p>
    </div>
  )
}

render(App)
