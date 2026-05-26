import { render } from 'pota'
import { clipboard } from 'pota/use/clipboard'

function App() {
  return (
    <div>
      <button use:ref={clipboard(true)}>
        copy this label's text
      </button>
      <button use:ref={clipboard('hard-coded snippet')}>
        copy a fixed string
      </button>
      <button use:ref={clipboard(() => `time: ${Date.now()}`)}>
        copy current time
      </button>
    </div>
  )
}

render(App)
