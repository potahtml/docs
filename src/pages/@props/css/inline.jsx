import { render } from 'pota'
import { css } from 'pota/std'

function App() {
  return (
    <main>
      {css`
        section {
          color: purple;
        }
      `}
      <section>fancy inline in the document</section>
    </main>
  )
}

render(App)
