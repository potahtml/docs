import { derived, render, signal } from 'pota'

function App() {
  const base = signal(10)
  const total = derived(() => base.read() * 2)

  return (
    <div>
      <p>total: {total}</p>
      <button on:click={() => base.update(n => n + 1)}>
        bump base
      </button>
      <button on:click={() => total(999)}>override total</button>
    </div>
  )
}

render(App)
