import { Fragment, render } from 'pota'

function Header() {
  return (
    <Fragment>
      <h1>title</h1>
      <p>subtitle</p>
    </Fragment>
  )
}

function App() {
  return (
    <>
      <Header />
      <main>body content</main>
    </>
  )
}

render(App)
