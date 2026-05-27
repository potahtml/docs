import { render, signal } from 'pota'

function useCounter(initial = 0) {
  const count = signal(initial)
  return {
    read: count.read,
    increment: () => count.update(v => v + 1),
    decrement: () => count.update(v => v - 1),
    reset: () => count.write(initial),
  }
}

function App() {
  const counter = useCounter(10)

  return (
    <div>
      <p>{counter.read}</p>
      <button on:click={counter.increment}>+</button>
      <button on:click={counter.decrement}>−</button>
      <button on:click={counter.reset}>reset</button>
    </div>
  )
}

render(App)
