import { render, signal, syncEffect } from 'pota'

function App() {
  const [count, , updateCount] = signal(1)
  let snapshot

  syncEffect(() => {
    snapshot = count()
  })

  return (
    <div>
      <p>captured: {snapshot}</p>
      <button on:click={() => updateCount(n => n + 1)}>
        bump (only the next syncEffect would update snapshot)
      </button>
    </div>
  )
}

render(App)
