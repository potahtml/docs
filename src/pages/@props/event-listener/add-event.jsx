import { addEvent, render, signal } from 'pota'

function App() {
  const key = signal('press anything')

  addEvent(window, 'keydown', e => {
    key.write(`pressed: ${e.key}`)
  })

  return <p>{key.read}</p>
}

render(App)
