import { cleanup, render, signal } from 'pota'

function Clock() {
  const now = signal(new Date())

  const id = setInterval(() => now.write(new Date()), 1000)
  cleanup(() => clearInterval(id))

  return <p>{() => now.read().toLocaleTimeString()}</p>
}

render(Clock)
