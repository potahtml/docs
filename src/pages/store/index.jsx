import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Store">
				Utilities to make and modify reactive objects.
			</Header>

			<Section title="Import">
				<Code
					code={`
import {
	mutable,
	signalify,
	merge,
	replace,
	reset,
} from 'pota/store'
					`}
					render={false}
				/>
			</Section>

			<Section title="API at a glance">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>signature</th>
							<th>returns</th>
							<th>purpose</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>mutable</td>
							<td>(value, clone?)</td>
							<td>proxy of value</td>
							<td>
								deeply reactive proxy — every property (current and
								future) is tracked and mutable
							</td>
						</tr>
						<tr>
							<td>signalify</td>
							<td>(target, keys?)</td>
							<td>target</td>
							<td>
								one-level signalification — replaces the target's
								own properties (or the listed keys) with tracked
								getters/setters
							</td>
						</tr>
						<tr>
							<td>merge</td>
							<td>(target, source, keys?)</td>
							<td>target</td>
							<td>
								merges <mark>source</mark> into <mark>target</mark>,
								preserving existing references
							</td>
						</tr>
						<tr>
							<td>replace</td>
							<td>(target, source, keys?)</td>
							<td>target</td>
							<td>
								like <mark>merge</mark>, but also removes keys from{' '}
								<mark>target</mark> that are absent from{' '}
								<mark>source</mark>
							</td>
						</tr>
						<tr>
							<td>reset</td>
							<td>(target, source)</td>
							<td>target</td>
							<td>
								overwrites the keys of <mark>target</mark> that
								appear in <mark>source</mark> with the values from{' '}
								<mark>source</mark>
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					All five utilities mutate <mark>target</mark> in place and
					return it for convenience; the returned reference{' '}
					<em>is</em> the same object you passed in.
				</p>
			</Section>

			<Section title="mutable">
				<p>
					Wraps <mark>value</mark> in a proxy that turns every
					property into a signal, recursively. Both existing and
					new properties are tracked and mutable. Reads of keys
					that don't exist yet are still tracked — once the key
					is added, readers re-run.
				</p>
				<Code url="/pages/store/mutable.jsx"></Code>
				<p>
					<mark>mutable(obj)</mark> modifies <mark>obj</mark> in
					place so the original reference stays reactive (and
					identity methods like <mark>===</mark> keep working).
					Pass <mark>true</mark> as the second argument to{' '}
					<em>copy</em> the input first, leaving the original
					untouched.
				</p>
				<Code url="/pages/store/mutable-copy.jsx">
					<mark>mutable(obj, true)</mark> makes a copy first, so
					the original object stays unchanged.
				</Code>
			</Section>

			<Section title="signalify">
				<p>
					Like <mark>mutable</mark>, but shallow: only the target's
					own properties become tracked getters/setters. Nested
					objects stay plain objects. Useful for opt-in reactivity
					on a handful of keys without walking the whole tree.
				</p>
				<Code url="/pages/store/signalify.jsx">
					All own properties become reactive.
				</Code>
				<p>
					Pass a <mark>keys</mark> array to signalify only the
					properties you name. The keys don't have to exist yet —
					reads of a missing key are tracked and will re-run once
					the key is assigned.
				</p>
				<Code url="/pages/store/signalify-keys.jsx">
					Only the <mark>lala</mark> property is made reactive.
				</Code>
			</Section>

			<Section title="Reconcile: merge, replace, reset">
				<p>
					Reconciling data can be confusing — there are three APIs
					so each use case stays narrow and explicit. In every
					case, the references to unchanged properties are kept
					intact.
				</p>
				<p>
					All three accept an optional <mark>keys</mark> option
					(third argument on <mark>merge</mark> /{' '}
					<mark>replace</mark>) that tells the reconciler how to
					identify items inside nested arrays. Without it, entries
					are matched by index; with it, they are matched by the
					named key and references to unchanged items are
					preserved across reorderings.
				</p>
			</Section>

			<Section title="merge">
				<p>
					Merges <mark>source</mark> into <mark>target</mark>. Keys
					of <mark>target</mark> that are absent from{' '}
					<mark>source</mark> are left alone.
				</p>
				<Code url="/pages/store/merge.jsx">
					With no <mark>keys</mark> option, nested arrays are
					merged positionally.
				</Code>
				<Code url="/pages/store/merge-keys.jsx">
					Passing{' '}
					<mark>{`{ q: { key: 'id' } }`}</mark> tells{' '}
					<mark>merge</mark> to match entries inside{' '}
					<mark>q</mark> by <mark>id</mark>; unmatched items from{' '}
					<mark>source</mark> are appended.
				</Code>
			</Section>

			<Section title="replace">
				<p>
					Merges <mark>source</mark> into <mark>target</mark> and
					deletes any keys of <mark>target</mark> that aren't in{' '}
					<mark>source</mark>.
				</p>
				<Code url="/pages/store/replace.jsx">
					Same starting data as the <mark>merge</mark> example —
					here everything absent from <mark>source</mark> is
					removed.
				</Code>
				<Code url="/pages/store/replace-keys.jsx">
					With the <mark>keys</mark> option, rows are matched by{' '}
					<mark>id</mark> and references to items that survived
					the replace are preserved.
				</Code>
			</Section>

			<Section title="reset">
				<p>
					Overwrites keys of <mark>target</mark> that appear in{' '}
					<mark>source</mark>. Unlike <mark>replace</mark>, keys
					of <mark>target</mark> not in <mark>source</mark> are
					kept.
				</p>
				<Code url="/pages/store/reset.jsx"></Code>
				<Code url="/pages/store/reset-use-case.jsx">
					Building a mutable from a <mark>defaultState</mark>, then
					resetting part of it back to the defaults. Note the{' '}
					<mark>mutable(defaultState, true)</mark> copy — otherwise
					the mutable proxy would share references with{' '}
					<mark>defaultState</mark>.
				</Code>
			</Section>
		</>
	)
}
