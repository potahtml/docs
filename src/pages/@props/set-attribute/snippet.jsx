import { effect, ref, render, setAttribute } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setAttribute(element(), 'src', () => '/favicon.ico')
    }
  })
  return <img use:ref={element} />
}

render(App)
