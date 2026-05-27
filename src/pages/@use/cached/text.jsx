import { derived, render, signal } from 'pota'
import { cached } from 'pota/use/cached'

function App() {
  const id = signal(1)

  // override the default JSON parser to fetch a plain-text view
  const body = derived(
    () => `https://jsonplaceholder.typicode.com/posts/${id.read()}`,
    url => cached(url, { parse: r => r.text() }),
  )

  return (
    <div>
      <button on:click={() => id.update(n => n + 1)}>next</button>
      <pre style={{ 'white-space': 'pre-wrap' }}>
        {() => body() ?? 'loading…'}
      </pre>
    </div>
  )
}

render(App)
