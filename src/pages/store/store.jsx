import { store } from 'pota/store'
import { effect, render } from 'pota'

const [user, setUser] = store({
  name: 'ada',
  age: 0,
  role: 'engineer',
})

effect(() => {
  console.log('user is now', user.name, user.age, user.role)
})

function App() {
  return (
    <button
      on:click={() =>
        setUser(u => {
          u.name = 'grace'
          u.age = 30
          u.role = 'rear admiral'
        })
      }
    >
      rename and promote (one effect run)
    </button>
  )
}

render(App)
