import { derived, render, signal } from 'pota'

function App() {
  const [raw, setRaw] = signal('  Hello, World!  ')

  const cleaned = derived(
    () => raw(),
    s => s.trim(),
    s => s.toLowerCase(),
    s => s.replace(/[^a-z0-9]+/g, '-'),
  )

  return (
    <div>
      <input
        prop:value={raw}
        on:input={e => setRaw(e.currentTarget.value)}
      />
      <p>slug: {cleaned}</p>
    </div>
  )
}

render(App)
