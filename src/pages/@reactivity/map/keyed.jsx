import { map, render, signal } from 'pota'

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
      <ul>{map(items, item => <li>{item}</li>)}</ul>
    </div>
  )
}

render(App)
