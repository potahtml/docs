import { render, signal } from 'pota'
import { html } from 'pota/html'

function Counter() {
  const [show, setShow, updateShow] = signal(false)
  const [show2, setShow2, updateShow2] = signal(false)
  const [show3, setShow3, updateShow3] = signal(0)

  setInterval(() => updateShow(value => !value), 4000)
  setInterval(() => updateShow2(value => !value), 2000)
  setInterval(() => updateShow3(value => value + 1), 100)

  return [
    // displays `asd`
    html`
      0
      <Show when="${show}">
        1
        <Show when="${show2}">
          2
          <p>3</p>
          4
          <b><Show when="${show3}">${value => value}</Show></b>
        </Show>
        5 ${Date.now()} ${() => Date.now()}
      </Show>
      6
    `,
  ]
}

render(Counter)
