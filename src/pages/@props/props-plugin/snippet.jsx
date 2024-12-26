import { addEvent, propsPlugin, propsPluginNS, render } from 'pota'

// when `clickOutside` is found on an element

propsPlugin('clickOutside', (node, propName, propValue, props) => {
  // node = the element
  // propName = 'clickOutside'
  // propValue = fn
  // props = props object
  addEvent(document, 'pointerdown', event => {
    if (!node.contains(event.target)) {
      propValue(event, node)
    }
  })
})

propsPluginNS(
  'myFancy',
  (node, propName, propValue, props, localName, ns) => {
    // node = the element
    // propName = 'myFancy:click'
    // propValue = fn
    // props = props object
    // localName = 'click'
    // ns = 'myFancy'

    addEvent(node, localName, propValue)
  },
)

// using our newly defined prop. It can be used anywhere

function App() {
  return (
    <span
      clickOutside={event => render(<div>you clicked outside!</div>)}
      myFancy:click={event =>
        render(<div>this click is very fancy!</div>)
      }
    >
      clicking outside this span will run the custom prop
    </span>
  )
}

render(App)
