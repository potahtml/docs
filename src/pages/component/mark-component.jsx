import { markComponent, render, signal } from 'pota'

function makeCounter(initial) {
  return markComponent(() => {
    const n = signal(initial)
    return (
      <button on:click={() => n.update(v => v + 1)}>{n.read}</button>
    )
  })
}

const A = makeCounter(0)
const B = makeCounter(100)

function App() {
  return (
    <div>
      <A />
      <B />
    </div>
  )
}

render(App)
