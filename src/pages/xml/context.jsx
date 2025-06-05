import { render, context } from 'pota'
import { XML } from 'pota/xml'

const xml = XML()

const Context = context({ myValue: 1 })
const Provider = Context.Provider

xml.define({ Provider, ContextValue, Cuatro })

// should display "1 2 3 4 3 2 1"
function ComponentHTML() {
  return xml`
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
  return xml`<Provider value="${{ myValue: 4 }}">
    ${props.children}
  </Provider>`
}

function ContextValue() {
  return Context().myValue
}

render([ComponentHTML, ComponentJSX])
