import { ref, render } from 'pota'
import { onElementSize, useElementSize } from 'pota/use/resize'

function App() {
  const node = ref()

  return (
    <div
      use:ref={[
        node,
        n => {
          const size = useElementSize(n)
          // signal accessor — re-runs effects on each resize
          console.log('current size signal:', size)

          onElementSize(n, entry => {
            console.log(
              'resize callback',
              entry.contentRect.width,
              entry.contentRect.height,
            )
          })
        },
      ]}
      style={{
        resize: 'both',
        overflow: 'auto',
        width: '200px',
        height: '120px',
        padding: '1rem',
        border: '1px solid #aaa',
      }}
    >
      resize me — watch the console
    </div>
  )
}

render(App)
