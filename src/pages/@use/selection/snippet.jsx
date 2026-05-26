import { render } from 'pota'
import { clickSelectsAll } from 'pota/use/selection'

function App() {
  return (
    <div>
      <p>click any snippet to select it all (then ⌘/Ctrl+C):</p>
      <code
        use:ref={clickSelectsAll}
        style={{ display: 'block', padding: '0.5rem', background: '#f4f4f4' }}
      >
        npm install pota
      </code>
      <code
        use:ref={clickSelectsAll}
        style={{ display: 'block', padding: '0.5rem', background: '#f4f4f4', 'margin-top': '0.5rem' }}
      >
        git clone https://github.com/potahtml/pota.git
      </code>
    </div>
  )
}

render(App)
