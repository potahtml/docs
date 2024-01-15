import { render, signal, memo, html, ref, effect } from 'pota'

function Component() {
  const element = ref()
  effect(() => {
    console.log('element is', element())
  })

  return html`
    <test-test
      attr:example-attr="${1}"
      prop:example-prop="${2}"
      boolean="${true}"
      dash-boolean="${true}"
      string="${'hola'}"
      ref="${element}"
    >
      attributes/props test
    </test-test>
  `
}

render(Component)
