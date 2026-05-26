import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="orientation">
				<mark>pota/use/orientation</mark> exposes the current
				screen orientation as <mark>'horizontal'</mark> or{' '}
				<mark>'vertical'</mark>, derived from{' '}
				<a href="/use/resize">documentSize</a> — so it tracks
				window resizes (including device rotation) without a
				separate listener. Same{' '}
				<a href="/use/emitter">Emitter</a>-pair shape as{' '}
				<a href="/use/fullscreen">fullscreen</a> and{' '}
				<a href="/use/visibility">visibility</a>.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  useOrientation,   // useOrientation() → signal accessor → 'horizontal' | 'vertical'
  onOrientation,    // onOrientation(value => …)
} from 'pota/use/orientation'`}
					render={false}
				/>
			</Section>

			<Section title="Reactive">
				<p>
					<mark>useOrientation()</mark> returns a signal
					accessor. The classification is{' '}
					<mark>width &gt;= height ? 'horizontal' : 'vertical'</mark>{' '}
					— so square viewports report{' '}
					<mark>'horizontal'</mark>.
				</p>
				<Code url="/pages/@use/orientation/snippet.jsx"></Code>
			</Section>

			<Section title="Callback">
				<p>
					<mark>onOrientation(fn)</mark> fires whenever the
					orientation flips. Useful for swapping layouts or
					re-laying-out a canvas. Multiple subscribers share
					the underlying <a href="/use/resize">documentSize</a>{' '}
					listener.
				</p>
				<Code
					code={`import { onOrientation } from 'pota/use/orientation'

onOrientation(o => {
  console.log('now', o)
})`}
					render={false}
				/>
			</Section>
		</>
	)
}
