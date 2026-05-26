import { externalSignal, render } from 'pota'
import { For } from 'pota/components'

function App() {
  const [todos, setTodos] = externalSignal([
    { id: 1, text: 'buy milk', done: false },
    { id: 2, text: 'walk dog', done: true },
  ])

  function refresh() {
    setTodos([
      { id: 1, text: 'buy milk', done: true },
      { id: 2, text: 'walk dog', done: true },
      { id: 3, text: 'water plants', done: false },
    ])
  }

  return (
    <div>
      <button on:click={refresh}>refresh</button>
      <ul>
        <For each={todos}>
          {todo => (
            <li>
              {todo.text} — {todo.done ? '✓' : '…'}
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

render(App)
