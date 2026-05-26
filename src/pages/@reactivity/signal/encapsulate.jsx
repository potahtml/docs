import { render, signal } from 'pota'

function useCounter(initial = 0) {
  const [count, setCount, updateCount] = signal(initial)
  return {
    count,
    increment: () => updateCount(v => v + 1),
    decrement: () => updateCount(v => v - 1),
    reset: () => setCount(initial),
  }
}

function App() {
  const counter = useCounter(10)

  return (
    <div>
      <p>{counter.count}</p>
      <button on:click={counter.increment}>+</button>
      <button on:click={counter.decrement}>−</button>
      <button on:click={counter.reset}>reset</button>
    </div>
  )
}

render(App)
