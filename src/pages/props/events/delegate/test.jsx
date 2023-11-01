import { render } from 'pota'

function App(props) {
  const filter = e => {
    const search = e.currentTarget.value
    const items = document.querySelectorAll('li')

    for (const item of items) {
      if (!search || item.textContent?.indexOf(search) !== -1) {
        item.style.display = ''
      } else {
        item.style.display = 'none'
      }
    }
  }

  const handler = (kind, info, e) => {
    render(
      <div>
        You {e.type} {kind} in a {info}
      </div>,
    )
  }

  return (
    <main>
      <label>
        Filter list:{' '}
        <input
          name="example"
          onInput:my-ns={filter}
          placeholder="Filter"
        />
      </label>
      <ul>
        <li onClick={[handler, 'duck', 'delegated event']}>duck</li>
        <li onClick={[handler, 'dog', 'delegated event']}>dog</li>
        <li onClick={[handler, 'meaw', 'delegated event']}>meaw</li>
        <li onClick={[handler, 'quack', 'delegated event']}>quack</li>
        <li onClick:my-ns={[handler, 'bird', 'delegated event']}>
          bird
        </li>
      </ul>
    </main>
  )
}

render(App)
