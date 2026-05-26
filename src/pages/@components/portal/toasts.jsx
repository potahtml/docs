import { render, signal } from 'pota'
import { For, Portal } from 'pota/components'

const host = document.createElement('div')
host.id = 'toasts'
host.style.cssText =
  'position:fixed;top:1rem;right:1rem;display:grid;gap:.5rem;z-index:9999'
document.body.append(host)

const [toasts, , updateToasts] = signal([])

function notify(text) {
  const id = Date.now() + Math.random()
  updateToasts(t => [...t, { id, text }])
  setTimeout(
    () => updateToasts(t => t.filter(x => x.id !== id)),
    2500,
  )
}

function App() {
  return (
    <div>
      <button on:click={() => notify('saved')}>saved</button>
      <button on:click={() => notify('uploaded')}>uploaded</button>

      <Portal mount={host}>
        <For each={toasts}>
          {t => (
            <div style="background:#222;color:#fff;padding:.5rem 1rem;border-radius:.25rem">
              {t.text}
            </div>
          )}
        </For>
      </Portal>
    </div>
  )
}

render(App)
