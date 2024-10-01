import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Stores">
				Utilities to make and modify reactive objects
			</Header>

			<Section title="Snippet">
				<Code
					code={`
						import {
							mutable,
							signalify,
						} from 'pota/store'
					`}
					render={false}
				></Code>
			</Section>

			<Section title="mutable">
				<p>
					<mark>mutable</mark> replaces all object properties with
					setters and getters, returning a proxy, making both existing
					and new properties trackable and mutable. This process
					occurs recursively.
				</p>
				<Code url="/pages/store/mutable.jsx"></Code>
				<Code url="/pages/store/mutable-copy.jsx">
					<mark>mutable</mark> will mutate the object passed to it to
					keep references and make identity methods work. To disable
					mutating the original object you can pass <mark>true</mark>
				</Code>
			</Section>

			<Section title="signalify">
				<p>
					<mark>signalify</mark> is similar to <mark>mutable</mark>{' '}
					but only applies to the first level of an object. It's
					lightweight and allows you to selectively choose which
					properties of the object to track or mutate. This process
					doesn't happen recursively.
				</p>

				<Code url="/pages/store/signalify.jsx"></Code>
			</Section>

			<Section title="Reconcile">
				<Code
					code={`
						import {
							merge,
							replace,
							reset,
						} from 'pota/store'
					`}
					render={false}
				></Code>
				<p>
					Reconciling data can be very confusing. There are three APIs
					to separate the use cases and make the process as clear and
					simple as possible. In all cases, the references to the
					properties are kept.
				</p>
			</Section>

			<Section title="merge">
				<p>Merges `source` into `target`</p>
				<Code url="/pages/store/merge.jsx">
					As keys for the array were not provided, it merged with the
					keys it had
				</Code>
				<Code url="/pages/store/merge-keys.jsx">
					Merge using keys appends the data when the key is not found
				</Code>
			</Section>
			<Section title="replace">
				<p>
					Merges `source` into `target` and removes from `target` keys
					not present in `source`
				</p>
				<Code url="/pages/store/replace.jsx">
					Same example as before, but everything was replaced.
				</Code>
				<Code url="/pages/store/replace-keys.jsx"></Code>
			</Section>
			<Section title="reset">
				<p>Resets from `target` whats defined in `source`</p>
				<Code url="/pages/store/reset.jsx"></Code>
			</Section>
		</>
	)
}
