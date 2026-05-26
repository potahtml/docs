import { render } from 'pota'
import { A, Route } from 'pota/components'

function App() {
  return (
    <div>
      <nav>
        <A href="/">home</A>
        {' · '}
        <A href="/users/:id" params={{ id: '7' }}>
          user 7
        </A>
        {' · '}
        <A href="/about" replace>
          about (replace)
        </A>
      </nav>

      <Route path="/users/:id">
        <p>user page</p>
      </Route>
    </div>
  )
}

render(App)
