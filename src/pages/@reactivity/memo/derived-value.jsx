import { memo, render, signal } from 'pota'

function App() {
  const count = signal(2)
  const doubled = memo(() => count.read() * 2)

  return (
    <div>
      <p>n = {count.read}</p>
      <p>2n = {doubled}</p>
      <button on:click={() => count.update(n => n + 1)}>+</button>
    </div>
  )
}

render(App)
