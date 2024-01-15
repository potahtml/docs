import { render, html } from 'pota'

function Component() {
  function SomeComponent(props) {
    return html`<div>-${props.children}-</div>`
  }

  html.register({ SomeComponent })

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
