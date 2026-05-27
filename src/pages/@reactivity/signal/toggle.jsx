import { render, signal } from 'pota'

function App() {
  const open = signal(false)

  return (
    <div>
      <button on:click={() => open.update(v => !v)}>
        {() => (open.read() ? 'close' : 'open')}
      </button>
      <p>panel is {() => (open.read() ? 'open' : 'closed')}</p>
    </div>
  )
}

render(App)
