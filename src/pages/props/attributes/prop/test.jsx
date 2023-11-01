import { render } from 'pota'

function App() {
  return (
    <main>
      <textarea prop:value="testing prop:">content</textarea>
      <hr />

      <textarea attr:value="testing attr:">content</textarea>
      <hr />

      <textarea value="testing">content</textarea>
    </main>
  )
}

render(App)
