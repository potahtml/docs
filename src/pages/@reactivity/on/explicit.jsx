import { on, render, signal } from 'pota'

function App() {
  const trigger = signal(0)
  const noisy = signal('initial')

  on(
    () => trigger.read(),
    () => {
      // reads `noisy` only as a snapshot — we don't want to
      // re-run when `noisy` changes
      console.log(`run #${trigger.read()} saw ${noisy.read()}`)
    },
  )

  return (
    <div>
      <button on:click={() => trigger.update(n => n + 1)}>
        re-run
      </button>
      <button
        on:click={() =>
          noisy.write(`changed ${Math.random().toFixed(2)}`)
        }
      >
        mutate noisy (no re-run)
      </button>
    </div>
  )
}

render(App)
