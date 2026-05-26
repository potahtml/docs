import { render, signal } from 'pota'
import { For } from 'pota/components'

function App() {
  const [items, , updateItems] = signal([])

  return (
    <div>
      <button
        on:click={() =>
          updateItems(list => [...list, `item ${list.length + 1}`])
        }
      >
        add
      </button>
      <button on:click={() => updateItems(list => list.slice(1))}>
        remove first
      </button>
      <ul>
        <For
          each={items}
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
