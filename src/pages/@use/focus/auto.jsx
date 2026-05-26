import { render, signal } from 'pota'
import { Show } from 'pota/components'
import { autoFocus } from 'pota/use/focus'

function App() {
  const [editing, setEditing] = signal(false)

  return (
    <Show
      when={editing}
      fallback={
        <button on:click={() => setEditing(true)}>edit</button>
      }
    >
      <input
        value="hello"
        use:ref={autoFocus}
        on:blur={() => setEditing(false)}
      />
    </Show>
  )
}

render(App)
