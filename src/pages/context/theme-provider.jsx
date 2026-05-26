import { context, render } from 'pota'

const Theme = context('light')

function Label() {
  return <p>theme is {Theme()}</p>
}

function App() {
  return (
    <div>
      <Label />
      <Theme.Provider value="dark">
        <Label />
        <Theme.Provider value="contrast">
          <Label />
        </Theme.Provider>
      </Theme.Provider>
    </div>
  )
}

render(App)
