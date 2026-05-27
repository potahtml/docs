import { render, signal } from 'pota'
import { resize } from 'pota/use/resize'

function App() {
  const size = signal({ width: 0, height: 0 })

  return (
    <div
      use:ref={resize(entry => {
        size.write({
          width: Math.round(entry.contentRect.width),
          height: Math.round(entry.contentRect.height),
        })
      })}
      style={{
        resize: 'both',
        overflow: 'auto',
        width: '300px',
        height: '200px',
        padding: '1rem',
        border: '1px solid #aaa',
      }}
    >
      drag the bottom-right corner to resize. current:{' '}
      <mark>
        {() => size.read().width}×{() => size.read().height}
      </mark>
    </div>
  )
}

render(App)
