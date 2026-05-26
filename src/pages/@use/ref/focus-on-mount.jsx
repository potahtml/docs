import { ready, ref, render } from 'pota'

function App() {
  const input = ref()

  ready(() => input().focus())

  return (
    <div>
      <label>type here:</label>
      <input use:ref={input} />
    </div>
  )
}

render(App)
