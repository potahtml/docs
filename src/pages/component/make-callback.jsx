import { makeCallback, render } from 'pota'

function HoverPanel(props) {
  const renderChildren = makeCallback(props.children)

  return (
    <div>
      {renderChildren('hovering')}
      {renderChildren('idle')}
    </div>
  )
}

function App() {
  return (
    <HoverPanel>
      {state => <p>state is {state}</p>}
    </HoverPanel>
  )
}

render(App)
