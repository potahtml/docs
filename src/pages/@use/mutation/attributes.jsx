import { render, signal } from 'pota'
import { mutated } from 'pota/use/mutation'

function App() {
  const flag = signal(false)
  const seen = signal([])

  return (
    <div>
      <div
        class={() => (flag.read() ? 'on' : 'off')}
        data-tick={() => Date.now()}
        use:ref={mutated(
          records => {
            seen.update(prev => [
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
      <button on:click={() => flag.update(v => !v)}>toggle</button>
      <pre>{() => seen.read().join('\n')}</pre>
    </div>
  )
}

render(App)
