import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="color">
				<mark>pota/use/color</mark> bundles a small palette of
				color helpers: a wrapper over the browser{' '}
				<mark>EyeDropper</mark> API, a perceptually-uniform
				gradient generator, APCA-based readability helpers,
				validation, and a passthrough of the popular{' '}
				<mark>color-bits</mark> string helpers (
				<mark>alpha</mark>, <mark>blend</mark>,{' '}
				<mark>darken</mark>, <mark>lighten</mark>,{' '}
				<mark>getLuminance</mark>).
			</Header>

			<Section title="eyeDropper(cb)">
				<p>
					Opens the browser{' '}
					<a href="https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper">
						EyeDropper
					</a>{' '}
					API and calls <mark>cb(hex)</mark> with the picked
					sRGB color. Logs an error and returns when the
					browser doesn't support it. User-cancel rejections
					are swallowed.
				</p>
				<Code
					code={`import { eyeDropper } from 'pota/use/color'

eyeDropper(hex => console.log('picked', hex))`}
					render={false}
				/>
			</Section>

			<Section title="scale(colors, count?)">
				<p>
					Returns an array of <mark>count</mark> (default{' '}
					<mark>10</mark>) CSS{' '}
					<mark>oklab(L a b / alpha)</mark> strings that walk
					through every stop in <mark>colors</mark>,
					interpolated in OkLab space for perceptually-uniform
					gradients. Pass any CSS color string the{' '}
					<mark>color-bits</mark> parser accepts.
				</p>
				<Code
					code={`import { scale } from 'pota/use/color'

const ramp = scale(['#ff0080', '#00ffd5'], 16)`}
					render={false}
				/>
			</Section>

			<Section title="textColor / textColorWhenBackgroundIs*">
				<p>
					APCA-based contrast helpers.{' '}
					<mark>textColor(color)</mark> returns{' '}
					<mark>'white'</mark> or <mark>'black'</mark> —
					whichever reads better on top of{' '}
					<mark>color</mark>.{' '}
					<mark>textColorWhenBackgroundIsBlack(color)</mark>{' '}
					and <mark>textColorWhenBackgroundIsWhite(color)</mark>{' '}
					iteratively lighten / darken the input color until it
					reaches APCA Lc ≥ 60 on the chosen background (20-step
					cap), returning the adjusted hex string.
				</p>
				<Code
					code={`import {
  textColor,
  textColorWhenBackgroundIsWhite,
} from 'pota/use/color'

textColor('#ffcc00')                       // 'black'
textColorWhenBackgroundIsWhite('#ffcc00')  // darker hex`}
					render={false}
				/>
			</Section>

			<Section title="validateColor(string)">
				<p>
					Returns the original string if it parses as a color,
					otherwise <mark>undefined</mark>. Doesn't throw.
				</p>
			</Section>

			<Section title="Re-exports from color-bits/string">
				<p>
					<mark>alpha</mark>, <mark>blend</mark>,{' '}
					<mark>darken</mark>, <mark>lighten</mark>,{' '}
					<mark>getLuminance</mark> are re-exported from{' '}
					<a href="https://github.com/romgrk/color-bits">
						color-bits
					</a>{' '}
					so callers don't need to install it directly. See
					that package's docs for full signatures.
				</p>
			</Section>
		</>
	)
}
