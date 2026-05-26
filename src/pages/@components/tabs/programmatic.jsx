import { render } from 'pota'
import { Tabs } from 'pota/components'

function App() {
  return (
    <Tabs selected={1}>
      <Tabs.Labels>
        <Tabs.Label name="overview">overview</Tabs.Label>
        <Tabs.Label name="editor" selected>
          editor
        </Tabs.Label>
        <Tabs.Label name="preview">preview</Tabs.Label>
      </Tabs.Labels>
      <Tabs.Panels>
        <Tabs.Panel>
          <p>read-only summary</p>
        </Tabs.Panel>
        <Tabs.Panel collapse>
          <textarea>draft preserved when hidden</textarea>
        </Tabs.Panel>
        <Tabs.Panel collapse>
          <iframe
            src="about:blank"
            style="width:100%;height:200px"
          />
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  )
}

render(App)
