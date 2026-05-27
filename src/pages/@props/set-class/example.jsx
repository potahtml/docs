import { ref, render, setClass, signal } from 'pota'

function App() {
  const card = ref()
  const selected = signal(false)

  return (
    <div>
      <div
        use:ref={card}
        class="card"
        on:click={() => selected.update(s => !s)}
      >
        click me
      </div>
      {() => setClass(card(), 'selected', selected.read())}
    </div>
  )
}

render(App)
