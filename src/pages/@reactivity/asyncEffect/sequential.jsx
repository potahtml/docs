import { asyncEffect, render, signal } from 'pota'

function App() {
  const [id, , updateId] = signal(1)
  const [data, setData] = signal(null)

  asyncEffect(async prev => {
    const current = id()
    await prev
    const res = await fetch(`/api/items/${current}`)
    setData(await res.json())
  })

  return (
    <div>
      <button on:click={() => updateId(n => n + 1)}>next</button>
      <pre>{() => JSON.stringify(data(), null, 2)}</pre>
    </div>
  )
}

render(App)
