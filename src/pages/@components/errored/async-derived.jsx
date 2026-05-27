import { derived, render, signal } from 'pota'
import { Errored } from 'pota/components'

function Catalog() {
  const id = signal(1)

  const post = derived(
    () => `https://jsonplaceholder.typicode.com/posts/${id.read()}`,
    url =>
      fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      }),
  )

  return (
    <div>
      <button on:click={() => id.update(n => n + 1)}>next</button>
      <button on:click={() => id.write(-1)}>force 404</button>
      <h2>{() => post()?.title ?? 'loading…'}</h2>
    </div>
  )
}

function App() {
  return (
    <Errored
      fallback={(err, reset) => (
        <div>
          <p>fetch failed: {err.message}</p>
          <button on:click={reset}>try again</button>
        </div>
      )}
    >
      <Catalog />
    </Errored>
  )
}

render(App)
