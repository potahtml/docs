import { Code, Header, Section } from '#main'

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
				<ol>
					<li>
						<a href="/api/directory/hooks/useSelector">useSelector</a>{' '}
						- Most performant way to have an <mark>isSelected</mark>{' '}
						signal.
					</li>
				</ol>
			</Section>
			<Section title="Lib">
				<style>{`h4{margin-top:15px;margin-bottom:5px;}`}</style>
				<p>
					<Code
						code="
						import {

makeCallback,
markComponent,


isReactive,


assign,
contextSimple,
defineProperty,
empty,
entries,
functionState,
getter,
getValue,
hasValue,
isArray,
isFunction,
isNaN,
isNotNullObject,
isNullUndefined,
keys,
noop,
optional,
removeFromArray,
toArray,
wholeNumber

						} from 'pota/lib'"
						render={false}
					/>
				</p>

				<h4>Components</h4>
				<ol>
					<li>
						<mark>makeCallback(props.children)</mark> - Makes of each
						children of <mark>props.children</mark> a function. Avoids
						tracking on functions(uses untrack), and allows tracking
						on signals.
					</li>
					<li>
						<mark>markComponent(fn)</mark> - Prevents adding an effect
						on rendering to a function.
					</li>
				</ol>

				<h4>Reactivity</h4>
				<ol>
					<li>
						<mark>isReactive(value)</mark> - Returns true when the
						value is reactive. A memo or a signal.
					</li>
				</ol>

				<h4>Standard</h4>
				<ol>
					<li>
						<mark>assign</mark> - Object.assign
					</li>
					<li>
						<mark>contextSimple</mark> - Like context but not attached
						to the reactive graph
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
						<mark>entries</mark> - Object.entries.
					</li>
					<li>
						<mark>functionState(fn, state={})</mark> - Keeps state in
						the function as a bind param.
					</li>
					<li>
						<mark>getter(object, key, fn)</mark> - defines getter on
						object.
					</li>
					<li>
						<mark>getValue(value)</mark> - If value is a function it
						will unwrap it recursively.
					</li>
					<li>
						<mark>hasValue(value)</mark> - Returns true when the value
						is not null and not undefined
					</li>
					<li>
						<mark>isArray</mark> - Array.isArray.
					</li>
					<li>
						<mark>isFunction</mark> - returns true when value is a
						function.
					</li>
					<li>
						<mark>isNaN</mark> - Number.isNaN.
					</li>
					<li>
						<mark>isNotNullObject</mark> - Returns true when value is
						a not null object
					</li>
					<li>
						<mark>isNullUndefined</mark> - Returns true if the value
						is null or undefined
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
						if value is <mark>undefined</mark> or else it will unwrap
						the value and return that. This is handy for optional
						arguments that come from objects.
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

				<h4>Color</h4>
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

				<h4>Events</h4>
				<p>
					<Code
						code="
						import {

stopEvent

						} from 'pota/events'"
						render={false}
					/>
				</p>

				<h4>Random</h4>
				<p>
					<Code
						code="
						import {

rand,
random,
randomSeeded,
randomBetween,
randomColor,
randomId,

						} from 'pota/random'"
						render={false}
					/>
				</p>

				<h4>Scroll</h4>
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

				<h4>Streams</h4>
				<p>
					<Code
						code="
						import {

stopTracks

						} from 'pota/streams'"
						render={false}
					/>
				</p>

				<h4>Strings</h4>
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

				<h4>Time</h4>
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
				<h4>Test</h4>
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
			<Section title="Props Plugins">
				<p>Please note each plugin must be imported</p>
				<h4>Bind</h4>
				<p>
					<ol>
						<li>
							<a href="/props/bind">bind</a> - automatically bind the
							value of a form field to a signal
						</li>
					</ol>
				</p>
			</Section>
		</>
	)
}
