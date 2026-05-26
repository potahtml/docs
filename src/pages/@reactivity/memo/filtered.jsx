import { memo, render, signal } from 'pota'
import { For } from 'pota/components'

function App() {
  const [items] = signal(['apple', 'banana', 'cherry', 'date'])
  const [query, setQuery] = signal('')

  const matches = memo(() => {
    const q = query().toLowerCase()
    return items().filter(item => item.toLowerCase().includes(q))
  })

  return (
    <div>
      <input
        on:input={e => setQuery(e.currentTarget.value)}
        placeholder="filter…"
      />
      <ul>
        <For each={matches}>{item => <li>{item}</li>}</For>
      </ul>
    </div>
  )
}

render(App)
