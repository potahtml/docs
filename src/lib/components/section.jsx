import { propsSplit } from 'pota'
import { H3 } from './headings.jsx'

export function Section(props) {
  const [others, local] = propsSplit(props, ['title', 'children'])
  return (
    <section>
      <H3>{local.title}</H3>
      <section {...others}>{local.children}</section>
    </section>
  )
}
