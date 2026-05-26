import { derived, isResolved, render, signal } from 'pota'

function App() {
  const [id, , updateId] = signal(1)

  const post = derived(
    () => `https://jsonplaceholder.typicode.com/posts/${id()}`,
    url => fetch(url),
    res => res.json(),
  )

  return (
    <div>
      <button on:click={() => updateId(n => n + 1)}>next</button>
      <p>{() => (isResolved(post) ? post().title : 'loading…')}</p>
    </div>
  )
}

render(App)
