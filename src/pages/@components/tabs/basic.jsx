import { render } from 'pota'
import { Tabs } from 'pota/components'

function App() {
  return (
    <Tabs>
      <Tabs.Labels>
        <Tabs.Label>profile</Tabs.Label>
        <Tabs.Label>settings</Tabs.Label>
        <Tabs.Label>billing</Tabs.Label>
      </Tabs.Labels>
      <Tabs.Panels>
        <Tabs.Panel>
          <p>your profile</p>
        </Tabs.Panel>
        <Tabs.Panel>
          <p>preferences and account</p>
        </Tabs.Panel>
        <Tabs.Panel>
          <p>plan and invoices</p>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  )
}

render(App)
