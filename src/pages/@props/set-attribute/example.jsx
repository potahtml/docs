import { ref, render, setAttribute, signal } from 'pota'

function App() {
  const button = ref()
  const [busy, , updateBusy] = signal(false)

  return (
    <div>
      <button
        use:ref={button}
        on:click={() => updateBusy(b => !b)}
      >
        toggle
      </button>
      {() => {
        setAttribute(button(), 'aria-busy', busy() ? 'true' : null)
      }}
    </div>
  )
}

render(App)
