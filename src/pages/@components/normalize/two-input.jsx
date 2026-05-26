import { render, signal } from 'pota'
import { Normalize } from 'pota/components'

function App() {
  const [first, setFirst] = signal('Ada')
  const [last, setLast] = signal('Lovelace')

  return (
    <div>
      <input
        prop:value={first}
        on:input={e => setFirst(e.currentTarget.value)}
      />
      <input
        prop:value={last}
        on:input={e => setLast(e.currentTarget.value)}
      />
      <p>
        <Normalize>
          hello, {first} {last}!
        </Normalize>
      </p>
    </div>
  )
}

render(App)
