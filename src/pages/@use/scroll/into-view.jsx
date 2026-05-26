import { render, signal } from 'pota'
import { For, Show } from 'pota/components'
import { scrollIntoView } from 'pota/use/scroll'

function App() {
  const [selected, setSelected] = signal(null)
  const items = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <div>
      <button on:click={() => setSelected(20)}>
        scroll to #20
      </button>
      <button on:click={() => setSelected(null)} style={{ 'margin-left': '0.5rem' }}>
        clear
      </button>

      <ul style={{ height: '300px', overflow: 'auto', border: '1px solid #aaa' }}>
        <For each={items}>
          {item => (
            <Show
              when={() => selected() === item}
              fallback={<li>item {item}</li>}
            >
              <li
                use:ref={scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                })}
                style={{ background: 'mediumseagreen', color: 'white' }}
              >
                item {item} (target)
              </li>
            </Show>
          )}
        </For>
      </ul>
    </div>
  )
}

render(App)
