import { effect, render, signal } from 'pota'

function App() {
  const theme = signal(
    localStorage.getItem('theme') ?? 'light',
  )

  effect(() => {
    localStorage.setItem('theme', theme.read())
  })

  return (
    <div>
      <p>theme: {theme.read}</p>
      <button on:click={() => theme.write('light')}>light</button>
      <button on:click={() => theme.write('dark')}>dark</button>
    </div>
  )
}

render(App)
