import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'
import { Tag } from '../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Articles ...</Tag>}> </Header>

			<Section title="Entries">
				<p>
					<ol>
						<li>
							<a href="/articles/anatomy-of-a-signals-based-reactive-renderer">
								Anatomy Of A Signals Based Reactive Renderer
							</a>{' '}
							(Jan 29, 2024)
						</li>
					</ol>
				</p>
			</Section>
		</>
	)
}
