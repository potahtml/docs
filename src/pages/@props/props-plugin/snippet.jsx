import { addEvent, propsPlugin, propsPluginNS, render } from 'pota'

// when `clickoutside` is found on an element

propsPlugin('plugin:clickoutside', (node, propValue) => {
  // node = the element
  // propValue = fn
  addEvent(document, 'pointerdown', event => {
    if (!node.contains(event.target)) {
      propValue(event, node)
    }
  })
})

propsPluginNS('myFancy', (node, localName, propValue, ns) => {
  // node = the element
  // localName = 'click'
  // propValue = fn
  // ns = 'myFancy'

  addEvent(node, localName, propValue)
})

// using our newly defined prop. It can be used anywhere

function App() {
  return (
    <span
      plugin:clickoutside={event =>
        render(<div>you clicked outside!</div>)
      }
      myFancy:click={event =>
        render(<div>this click is very fancy!</div>)
      }
    >
      clicking outside this span will run the custom prop
    </span>
  )
}

render(App)
