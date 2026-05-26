import { batch, render } from 'pota'
import { mutable } from 'pota/store'

const account = mutable({ debit: 100, credit: 0 })

function transfer(amount) {
  batch(() => {
    account.debit -= amount
    account.credit += amount
  })
}

function App() {
  return (
    <div>
      <p>debit: {() => account.debit}</p>
      <p>credit: {() => account.credit}</p>
      <button on:click={() => transfer(25)}>move 25</button>
    </div>
  )
}

render(App)
