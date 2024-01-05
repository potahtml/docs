import { effect, ref, render, setNodeAttribute } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setNodeAttribute(element(), 'src', () => '/favicon.ico')
    }
  })
  return <img ref={element} />
}

render(App)
