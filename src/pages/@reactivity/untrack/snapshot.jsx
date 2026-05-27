import { effect, render, signal, untrack } from 'pota'

function App() {
  const a = signal(1)
  const b = signal(10)

  effect(() => {
    // Re-runs only when `a` changes; `b` is read snapshot-style.
    console.log('a =', a.read(), 'b was', untrack(() => b.read()))
  })

  return (
    <div>
      <button on:click={() => a.update(n => n + 1)}>a++</button>
      <button on:click={() => b.update(n => n + 1)}>b++</button>
    </div>
  )
}

render(App)
