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
							useSelector
						} from 'pota/hooks'"
						render={false}
					/>
				</p>
				<p>
					<ol>
						<li>
							<a href="/hooks/useSelector">useSelector</a> - Most
							performant way to have an <mark>isSelected</mark>{' '}
							signal.
						</li>
					</ol>
				</p>
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
				<p>
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
							<a href="/props/plugins/onClickOutside">
								onClickOutside
							</a>{' '}
							- runs a function when clicking outside the element
						</li>
						<li>
							<a href="/props/plugins/pasteTextPlain">
								pasteTextPlain
							</a>{' '}
							- forces pasting as text/plain
						</li>
						<li>
							<a href="/props/plugins/useClipboard">useClipboard</a> -
							allows to copy to clipboard the return value of a
							function, the string set as the prop value or the{' '}
							<mark>innerText</mark> of the element
						</li>
						<li>
							<a href="/props/plugins/useFullscreen">useFullscreen</a>{' '}
							- on click it will fullscreen the element
						</li>
					</ol>
				</p>
			</Section>

			<Section title="Lib">
				<p>
					<Code
						code="
						import {
assign,
callAll,
contextSimple,
copy,
defineProperties,
defineProperty,
empty,
entries,
flat,
freeze,
fromEntries,
functionState,
getter,
getValue,
getValueElement,
groupBy,
hasOwnProperty,
hasValue,
isArray,
isExtensible,
isFunction,
isNaN,
isNotNullObject,
isNullUndefined,
isPrototypeProperty,
keys,
measure,
microtask,
noop,
optional,
range,
removeFromArray,
toArray

						} from 'pota/lib'"
						render={false}
					/>
				</p>
				<p>
					<ol>
						<li>
							<mark>assign</mark> - Object.assign
						</li>
						<li>
							<mark>contextSimple</mark> - Like context but not
							attached to the reactive graph
						</li>
						<li>
							<mark>callAll</mark> - calls an array of functions
						</li>
						<li>
							<mark>copy</mark> - structuredClone an object or returns
							its value
						</li>
						<li>
							<mark>defineProperties</mark> - Object.defineProperties.
						</li>
						<li>
							<mark>defineProperty</mark> - Object.defineProperty.
						</li>
						<li>
							<mark>empty</mark> - creates an object without a
							prototype.
						</li>
						<li>
							<mark>flat</mark> - Flats an array to the first children
							if the length is 1
						</li>
						<li>
							<mark>freeze</mark> - Object.freeze
						</li>
						<li>
							<mark>fromEntries</mark> - Object.fromEntries
						</li>
						<li>
							<mark>entries</mark> - Object.entries.
						</li>
						<li>
							<mark>functionState(fn, state={})</mark> - Keeps state
							in the function as a bind param.
						</li>
						<li>
							<mark>getter(object, key, fn)</mark> - defines getter on
							object.
						</li>
						<li>
							<mark>getValue(value, arg0, arg1, etc)</mark> - If value
							is a function it will unwrap it recursively. arguments
							will be forwarded to the function if any
						</li>
						<li>
							<mark>getValueElement(value )</mark> - Unwraps value and
							returns element if result is a Node or undefined in the
							case isnt a Node
						</li>
						<li>
							<mark>groupBy</mark> - Object.groupBy
						</li>
						<li>
							<mark>hasOwnProperty</mark> - Object.hasOwn
						</li>
						<li>
							<mark>hasValue(value)</mark> - Returns true when the
							value is not null and not undefined
						</li>
						<li>
							<mark>isArray</mark> - Array.isArray.
						</li>
						<li>
							<mark>isExtensible</mark> - Object.isExtensible.
						</li>
						<li>
							<mark>isFunction</mark> - returns true when value is a
							function.
						</li>
						<li>
							<mark>isNaN</mark> - Number.isNaN.
						</li>
						<li>
							<mark>isNotNullObject</mark> - Returns true when value
							is a not null object
						</li>
						<li>
							<mark>isNullUndefined</mark> - Returns true if the value
							is null or undefined
						</li>
						<li>
							<mark>isPrototypeProperty</mark> - returns true when
							object has the property and is on the prototype
						</li>
						<li>
							<mark>keys</mark> - Object.keys.
						</li>
						<li>
							<mark>measure</mark> - measure execution time of a
							function
						</li>
						<li>
							<mark>noop</mark> - empty function.
						</li>
						<li>
							<mark>optional(value)</mark> - returns <mark>true</mark>{' '}
							if value is <mark>undefined</mark> or else it will
							unwrap the value and return that. This is handy for
							optional arguments that come from objects.
						</li>
						<li>
							<mark>range(start, stop, step=1)</mark>
						</li>
						<li>
							<mark>removeFromArray(array, value)</mark> - Removes a
							value from an array and returns the array
						</li>
						<li>
							<mark>toArray</mark> - Array.from.
						</li>
					</ol>
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

stopEvent,
dispatchNativeEvent

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
scrollToTopLeft,

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

stopTracks

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
webElementsGroup
						} from 'pota/css'"
						render={false}
					/>
				</p>
			</Section>
		</>
	)
}
