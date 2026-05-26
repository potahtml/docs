import { render, signal, withValue } from 'pota'

const title = value => node =>
  withValue(value, resolved => {
    node.setAttribute('title', String(resolved))
  })

function App() {
  const [tip, setTip] = signal('hover me')
  return (
    <div>
      <button use:ref={title(tip)}>hover</button>
      <button on:click={() => setTip(`clicked at ${Date.now()}`)}>
        change tooltip
      </button>
    </div>
  )
}

render(App)
