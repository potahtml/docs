import { batch, effect, render, signal } from 'pota'

function App() {
  const [first, setFirst] = signal('Ada')
  const [last, setLast] = signal('Lovelace')

  effect(() => {
    console.log(`hello, ${first()} ${last()}`)
  })

  return (
    <button
      on:click={() =>
        batch(() => {
          setFirst('Grace')
          setLast('Hopper')
        })
      }
    >
      rename (single effect run)
    </button>
  )
}

render(App)
