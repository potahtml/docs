import { cleanup, effect, render, signal } from 'pota'

function App() {
  const x = signal(0)
  const y = signal(0)

  effect(() => {
    const onMove = e => {
      x.write(e.clientX)
      y.write(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    cleanup(() => window.removeEventListener('mousemove', onMove))
  })

  return (
    <p>
      pointer at {x.read}, {y.read}
    </p>
  )
}

render(App)
