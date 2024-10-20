export default `

import { render, signal, memo } from 'pota'

function Counter() {
  const [count, setCount, updateCount] = signal(1)

  const double = memo(() => count() * 2)
  const increment = () => updateCount(count => count + 1)

  return (
    <button onClick={increment}>
      {count} / {double}
    </button>
  )
}

render(Counter)


`
