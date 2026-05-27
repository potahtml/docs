import { signal } from 'pota'
import { Show } from 'pota/components'

function Component() {
  const condition = signal(true)

  return <Show when={condition.read}>Thing to render</Show>
}
