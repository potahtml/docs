import { render, signal } from 'pota'
import { visible } from 'pota/use/intersection'

function Card({ index }) {
  const seen = signal(false)

  return (
    <div
      use:ref={visible(
        entry => entry.isIntersecting && seen.write(true),
      )}
      style={{
        height: '40vh',
        margin: '2rem 0',
        background: () => (seen.read() ? 'mediumseagreen' : '#222'),
        color: 'white',
        display: 'grid',
        'place-items': 'center',
      }}
    >
      card #{index} — {() => (seen.read() ? 'in view' : 'scroll me into view')}
    </div>
  )
}

render(
  <div>
    {[1, 2, 3, 4].map(i => (
      <Card index={i} />
    ))}
  </div>,
)
