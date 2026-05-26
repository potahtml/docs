import { render, signal } from 'pota'
import { mutated } from 'pota/use/mutation'

function App() {
  const [count, , updateCount] = signal(0)
  const [log, , updateLog] = signal([])

  return (
    <div>
      <div
        id="bucket"
        use:ref={mutated(records => {
          updateLog(prev => [
            ...prev,
            ...records.map(r => `${r.type} (${r.addedNodes.length} added)`),
          ])
        })}
        style={{ padding: '1rem', border: '1px solid #aaa' }}
      >
        {() =>
          [...Array(count())].map((_, i) => <p>item {i + 1}</p>)
        }
      </div>
      <button on:click={() => updateCount(n => n + 1)}>add</button>
      <ul>
        {() => log().map(line => <li>{line}</li>)}
      </ul>
    </div>
  )
}

render(App)
