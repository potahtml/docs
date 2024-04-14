import { render, signal } from 'pota'
import { HTML } from 'pota/html'

const html = HTML()

function Example(props) {
  const [count, setCount, updateCount] = signal(0)

  setInterval(() => updateCount(count => count + 1), 1_000)

  const add10 = html`<button
    onclick="${() => updateCount(count => count + 10)}"
    name="button"
  >
    add 10
  </button>`

  return html`<div>
    Hello ${props.name}, The count is: ${count}!<br />
    <i>No need to click buttons!</i><br />
    ok, have one ${add10}
  </div>`
}

function App() {
  return (
    <main>
      <Example name="Kilo" />
    </main>
  )
}
render(App)
