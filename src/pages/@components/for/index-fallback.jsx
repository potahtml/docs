import { render, signal } from 'pota'
import { For } from 'pota/components'

function App() {
  const items = signal([])

  return (
    <div>
      <button
        on:click={() =>
          items.update(list => [...list, `item ${list.length + 1}`])
        }
      >
        add
      </button>
      <button on:click={() => items.update(list => list.slice(1))}>
        remove first
      </button>
      <ul>
        <For
          each={items.read}
          reactiveIndex
          fallback={<li>list is empty</li>}
        >
          {(item, index) => (
            <li>
              #{index} — {item}
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

render(App)
