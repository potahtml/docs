import { render, signal } from 'pota'

function App() {
  const count = signal(0)

  return (
    <div>
      <p>Count: {count.read}</p>
      <button on:click={() => count.update(n => n + 1)}>+</button>
      <button on:click={() => count.write(0)}>reset</button>
    </div>
  )
}

render(App)
