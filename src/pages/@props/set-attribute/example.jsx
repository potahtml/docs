import { ref, render, setAttribute, signal } from 'pota'

function App() {
  const button = ref()
  const busy = signal(false)

  return (
    <div>
      <button
        use:ref={button}
        on:click={() => busy.update(b => !b)}
      >
        toggle
      </button>
      {() => {
        setAttribute(button(), 'aria-busy', busy.read() ? 'true' : null)
      }}
    </div>
  )
}

render(App)
