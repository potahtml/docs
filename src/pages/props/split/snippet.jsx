import { propsSplit } from 'pota'

// const props = {children:[1,2,3], id:"divId",  class:"someClass"}

function ExampleSplit(props) {
  const [_, childs, divProps] = propsSplit(
    props,
    ['children'],
    ['id', 'class'],
  )

  return (
    <>
      <div {...divProps}>{childs.children}</div>
    </>
  )
}

// const props = {children:[1,2,3], id:"divId",  class:"someClass"}

function ExampleMerge(props) {
  const [others, childs] = propsSplit(props, ['children'])

  const newProps = { ...others, 'aria-role': 'tooltip' }

  return (
    <>
      <div {...newProps}>{childs.children}</div>
    </>
  )
}
