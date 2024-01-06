import { effect, ref, render, setElementProperty } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setElementProperty(element(), 'src', () => '/favicon.ico')
    }
  })
  return <img ref={element} />
}

render(App)
