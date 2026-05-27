import { render } from 'pota'
import { storage } from 'pota/use/storage'

const settings = storage('settings:')

// two independent calls, same key — they stay in sync
const fontA = settings('font-size', 14)
const fontB = settings('font-size', 14)

function App() {
  return (
    <div>
      <p>signal A reads: {fontA.read}px</p>
      <p>signal B reads: {fontB.read}px</p>
      <button on:click={() => fontA.update(n => n + 1)}>
        bump from A
      </button>
      <button on:click={() => fontB.write(14)}>
        reset from B
      </button>
      <p>
        <small>
          both readouts update together — fan-out happens inside the
          same document
        </small>
      </p>
    </div>
  )
}

render(App)
