import { render } from 'pota'
import { html } from 'pota/html'

customElements.define(
  'some-test',
  class extends HTMLElement {
    constructor() {
      super()
      render('construct!')
    }
  },
)

render('before')

const element = html`
  <some-test>${2 + 2}</some-test>
  <some-test>${2 + 6}</some-test>
`
render('after')

render(element)
