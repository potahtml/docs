import { bind, render } from 'pota'

function App() {
  const emailAddress = bind('email@gmail.com')

  return (
    <>
      <input
        name="email"
        bind={emailAddress}
      />{' '}
      email: {emailAddress}
    </>
  )
}

render(App)
