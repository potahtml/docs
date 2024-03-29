import { render, context } from 'pota'
import { HTML } from 'pota/html'

const html = HTML()

const Context = context({ myValue: 1 })
const Provider = Context.Provider

html.define({ Provider, ContextValue, Cuatro })

// should display "1 2 3 4 3 2 1"
function ComponentHTML() {
  return html`
    HTML:
    <ContextValue />
    <Provider value="${{ myValue: 2 }}">
      <ContextValue />
      <Provider value="${{ myValue: 3 }}">
        <ContextValue />
        <Cuatro>
          <ContextValue />
        </Cuatro>
        <ContextValue />
      </Provider>
      <ContextValue />
    </Provider>
    <ContextValue />
    <hr />
  `
}

// should display "123 4 321"
function ComponentJSX() {
  return (
    <>
      JSX: <ContextValue />
      <Provider value={{ myValue: 2 }}>
        <ContextValue />
        <Provider value={{ myValue: 3 }}>
          <ContextValue />
          <Cuatro>
            <ContextValue />
          </Cuatro>
          <ContextValue />
        </Provider>
        <ContextValue />
      </Provider>
      <ContextValue />
    </>
  )
}

function Cuatro(props) {
  return html`<Provider value="${{ myValue: 4 }}">
    ${props.children}
  </Provider>`
}

function ContextValue() {
  return Context().myValue
}

render([ComponentHTML, ComponentJSX])
