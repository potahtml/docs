import { asyncEffect, render, signal } from 'pota'

function App() {
  const id = signal(1)
  const data = signal(null)

  asyncEffect(async prev => {
    const current = id.read()
    await prev
    const res = await fetch(`/api/items/${current}`)
    data.write(await res.json())
  })

  return (
    <div>
      <button on:click={() => id.update(n => n + 1)}>next</button>
      <pre>{() => JSON.stringify(data.read(), null, 2)}</pre>
    </div>
  )
}

render(App)
