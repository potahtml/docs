import { render, signal } from 'pota'
import { For } from 'pota/components'
import { paginateValues } from 'pota/use/paginate'

const rows = Array.from({ length: 23 }, (_, i) => `row #${i + 1}`)

function App() {
  const perPage = signal(5)

  const {
    items,
    currentPage,
    totalPages,
    hasPrevious,
    hasNext,
    next,
    previous,
  } = paginateValues(() => rows, perPage.read)

  return (
    <div>
      <ul>
        <For each={items}>{row => <li>{row}</li>}</For>
      </ul>

      <p>
        page <strong>{currentPage}</strong> of{' '}
        <strong>{totalPages}</strong>
      </p>

      <button on:click={previous} disabled={() => !hasPrevious()}>
        prev
      </button>
      <button on:click={next} disabled={() => !hasNext()}>
        next
      </button>
    </div>
  )
}

render(App)
