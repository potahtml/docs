import { render } from 'pota'
import { html } from 'pota/html'

const FancyCustomBold = props => {
  return html`<b>
    ${props.children} ${props.test.filter(item => item % 2 === 0)}
  </b>`
}

html.define({ FancyCustomBold })

function Fun() {
  const name = 'Test'
  return html`
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
