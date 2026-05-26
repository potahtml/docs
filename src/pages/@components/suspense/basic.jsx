import { derived, render, signal } from 'pota'
import { Suspense } from 'pota/components'

function App() {
  const [id, , updateId] = signal(1)

  const post = derived(
    () =>
      fetch(`https://jsonplaceholder.typicode.com/posts/${id()}`),
    res => res.json(),
  )

  return (
    <div>
      <button on:click={() => updateId(n => n + 1)}>next</button>
      <Suspense fallback={<p>loading…</p>}>
        <h2>{() => post().title}</h2>
        <p>{() => post().body}</p>
      </Suspense>
    </div>
  )
}

render(App)
