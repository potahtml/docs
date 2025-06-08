import { css, render } from 'pota'

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
