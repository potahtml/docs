import { ready, ref, render } from 'pota'

function App() {
  const input = ref()

  ready(() => {
    input().focus()
    input().select()
  })

  return <input use:ref={input} value="select me on mount" />
}

render(App)
