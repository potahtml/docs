import { render, signal } from 'pota'
import { now, useElapsed } from 'pota/use/time'

function format(seconds) {
  if (seconds < 60) return `${Math.floor(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

function App() {
  const since = signal(now() / 1000)
  const elapsed = useElapsed(since.read)

  return (
    <div>
      <button on:click={() => since.write(now() / 1000)}>
        reset to now
      </button>
      <p>elapsed: {() => format(elapsed())}</p>
      <p>
        <small>
          re-runs once per second under a minute, once per minute
          under an hour, etc. — no per-second renders for old data
        </small>
      </p>
    </div>
  )
}

render(App)
