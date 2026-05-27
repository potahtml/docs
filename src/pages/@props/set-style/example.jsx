import { ref, render, setStyle, signal } from 'pota'

function App() {
  const dot = ref()
  const x = signal(0)
  const y = signal(0)

  return (
    <div
      on:mousemove={e => {
        x.write(e.clientX)
        y.write(e.clientY)
      }}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
      }}
    >
      <span
        use:ref={dot}
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          background: 'red',
          'border-radius': '50%',
        }}
      />
      {() => {
        setStyle(dot(), 'left', `${x.read()}px`)
        setStyle(dot(), 'top', `${y.read()}px`)
      }}
    </div>
  )
}

render(App)
