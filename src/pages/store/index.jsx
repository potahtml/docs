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
					<mark>mutable</mark> modifies the object passed to it,
					preserving references and ensuring identity methods function
					as expected. To prevent changes to the original object, you
					can pass <mark>true</mark> to make a copy before making it
					mutable
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

				<Code url="/pages/store/signalify.jsx">
					All already defined properties become reactive
				</Code>
				<Code url="/pages/store/signalify-keys.jsx">
					Only `lala` property becomes reactive
				</Code>
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
				<p>
					Resets from `target` whats defined in `source`. See this{' '}
					<a href="/playground#H4sIAE1T/GYAA4VTwW7bMAz9Fa6X2IOhdDsasYdi2GXDNqDZbdlBseREqCwZEl2sM/zvo6Q4aZIWBXyQyMdH8j35RnW9dQgjOGmEdDBB62wHi94iX2zMMd0NyLdaFoTzEs9gS4/WSQJvTGONRxCy5YPGNXKUUMG4MQB767EMBwBtG47KGhZihneEqSpYhLAOIWIKMIBPLwVLWHDDVM+4EDSLZ3rQ/xZFSKuO76Qv4fefeH2QT60j+lME7b3s7KM8BlrrGim+XQGJmBYooeXayxjxSsgtd1/+9px0EiWgG1IGVSe1MkQ6ThtD3yyDP+x/kC57LksR6/MTGO1up+U6daGiLIeqDvRZpGEX/Qnx7sVEpGwH0wSFk1mxIfFFH1K3MfoRzaSJisvtCmCMeTK5OvPyoIzENBOVUbe48LEhmTKrOXdMYx7NYP3g99l3jnvWSKXTyVFb21HFe/hwe5sT7VUdzXLJ5OlpZlcj3PX93NpJHJyBLL2dlVCPUdJ42Q6IhLbms1bNQzWeGTDVv+J1tUyw18tOCk/1fTi/XfJMo6m+E+K6oneyHuMLgK/rnz+YR6fMTrVPs/Bm0LqAj/m0WgbsYb/lvOCsSfqnM1Ikv/kPQwS+GuoDAAA=">
						example
					</a>{' '}
					for when this is useful
				</p>
				<Code url="/pages/store/reset.jsx"></Code>
			</Section>
		</>
	)
}
