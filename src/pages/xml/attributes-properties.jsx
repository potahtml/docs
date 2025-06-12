import { render } from 'pota'
import { xml } from 'pota/xml'

function Component() {
  return xml`
    <test-test
      example-attr-1="${1}"
      example-attr-true="${true}"
      example-attr-false="${false}"
      prop:example-prop-2="${2}"
      prop:example-prop-2-true="${true}"
      prop:example-prop-2-false="${false}"
      booleantrue="${true}"
      booleanfalse="${false}"
      dash-boolean-true="${true}"
      dash-boolean-false="${false}"
      string="${'hola'}"
      booltruetest="${true}"
      boolfalsetest="${false}"
    >
      attributes/props test
    </test-test>
  `
}

render(Component)
