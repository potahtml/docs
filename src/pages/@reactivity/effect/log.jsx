import { effect, render, signal } from 'pota'

function App() {
  const count = signal(0)

  effect(() => {
    console.log('count is now', count.read())
  })

  return (
    <button on:click={() => count.update(n => n + 1)}>
      {count.read}
    </button>
  )
}

render(App)
