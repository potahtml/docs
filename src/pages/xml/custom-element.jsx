import { render } from 'pota'
import { xml } from 'pota/xml'

const FancyCustomBold = props => {
  return xml`<b>
    ${props.children} ${props.test.filter(item => item % 2 === 0)}
  </b>`
}

xml.define({ FancyCustomBold })

function Fun() {
  const name = 'Test'
  return xml`
    <div>
      <FancyCustomBold test="${[1, 2, 3]}">
        is this bold?
        <FancyCustomBold test="${[1, 2, 3]}">
          is this bold?
          <FancyCustomBold test="${[1, 2, 3]}">
            is this bold?
          </FancyCustomBold>
        </FancyCustomBold>
      </FancyCustomBold>
      <u>${name}</u>
    </div>
  `
}

render(Fun)
