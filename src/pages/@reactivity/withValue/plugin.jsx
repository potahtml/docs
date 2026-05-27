import { render, signal, withValue } from 'pota'

const title = value => node =>
  withValue(value, resolved => {
    node.setAttribute('title', String(resolved))
  })

function App() {
  const tip = signal('hover me')
  return (
    <div>
      <button use:ref={title(tip.read)}>hover</button>
      <button on:click={() => tip.write(`clicked at ${Date.now()}`)}>
        change tooltip
      </button>
    </div>
  )
}

render(App)
