import { render } from 'pota'
import { A, Route } from 'pota/components'
import { location } from 'pota/use/location'

function UserDetail() {
  const params = location.params
  return (
    <div>
      <h2>user #{() => params.id}</h2>
      <p>open the URL with a different id to see this update</p>
    </div>
  )
}

function Post() {
  const params = location.params
  return <p>post: {() => params.slug}</p>
}

function App() {
  return (
    <div>
      <nav>
        <A href="/users/1">user 1</A>
        {' · '}
        <A href="/users/2">user 2</A>
        {' · '}
        <A href="/users/42/posts/intro">42 / posts / intro</A>
      </nav>

      <Route path="/users">
        <Route path=":id">
          <UserDetail />
          <Route path="posts/:slug">
            <Post />
          </Route>
        </Route>
      </Route>
    </div>
  )
}

render(App)
