import { derived, render, signal } from 'pota'

function App() {
  const raw = signal('  Hello, World!  ')

  const cleaned = derived(
    () => raw.read(),
    s => s.trim(),
    s => s.toLowerCase(),
    s => s.replace(/[^a-z0-9]+/g, '-'),
  )

  return (
    <div>
      <input
        prop:value={raw.read}
        on:input={e => raw.write(e.currentTarget.value)}
      />
      <p>slug: {cleaned}</p>
    </div>
  )
}

render(App)
