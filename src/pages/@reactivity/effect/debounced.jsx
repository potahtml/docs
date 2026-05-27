import { effect, render, signal } from 'pota'
import { useTimeout } from 'pota/use/time'

function App() {
  const query = signal('')
  const result = signal('—')

  effect(() => {
    const q = query.read()
    const timer = useTimeout(() => {
      result.write(q ? `searched for "${q}"` : '—')
    }, 400)
    timer.start()
  })

  return (
    <div>
      <input
        placeholder="type a query…"
        on:input={e => query.write(e.currentTarget.value)}
      />
      <p>{result.read}</p>
    </div>
  )
}

render(App)
