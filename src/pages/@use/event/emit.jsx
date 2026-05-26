import { ref, render, signal } from 'pota'
import { emit } from 'pota/use/event'

function App() {
  const target = ref()
  const [last, setLast] = signal('—')

  return (
    <div>
      <div
        use:ref={target}
        on:greet={e => setLast(e.detail.name)}
      >
        listening for <code>greet</code> events
      </div>

      <button
        on:click={() =>
          emit(target(), 'greet', { detail: { name: 'pota' } })
        }
      >
        dispatch greet
      </button>

      <p>last greeted: {last}</p>
    </div>
  )
}

render(App)
