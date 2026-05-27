import { render, signal } from 'pota'
import { For } from 'pota/components'

function App() {
  const items = signal([
    'apple',
    'banana',
    'cherry',
  ])

  return (
    <div>
      <button
        on:click={() => items.update(list => [...list].reverse())}
      >
        reverse
      </button>
      <ul>
        <For each={items.read}>{item => <li>{item}</li>}</For>
      </ul>
    </div>
  )
}

render(App)
