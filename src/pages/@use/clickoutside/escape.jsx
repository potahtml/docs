import { render, signal } from 'pota'
import { Show } from 'pota/components'
import { clickOutside, escape } from 'pota/use/clickoutside'

function App() {
  const open = signal(false)
  const close = () => open.write(false)

  return (
    <div>
      <button on:click={() => open.write(true)}>open</button>
      <Show when={open.read}>
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
