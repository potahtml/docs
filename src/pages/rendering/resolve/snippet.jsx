import { render, resolve } from 'pota'

function Menu(props) {
  const items = resolve(() => {
    return props.children
  })

  return items
}

function App() {
  return (
    <Menu>
      <li>quack</li>
      <li>duck</li>
    </Menu>
  )
}

render(App)
