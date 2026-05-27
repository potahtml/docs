import { render, signal } from 'pota'
import { Show } from 'pota/components'
import { autoFocus, trapFocus } from 'pota/use/focus'
import { clickOutside, escape } from 'pota/use/clickoutside'

function App() {
  const open = signal(false)
  const close = () => open.write(false)

  return (
    <div>
      <button on:click={() => open.write(true)}>open dialog</button>
      <Show when={open.read}>
        <div
          use:ref={[trapFocus, clickOutside(close), escape(close)]}
          style={{
            position: 'fixed',
            inset: '20% auto auto 30%',
            padding: '1rem 2rem',
            background: 'white',
            border: '1px solid #aaa',
          }}
        >
          <h3>Dialog</h3>
          <input use:ref={autoFocus} placeholder="first field" />
          <input placeholder="second field" />
          <button on:click={close}>close</button>
        </div>
      </Show>
    </div>
  )
}

render(App)
