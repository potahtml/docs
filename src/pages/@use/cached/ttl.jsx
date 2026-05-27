import { render, signal } from 'pota'
import { cached } from 'pota/use/cached'

const URL = 'https://jsonplaceholder.typicode.com/posts/1'

function App() {
  const status = signal('idle')

  async function load() {
    status.write('fetching…')
    // 5s TTL — within the window, calls hit the Cache API
    const post = await cached(URL, { ttl: 5_000 })
    status.write(`got "${post.title.slice(0, 40)}…"`)
  }

  return (
    <div>
      <button on:click={load}>fetch</button>
      <p>{status.read}</p>
      <p>
        <small>
          click rapidly: subsequent calls within 5s come from the
          cache without touching the network
        </small>
      </p>
    </div>
  )
}

render(App)
