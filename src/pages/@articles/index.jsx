import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'
import { Tag } from '../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Articles ...</Tag>}> </Header>

			<Section title="Entries">
				<ol>
					<li>
						<a href="/Articles/anatomy-of-a-signals-based-reactive-renderer">
							Anatomy Of A Signals Based Reactive Renderer
						</a>{' '}
						- Implementing from scratch the core parts of a signals
						based reactive web renderer: rendering, placeholders, node
						creation and node disposal. (Jan 29, 2024)
					</li>
				</ol>
			</Section>
		</>
	)
}
