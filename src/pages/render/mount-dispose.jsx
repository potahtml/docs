import { render, signal } from 'pota'

function App() {
  const [count, , updateCount] = signal(0)
  return (
    <button on:click={() => updateCount(n => n + 1)}>
      clicks: {count}
    </button>
  )
}

const dispose = render(<App />)

// later, when you need to tear the app down:
// dispose()
