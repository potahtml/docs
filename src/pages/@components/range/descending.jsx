import { render, signal } from 'pota'
import { Range } from 'pota/components'

function App() {
  const step = signal(-1)

  return (
    <div>
      <label>
        step:{' '}
        <input
          type="number"
          prop:value={step.read}
          on:input={e => step.write(Number(e.currentTarget.value))}
        />
      </label>
      <ol>
        <Range start={10} stop={0} step={step.read}>
          {n => <li>countdown: {n}</li>}
        </Range>
      </ol>
    </div>
  )
}

render(App)
