import { render } from 'pota'
import { For } from 'pota/components'

function Example() {
  return (
    <main>
      <For
        each={[]}
        fallback="List contains no items!"
      >
        {item => <div class="render">hola</div>}
      </For>
    </main>
  )
}

render(Example)
