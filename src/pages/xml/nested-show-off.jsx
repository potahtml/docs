import { render, signal } from 'pota'
import { xml } from 'pota/xml'

function Counter() {
  const show = signal(false)
  const show2 = signal(false)
  const show3 = signal(0)

  setInterval(() => show.update(value => !value), 4000)
  setInterval(() => show2.update(value => !value), 2000)
  setInterval(() => show3.update(value => value + 1), 100)

  return [
    // displays `asd`
    xml`
      0
      <Show when="${show.read}">
        1
        <Show when="${show2.read}">
          2
          <p>3</p>
          4
          <b><Show when="${show3.read}">${value => value}</Show></b>
        </Show>
        5 ${Date.now()} ${() => Date.now()}
      </Show>
      6
    `,
  ]
}

render(Counter)
