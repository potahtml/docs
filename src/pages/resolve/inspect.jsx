import { render, resolve } from 'pota'

function Card(props) {
  const kids = resolve(props.children)

  return (
    <div class="card">
      <header>{() => `(${kids().length} children)`}</header>
      <div>{kids}</div>
    </div>
  )
}

function App() {
  return (
    <Card>
      <p>one</p>
      <p>two</p>
    </Card>
  )
}

render(App)
