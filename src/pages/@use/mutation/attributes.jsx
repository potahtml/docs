import { render, signal } from 'pota'
import { mutated } from 'pota/use/mutation'

function App() {
  const [flag, , updateFlag] = signal(false)
  const [seen, , updateSeen] = signal([])

  return (
    <div>
      <div
        class={() => (flag() ? 'on' : 'off')}
        data-tick={() => Date.now()}
        use:ref={mutated(
          records => {
            updateSeen(prev => [
              ...prev,
              ...records.map(r => r.attributeName),
            ])
          },
          { attributes: true, attributeOldValue: true },
        )}
        style={{ padding: '1rem', border: '1px solid #aaa' }}
      >
        watched
      </div>
      <button on:click={() => updateFlag(v => !v)}>toggle</button>
      <pre>{() => seen().join('\n')}</pre>
    </div>
  )
}

render(App)
