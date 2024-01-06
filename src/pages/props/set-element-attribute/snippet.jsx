import { effect, ref, render, setElementAttribute } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setElementAttribute(element(), 'src', () => '/favicon.ico')
    }
  })
  return <img ref={element} />
}

render(App)
