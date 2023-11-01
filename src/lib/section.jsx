import { H3 } from './headings.jsx'

export function Section(props) {
  return (
    <section>
      <H3>{props.title}</H3>
      <section>{props.children}</section>
    </section>
  )
}
