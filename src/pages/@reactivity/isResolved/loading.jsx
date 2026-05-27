import { derived, isResolved, render, signal } from 'pota'

function App() {
  const id = signal(1)

  const user = derived(
    () => `https://jsonplaceholder.typicode.com/users/${id.read()}`,
    url => fetch(url),
    res => res.json(),
  )

  return (
    <div>
      <button on:click={() => id.update(n => n + 1)}>next</button>
      <p>{() => (isResolved(user) ? user().name : 'loading…')}</p>
    </div>
  )
}

render(App)
