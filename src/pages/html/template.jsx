import { render, signal } from 'pota'
import { html } from 'pota/html'

function Example() {
  const [count, setCount, updateCount] = signal(0)

  setInterval(() => updateCount(count => count + 1), 1_000)

  const add10 = html`<button
    on:click="${() => updateCount(count => count + 10)}"
    name="button"
  >
    add 10
  </button>`

  function thisworks() {
    render('you clicked!')
  }
  function hellyeah() {
    render('you left!')
  }

  return html`<div>
    Hello, The count is: ${count}!<br />
    <i
      on:click="${thisworks}"
      on:mouseout="${hellyeah}"
      >No need to click buttons!</i
    ><br />
    ok, I know you like it ${add10}
  </div>`
}

render(Example)
