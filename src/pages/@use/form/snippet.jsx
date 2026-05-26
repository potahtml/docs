import { render } from 'pota'
import {
  enterFocusNext,
  preventEnter,
  sizeToInput,
} from 'pota/use/form'

function App() {
  return (
    <form on:submit={e => e.preventDefault()}>
      <input
        placeholder="Enter advances to next field"
        use:ref={enterFocusNext}
      />
      <input
        placeholder="Enter advances here too"
        use:ref={enterFocusNext}
      />
      <input
        placeholder="Enter is swallowed (preventEnter)"
        use:ref={preventEnter}
      />
      <textarea
        placeholder="grows with content"
        use:ref={sizeToInput}
      />
    </form>
  )
}

render(App)
