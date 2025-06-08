import { render } from 'pota'

function App() {
  return (
    <main>
      <section use:css="class:hover{color:red}">
        fancy css in attribute
      </section>
    </main>
  )
}

render(App)
