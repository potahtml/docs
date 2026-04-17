import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Directory">
				Every importable symbol from the <mark>pota/use/*</mark>{' '}
				sub-paths, grouped by module. Some modules are{' '}
				<em>props plugins</em>: importing them for their side effect
				registers one or more <mark>use:*</mark> attributes you can
				apply to elements.
			</Header>

			<Section title="Props plugins">
				<p>
					Importing these registers <mark>use:*</mark> props
					globally. You can import the side effect alone, or import
					any named exports to call the helpers imperatively.
				</p>
				<Code
					code={`
import 'pota/use/bind'            // registers  use:bind
import 'pota/use/clickoutside'    // registers  use:clickoutside, use:clickoutsideonce
import 'pota/use/clipboard'       // registers  use:clipboard
import 'pota/use/form'            // registers  use:click-focus-children-input, use:enter-focus-next, use:prevent-enter, use:size-to-input
import 'pota/use/fullscreen'      // registers  use:fullscreen
import 'pota/use/selection'       // registers  use:click-selects-all
`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/animate">
				<Code
					code={`import { animateClassTo, animatePartTo } from 'pota/use/animate'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/bind">
				<Code
					code={`import { bind } from 'pota/use/bind'`}
					render={false}
				/>
				<p>
					Registers the <mark>use:bind</mark> attribute. See{' '}
					<a href="/use/bind">use:bind</a>.
				</p>
			</Section>

			<Section title="pota/use/browser">
				<Code
					code={`import { isMobile, isFirefox } from 'pota/use/browser'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/clickoutside">
				<p>
					Side-effect import. Registers <mark>use:clickoutside</mark>{' '}
					and <mark>use:clickoutsideonce</mark>. See{' '}
					<a href="/use/clickoutside">use:clickoutside</a>.
				</p>
			</Section>

			<Section title="pota/use/clipboard">
				<p>
					Side-effect import. Registers <mark>use:clipboard</mark>.
					See <a href="/use/clipboard">use:clipboard</a>.
				</p>
			</Section>

			<Section title="pota/use/color">
				<Code
					code={`import {
  eyeDropper,
  scale,
  setAlpha,
  textColor,
  textColorWhenBackgroundIsBlack,
  textColorWhenBackgroundIsWhite,
  textColorWhenBackgroundIs,
  validateColor,
} from 'pota/use/color'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/css">
				<Code
					code={`import {
  CSSStyleSheet,
  css,
  sheet,
  getAdoptedStyleSheets,
  adoptedStyleSheets,
  addAdoptedStyleSheet,
  removeAdoptedStyleSheet,
  addStyleSheets,
  addStyleSheetExternal,
} from 'pota/use/css'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/dom">
				<Code
					code={`import {
  document,
  head,
  documentElement,
  DocumentFragment,
  isConnected,
  activeElement,

  createElement,
  createElementNS,
  createTextNode,
  createComment,
  createTreeWalker,
  importNode,

  querySelector,
  querySelectorAll,
  walkElements,
  getDocumentForElement,
  getValueElement,

  setAttribute,
  hasAttribute,
  removeAttribute,
  addClass,
  removeClass,
  addPart,
  removePart,
  tokenList,

  toDiff,
} from 'pota/use/dom'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/emitter">
				<Code
					code={`import { Emitter } from 'pota/use/emitter'`}
					render={false}
				/>
				<p>
					Base class used by the <mark>on*</mark> / <mark>use*</mark>{' '}
					pairs in modules like <mark>fullscreen</mark>,{' '}
					<mark>orientation</mark>, <mark>resize</mark>,{' '}
					<mark>visibility</mark>.
				</p>
			</Section>

			<Section title="pota/use/event">
				<Code
					code={`import {
  preventDefault,
  stopPropagation,
  stopImmediatePropagation,
  stopEvent,

  emit,
  waitEvent,

  addEventNative,
  removeEventNative,
  passiveEvent,
} from 'pota/use/event'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/focus">
				<Code
					code={`import {
  focusNext,
  focusPrevious,

  onDocumentFocus,
  useDocumentFocus,
} from 'pota/use/focus'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/form">
				<Code
					code={`import {
  isDisabled,
  focusNextInput,
  form2object,
  object2form,
} from 'pota/use/form'`}
					render={false}
				/>
				<p>
					Registers <mark>use:click-focus-children-input</mark>,{' '}
					<mark>use:enter-focus-next</mark>,{' '}
					<mark>use:prevent-enter</mark>,{' '}
					<mark>use:size-to-input</mark>.
				</p>
			</Section>

			<Section title="pota/use/fullscreen">
				<Code
					code={`import {
  isFullscreen,
  exitFullscreen,
  requestFullscreen,
  toggleFullscreen,

  onFullscreen,
  useFullscreen,
} from 'pota/use/fullscreen'`}
					render={false}
				/>
				<p>
					Registers <mark>use:fullscreen</mark>. See{' '}
					<a href="/use/fullscreen">use:fullscreen</a>.
				</p>
			</Section>

			<Section title="pota/use/location">
				<Code
					code={`import {
  location,
  navigate,
  navigateSync,
  addListeners,
  useBeforeLeave,
} from 'pota/use/location'`}
					render={false}
				/>
				<p>
					See <a href="/use/location">useLocation</a>.
				</p>
			</Section>

			<Section title="pota/use/orientation">
				<Code
					code={`import {
  onOrientation,
  useOrientation,
} from 'pota/use/orientation'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/paginate">
				<Code
					code={`import { paginate, paginateValues } from 'pota/use/paginate'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/random">
				<Code
					code={`import {
  chance,
  random,
  randomBetween,
  randomColor,
  randomId,
  randomSeeded,
} from 'pota/use/random'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/resize">
				<Code
					code={`import {
  documentSize,
  onDocumentSize,
  useDocumentSize,
} from 'pota/use/resize'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/scroll">
				<Code
					code={`import {
  scrollToElement,
  scrollToSelector,
  scrollToSelectorWithFallback,
  scrollToLocationHash,
  scrollToTop,
} from 'pota/use/scroll'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/selection">
				<Code
					code={`import {
  getSelection,
  restoreSelection,
} from 'pota/use/selection'`}
					render={false}
				/>
				<p>
					Registers <mark>use:click-selects-all</mark>.
				</p>
			</Section>

			<Section title="pota/use/selector">
				<Code
					code={`import { useSelector, usePrevious } from 'pota/use/selector'`}
					render={false}
				/>
				<p>
					See <a href="/use/selector">useSelector</a>.
				</p>
			</Section>

			<Section title="pota/use/stream">
				<Code
					code={`import {
  copyAudioTracks,
  copyVideoTracks,
  removeAudioTracks,
  removeVideoTracks,
  stopStream,
  stopTrack,
  stopTracks,
} from 'pota/use/stream'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/string">
				<Code
					code={`import {
  capitalizeFirstLetter,
  dashesToCamelCase,
  copyToClipboard,
  ensureString,
  hash,
  isEmoji,
  label,
  short,
  toString,
  validateEmail,
  validatePassword,
  wholeNumber,
  diff,
} from 'pota/use/string'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/test">
				<Code
					code={`import {
  test,
  isProxy,
  rerenders,

  body,
  head,
  childNodes,

  microtask,
  macrotask,
  sleep,
  sleepLong,

  $,
  $$,
} from 'pota/use/test'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/time">
				<Code
					code={`import {
  now,
  date,
  datetime,
  time,
  timeWithSeconds,
  day,

  measure,
  timing,

  useTimeout,
} from 'pota/use/time'`}
					render={false}
				/>
				<p>
					See <a href="/use/time">useTimeout</a>.
				</p>
			</Section>

			<Section title="pota/use/url">
				<Code
					code={`import {
  cleanLink,
  encodeURIComponent,
  decodeURIComponent,

  isAbsolute,
  isRelative,
  isExternal,
  isFileProtocol,
  isHash,
  hasProtocol,
  removeNestedProtocol,

  paramsRegExp,
  replaceParams,
} from 'pota/use/url'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/visibility">
				<Code
					code={`import {
  isDocumentVisible,
  onDocumentVisible,
  useDocumentVisible,
} from 'pota/use/visibility'`}
					render={false}
				/>
			</Section>
		</>
	)
}
