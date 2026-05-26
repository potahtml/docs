import { markComponent, render, signal } from 'pota'

function makeCounter(initial) {
  return markComponent(() => {
    const [n, , updateN] = signal(initial)
    return (
      <button on:click={() => updateN(v => v + 1)}>{n}</button>
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
