import { render, signal } from 'pota'
import { useTimeout } from 'pota/use/time'

function App() {
  const [delay, setDelay] = signal(1000)
  const [status, setStatus] = signal('idle')

  const fire = useTimeout(
    () => setStatus(`fired @ ${new Date().toLocaleTimeString()}`),
    delay,
  )

  return (
    <div>
      <label>
        delay (ms):{' '}
        <input
          type="number"
          prop:value={delay}
          on:input={e => setDelay(Number(e.currentTarget.value))}
        />
      </label>
      <button on:click={() => fire.start()}>start</button>
      <button on:click={() => fire.stop()}>stop</button>
      <p>{status}</p>
    </div>
  )
}

render(App)
