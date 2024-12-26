import { render, signal } from 'pota'
import { css } from 'pota/std'
import { useSelector } from 'pota/plugin/useSelector'
import { For } from 'pota/web'

const [selected, setSelected] = signal(3)

const isSelected = useSelector(selected)

render(
  <main>
    {css`
      .selected {
        color: aqua;
      }
    `}

    <For each={[1, 2, 3, 4, 5]}>
      {item => (
        <li
          class:selected={isSelected(item)}
          on:click={() => setSelected(item)}
        >
          {item} is selected? {isSelected(item)}
        </li>
      )}
    </For>
  </main>,
)
