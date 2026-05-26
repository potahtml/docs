import { ref, render, setClassList, signal } from 'pota'

function App() {
  const box = ref()
  const [open, , updateOpen] = signal(false)
  const [error, , updateError] = signal(false)

  return (
    <div>
      <div use:ref={box} class="panel">
        panel
      </div>
      <button on:click={() => updateOpen(o => !o)}>
        toggle open
      </button>
      <button on:click={() => updateError(e => !e)}>
        toggle error
      </button>
      {() =>
        setClassList(box(), {
          open: open(),
          error: error(),
        })
      }
    </div>
  )
}

render(App)
