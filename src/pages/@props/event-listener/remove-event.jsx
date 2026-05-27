import { addEvent, removeEvent, render, signal } from 'pota'

function App() {
  const seen = signal(0)

  function onMove(e) {
    seen.write(seen.read() === 0 ? e.clientX : seen.read())
    removeEvent(window, 'mousemove', onMove)
  }

  addEvent(window, 'mousemove', onMove)

  return <p>first mouse x: {seen.read}</p>
}

render(App)
