import { render } from 'pota'
import { Portal } from 'pota/web'

function Test() {
  return ' me too!'
}

function Example() {
  return (
    <section class="escaping-this-parent">
      <Portal mount={document.body}>
        Portals can move text, elements and includes its children.
        <br />
        Without any kind of wrapper.
        <Test />
      </Portal>
      I stay here
    </section>
  )
}

render(Example)
