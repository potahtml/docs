import { effect, render, signal } from 'pota'

function App() {
  const [user, setUser] = signal(
    { id: 1, name: 'Ada' },
    { equals: (a, b) => a.id === b.id },
  )

  effect(() => {
    console.log('user changed:', user().name)
  })

  return (
    <div>
      <p>{() => user().name}</p>
      <button
        on:click={() => setUser({ id: 1, name: 'Ada Lovelace' })}
      >
        rename (same id — no re-run)
      </button>
      <button on:click={() => setUser({ id: 2, name: 'Grace' })}>
        switch user (different id — re-runs)
      </button>
    </div>
  )
}

render(App)
