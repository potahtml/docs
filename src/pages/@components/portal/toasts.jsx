import { render, signal } from 'pota'
import { For, Portal } from 'pota/components'

const host = document.createElement('div')
host.id = 'toasts'
host.style.cssText =
  'position:fixed;top:1rem;right:1rem;display:grid;gap:.5rem;z-index:9999'
document.body.append(host)

const toasts = signal([])

function notify(text) {
  const id = Date.now() + Math.random()
  toasts.update(t => [...t, { id, text }])
  setTimeout(
    () => toasts.update(t => t.filter(x => x.id !== id)),
    2500,
  )
}

function App() {
  return (
    <div>
      <button on:click={() => notify('saved')}>saved</button>
      <button on:click={() => notify('uploaded')}>uploaded</button>

      <Portal mount={host}>
        <For each={toasts.read}>
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
