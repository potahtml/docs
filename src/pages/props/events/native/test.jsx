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
          on:input={filter}
          placeholder="Filter"
        />
      </label>
      <ul>
        <li on:click={[handler, 'dog', 'native event']}>dog</li>
        <li on:click={[handler, 'meaw', 'native event']}>meaw</li>
        <li on:click={[handler, 'quack', 'native event']}>quack</li>
        <li on:click={[handler, 'duck', 'native event']}>duck</li>
      </ul>
    </main>
  )
}

render(App)
