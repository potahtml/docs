import { render } from 'pota'

function App() {
  return (
    <main>
      <textarea value="testing">content</textarea>

      <hr />
      <textarea prop:value="testing prop:">content</textarea>
    </main>
  )
}

render(App)
