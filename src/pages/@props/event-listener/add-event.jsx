import { addEvent, render, signal } from 'pota'

function App() {
  const [key, setKey] = signal('press anything')

  addEvent(window, 'keydown', e => {
    setKey(`pressed: ${e.key}`)
  })

  return <p>{key}</p>
}

render(App)
