import { render } from 'pota'
import { For } from 'pota/components'
import { mutable } from 'pota/store'

const items = mutable([
  { id: 'a', text: 'apple' },
  { id: 'b', text: 'banana' },
  { id: 'c', text: 'cherry' },
])

function swap(i, j) {
  const tmp = items[i]
  items[i] = items[j]
  items[j] = tmp
}

function App() {
  return (
    <ul>
      <For each={() => items} restoreFocus reactiveIndex>
        {(item, i) => (
          <li>
            <input
              prop:value={() => item.text}
              on:input={e => (item.text = e.currentTarget.value)}
            />
            <button on:click={() => i() > 0 && swap(i(), i() - 1)}>
              ↑
            </button>
            <button
              on:click={() =>
                i() < items.length - 1 && swap(i(), i() + 1)
              }
            >
              ↓
            </button>
          </li>
        )}
      </For>
    </ul>
  )
}

render(App)
