import { render } from 'pota'

function App() {
  return <main>Hello World</main>
}

render(App)

render(
  <span>The content of the container has been replaced</span>,
  document.querySelector('main'),
  {
    clear: true,
  },
)
