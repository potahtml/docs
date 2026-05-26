import { ref, render } from 'pota'
import { fullscreen, useFullscreen } from 'pota/use/fullscreen'

function App() {
  const stage = ref()
  const current = useFullscreen()

  return (
    <div>
      <button use:ref={fullscreen(() => stage())}>
        toggle fullscreen
      </button>
      <div
        use:ref={stage}
        style={{
          background: 'rebeccapurple',
          color: 'white',
          padding: '2rem',
        }}
      >
        stage — fullscreen target
      </div>
      <p>currently fullscreen: {() => (current() ? 'yes' : 'no')}</p>
    </div>
  )
}

render(App)
