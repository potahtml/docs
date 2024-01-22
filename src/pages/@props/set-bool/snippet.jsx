import { effect, ref, render, setBool } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setBool(element(), 'disabled', () => true)
    }
  })
  return <div ref={element}>element here</div>
}

render(App)
