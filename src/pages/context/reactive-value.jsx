import { context, render, signal } from 'pota'

const Theme = context({
  value: () => 'light',
  set: () => {},
})

function Toolbar() {
  const t = Theme()
  return (
    <div>
      <p>current: {t.value}</p>
      <button on:click={() => t.set('light')}>light</button>
      <button on:click={() => t.set('dark')}>dark</button>
    </div>
  )
}

function App() {
  const [theme, setTheme] = signal('light')
  return (
    <Theme.Provider
      value={{
        value: theme,
        set: v => setTheme(v),
      }}
    >
      <Toolbar />
    </Theme.Provider>
  )
}

render(App)
