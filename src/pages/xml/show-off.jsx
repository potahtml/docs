import { render, signal } from 'pota'
import { xml } from 'pota/xml'

function Component() {
  const [show, setShow, updateShow] = signal(false)

  setInterval(() => updateShow(value => !value), 4000)

  return [
    // displays `asd`
    xml`0<Show when="${() => !show()}">
        <p>asd</p>
      </Show>`,

    // first `true`, callback on attribute
    xml`1<Show
        when="${show}"
        children="${value => value}"
      />`,

    // second `true`, callback as a child
    xml`2<Show when="${show}">${value => value}</Show>`,

    // third `true quack false`, multiple callbacks as child
    xml`3<Show when="${show}"
        >${[value => value, ' quack ', value => !value]}</Show
      >`,
  ]
}

render(Component)
