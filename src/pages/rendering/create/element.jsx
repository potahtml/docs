import { render, create } from 'pota'

function App() {
  const div = document.createElement('div')
  div.textContent = 'a native element'

  const Component = create(div)

  return (
    <main>
      <Component />
      <Component style:color="aqua" />
    </main>
  )
}

render(App)
