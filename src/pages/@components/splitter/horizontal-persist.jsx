import { render } from 'pota'
import { Splitter } from 'pota/components'

function App() {
  return (
    <div
      style={{
        display: 'flex',
        'flex-direction': 'column',
        height: '300px',
        border: '1px solid #aaa',
      }}
    >
      <section
        style={{
          padding: '1rem',
          background: '#e76f51',
          color: 'white',
        }}
      >
        top (drag the handle ↓ — refresh the page to see persistence)
      </section>
      <Splitter
        orientation="horizontal"
        min={50}
        max={250}
        initial={120}
        persist="docs:splitter-demo"
      />
      <section
        style={{
          flex: 1,
          padding: '1rem',
          background: '#f4a261',
        }}
      >
        bottom
      </section>
    </div>
  )
}

render(App)
