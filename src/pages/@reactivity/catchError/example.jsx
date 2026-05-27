import { catchError, render, root, signal } from 'pota'

function App() {
  const message = signal('not yet')

  root(() => {
    catchError(
      () => {
        throw new Error('boom')
      },
      err => message.write(`caught: ${err.message}`),
    )
  })

  return <p>{message.read}</p>
}

render(App)
