import { render } from 'pota'
import { HTML } from 'pota/html'

const html = HTML()

function Component() {
  function SomeComponent(props) {
    return html`<div>-${props.children}-</div>`
  }

  html.define({ SomeComponent })

  const foo = 1
  const bar = 2

  return html`
    <SomeComponent>
      <div foo="${foo}">
        ${foo}
        <p bar="${bar}">${bar}</p>
      </div>
    </SomeComponent>
  `
}

render(Component)
