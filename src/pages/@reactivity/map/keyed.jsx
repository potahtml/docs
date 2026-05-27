import { map, render, signal } from 'pota'

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
      <ul>{map(items.read, item => <li>{item}</li>)}</ul>
    </div>
  )
}

render(App)
