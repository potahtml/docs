import { render, signal } from 'pota'
import { Collapse } from 'pota/components'

function HeavyForm() {
  const draft = signal('')
  return (
    <form>
      <label>draft (preserved when hidden):</label>
      <input
        prop:value={draft.read}
        on:input={e => draft.write(e.currentTarget.value)}
      />
      <p>{() => `${draft.read().length} chars`}</p>
    </form>
  )
}

function App() {
  const open = signal(true)

  return (
    <div>
      <button on:click={() => open.update(o => !o)}>toggle</button>
      <Collapse when={open.read}>
        <HeavyForm />
      </Collapse>
    </div>
  )
}

render(App)
