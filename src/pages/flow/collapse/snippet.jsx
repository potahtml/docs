import { signal, Collapse } from 'pota'

function Component() {
  const [condition, setCondition] = signal(true)

  return <Collapse when={condition}>Thing to render</Collapse>
}
