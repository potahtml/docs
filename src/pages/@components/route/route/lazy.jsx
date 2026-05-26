import { render } from 'pota'
import { A, Route, load } from 'pota/components'

const Settings = load(() => import('./pages/Settings.js'))
const Reports = load(() => import('./pages/Reports.js'))

function App() {
  return (
    <div>
      <nav>
        <A href="/settings">settings</A>
        {' · '}
        <A href="/reports">reports</A>
      </nav>

      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/reports">
        <Reports />
      </Route>
    </div>
  )
}

render(App)
