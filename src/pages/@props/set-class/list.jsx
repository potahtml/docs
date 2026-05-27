import { ref, render, setClassList, signal } from 'pota'

function App() {
  const box = ref()
  const open = signal(false)
  const error = signal(false)

  return (
    <div>
      <div use:ref={box} class="panel">
        panel
      </div>
      <button on:click={() => open.update(o => !o)}>
        toggle open
      </button>
      <button on:click={() => error.update(e => !e)}>
        toggle error
      </button>
      {() =>
        setClassList(box(), {
          open: open.read(),
          error: error.read(),
        })
      }
    </div>
  )
}

render(App)
