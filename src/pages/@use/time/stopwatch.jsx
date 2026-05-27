import { render } from 'pota'
import { useStopwatch } from 'pota/use/time'

function App() {
  const sw = useStopwatch({ interval: 100 })

  return (
    <div>
      <h2>{() => (sw.elapsed() / 1000).toFixed(1)}s</h2>
      <button on:click={sw.start}>start</button>
      <button on:click={sw.stop}>stop</button>
      <button on:click={sw.reset}>reset</button>
      <p>{() => (sw.running() ? 'running' : 'paused')}</p>
    </div>
  )
}

render(App)
