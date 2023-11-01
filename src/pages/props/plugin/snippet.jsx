import { addEventListener, propsPlugin, render } from 'pota'

// when `onClickOutside` is found on a JSX element
propsPlugin('onClickOutside', (node, propName, propValue, props) => {
  // we add an event listener to the document
  addEventListener(document, 'click', event => {
    // if `node` doesnt contains what you click
    if (!node.contains(event.target)) {
      // then we call the `onClickOutside` callback you defined on the JSX
      propValue(event)
    }
  })
})

// using our newly defined prop
function App() {
  return (
    <span
      onClickOutside={event =>
        render(<div>you clicked outside!</div>)
      }
    >
      clicking outside this span will run the custom prop
    </span>
  )
}

render(App)
