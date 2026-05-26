import { render, signal } from 'pota'

function App() {
  const [open, , updateOpen] = signal(false)

  return (
    <div>
      <button on:click={() => updateOpen(v => !v)}>
        {() => (open() ? 'close' : 'open')}
      </button>
      <p>panel is {() => (open() ? 'open' : 'closed')}</p>
    </div>
  )
}

render(App)
