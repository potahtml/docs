import { render, signal } from 'pota'

function App() {
  const count = signal(0)
  return (
    <button on:click={() => count.update(n => n + 1)}>
      clicks: {count.read}
    </button>
  )
}

const dispose = render(<App />)

// later, when you need to tear the app down:
// dispose()
