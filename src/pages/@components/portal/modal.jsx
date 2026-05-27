import { render, signal } from 'pota'
import { Portal, Show } from 'pota/components'

const overlay = document.createElement('div')
overlay.id = 'overlay'
document.body.append(overlay)

function App() {
  const open = signal(false)

  return (
    <div>
      <button on:click={() => open.update(o => !o)}>
        toggle modal
      </button>
      <Show when={open.read}>
        <Portal mount={overlay}>
          <div class="modal">
            <p>I'm rendered into #overlay.</p>
            <button on:click={() => open.write(false)}>close</button>
          </div>
        </Portal>
      </Show>
    </div>
  )
}

render(App)
