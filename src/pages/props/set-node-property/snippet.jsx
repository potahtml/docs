import { effect, ref, render, setNodeProperty } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setNodeProperty(element(), 'src', () => '/favicon.ico')
    }
  })
  return <img ref={element} />
}

render(App)
