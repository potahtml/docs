import { render, signal } from 'pota'

function App() {
  const [count, setCount, updateCount] = signal(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button on:click={() => updateCount(n => n + 1)}>+</button>
      <button on:click={() => setCount(0)}>reset</button>
    </div>
  )
}

render(App)
