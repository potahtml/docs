import { effect, render, signal } from 'pota'

function App() {
  const [theme, setTheme] = signal(
    localStorage.getItem('theme') ?? 'light',
  )

  effect(() => {
    localStorage.setItem('theme', theme())
  })

  return (
    <div>
      <p>theme: {theme}</p>
      <button on:click={() => setTheme('light')}>light</button>
      <button on:click={() => setTheme('dark')}>dark</button>
    </div>
  )
}

render(App)
