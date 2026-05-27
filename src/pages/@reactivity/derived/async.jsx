import { derived, isResolved, render, signal } from 'pota'

function App() {
  const id = signal(1)

  const post = derived(
    () => `https://jsonplaceholder.typicode.com/posts/${id.read()}`,
    url => fetch(url),
    res => res.json(),
  )

  return (
    <div>
      <button on:click={() => id.update(n => n + 1)}>next</button>
      <p>{() => (isResolved(post) ? post().title : 'loading…')}</p>
    </div>
  )
}

render(App)
