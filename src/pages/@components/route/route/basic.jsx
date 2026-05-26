import { render } from 'pota'
import { A, Route } from 'pota/components'

function App() {
  return (
    <div>
      <nav>
        <A href="/">home</A>
        {' · '}
        <A href="/about">about</A>
        {' · '}
        <A href="/users/42">user 42</A>
      </nav>

      <Route path="/">
        <h2>welcome</h2>
      </Route>
      <Route path="/about">
        <h2>about us</h2>
      </Route>
      <Route path="/users/:id">
        <h2>user profile</h2>
        <p>(open the URL — :id is captured)</p>
      </Route>
    </div>
  )
}

render(App)
