import { render, signal } from 'pota'
import { For } from 'pota/components'

function App() {
  const [items, , updateItems] = signal([
    'apple',
    'banana',
    'cherry',
  ])

  return (
    <div>
      <button
        on:click={() => updateItems(list => [...list].reverse())}
      >
        reverse
      </button>
      <ul>
        <For each={items}>{item => <li>{item}</li>}</For>
      </ul>
    </div>
  )
}

render(App)
