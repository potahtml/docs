import { render } from 'pota'
import { HTML } from 'pota/html'

const html = HTML()

function Component() {
  return html`
    <test-test
      attr:example-attr-1="${1}"
      attr:example-attr-true="${true}"
      attr:example-attr-false="${false}"
      prop:example-prop-2="${2}"
      prop:example-prop-2-true="${true}"
      prop:example-prop-2-false="${false}"
      booleantrue="${true}"
      booleanfalse="${false}"
      dash-boolean-true="${true}"
      dash-boolean-false="${false}"
      string="${'hola'}"
      bool:booltruetest="${true}"
      bool:boolfalsetest="${false}"
    >
      attributes/props test
    </test-test>
  `
}

render(Component)
