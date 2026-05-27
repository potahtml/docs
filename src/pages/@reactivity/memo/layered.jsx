import { memo, render, signal } from 'pota'
import { For } from 'pota/components'

function App() {
  const todos = signal([
    { text: 'a', done: true },
    { text: 'b', done: false },
    { text: 'c', done: false },
  ])

  const total = memo(() => todos.read().length)
  const done = memo(() => todos.read().filter(t => t.done))
  const completed = memo(() => done().length)
  const percent = memo(() =>
    total() === 0 ? 0 : Math.round((completed() / total()) * 100),
  )

  function toggle(i) {
    todos.update(list =>
      list.map((t, n) => (n === i ? { ...t, done: !t.done } : t)),
    )
  }

  return (
    <div>
      <p>
        {completed} / {total} done — {percent}%
      </p>
      <ul>
        <For each={todos.read}>
          {(todo, i) => (
            <li on:click={() => toggle(i)}>
              {todo.done ? '✓ ' : '○ '}
              {todo.text}
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

render(App)
