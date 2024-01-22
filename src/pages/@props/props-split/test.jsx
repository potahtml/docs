import { render, propsSplit } from 'pota'

//  propsSplit

render(<h3>propsSplit test</h3>)

const props = { children: [1, 2, 3], id: 'divId', class: 'someClass' }

const [_, childs, divProps] = propsSplit(
  props,
  ['children'],
  ['id', 'class'],
)

log(childs)

log(divProps)

//  propsMerge

render(<h3>propsMerge test</h3>)

const [others, children] = propsSplit(props, ['children'])

const newProps = { ...others, 'aria-role': 'tooltip' }

log(others)

log(children)

log(newProps)

//

function log(object) {
  render(JSON.stringify(object))
  render(<hr />)
}
