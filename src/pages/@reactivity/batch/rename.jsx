import { batch, effect, render, signal } from 'pota'

function App() {
  const first = signal('Ada')
  const last = signal('Lovelace')

  effect(() => {
    console.log(`hello, ${first.read()} ${last.read()}`)
  })

  return (
    <button
      on:click={() =>
        batch(() => {
          first.write('Grace')
          last.write('Hopper')
        })
      }
    >
      rename (single effect run)
    </button>
  )
}

render(App)
