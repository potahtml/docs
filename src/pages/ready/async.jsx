import { derived, readyAsync, render, signal } from 'pota'

function App() {
  const id = signal(1)

  const post = derived(
    () => fetch(`https://jsonplaceholder.typicode.com/posts/${id.read()}`),
    res => res.json(),
  )

  readyAsync(() => {
    console.log('all async settled — post is', post())
  })

  return <p>{() => post()?.title ?? 'loading…'}</p>
}

render(App)
