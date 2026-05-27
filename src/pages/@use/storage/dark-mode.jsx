import { render } from 'pota'
import { storage } from 'pota/use/storage'

const prefs = storage('prefs:')
const dark = prefs('dark', false)

function App() {
  return (
    <div
      style={{
        background: () => (dark.read() ? '#111' : '#fafafa'),
        color: () => (dark.read() ? '#eee' : '#111'),
        padding: '1rem',
      }}
    >
      <label>
        <input
          type="checkbox"
          prop:checked={dark.read}
          on:change={e => dark.write(e.currentTarget.checked)}
        />
        dark mode
      </label>
      <p>
        <small>
          open this page in a second tab and toggle the checkbox —
          both tabs follow each other via the native storage event
        </small>
      </p>
    </div>
  )
}

render(App)
