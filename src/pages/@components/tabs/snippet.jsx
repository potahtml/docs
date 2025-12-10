import { render } from 'pota'
import { Tabs } from 'pota/components'

function Component() {
  return (
    <Tabs>
      <div>
        {() => `Selected tab is: ${Tabs.selected().read().name}`}
      </div>

      <Tabs.Labels class="nav-tag">
        <Tabs.Label
          name="one"
          class="button-tag"
        >
          one
        </Tabs.Label>
        <Tabs.Label
          name="two"
          class="button-tag"
          selected
        >
          two
        </Tabs.Label>
        <Tabs.Label
          name="three"
          class="button-tag"
          hidden
        >
          three
        </Tabs.Label>
      </Tabs.Labels>
      <Tabs.Panels>
        <Tabs.Panel class="section-tag">one</Tabs.Panel>
        <Tabs.Panel class="section-tag">two</Tabs.Panel>
        <Tabs.Panel class="section-tag">three</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  )
}

render(Component)
