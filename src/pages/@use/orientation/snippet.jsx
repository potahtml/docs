import { render } from 'pota'
import { useOrientation } from 'pota/use/orientation'

function App() {
  const orientation = useOrientation()

  return (
    <div>
      <p>
        Current orientation: <strong>{orientation}</strong>
      </p>
      <p>
        <em>resize the window to flip between vertical and horizontal.</em>
      </p>
    </div>
  )
}

render(App)
