import { render, signal } from 'pota'
import { Show } from 'pota/components'
import { globalShortcut } from 'pota/use/keyboard'

function App() {
  const [open, setOpen] = signal(false)

  return (
    <div
      use:ref={[
        globalShortcut('mod+k', () => setOpen(true)),
        globalShortcut('escape', () => setOpen(false)),
      ]}
    >
      <p>
        press <kbd>Ctrl/Cmd</kbd>+<kbd>K</kbd> to open the
        palette
      </p>
      <Show when={open}>
        <div
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '1rem 2rem',
            background: 'white',
            border: '1px solid #aaa',
            'box-shadow': '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <h3>Command palette</h3>
          <p>press Escape to close</p>
        </div>
      </Show>
    </div>
  )
}

render(App)
