import { render, signal } from 'pota'
import { Show } from 'pota/components'
import { clickOutside } from 'pota/use/clickoutside'

function App() {
  const open = signal(false)

  return (
    <div>
      <button on:click={() => open.write(true)}>open</button>
      <Show when={open.read}>
        <div use:ref={clickOutside(() => open.write(false))}>
          <p>I close on outside click.</p>
        </div>
      </Show>
    </div>
  )
}

render(App)
