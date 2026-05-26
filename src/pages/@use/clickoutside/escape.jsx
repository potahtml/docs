import { render, signal } from 'pota'
import { Show } from 'pota/components'
import { clickOutside, escape } from 'pota/use/clickoutside'

function App() {
  const [open, setOpen] = signal(false)
  const close = () => setOpen(false)

  return (
    <div>
      <button on:click={() => setOpen(true)}>open</button>
      <Show when={open}>
        <div
          use:ref={[clickOutside(close), escape(close)]}
          style={{
            position: 'fixed',
            inset: '30% auto auto 30%',
            padding: '1rem 2rem',
            background: 'white',
            border: '1px solid #aaa',
          }}
        >
          <p>click outside, or press Escape, to dismiss.</p>
        </div>
      </Show>
    </div>
  )
}

render(App)
