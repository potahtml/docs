import { effect, ref, render, setElementStyle } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setElementStyle(element(), 'padding', () => '8px')
      setElementStyle(element(), 'border', () => '4px solid blue')
    }
  })
  return <div ref={element} />
}

render(App)
