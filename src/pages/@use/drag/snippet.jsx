import { render, signal } from 'pota'
import { draggable } from 'pota/use/drag'

function App() {
  const [pos, setPos] = signal({ x: 40, y: 40 })
  let committed = { x: 40, y: 40 }

  return (
    <div
      use:ref={draggable({
        onMove(info) {
          setPos({
            x: committed.x + info.dx,
            y: committed.y + info.dy,
          })
        },
        onEnd() {
          committed = pos()
        },
      })}
      style={() => ({
        position: 'absolute',
        left: pos().x + 'px',
        top: pos().y + 'px',
        width: '120px',
        height: '120px',
        background: 'rebeccapurple',
        color: 'white',
        'border-radius': '8px',
        display: 'grid',
        'place-items': 'center',
        cursor: 'grab',
        'user-select': 'none',
        'touch-action': 'none',
      })}
    >
      drag me
    </div>
  )
}

render(App)
