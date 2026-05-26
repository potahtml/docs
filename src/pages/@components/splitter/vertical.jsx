import { render } from 'pota'
import { Splitter } from 'pota/components'

function App() {
  return (
    <div
      style={{
        display: 'flex',
        height: '200px',
        border: '1px solid #aaa',
      }}
    >
      <aside
        style={{
          width: '200px',
          padding: '1rem',
          background: '#2a9d8f',
          color: 'white',
        }}
      >
        sidebar (drag the handle →)
      </aside>
      <Splitter min={100} max={400} initial={200} />
      <main
        style={{
          flex: 1,
          padding: '1rem',
          background: '#264653',
          color: 'white',
        }}
      >
        content
      </main>
    </div>
  )
}

render(App)
