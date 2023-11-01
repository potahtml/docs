import { render, template } from 'pota'

const Bold = text => template`<b>${text}</b>`

function Fun(props) {
  return template`
    <div>
      ${props.message}
        ${props.list} ${props.node}
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
