import { H3 } from './headings.jsx'

export function Section(props) {
  const { title, children, ...others } = props

  return (
    <section>
      <H3>{title}</H3>
      <section {...others}>{children}</section>
    </section>
  )
}
