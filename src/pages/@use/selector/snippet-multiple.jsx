import { render, signal } from 'pota'
import { useSelector } from 'pota/use/selector'
import { For } from 'pota/components'
import { css } from 'pota/use/css'

const [selected, setSelected, updateSelected] = signal(new Set([3]), {
  equals: false,
})

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
          on:click={() =>
            updateSelected(set => {
              set.has(item) ? set.delete(item) : set.add(item)
              return set
            })
          }
        >
          {item} is selected? {isSelected(item)}
        </li>
      )}
    </For>
  </main>,
)
