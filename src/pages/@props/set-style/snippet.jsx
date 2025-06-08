import { effect, ref, render, setStyle } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setStyle(element(), 'padding', () => '8px')
      setStyle(element(), 'border', () => '4px solid blue')
    }
  })
  return <div use:ref={element} />
}

render(App)
