import { render, signal } from 'pota'
import { draggable } from 'pota/use/drag'

function App() {
  const pos = signal({ x: 40, y: 40 })
  let committed = { x: 40, y: 40 }

  return (
    <div
      use:ref={draggable({
        onMove(info) {
          pos.write({
            x: committed.x + info.dx,
            y: committed.y + info.dy,
          })
        },
        onEnd() {
          committed = pos.read()
        },
      })}
      style={() => ({
        position: 'absolute',
        left: pos.read().x + 'px',
        top: pos.read().y + 'px',
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
