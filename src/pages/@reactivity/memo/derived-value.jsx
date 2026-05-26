import { memo, render, signal } from 'pota'

function App() {
  const [count, , updateCount] = signal(2)
  const doubled = memo(() => count() * 2)

  return (
    <div>
      <p>n = {count}</p>
      <p>2n = {doubled}</p>
      <button on:click={() => updateCount(n => n + 1)}>+</button>
    </div>
  )
}

render(App)
