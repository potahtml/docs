import { render } from 'pota'
import { For } from 'pota/web'

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
