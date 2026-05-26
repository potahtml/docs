import {
  addListeners,
  location,
  navigate,
} from 'pota/use/location'
import { render } from 'pota'

addListeners()

function App() {
  return (
    <div>
      <p>path: {location.pathname}</p>
      <p>hash: {location.hash}</p>
      <button on:click={() => navigate('/about')}>
        go to /about
      </button>
      <button on:click={() => navigate('/users/42')}>
        go to /users/42
      </button>
    </div>
  )
}

render(App)
