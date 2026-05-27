import { derived, render, signal } from 'pota'
import { cached } from 'pota/use/cached'

function App() {
  const id = signal(1)

  const post = derived(
    () => `https://jsonplaceholder.typicode.com/posts/${id.read()}`,
    url => cached(url),
  )

  return (
    <div>
      <button on:click={() => id.update(n => n + 1)}>next</button>
      <button on:click={() => id.write(1)}>reset</button>
      <h3>post #{id.read}</h3>
      <p>{() => post()?.title ?? 'loading…'}</p>
      <p>
        <small>
          repeat-clicking the same id is a cache hit — no network
          tab activity after the first request
        </small>
      </p>
    </div>
  )
}

render(App)
