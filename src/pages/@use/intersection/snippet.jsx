import { render, signal } from 'pota'
import { visible } from 'pota/use/intersection'

function App() {
  const [isVisible, setVisible] = signal(false)

  return (
    <section
      use:ref={visible(entry => setVisible(entry.isIntersecting))}
      style={{
        height: '40vh',
        display: 'grid',
        'place-items': 'center',
      }}
    >
      {() => (isVisible() ? 'in view' : 'out of view')}
    </section>
  )
}

render(App)
