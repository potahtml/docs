export default `

import { render, signal, memo, effect } from 'pota'
import { html } from 'pota/html'

function Counter() {
  const [count, setCount, updateCount] = signal(1)

  const double = memo(() => count() * 2)
  const increment = () => updateCount(count => count + 1)

  // jsx
  const jsx = (
    <button onClick={increment}>
      jsx {count} / {double}
    </button>
  )

  // vanilla
  const vanilla = document.createElement('button')
  effect(() => {
    vanilla.textContent = 'vanilla '
    vanilla.textContent += count() + ' / ' + double()
  })
  vanilla.onclick = increment

  // html
  const htm = html\`<button onclick="\${increment}">
     html \${count} / \${double}
    </button>\`

  return [jsx, vanilla, htm]
}

render(Counter)


`
