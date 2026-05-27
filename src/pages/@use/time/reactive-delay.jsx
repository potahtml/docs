import { render, signal } from 'pota'
import { useTimeout } from 'pota/use/time'

function App() {
  const delay = signal(1000)
  const status = signal('idle')

  const fire = useTimeout(
    () => status.write(`fired @ ${new Date().toLocaleTimeString()}`),
    delay.read,
  )

  return (
    <div>
      <label>
        delay (ms):{' '}
        <input
          type="number"
          prop:value={delay.read}
          on:input={e => delay.write(Number(e.currentTarget.value))}
        />
      </label>
      <button on:click={() => fire.start()}>start</button>
      <button on:click={() => fire.stop()}>stop</button>
      <p>{status.read}</p>
    </div>
  )
}

render(App)
