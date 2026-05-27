import { render, signal } from 'pota'
import { Normalize } from 'pota/components'

function App() {
  const first = signal('Ada')
  const last = signal('Lovelace')

  return (
    <div>
      <input
        prop:value={first.read}
        on:input={e => first.write(e.currentTarget.value)}
      />
      <input
        prop:value={last.read}
        on:input={e => last.write(e.currentTarget.value)}
      />
      <p>
        <Normalize>
          hello, {first.read} {last.read}!
        </Normalize>
      </p>
    </div>
  )
}

render(App)
