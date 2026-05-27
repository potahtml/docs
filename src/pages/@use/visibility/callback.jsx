import { render, signal } from 'pota'
import { onDocumentVisible } from 'pota/use/visibility'

function App() {
  const log = signal([])

  onDocumentVisible(visible => {
    log.update(entries => [
      ...entries,
      `${new Date().toLocaleTimeString()} — ${visible ? 'visible' : 'hidden'}`,
    ])
  })

  return (
    <div>
      <p>Switch tabs to populate the log:</p>
      <ul>
        {() =>
          log.read().map(entry => (
            <li>
              <code>{entry}</code>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

render(App)
