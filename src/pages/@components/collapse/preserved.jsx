import { render, signal } from 'pota'
import { Collapse } from 'pota/components'

function HeavyForm() {
  const [draft, setDraft] = signal('')
  return (
    <form>
      <label>draft (preserved when hidden):</label>
      <input
        prop:value={draft}
        on:input={e => setDraft(e.currentTarget.value)}
      />
      <p>{() => `${draft().length} chars`}</p>
    </form>
  )
}

function App() {
  const [open, , updateOpen] = signal(true)

  return (
    <div>
      <button on:click={() => updateOpen(o => !o)}>toggle</button>
      <Collapse when={open}>
        <HeavyForm />
      </Collapse>
    </div>
  )
}

render(App)
