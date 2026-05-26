import { addEvent, cleanup, render } from 'pota'

const longPress =
  (handler, ms = 600) =>
  node => {
    let timer
    const start = () => {
      timer = setTimeout(handler, ms)
    }
    const stop = () => clearTimeout(timer)

    addEvent(node, 'pointerdown', start)
    addEvent(node, 'pointerup', stop)
    addEvent(node, 'pointerleave', stop)

    cleanup(stop)
  }

function App() {
  return (
    <button use:ref={longPress(() => alert('long pressed!'))}>
      hold me
    </button>
  )
}

render(App)
