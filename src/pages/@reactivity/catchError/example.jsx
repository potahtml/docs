import { catchError, render, root, signal } from 'pota'

function App() {
  const [message, setMessage] = signal('not yet')

  root(() => {
    catchError(
      () => {
        throw new Error('boom')
      },
      err => setMessage(`caught: ${err.message}`),
    )
  })

  return <p>{message}</p>
}

render(App)
