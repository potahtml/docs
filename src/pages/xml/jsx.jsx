import { render, signal } from 'pota'
import { xml } from 'pota/xml'

function Example(props) {
  const [count, setCount, updateCount] = signal(0)

  setInterval(() => updateCount(count => count + 1), 1_000)

  const add10 = xml`<button
    on:click="${() => updateCount(count => count + 10)}"
    name="button"
  >
    add 10
  </button>`

  return xml`<div>
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
