import { render, signal, For } from 'pota'
import { useSelector } from 'pota/hooks'

const [selected, setSelected] = signal(3)

const isSelected = useSelector(selected)

render(
  <main>
    <style>{'.selected{color:aqua}'}</style>

    <For each={[1, 2, 3, 4, 5]}>
      {item => (
        <li
          class:selected={isSelected(item)}
          onClick={() => setSelected(item)}
        >
          {item} is selected? {isSelected(item)}
        </li>
      )}
    </For>
  </main>,
)
