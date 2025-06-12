import { render } from 'pota'
import { css } from 'pota/use/css'

function App() {
  return (
    <main>
      {css`
        section:hover {
          color: blue;
        }
      `}
      <section>fancy inline in the document</section>
    </main>
  )
}

render(App)
