import { effect, ref, render, setNodeStyle } from 'pota'

function App() {
  const element = ref()

  effect(() => {
    if (element()) {
      setNodeStyle(element(), 'padding', () => '8px')
      setNodeStyle(element(), 'border', () => '4px solid blue')
    }
  })
  return <div ref={element} />
}

render(App)
