import { datetime, useTimeout } from 'pota/use/time'
import { render, signal } from 'pota'

function App() {
  const [status, setStatus] = signal('click to start')

  function start() {
    setStatus(`started at ${datetime()}`)
    useTimeout(() => setStatus('done!'), 2000).start()
  }

  return (
    <div>
      <button on:click={start}>start 2s timer</button>
      <p>{status}</p>
    </div>
  )
}

render(App)
