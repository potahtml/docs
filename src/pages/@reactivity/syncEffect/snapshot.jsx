import { render, signal, syncEffect } from 'pota'

function App() {
  const count = signal(1)
  let snapshot

  syncEffect(() => {
    snapshot = count.read()
  })

  return (
    <div>
      <p>captured: {snapshot}</p>
      <button on:click={() => count.update(n => n + 1)}>
        bump (only the next syncEffect would update snapshot)
      </button>
    </div>
  )
}

render(App)
