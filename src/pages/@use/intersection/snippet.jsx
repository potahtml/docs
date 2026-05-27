import { render, signal } from 'pota'
import { visible } from 'pota/use/intersection'

function App() {
  const isVisible = signal(false)

  return (
    <section
      use:ref={visible(entry => isVisible.write(entry.isIntersecting))}
      style={{
        height: '40vh',
        display: 'grid',
        'place-items': 'center',
      }}
    >
      {() => (isVisible.read() ? 'in view' : 'out of view')}
    </section>
  )
}

render(App)
