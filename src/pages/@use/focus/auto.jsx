import { render, signal } from 'pota'
import { Show } from 'pota/components'
import { autoFocus } from 'pota/use/focus'

function App() {
  const editing = signal(false)

  return (
    <Show
      when={editing.read}
      fallback={
        <button on:click={() => editing.write(true)}>edit</button>
      }
    >
      <input
        value="hello"
        use:ref={autoFocus}
        on:blur={() => editing.write(false)}
      />
    </Show>
  )
}

render(App)
