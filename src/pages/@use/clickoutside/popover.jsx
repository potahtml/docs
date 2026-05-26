import { render, signal } from 'pota'
import { Show } from 'pota/components'
import { clickOutside } from 'pota/use/clickoutside'

function App() {
  const [open, setOpen] = signal(false)

  return (
    <div>
      <button on:click={() => setOpen(true)}>open</button>
      <Show when={open}>
        <div use:ref={clickOutside(() => setOpen(false))}>
          <p>I close on outside click.</p>
        </div>
      </Show>
    </div>
  )
}

render(App)
