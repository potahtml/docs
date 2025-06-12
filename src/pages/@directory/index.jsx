import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Directory">
				Directory of pota plugins and hooks for fancy stuff.
			</Header>

			<Section title="Plugins">
				<p>
					Note:{' '}
					<em>
						<mark>props plugins</mark>
					</em>{' '}
					is a side-effect, once imported it registers globally.
				</p>
				<p>
					<Code
						code={`
 // props plugins

import { bind } from 'pota/use/bind'
import 'pota/use/clickoutside'
import 'pota/use/clipboard'
import 'pota/use/fullscreen'

`}
						render={false}
					/>
				</p>
				<p>
					<Code
						code={`


// use plugins

import {
  isMobile,
  isFirefox
} from 'pota/use/browser'

import {
  onDocumentFocus,
  useDocumentFocus
} from 'pota/use/focus'

import {
  onDocumentSize,
  useDocumentSize
} from 'pota/use/resize'

import {
  onDocumentVisible,
  useDocumentVisible,

  isDocumentVisible
} from 'pota/use/visibility'

import {
	  onDocumentFocus,
  useDocumentFocus,

  focusNext,
  focusPrevious
} from 'pota/use/focus'

import {
  onFullscreen,
  useFullscreen,

  isFullscreen,
  exitFullscreen,
  requestFullscreen,
  toggleFullscreen
} from 'pota/use/fullscreen'

import {
  onOrientation,
  useOrientation,
} from 'pota/use/orientation'

import { useSelector } from 'pota/use/selector'

import { useTimeout } from 'pota/use/time'

import {
copyAudioTracks,
copyVideoTracks,
removeAudioTracks,
removeVideoTracks,
stopStream,
stopTrack,
stopTracks,
stopTracks,
} from 'pota/use/stream'


`}
						render={false}
					/>
				</p>

				<ol>
					<li>
						<a href="/use/bind">bind</a> - automatically bind the
						value of a form field to a signal
					</li>
					<li>
						<a href="/use/clickoutside">clickoutside</a> - runs a
						function when clicking outside the element
					</li>
					<li>
						<a href="/use/clipboard">clipboard</a> - allows to copy to
						clipboard the return value of a function, the string set
						as the prop value or the <mark>innerText</mark> of the
						element
					</li>
					<li>
						<a href="/use/fullscreen">fullscreen</a> - on click it
						will fullscreen the element
					</li>
					<li>
						<a href="/use/selector">useSelector</a> - Most performant
						way to have an <mark>isSelected</mark> signal.
					</li>
					<li>
						<a href="/use/time">useTimeout</a> - For creating
						setTimeouts that autodispose.
					</li>
				</ol>
			</Section>

			{/*<Section title="Animations">
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
						} from 'pota/x'"
						render={false}
					/>
				</p>
			</Section>*/}
		</>
	)
}
