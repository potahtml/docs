import { Route, load } from 'pota/router'

function App() {
  return (
    <main>
      <Route path="/docs/">
        <Route>
          this will render only when the location is exactly "/docs/"
        </Route>
        <Route path=":page">
          <h1>Docs</h1>
        </Route>
        <Route.Default>Oops! page not found on docs/</Route.Default>
      </Route>

      <Route path="/blog/">
        <Route path=":page">
          <h1>Blog</h1>
        </Route>
        <Route.Default>Oops! page not found on blog/</Route.Default>
      </Route>

      <Route
        path="/contact/"
        children={load(() => import('/contact.jsx'))}
      />

      <Route.Default>
        Oops! You arent in docs/ nor blog/
      </Route.Default>
    </main>
  )
}
