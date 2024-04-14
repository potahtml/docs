import { render, resolve, signal } from 'pota'

function Menu(props) {
  const [rendered, setRendered, updateRendered] = signal(0)

  const items = resolve(() => {
    updateRendered(rendered => rendered + 1)
    return props.children
  })

  const [search, setSearch] = signal('')

  function filter(item) {
    if (!search()) return item

    const text = item.textContent

    return text.includes(search()) ? item : null
  }
  return (
    <nav>
      <label>
        Filter:
        <input
          type="text"
          onInput={e => setSearch(e.currentTarget.value)}
        />
      </label>
      <hr />
      <ul>{() => items().filter(filter)}</ul>
      <hr />
      Children rendered {rendered} time
    </nav>
  )
}

function App() {
  return (
    <Menu>
      <li>dog</li>
      <li>meaw</li>
      <li>quack</li>
      <li>duck</li>
    </Menu>
  )
}

render(App)
