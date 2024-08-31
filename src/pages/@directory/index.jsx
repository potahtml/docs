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

import 'pota/plugin/autofocus'
import { bind } from 'pota/plugin/bind'
import 'pota/plugin/clickOutside'
import 'pota/plugin/pasteTextPlain'
import 'pota/plugin/clipboard'
import 'pota/plugin/fullscreen'

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
} from 'pota/plugin/useBrowser'

import {
  onDocumentFocus,
  useDocumentFocus
} from 'pota/plugin/useDocumentFocus'

import {
  onDocumentSize,
  useDocumentSize
} from 'pota/plugin/useDocumentSize'

import {
  onDocumentVisible,
  useDocumentVisible,

  isDocumentVisible
} from 'pota/plugin/useDocumentVisible'

import {
  focusNext,
  focusPrevious
} from 'pota/plugin/useFocus'

import {
  onFullscreen,
  useFullscreen,

  isFullscreen,
  exitFullscreen,
  requestFullscreen,
  toggleFullscreen
} from 'pota/plugin/useFullscreen'

import {
  onOrientation,
  useOrientation,
} from 'pota/plugin/useOrientation'

import { useSelector } from 'pota/plugin/useSelector'

import { useTimeout } from 'pota/plugin/useTimeout'




`}
						render={false}
					/>
				</p>

				<ol>
					<li>
						<a href="/plugin/autofocus">autofocus</a> - automatically
						focus the field
					</li>
					<li>
						<a href="/plugin/bind">bind</a> - automatically bind the
						value of a form field to a signal
					</li>
					<li>
						<a href="/plugin/clickOutside">clickOutside</a> - runs a
						function when clicking outside the element
					</li>
					<li>
						<a href="/plugin/pasteTextPlain">pasteTextPlain</a> -
						forces pasting as text/plain
					</li>
					<li>
						<a href="/plugin/clipboard">clipboard</a> - allows to copy
						to clipboard the return value of a function, the string
						set as the prop value or the <mark>innerText</mark> of the
						element
					</li>
					<li>
						<a href="/plugin/fullscreen">fullscreen</a> - on click it
						will fullscreen the element
					</li>
					<li>
						<a href="/plugin/useSelector">useSelector</a> - Most
						performant way to have an <mark>isSelected</mark> signal.
					</li>
					<li>
						<a href="/plugin/useTimeout">useTimeout</a> - For creating
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
						} from 'pota/x'"
						render={false}
					/>
				</p>
			</Section>*/}
		</>
	)
}
