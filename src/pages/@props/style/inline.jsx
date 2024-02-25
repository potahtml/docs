import { css, render } from 'pota'

function App() {
  return (
    <main>
      <section>test</section>
      {css`
        section {
          color: purple;
        }
      `}
    </main>
  )
}

render(App)
