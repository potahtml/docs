import { effect, render, signal } from 'pota'

function App() {
  const user = signal(
    { id: 1, name: 'Ada' },
    { equals: (a, b) => a.id === b.id },
  )

  effect(() => {
    console.log('user changed:', user.read().name)
  })

  return (
    <div>
      <p>{() => user.read().name}</p>
      <button
        on:click={() => user.write({ id: 1, name: 'Ada Lovelace' })}
      >
        rename (same id — no re-run)
      </button>
      <button on:click={() => user.write({ id: 2, name: 'Grace' })}>
        switch user (different id — re-runs)
      </button>
    </div>
  )
}

render(App)
