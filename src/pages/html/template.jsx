import { render, signal } from 'pota'
import { HTML } from 'pota/html'

const html = HTML()

function Example() {
  const [count, setCount] = signal(0)

  setInterval(() => setCount(count => count + 1), 1_000)

  const add10 = html`<button
    onclick="${() => setCount(count => count + 10)}"
    name="button"
  >
    add 10
  </button>`

  add10.onmousedown = () => render(<div>onmousedown!</div>)

  function thisworks() {
    render('you clicked!')
  }
  function hellyeah() {
    render('you left!')
  }

  return html`<div>
    Hello, The count is: ${count}!<br />
    <i
      onclick="${thisworks}"
      onmouseout="${hellyeah}"
      >No need to click buttons!</i
    ><br />
    ok, I know you like it ${add10}
  </div>`
}

render(Example)
