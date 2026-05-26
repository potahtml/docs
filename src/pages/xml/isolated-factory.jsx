import { render } from 'pota'
import { XML } from 'pota/xml'

const xml = XML()

xml.define({
  Card: props => xml`
		<section style="border:1px solid #ccc; padding:1rem">
			<h3>${props.title}</h3>
			${props.children}
		</section>
	`,
})

const App = xml`
	<div>
		<Card title="Hello">
			<p>this came from a registered component</p>
		</Card>
		<Card title="World">
			<p>and so did this</p>
		</Card>
	</div>
`

render(App)
