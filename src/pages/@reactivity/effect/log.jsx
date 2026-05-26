import { effect, render, signal } from 'pota'

function App() {
  const [count, , updateCount] = signal(0)

  effect(() => {
    console.log('count is now', count())
  })

  return (
    <button on:click={() => updateCount(n => n + 1)}>
      {count}
    </button>
  )
}

render(App)
