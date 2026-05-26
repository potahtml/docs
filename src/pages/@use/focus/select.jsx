import { render } from 'pota'
import { autoFocus, selectOnFocus } from 'pota/use/focus'

function App() {
  return (
    <input
      value="select me on focus"
      use:ref={[autoFocus, selectOnFocus]}
    />
  )
}

render(App)
