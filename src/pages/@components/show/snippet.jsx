import { signal, Show } from 'pota'

function Component() {
  const [condition, setCondition] = signal(true)

  return <Show when={condition}>Thing to render</Show>
}
