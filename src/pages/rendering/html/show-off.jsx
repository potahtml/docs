import { render, signal, html, Show } from 'pota'

function Component() {
  const [show, setShow] = signal(false)
  const [show2, setShow2] = signal(false)
  const [show3, setShow3] = signal(0)

  setInterval(() => setShow(value => !value), 4000)
  setInterval(() => setShow2(value => !value), 2000)
  setInterval(() => setShow3(value => value + 1), 200)

  html.register({ Show })

  return [
    // displays `asd`
    html` <Show when="${() => !show()}">
      <p>asd</p>
    </Show>`,

    // first `true`, callback on attribute
    html`<Show
      when="${show}"
      children="${value => value}"
    />`,

    // second `true`, callback as a child
    html`<Show when="${show}">${value => value}</Show>`,

    // third `true quack false`, multiple callbacks as child
    html`<Show when="${show}"
      >${[value => value, ' quack ', value => !value]}</Show
    >`,
  ]
}

render(Component)
