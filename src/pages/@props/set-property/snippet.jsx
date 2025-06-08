import { effect, ref, render, setProperty } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setProperty(element(), 'src', () => '/favicon.ico')
    }
  })
  return <img use:ref={element} />
}

render(App)
