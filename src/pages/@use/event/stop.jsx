import { render } from 'pota'
import { stopEvent, preventDefault } from 'pota/use/event'

function App() {
  return (
    <div>
      <a
        href="https://example.com"
        on:click={preventDefault}
      >
        click me (default prevented, link does not navigate)
      </a>

      <hr />

      <button on:click={stopEvent}>
        button — click is swallowed (no default, no bubble)
      </button>
    </div>
  )
}

render(App)
