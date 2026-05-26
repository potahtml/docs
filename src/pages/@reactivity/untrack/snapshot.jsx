import { effect, render, signal, untrack } from 'pota'

function App() {
  const [a, , updateA] = signal(1)
  const [b, , updateB] = signal(10)

  effect(() => {
    // Re-runs only when `a` changes; `b` is read snapshot-style.
    console.log('a =', a(), 'b was', untrack(() => b()))
  })

  return (
    <div>
      <button on:click={() => updateA(n => n + 1)}>a++</button>
      <button on:click={() => updateB(n => n + 1)}>b++</button>
    </div>
  )
}

render(App)
