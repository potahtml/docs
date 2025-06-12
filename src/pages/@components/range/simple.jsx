import { render } from 'pota'
import { Range } from 'pota/components'

function Example() {
  return (
    <main>
      <Range
        start={0}
        stop={10}
        step={2}
      >
        {item => <div>item: {item}</div>}
        {item => <div>double the item: {item * 2}</div>}
      </Range>
    </main>
  )
}

render(Example)
