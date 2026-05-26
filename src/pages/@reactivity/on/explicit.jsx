import { on, render, signal } from 'pota'

function App() {
  const [trigger, , updateTrigger] = signal(0)
  const [noisy, setNoisy] = signal('initial')

  on(
    () => trigger(),
    () => {
      // reads `noisy` only as a snapshot — we don't want to
      // re-run when `noisy` changes
      console.log(`run #${trigger()} saw ${noisy()}`)
    },
  )

  return (
    <div>
      <button on:click={() => updateTrigger(n => n + 1)}>
        re-run
      </button>
      <button
        on:click={() =>
          setNoisy(`changed ${Math.random().toFixed(2)}`)
        }
      >
        mutate noisy (no re-run)
      </button>
    </div>
  )
}

render(App)
