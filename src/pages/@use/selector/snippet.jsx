import { render, signal } from 'pota'
import { useSelector } from 'pota/use/selector'
import { For } from 'pota/components'
import { css } from 'pota/use/css'

const selected = signal(3)

const isSelected = useSelector(selected.read)

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
          on:click={() => selected.write(item)}
        >
          {item} is selected? {isSelected(item)}
        </li>
      )}
    </For>
  </main>,
)
