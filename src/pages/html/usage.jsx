import { render } from 'pota'
import { HTML } from 'pota/html'

const html = HTML()

const Bold = text => html`<b>${text}</b>`

function Fun(props) {
  return html`
    <div>
      ${props.message} ${props.list} ${props.node}
      <u>${props.look}</u>
      ${props.element}
    </div>
  `
}

const example = Fun({
  message: 'Hola!',
  list: [4, 5, 6, Bold(' really')],
  node: Bold('whoa'),
  look: 'Look mom no <JSX>',
  element: <div>:)</div>,
})

render(example)
