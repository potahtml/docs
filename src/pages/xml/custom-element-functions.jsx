import { render } from 'pota'
import { XML } from 'pota/xml'

const xml = XML()

function Component() {
  function SomeComponent(props) {
    return xml`<div>-${props.children}-</div>`
  }

  xml.define({ SomeComponent })

  const foo = 1
  const bar = 2

  return xml`
    <SomeComponent>
      <div foo="${foo}">
        ${foo}
        <p bar="${bar}">${bar}</p>
      </div>
    </SomeComponent>
  `
}

render(Component)
