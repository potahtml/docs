import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { H2 } from '../../lib/components/headings.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Directory">
				Every importable symbol from the <mark>pota/use/*</mark>{' '}
				sub-paths, grouped by purpose. Modules with two
				shapes (<mark>fullscreen</mark>, <mark>resize</mark>,{' '}
				<mark>focus</mark>) appear under more than one heading
				— each listing shows only the exports relevant to that
				group. JSX lifecycle directives (
				<a href="/use/ref">use:ref</a>,{' '}
				<a href="/use/connected">use:connected</a>,{' '}
				<a href="/use/disconnected">use:disconnected</a>) live
				with the JSX docs.
			</Header>

			<H2
				title="Behavior refs"
				no-meta
			/>
			<p>
				Attach with{' '}
				<mark>{`use:ref={factory(...)}`}</mark>. Compose multiple
				by nesting in an array:{' '}
				<mark>{`use:ref={[a, b()]}`}</mark>. See{' '}
				<a href="/use/ref">use:ref</a>.
			</p>

			<Section title="pota/use/bind">
				<Code
					code={`import { bind } from 'pota/use/bind'`}
					render={false}
				/>
				<p>
					Registers the <mark>use:bind</mark> attribute (kept
					as a plugin rather than a ref factory). See{' '}
					<a href="/use/bind">use:bind</a>.
				</p>
			</Section>

			<Section title="pota/use/clickoutside">
				<Code
					code={`import {
  clickOutside,
  escape,
} from 'pota/use/clickoutside'`}
					render={false}
				/>
				<p>
					<mark>clickOutside(handler, options?)</mark> — ref
					factory; pass <mark>{`{ once: true }`}</mark> for
					single-shot dismissal. <mark>escape(handler)</mark>{' '}
					— companion ref factory; fires on document Escape.
					See <a href="/use/clickoutside">clickOutside</a>.
				</p>
			</Section>

			<Section title="pota/use/clipboard">
				<Code
					code={`import { clipboard } from 'pota/use/clipboard'`}
					render={false}
				/>
				<p>
					<mark>clipboard(value)</mark> — ref factory that
					copies text on click. See{' '}
					<a href="/use/clipboard">clipboard</a>.
				</p>
			</Section>

			<Section title="pota/use/drag">
				<Code
					code={`import { draggable } from 'pota/use/drag'`}
					render={false}
				/>
				<p>
					<mark>draggable({`{ onMove, onStart?, onEnd? }`})</mark>{' '}
					— ref factory; pointer-drag with cumulative deltas
					and gesture lifecycle. See{' '}
					<a href="/use/drag">draggable</a>.
				</p>
			</Section>

			<Section title="pota/use/focus (refs)">
				<Code
					code={`import {
  autoFocus,
  selectOnFocus,
  trapFocus,

  focusNext,
  focusPrevious,
} from 'pota/use/focus'`}
					render={false}
				/>
				<p>
					<mark>autoFocus</mark>, <mark>selectOnFocus</mark>,{' '}
					<mark>trapFocus</mark> — bare ref functions; attach
					via <mark>use:ref</mark>. <mark>focusNext</mark> /{' '}
					<mark>focusPrevious</mark> — imperative tab-order
					navigation. See <a href="/use/focus">focus</a>.
				</p>
			</Section>

			<Section title="pota/use/form (refs)">
				<Code
					code={`import {
  clickFocusChildrenInput,
  enterFocusNext,
  preventEnter,
  sizeToInput,
} from 'pota/use/form'`}
					render={false}
				/>
				<p>
					Bare ref functions for common form ergonomics. See{' '}
					<a href="/use/form">form</a>.
				</p>
			</Section>

			<Section title="pota/use/fullscreen (ref)">
				<Code
					code={`import { fullscreen } from 'pota/use/fullscreen'`}
					render={false}
				/>
				<p>
					<mark>fullscreen(target?)</mark> — ref factory;
					toggles fullscreen on click. See{' '}
					<a href="/use/fullscreen">fullscreen</a>.
				</p>
			</Section>

			<Section title="pota/use/intersection">
				<Code
					code={`import {
  visible,
  lazyImage,
} from 'pota/use/intersection'`}
					render={false}
				/>
				<p>
					<mark>visible(handler, opts?)</mark> — ref factory
					that fires on viewport intersection.{' '}
					<mark>lazyImage(opts?)</mark> — one-shot ref factory
					that swaps <mark>data-src</mark> into <mark>src</mark>{' '}
					on first intersection. See{' '}
					<a href="/use/intersection">intersection</a>.
				</p>
			</Section>

			<Section title="pota/use/keyboard">
				<Code
					code={`import {
  shortcut,
  globalShortcut,
  submitOnCtrlEnter,
} from 'pota/use/keyboard'`}
					render={false}
				/>
				<p>
					<mark>shortcut(combo, fn)</mark> — element-scoped
					keyboard chord. <mark>globalShortcut(combo, fn)</mark>{' '}
					— same but listens on <mark>document</mark>.{' '}
					<mark>submitOnCtrlEnter(fn)</mark> —{' '}
					<mark>Ctrl/Cmd+Enter</mark> convenience. See{' '}
					<a href="/use/keyboard">keyboard</a>.
				</p>
			</Section>

			<Section title="pota/use/mutation">
				<Code
					code={`import { mutated } from 'pota/use/mutation'`}
					render={false}
				/>
				<p>
					<mark>mutated(handler, init?)</mark> — ref factory
					backed by <mark>MutationObserver</mark>. Default
					init is{' '}
					<mark>{`{ childList: true, subtree: true }`}</mark>.
					See <a href="/use/mutation">mutation</a>.
				</p>
			</Section>

			<Section title="pota/use/resize (ref)">
				<Code
					code={`import { resize } from 'pota/use/resize'`}
					render={false}
				/>
				<p>
					<mark>resize(handler)</mark> — ref factory backed
					by <mark>ResizeObserver</mark>. See{' '}
					<a href="/use/resize">resize</a>.
				</p>
			</Section>

			<Section title="pota/use/scroll (ref)">
				<Code
					code={`import { scrollIntoView } from 'pota/use/scroll'`}
					render={false}
				/>
				<p>
					<mark>scrollIntoView(opts?)</mark> — ref factory;
					scrolls the element into view on mount. See{' '}
					<a href="/use/scroll">scroll</a>.
				</p>
			</Section>

			<Section title="pota/use/selection (ref)">
				<Code
					code={`import { clickSelectsAll } from 'pota/use/selection'`}
					render={false}
				/>
				<p>
					<mark>clickSelectsAll</mark> — bare ref function;
					attach via <mark>use:ref</mark>. See{' '}
					<a href="/use/selection">selection</a>.
				</p>
			</Section>

			<H2
				title="State emitters"
				no-meta
			/>
			<p>
				Each module exposes a <mark>useX</mark> reactive reader
				paired with an <mark>onX</mark> callback subscription,
				backed by <a href="/use/emitter">Emitter</a>. Multiple
				subscribers share one underlying listener/observer; it
				is set up on the first add and torn down on the last
				remove.
			</p>

			<Section title="pota/use/focus (emitter)">
				<Code
					code={`import {
  useDocumentFocus,
  onDocumentFocus,
} from 'pota/use/focus'`}
					render={false}
				/>
				<p>
					Tracks the document's currently-focused element.
					See <a href="/use/focus">focus</a>.
				</p>
			</Section>

			<Section title="pota/use/fullscreen (emitter + sync)">
				<Code
					code={`import {
  isFullscreen,
  exitFullscreen,
  requestFullscreen,
  toggleFullscreen,

  useFullscreen,
  onFullscreen,
} from 'pota/use/fullscreen'`}
					render={false}
				/>
				<p>
					Synchronous <mark>isFullscreen()</mark> plus the
					emitter pair tracking the fullscreen element. See{' '}
					<a href="/use/fullscreen">fullscreen</a>.
				</p>
			</Section>

			<Section title="pota/use/intersection (emitter)">
				<Code
					code={`import {
  useVisible,
  onVisible,
} from 'pota/use/intersection'`}
					render={false}
				/>
				<p>
					Element-level emitter pair backed by{' '}
					<mark>IntersectionObserver</mark>. See{' '}
					<a href="/use/intersection">intersection</a>.
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
					Reactive location signal plus navigation helpers.
					See <a href="/use/location">useLocation</a>.
				</p>
			</Section>

			<Section title="pota/use/mutation (emitter)">
				<Code
					code={`import {
  useMutations,
  onMutations,
} from 'pota/use/mutation'`}
					render={false}
				/>
				<p>
					Element-level emitter pair backed by{' '}
					<mark>MutationObserver</mark>. See{' '}
					<a href="/use/mutation">mutation</a>.
				</p>
			</Section>

			<Section title="pota/use/orientation">
				<Code
					code={`import {
  useOrientation,
  onOrientation,
} from 'pota/use/orientation'`}
					render={false}
				/>
				<p>
					Tracks <mark>screen.orientation</mark>. See{' '}
					<a href="/use/orientation">orientation</a>.
				</p>
			</Section>

			<Section title="pota/use/resize (emitter)">
				<Code
					code={`import {
  documentSize,
  useDocumentSize,
  onDocumentSize,

  useElementSize,
  onElementSize,
} from 'pota/use/resize'`}
					render={false}
				/>
				<p>
					Document-level (<mark>resize</mark> event) and
					element-level (<mark>ResizeObserver</mark>) emitter
					pairs. See <a href="/use/resize">resize</a>.
				</p>
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
					Reactive clock readers plus <mark>useTimeout</mark>.
					See <a href="/use/time">useTimeout</a>.
				</p>
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
				<p>
					Page Visibility API: synchronous{' '}
					<mark>isDocumentVisible()</mark> plus the emitter
					pair. See <a href="/use/visibility">visibility</a>.
				</p>
			</Section>

			<H2
				title="Utilities"
				no-meta
			/>
			<p>
				Plain functions and helpers. Pulled in by name where
				needed; not tied to any particular renderer hook.
			</p>

			<Section title="pota/use/animate">
				<Code
					code={`import { animateClassTo, animatePartTo } from 'pota/use/animate'`}
					render={false}
				/>
				<p>
					Swap classes/parts and await the resulting
					animation. See <a href="/use/animate">animate</a>.
				</p>
			</Section>

			<Section title="pota/use/browser">
				<Code
					code={`import { isMobile, isFirefox } from 'pota/use/browser'`}
					render={false}
				/>
			</Section>

			<Section title="pota/use/color">
				<Code
					code={`import {
  // re-exported from color-bits/string
  alpha,
  blend,
  darken,
  lighten,
  getLuminance,

  eyeDropper,
  scale,
  textColor,
  textColorWhenBackgroundIsBlack,
  textColorWhenBackgroundIsWhite,
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
				<p>
					Stylesheet helpers; distinct from the{' '}
					<a href="/props/css">use:css</a> JSX directive.
				</p>
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
					Base class used by every <mark>useX</mark> /{' '}
					<mark>onX</mark> pair —{' '}
					<mark>fullscreen</mark>, <mark>orientation</mark>,{' '}
					<mark>resize</mark>, <mark>visibility</mark>,{' '}
					<mark>focus</mark>, and the element-level observers
					in <mark>intersection</mark>,{' '}
					<mark>mutation</mark>. See{' '}
					<a href="/use/emitter">Emitter</a>.
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
				<p>
					Stop helpers, <mark>CustomEvent</mark> emitter,
					promise-based <mark>waitEvent</mark>, and native
					add/remove with options support. See{' '}
					<a href="/use/event">event</a>.
				</p>
			</Section>

			<Section title="pota/use/form (helpers)">
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
					Form-state helpers (non-ref). See{' '}
					<a href="/use/form">form</a>.
				</p>
			</Section>

			<Section title="pota/use/paginate">
				<Code
					code={`import { paginate, paginateValues } from 'pota/use/paginate'`}
					render={false}
				/>
				<p>
					Slice an iterable or async fetch into pages with{' '}
					<mark>next</mark> / <mark>previous</mark> controls.
					See <a href="/use/paginate">paginate</a>.
				</p>
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

			<Section title="pota/use/scroll (helpers)">
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
				<p>
					Imperative scroll helpers. See{' '}
					<a href="/use/scroll">scroll</a>.
				</p>
			</Section>

			<Section title="pota/use/selection (helpers)">
				<Code
					code={`import {
  getSelection,
  restoreSelection,
} from 'pota/use/selection'`}
					render={false}
				/>
				<p>
					Selection snapshot helpers. See{' '}
					<a href="/use/selection">selection</a>.
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
		</>
	)
}
