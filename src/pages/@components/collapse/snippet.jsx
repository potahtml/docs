import { signal } from 'pota'
import { Collapse } from 'pota/components'

function Component() {
  const [condition, setCondition] = signal(true)

  return <Collapse when={condition}>Thing to render</Collapse>
}
