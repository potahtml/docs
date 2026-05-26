import { addEvent, removeEvent, render, signal } from 'pota'

function App() {
  const [seen, setSeen] = signal(0)

  function onMove(e) {
    setSeen(seen() === 0 ? e.clientX : seen())
    removeEvent(window, 'mousemove', onMove)
  }

  addEvent(window, 'mousemove', onMove)

  return <p>first mouse x: {seen}</p>
}

render(App)
