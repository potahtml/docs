import { useSelector } from 'pota/use/selector'
import { For } from 'pota/components'
import { render, signal } from 'pota'

const items = ['apple', 'banana', 'cherry', 'date']

function App() {
  const [current, setCurrent] = signal('apple')
  const isSelected = useSelector(current)

  return (
    <ul>
      <For each={items}>
        {item => (
          <li
            class:selected={isSelected(item)}
            on:click={() => setCurrent(item)}
          >
            {item}
          </li>
        )}
      </For>
    </ul>
  )
}

render(App)
