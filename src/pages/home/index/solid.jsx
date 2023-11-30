// pota + solid reactivity - counter example

import { render, signal } from 'pota'

function Counter() {
  const [count, setCount] = signal(1)
  const increment = () => setCount(count => count + 1)

  return (
    <label>
      I heard you like to click counters
      <button
        name="button"
        onClick={increment}
      >
        {count}
      </button>
    </label>
  )
}

render(Counter)
