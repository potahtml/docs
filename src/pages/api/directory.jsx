import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="Directory">
				Sometimes we have to use some niche stuff, specially when
				creating some complicated components that require some fancy
				functions
			</Header>
			<Section title="Hooks">
				<p>
					<Code
						code="
						import {
							selector
						} from 'pota/hooks'"
						render={false}
					/>
				</p>
				<ol>
					<li>
						<a href="/api/directory/hooks/selector">selector</a> -
						Most performant way to have an <mark>isSelected</mark>{' '}
						signal.
					</li>
				</ol>
			</Section>
			<Section title="Lib">
				<p>
					<Code
						code="
						import {
							makeCallback, isReactive, getValue, optional, removeFromArray
						} from 'pota/lib'"
						render={false}
					/>
				</p>

				<ol>
					<li>
						<mark>makeCallback(props.children)</mark> - Makes of each
						children of <mark>props.children</mark> a function. Avoids
						tracking on functions(uses untrack), and allows tracking
						on signals.
					</li>
					<li>
						<mark>isReactive(value)</mark> - Returns true when the
						value is reactive. A memo or a signal.
					</li>
					<li>
						<mark>getValue(value)</mark> - If value is a function it
						will unwrap it recursively.
					</li>
					<li>
						<mark>optional(value)</mark> - returns <mark>true</mark>{' '}
						if value is <mark>undefined</mark> or else it will unwrap
						the value and return that. This is handy for optional
						arguments that come from objects.
					</li>
					<li>
						<mark>removeFromArray(array, value)</mark> - Removes a
						value from an array.
					</li>
				</ol>
			</Section>
			<Section title="Props Plugins">
				<p>
					Currently, the library doesnt provide any prop plugin, but
					you can check <a href="/props/propsPlugin">on this page</a>{' '}
					how easy is to make one.
				</p>
			</Section>
		</>
	)
}
