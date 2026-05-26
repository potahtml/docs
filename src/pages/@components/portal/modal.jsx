import { render, signal } from 'pota'
import { Portal, Show } from 'pota/components'

const overlay = document.createElement('div')
overlay.id = 'overlay'
document.body.append(overlay)

function App() {
  const [open, setOpen, updateOpen] = signal(false)

  return (
    <div>
      <button on:click={() => updateOpen(o => !o)}>
        toggle modal
      </button>
      <Show when={open}>
        <Portal mount={overlay}>
          <div class="modal">
            <p>I'm rendered into #overlay.</p>
            <button on:click={() => setOpen(false)}>close</button>
          </div>
        </Portal>
      </Show>
    </div>
  )
}

render(App)
