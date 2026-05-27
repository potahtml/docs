import { render, signal } from 'pota'

function App() {
  const name = signal('world')

  return (
    <div>
      <input
        prop:value={name.read}
        on:input={e => name.write(e.currentTarget.value)}
      />
      <p>Hello, {name.read}!</p>
    </div>
  )
}

render(App)
