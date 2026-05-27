import { datetime, useTimeout } from 'pota/use/time'
import { render, signal } from 'pota'

function App() {
  const status = signal('click to start')

  function start() {
    status.write(`started at ${datetime()}`)
    useTimeout(() => status.write('done!'), 2000).start()
  }

  return (
    <div>
      <button on:click={start}>start 2s timer</button>
      <p>{status.read}</p>
    </div>
  )
}

render(App)
