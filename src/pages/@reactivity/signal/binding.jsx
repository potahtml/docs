import { render, signal } from 'pota'

function App() {
  const [name, setName] = signal('world')

  return (
    <div>
      <input
        prop:value={name}
        on:input={e => setName(e.currentTarget.value)}
      />
      <p>Hello, {name}!</p>
    </div>
  )
}

render(App)
