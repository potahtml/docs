import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Component">
				<mark>Component</mark> turns any value into a callable
				factory, useful for creating dynamic or untracked
				components. You can preset props at factory time; calling
				the factory with more props shallow-merges them over the
				presets (<em>later wins, key-by-key</em>). For the JSX
				equivalent see{' '}
				<a href="/Components/Dynamic">&lt;Dynamic/&gt;</a>; for
				class-style components, see{' '}
				<a href="/Classes">Classes</a>.
			</Header>

			<Section title="Component">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>type</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>component</td>
							<td>fn | Element | tagName | object with toString</td>
							<td>
								what to turn into a factory. Strings become
								intrinsic elements (<mark>'div'</mark>); functions
								become user components; Elements are wrapped as-is;
								an object with a <mark>toString</mark> is coerced
								via that method (handy for third-party wrappers).
							</td>
						</tr>
						<tr>
							<td>[props]</td>
							<td>object</td>
							<td>
								preset props. Omitted entirely when you only want
								the factory. When the factory is later called with
								overrides, the two are shallow-merged as{' '}
								<mark>{'{ ...preset, ...override }'}</mark>.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Component with fixed props">
				<p>
					Pre-bake a component's props once, use it like any
					other. With <mark>value</mark> as a tag string and a
					fixed <mark>props</mark> object, you get a
					pre-styled element you can drop into JSX. Without the
					second argument <mark>Component</mark> just wraps{' '}
					<mark>value</mark> so it can be invoked imperatively.
				</p>
				<Code url="/pages/component/fixed-props.jsx"></Code>
			</Section>

			<Section title="Component as a Factory">
				<Code url="/pages/component/element.jsx">
					Component with default props
				</Code>
			</Section>

			<Section title="Component With Props Override">
				<Code url="/pages/component/element-override.jsx">
					Component with default props that change
				</Code>
			</Section>

			<Section title="Component With Empty Props">
				<Code url="/pages/component/factory.jsx">
					<mark>props</mark> argument may be omitted
				</Code>
			</Section>

			<Section title="Fragment">
				<p>
					<mark>&lt;&gt;...&lt;/&gt;</mark> and{' '}
					<mark>&lt;Fragment&gt;...&lt;/Fragment&gt;</mark> both
					group siblings without inserting an extra DOM node.
					Use the explicit form when a tool (e.g. an older lint
					rule) doesn't recognize the shorthand, or when you
					want to pass <mark>Fragment</mark> programmatically.
				</p>
				<Code url="/pages/component/fragment.jsx"></Code>
			</Section>

			<Section title="markComponent">
				<p>
					<mark>markComponent(fn)</mark> flags <mark>fn</mark>{' '}
					as a component — when the renderer sees a marked
					function as a child it invokes it untracked (signals
					read inside don't re-run the parent), which is the
					right semantic for components vs. reactive
					expressions. Hand-roll this when you build a
					component factory that bypasses JSX.
				</p>
				<Code url="/pages/component/mark-component.jsx"></Code>
			</Section>

			<Section title="isComponent">
				<p>
					<mark>isComponent(v)</mark> returns <mark>true</mark>{' '}
					for things tagged via <mark>markComponent</mark>. The
					renderer uses the same check; the helper is exposed
					for component libraries that need to branch on "this
					prop is a renderable" vs "this prop is a getter".
				</p>
				<Code url="/pages/component/is-component.jsx"></Code>
			</Section>

			<Section title="makeCallback">
				<p>
					<mark>makeCallback(children)</mark> returns a function
					that yields the rendered children — calling it again
					re-evaluates them with whatever arguments you pass.
					It's the helper flow components like{' '}
					<mark>Show</mark>, <mark>Switch</mark>, and{' '}
					<mark>For</mark> use to support children that are
					either static JSX or render functions like{' '}
					<mark>{'{(item, index) => …}'}</mark>.
				</p>
				<Code url="/pages/component/make-callback.jsx"></Code>
			</Section>

			<Section title="getValue">
				<p>
					<mark>getValue(v)</mark> calls <mark>v</mark> until
					it's no longer a function, then returns the result. It
					accepts a plain value, a signal reader, a memo
					accessor, or any nested function-of-function. Useful
					when authoring components or plugins that take an{' '}
					<mark>{'Accessor<T>'}</mark> /{' '}
					<mark>{'T | () => T'}</mark> prop and want one shape
					to work with.
				</p>
				<Code
					url="/pages/component/get-value.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
