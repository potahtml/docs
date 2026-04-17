import { context, render } from 'pota'

export default function App() {
  const Theme = context('light')
  return (
    <Theme.Provider value="dark">
      <p>{Theme()}</p>
    </Theme.Provider>
  )
}
