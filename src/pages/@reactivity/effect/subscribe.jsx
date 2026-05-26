import { cleanup, effect, render, signal } from 'pota'

function App() {
  const [x, setX] = signal(0)
  const [y, setY] = signal(0)

  effect(() => {
    const onMove = e => {
      setX(e.clientX)
      setY(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    cleanup(() => window.removeEventListener('mousemove', onMove))
  })

  return (
    <p>
      pointer at {x}, {y}
    </p>
  )
}

render(App)
