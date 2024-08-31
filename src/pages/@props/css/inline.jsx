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
      <section>test inlining a stylesheet in the document</section>

      <section css="class{color:green} class:hover{color:red}">
        fancy css inline for a specific element
      </section>
    </main>
  )
}

render(App)
