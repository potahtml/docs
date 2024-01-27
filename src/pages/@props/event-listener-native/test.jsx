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
          on:input={filter}
          placeholder="Filter"
        />
      </label>
      <ul>
        <li on:click={e => handler('duck', e)}>duck</li>
        <li on:click={e => handler('dog', e)}>dog</li>
        <li on:click={e => handler('meaw', e)}>meaw</li>
        <li on:click={e => handler('quack', e)}>quack</li>
        <li on:click={e => handler('bird', e)}>bird</li>
      </ul>
    </main>
  )
}

render(App)
