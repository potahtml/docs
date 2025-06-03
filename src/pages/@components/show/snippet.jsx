import { signal } from 'pota'
import { Show } from 'pota/components'

function Component() {
  const [condition, setCondition] = signal(true)

  return <Show when={condition}>Thing to render</Show>
}
