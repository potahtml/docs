import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

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
							useSelector,
							useTimeout
						} from 'pota/hooks'"
						render={false}
					/>
				</p>

				<ol>
					<li>
						<a href="/hooks/useSelector">useSelector</a> - Most
						performant way to have an <mark>isSelected</mark> signal.
					</li>
					<li>
						<a href="/hooks/useTimeout">useTimeout</a> - For creating
						setTimeouts that autodispose.
					</li>
				</ol>
			</Section>

			<Section title="Props Plugins">
				<p>
					Note: each plugin must be imported separately at least once
					to be registered as a prop to be used on elements globally
				</p>
				<p>
					<Code
						code="

 import 'pota/plugins/autofocus';
 import { bind } from 'pota/plugins/bind';
 import 'pota/plugins/onClickOutside';
 import 'pota/plugins/pasteTextPlain';
 import 'pota/plugins/useClipboard';
 import 'pota/plugins/useFullscreen';

"
						render={false}
					/>
				</p>

				<ol>
					<li>
						<a href="/props/plugins/autofocus">autofocus</a> -
						automatically focus the field
					</li>
					<li>
						<a href="/props/plugins/bind">bind</a> - automatically
						bind the value of a form field to a signal
					</li>
					<li>
						<a href="/props/plugins/onClickOutside">onClickOutside</a>{' '}
						- runs a function when clicking outside the element
					</li>
					<li>
						<a href="/props/plugins/pasteTextPlain">pasteTextPlain</a>{' '}
						- forces pasting as text/plain
					</li>
					<li>
						<a href="/props/plugins/useClipboard">useClipboard</a> -
						allows to copy to clipboard the return value of a
						function, the string set as the prop value or the{' '}
						<mark>innerText</mark> of the element
					</li>
					<li>
						<a href="/props/plugins/useFullscreen">useFullscreen</a> -
						on click it will fullscreen the element
					</li>
				</ol>
			</Section>

			<Section title="Animations">
				<p>
					<Code
						code="
						import {
animateClassTo,
animatePartTo,
						} from 'pota/animations'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Color">
				<p>
					<Code
						code="
						import {

eyeDropper,
scale,
setAlpha,
textColor,
textColorWhenBackgroundIsBlack,
textColorWhenBackgroundIsWhite,
validateColor,

						} from 'pota/color'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Events">
				<p>
					<Code
						code="
						import {

emit,
stopEvent,
waitEvent,

						} from 'pota/events'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Random">
				<p>
					<Code
						code="
						import {

chance,
random,
randomSeeded,
randomBetween,
randomColor,
randomId,

						} from 'pota/random'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Scroll">
				<p>
					<Code
						code="
						import {

scrollToElement,
scrollToSelector,
scrollToSelectorWithFallback,
scrollToTop,


						} from 'pota/scroll'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Streams">
				<p>
					<Code
						code="
						import {
copyAudioTracks,
copyVideoTracks,
removeAudioTracks,
removeVideoTracks,
stopStream,
stopTrack,
stopTracks,
stopTracks,
						} from 'pota/streams'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Strings">
				<p>
					<Code
						code="
						import {

capitalizeFirstLetter,
copyToClipboard,
hash,
isEmoji,
label,
toString,
validateEmail,
validatePassword,
wholeNumber

						} from 'pota/strings'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Time">
				<p>
					<Code
						code="
						import {

time,
timeWithSeconds

						} from 'pota/time'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Test">
				<p>
					<Code
						code="
						import {

describe,
test,
expect,
assertions,


						} from 'pota/test'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="Data">
				<p>
					<Code
						code="
						import {

paginate,
paginateValues


						} from 'pota/data'"
						render={false}
					/>
				</p>
			</Section>
			<Section title="CSS">
				<p>
					<Code
						code="
						import {
css,
sheet,
						} from 'pota/css'"
						render={false}
					/>
				</p>
			</Section>
		</>
	)
}
