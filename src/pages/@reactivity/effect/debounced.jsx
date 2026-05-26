import { effect, render, signal } from 'pota'
import { useTimeout } from 'pota/use/time'

function App() {
  const [query, setQuery] = signal('')
  const [result, setResult] = signal('—')

  effect(() => {
    const q = query()
    const timer = useTimeout(() => {
      setResult(q ? `searched for "${q}"` : '—')
    }, 400)
    timer.start()
  })

  return (
    <div>
      <input
        placeholder="type a query…"
        on:input={e => setQuery(e.currentTarget.value)}
      />
      <p>{result}</p>
    </div>
  )
}

render(App)
