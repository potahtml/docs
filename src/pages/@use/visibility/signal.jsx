import { render } from 'pota'
import { useDocumentVisible } from 'pota/use/visibility'

function App() {
  const visible = useDocumentVisible()

  return (
    <p>
      Tab is currently{' '}
      <strong>{() => (visible() ? 'visible' : 'hidden')}</strong>.
      Switch to another tab and back to see the value change.
    </p>
  )
}

render(App)
