import { cleanup, render, signal } from 'pota'

function Clock() {
  const [now, setNow] = signal(new Date())

  const id = setInterval(() => setNow(new Date()), 1000)
  cleanup(() => clearInterval(id))

  return <p>{() => now().toLocaleTimeString()}</p>
}

render(Clock)
