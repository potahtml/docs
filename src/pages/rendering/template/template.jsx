import { render, template, signal } from 'pota'

function Example() {
  const [count, setCount] = signal(0)

  setInterval(() => setCount(count => count + 1), 1_000)

  const add10 = template`<button name="button">add 10</button>`
  add10.onclick = () => setCount(count => count + 10)

  function thisworks() {
    render('you clicked!')
  }
  function hellyeah() {
    render('you left!')
  }

  return template`<div>
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
