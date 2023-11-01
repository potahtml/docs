import { render, template, signal } from 'pota'

function Example(props) {
  const [count, setCount] = signal(0)

  setInterval(() => setCount(count => count + 1), 1_000)

  const add10 = template`<button>add 10</button>`
  add10.onclick = () => setCount(count => count + 10)

  return template`<div>
        Hello ${props.name},
        The count is: ${count}!<br/>
        <i>No need to click buttons!</i><br/>
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
