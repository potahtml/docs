import { Router, load } from 'pota/web'

function App() {
  return (
    <main>
      <Router path="/docs/">
        <Router>
          this will render only when the location is exactly "/docs/"
        </Router>
        <Router path=":page">
          <h1>Docs</h1>
        </Router>
        <Router.Default>Oops! page not found on docs/</Router.Default>
      </Router>

      <Router path="/blog/">
        <Router path=":page">
          <h1>Blog</h1>
        </Router>
        <Router.Default>Oops! page not found on blog/</Router.Default>
      </Router>

      <Router
        path="/contact/"
        children={load(() => import('/contact.jsx'))}
      />

      <Router.Default>
        Oops! You arent in docs/ nor blog/
      </Router.Default>
    </main>
  )
}
