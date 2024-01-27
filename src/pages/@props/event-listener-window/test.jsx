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

  const handler = (kind, e) => {
    render(
      <div>
        You {e.type} {kind}
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
        <li onClick={e => handler('duck', e)}>duck</li>
        <li onClick={e => handler('dog', e)}>dog</li>
        <li onClick={e => handler('meaw', e)}>meaw</li>
        <li onClick={e => handler('quack', e)}>quack</li>
        <li onClick:my-ns={e => handler('bird', e)}>bird</li>
      </ul>
    </main>
  )
}

render(App)
