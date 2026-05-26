import { ref, render, setClass, signal } from 'pota'

function App() {
  const card = ref()
  const [selected, , updateSelected] = signal(false)

  return (
    <div>
      <div
        use:ref={card}
        class="card"
        on:click={() => updateSelected(s => !s)}
      >
        click me
      </div>
      {() => setClass(card(), 'selected', selected())}
    </div>
  )
}

render(App)
