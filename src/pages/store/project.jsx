import { mutable, project } from 'pota/store'
import { render } from 'pota'

const original = mutable({ name: 'Ada', age: 30 })
const draft = project(original)

function App() {
  return (
    <div>
      <p>
        original: {() => original.name}, {() => original.age}
      </p>
      <p>
        draft: {() => draft.name}, {() => draft.age}
      </p>
      <button on:click={() => (draft.age += 1)}>
        bump draft age (original unchanged)
      </button>
      <button on:click={() => (original.name = 'Grace')}>
        rename original (draft sees it through)
      </button>
    </div>
  )
}

render(App)
