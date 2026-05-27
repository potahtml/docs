import { signal } from 'pota'
import { Collapse } from 'pota/components'

function Component() {
  const condition = signal(true)

  return <Collapse when={condition.read}>Thing to render</Collapse>
}
