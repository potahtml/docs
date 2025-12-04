(function () {
	'use strict';

	const version = '0.20.220';

	const window = globalThis;
	const requestAnimationFrame = window.requestAnimationFrame;
	const queueMicrotask = window.queueMicrotask;
	const history = window.history;
	const navigator = window.navigator;
	const location = window.location;
	const origin = location?.origin;
	const Object$1 = window.Object;
	const Array = window.Array;
	const Promise$1 = window.Promise;
	const Symbol = window.Symbol;
	const assign = Object$1.assign;
	const create = Object$1.create;
	const defineProperties = Object$1.defineProperties;
	const defineProperty = Object$1.defineProperty;
	const entries = Object$1.entries;
	const freeze = Object$1.freeze;
	const fromEntries = Object$1.fromEntries;
	const getOwnPropertyDescriptor = Object$1.getOwnPropertyDescriptor;
	const getOwnPropertyDescriptors = Object$1.getOwnPropertyDescriptors;
	const getOwnPropertyNames = Object$1.getOwnPropertyNames;
	const getOwnPropertySymbols = Object$1.getOwnPropertySymbols;
	const getPrototypeOf = Object$1.getPrototypeOf;
	const groupBy = Object$1.groupBy;
	const hasOwn = Object$1.hasOwn;
	const is = Object$1.is;
	const isExtensible = Object$1.isExtensible;
	const keys = Object$1.keys;
	const values = Object$1.values;
	const setPrototypeOf = Object$1.setPrototypeOf;
	const toArray = Array.from;

	/**
	 * @template T
	 * @param {T} value
	 */
	const toValues = value => isArray(value) ? value :
	// @ts-expect-error
	isObject(value) && 'values' in value ? /** @type {{ values(): IterableIterator<T> }} */value.values() : toArray(/** @type {Iterable<T> | ArrayLike<T>} */value);

	/**
	 * @template T
	 * @param {T} value
	 */
	const toEntries = value =>
	// @ts-expect-error
	isObject(value) && 'entries' in value ? /** @type {{ entries(): IterableIterator<[string, T]> }} */value.entries() : toArray(/** @type {Iterable<T> | ArrayLike<T>} */value);
	const iterator = Symbol.iterator;
	const Iterator = window.Iterator;
	const stringify = JSON.stringify;

	/** @param {unknown} o */
	const stringifyReadable = o => stringify(o, null, 2);

	/** @param {unknown} o */
	const stringifySorted = o => {
	  function sort(o) {
	    if (!isObject(o)) {
	      return o;
	    }
	    const asArray = isArray(o);
	    /** @type {unknown[] | { [key: string]: unknown }} */
	    const tmp = asArray ? [] : {};
	    keys(o).sort().map(k => tmp[k] = sort(o[k]));
	    if (asArray) {
	      // @ts-expect-error
	      tmp.sort((a, b) => stringify(a).localeCompare(stringify(b)));
	    }
	    return tmp;
	  }
	  return stringifyReadable(sort(o));
	};

	/**
	 * @param {(
	 * 	resolve: (value: unknown) => void,
	 * 	reject: (reason?: any) => void,
	 * ) => void} fn
	 */
	const promise = fn => new Promise$1(fn);

	/**
	 * Creates a promise together with deferred `resolve`/`reject`
	 * helpers.
	 *
	 * @template T
	 * @returns {{
	 * 	promise: Promise<T>
	 * 	resolve: (value: T | PromiseLike<T>) => void
	 * 	reject: (reason?: any) => void
	 * }}
	 */
	const withResolvers = () => Promise$1.withResolvers();

	/**
	 * Given a promise it adds `onDone` to `then` and `catch`
	 *
	 * ```js
	 * resolved(promise, onDone)
	 * // is same as
	 * promise.then(onDone).catch(onDone)
	 * ```
	 */
	const resolved = (promise, onDone) => promise.then(onDone).catch(e => {
	  error(e);
	  onDone(e.toString());
	});

	/**
	 * Runs an array of functions
	 *
	 * @param {Iterable<Function>} fns
	 */
	const call = fns => {
	  for (const fn of fns) fn();
	};

	/**
	 * Flats an array recursively and passes values to secondary function
	 *
	 * @template {unknown | unknown[]} T
	 * @param {T} arr
	 * @param {(value: T) => void} fn
	 */
	const flatForEach = (arr, fn) => {
	  isArray(arr) ? arr.flat(Infinity).forEach(value => value && fn(value)) : arr ? fn(arr) : nothing;
	};

	/**
	 * Object.defineProperty with `enumerable` and `configurable` set to
	 * `true` unless overwriten by `descriptor` argument
	 *
	 * @template T
	 * @param {T} target
	 * @param {PropertyKey} key
	 * @param {PropertyDescriptor} descriptor
	 */
	const redefineProperty = (target, key, descriptor) => defineProperty(target, key, assign(create(redefinePropertyDefailts), descriptor));
	const redefinePropertyDefailts = {
	  __proto__: null,
	  configurable: true,
	  enumerable: true
	};

	/**
	 * Returns an object without a prototype
	 *
	 * @type {Function}
	 */
	const empty = Object$1.create.bind(null, null);

	/**
	 * An empty frozen array
	 *
	 * @type {readonly unknown[]}
	 */
	const emptyArray = freeze([]);

	/** An empty frozen object */
	const nothing = freeze(empty());

	/**
	 * Iterates over own enumerable string and symbol keys.
	 *
	 * @param {Record<PropertyKey, unknown>} target
	 * @returns {IterableIterator<[PropertyKey, unknown]>}
	 */
	function* entriesIncludingSymbols(target) {
	  for (const item of entries(target)) {
	    yield item;
	  }
	  for (const item of getOwnPropertySymbols(target)) {
	    yield [item, target[item]];
	  }
	}

	/**
	 * Compares two values for equality. Handles primitive types, objects,
	 * and arrays recursively.
	 *
	 * @template T
	 * @param {T} a - The first value to compare.
	 * @param {T} b - The second value to compare.
	 * @returns {boolean} True if the values are equal, false otherwise.
	 * @url modified version of https://github.com/epoberezkin/fast-deep-equal
	 */
	function equals(a, b) {
	  if (a === b) {
	    return true;
	  }
	  if (a && b && typeof a == 'object' && typeof b == 'object') {
	    if (a.constructor !== b.constructor) {
	      return false;
	    }
	    let length, i, k;
	    if (isArray(a)) {
	      length = a.length;
	      // @ts-expect-error
	      if (length != b.length) {
	        return false;
	      }
	      for (i = length; i-- !== 0;) {
	        if (!equals(a[i], b[i])) {
	          return false;
	        }
	      }
	      return true;
	    }
	    if (a.constructor === RegExp)
	      // @ts-expect-error
	      return a.source === b.source && a.flags === b.flags;
	    if (a.valueOf !== Object$1.prototype.valueOf) return a.valueOf() === b.valueOf();
	    if (a.toString !== Object$1.prototype.toString) return a.toString() === b.toString();
	    k = keys(a);
	    length = k.length;
	    if (length !== keys(b).length) {
	      return false;
	    }
	    for (i = length; i-- !== 0;) {
	      if (!Object$1.prototype.hasOwnProperty.call(b, k[i])) {
	        return false;
	      }
	    }
	    for (i = length; i-- !== 0;) {
	      var key = k[i];
	      if (!equals(a[key], b[key])) {
	        return false;
	      }
	    }
	    return true;
	  }

	  // true if both NaN, false otherwise
	  return a !== a && b !== b;
	}

	/**
	 * Unwraps an array/childNodes to the first item if the length is 1
	 *
	 * @param {any[] | NodeListOf<ChildNode>} arr
	 * @returns {any}
	 */
	const unwrapArray = arr => arr.length === 1 ? arr[0] : arr;

	/**
	 * Flats an array/childNodes recursively
	 *
	 * @template {unknown | unknown[]} T
	 * @param {T} arr
	 * @returns {T[]}
	 */
	const flatToArray = arr => isArray(arr) ? arr.flat(Infinity) : [arr];

	/**
	 * Flats an array/childNodes recursively if its an array else it
	 * returns
	 *
	 * @template {unknown | unknown[]} T
	 * @param {T} arr
	 * @returns {T[] | T}
	 */
	const flatNoArray = arr => isArray(arr) ? arr.flat(Infinity) : arr;

	/**
	 * Keeps state in the function as the first param
	 *
	 * @template {(...args: any[]) => any} T
	 * @param {T} fn - Function to which add state to it
	 * @param {() => DataStore<Map<unknown, unknown>>} [state] - Passed to
	 *   `fn` as first param
	 * @returns {(...args: Parameters<T>) => ReturnType<T>} A copy of the
	 *   function with the state
	 */
	const withState = /* #__NO_SIDE_EFFECTS__ */(fn, state = cacheStore) => fn.bind(null, state());

	/**
	 * Memoizes a unary function using a strong Map-backed cache.
	 *
	 * @template T, R
	 * @param {(value: T) => R} fn
	 * @returns {(value: T) => R}
	 */
	const withCache = fn => withState((cache, thing) => cache.get(thing, thing => fn(thing)), cacheStore);
	/**
	 * Memoizes a unary function using a WeakMap-backed cache.
	 *
	 * @template {object} T
	 * @template R
	 * @param {(value: T) => R} fn
	 * @returns {(value: T) => R}
	 */
	const withWeakCache = fn => withState((cache, thing) => cache.get(thing, thing => fn(thing)), weakStore);

	/**
	 * Safely collects own property values, skipping getters that throw.
	 *
	 * @param {Record<PropertyKey, unknown>} o
	 * @returns {unknown[]}
	 */
	const getOwnValues = o => getOwnPropertyNames(o).map(key => {
	  try {
	    return o[key];
	  } catch (e) {}
	});

	/**
	 * Walks a prototype and returns the names of every setter it defines.
	 *
	 * @param {object} object
	 * @param {Set<PropertyKey>} [set]
	 * @returns {Set<PropertyKey>}
	 */
	function getSetterNamesFromPrototype(object, set = new Set()) {
	  const descriptors = getOwnPropertyDescriptors(object);
	  for (const key in descriptors) {
	    if (descriptors[key].set) {
	      set.add(key);
	    }
	  }
	  return set;
	}

	/**
	 * Unwraps values. If the argument is a function then it runs it
	 * recursively and returns the value
	 *
	 * @template T
	 * @param {Accessor<T>} value - Maybe function
	 * @returns T
	 */
	function getValue(value) {
	  while (typeof value === 'function') value = /** @type {() => T} */value();
	  return value;
	}

	/**
	 * Resolves functions (optionally with arguments) and unwraps nested
	 * accessors.
	 *
	 * @template T
	 * @param {T} value
	 * @param {...unknown} args
	 * @returns {T}
	 */
	const getValueWithArguments = (value, ...args) => typeof value === 'function' ? args.length ? getValue(value(...args)) : getValue(value()) : value;

	/**
	 * Identity function, given `x` returns `x`
	 *
	 * @template T
	 * @param {T} x
	 * @returns {T}
	 */
	const identity = x => x;

	/**
	 * When `value` is an object, it will check if the `key` on `target`
	 * is `configurable`
	 *
	 * @param {object} target
	 * @param {PropertyKey} key
	 * @param {boolean | undefined} value
	 */
	const isConfigurable = (target, key, value) => {
	  if (isObject(value)) {
	    const descriptor = getOwnPropertyDescriptor(target, key);
	    if (descriptor) {
	      return descriptor.configurable;
	    }
	  }
	  return true;
	};

	/**
	 * Returns `true` when `typeof` of `value` is `function`
	 *
	 * @template T
	 * @param {T} value
	 * @returns {value is ((...args:unknown[])=>T)}
	 */
	const isFunction = value => typeof value === 'function';
	const isNaN = Number.isNaN;

	/**
	 * Returns `true` when value is Iterable
	 *
	 * @param {unknown} value
	 * @returns {value is Iterable<unknown>}
	 */
	const isIterable = value => value?.[iterator];

	/**
	 * Returns `true` if the value is `null` or `undefined`
	 *
	 * @param {unknown} value
	 * @returns {value is null | undefined}
	 */
	const isNullUndefined = value => value == null;

	/**
	 * Returns `true` when typeof of value is object and not null
	 *
	 * @template T
	 * @param {T} value
	 * @returns {value is object}
	 */
	const isObject = value => value !== null && typeof value === 'object';

	/**
	 * Returns `true` when `typeof` of `value` is `string`
	 *
	 * @param {unknown} value
	 * @returns {value is string}
	 */
	const isString = value => typeof value === 'string';

	/**
	 * Returns `true` when `typeof` of `value` is `number`
	 *
	 * @param {unknown} value
	 * @returns {value is number}
	 */
	const isNumber = value => typeof value === 'number';

	/**
	 * Returns `true` when `typeof` of `value` is `symbol`
	 *
	 * @param {unknown} value
	 * @returns {value is symbol}
	 */
	const isSymbol = value => typeof value === 'symbol';

	/**
	 * Returns `true` when `typeof` of `value` is `boolean`
	 *
	 * @param {unknown} value
	 * @returns {value is boolean}
	 */
	const isBoolean = value => typeof value === 'boolean';

	/**
	 * Returns `true` when `value` may be a promise
	 *
	 * @template T
	 * @param {T} value
	 * @returns {value is Promise<T>}
	 */
	const isPromise = value => isFunction(/** @type {any} */value?.then);

	/**
	 * @template T
	 * @param {T} value
	 * @returns {value is array}
	 */
	const isArray = Array.isArray;

	/**
	 * Returns `true` when object morphed between array/object
	 *
	 * @param {unknown} a
	 * @param {unknown} b
	 * @returns {boolean}
	 */
	const morphedBetweenArrayAndObject = (a, b) => isObject(a) && !isObject(b) || isObject(b) && !isObject(a) || isArray(a) && !isArray(b) || isArray(b) && !isArray(a);

	/**
	 * Returns `true` if the property is defined in the `prototype` and
	 * absent in the `object`
	 *
	 * @param {object} target
	 * @param {PropertyKey} key
	 */
	const isPrototypeProperty = (target, key) =>
	// must do `key in target` to check that it DOES have it somewhere
	// must do !hasOwnProperty to check that isnt an own property
	key in target && !hasOwn(target, key);

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction
	const GeneratorFunction = function* () {}.constructor;

	/** Returns `true` when is a generator function */
	const isGeneratorFunction = target => target && (target.constructor === GeneratorFunction || target.constructor?.constructor === GeneratorFunction);

	/** Function that intentionally performs no operation. */
	const noop = () => {};

	// an optional value is `true` by default, so most of the time is undefined which means is `true`
	// to avoid having conditions like `if(something.bla === undefined || something.bla)`
	// this function will short it to `if(optional(something.bla))`
	// additionally the value is resolved, for cases like `when={() => show() && optional(props.when)}`

	/**
	 * Returns `true` when value is `true` or `undefined`
	 *
	 * @template T
	 * @param {T} value
	 * @returns {true | T} True when value is true or undefined
	 */
	const optional = value => value === undefined || getValue(value);
	function* range(start, stop, step) {
	  if (step < 0) step = Math.abs(step);
	  yield start;
	  if (start < stop) {
	    while (start < stop) {
	      yield start += step;
	    }
	  } else {
	    while (start > stop) {
	      yield start -= step;
	    }
	  }
	}
	const {
	  ownKeys: reflectOwnKeys,
	  has: reflectHas,
	  deleteProperty: reflectDeleteProperty,
	  getOwnPropertyDescriptor: reflectGetOwnPropertyDescriptor,
	  get: reflectGet,
	  apply: reflectApply,
	  set: reflectSet,
	  isExtensible: reflectIsExtensible
	} = Reflect;

	/**
	 * Removes a value from an array
	 *
	 * @template T
	 * @param {T[]} array
	 * @param {T} value To remove from the array
	 */
	function removeFromArray(array, value) {
	  const index = array.indexOf(value);
	  if (index !== -1) array.splice(index, 1);
	}
	/**
	 * Removes values from an array based on a condition
	 *
	 * @template T
	 * @param {T[]} array
	 * @param {(index: number, value: T) => boolean} cb Function with
	 *   condition
	 */
	function removeFromArrayConditionally(array, cb) {
	  let i = array.length;
	  while (i--) {
	    if (cb(i, array[i])) {
	      array.splice(i, 1);
	    }
	  }
	}
	/**
	 * Removes values from an array based on a condition
	 *
	 * @template T
	 * @param {Iterable<T>} iterable
	 * @param {PropertyKey} key Function with condition
	 */
	function indexByKey(iterable, key) {
	  const byKey = empty();
	  for (const item of iterable) {
	    byKey[item[key]] = item;
	  }
	  return byKey;
	}

	/**
	 * Returns the internal `[[Class]]` tag for a value (e.g. `Array`).
	 *
	 * @param {unknown} obj
	 * @returns {string}
	 */
	const typeString = obj => Object$1.prototype.toString.call(obj).slice(8, -1);

	/**
	 * Walks up a linked structure invoking `cb` for each parent until
	 * `cb` returns `true`.
	 *
	 * @param {object} context
	 * @param {PropertyKey} propertyName
	 * @param {(value: any) => boolean | void} cb
	 * @returns {boolean} Whether the callback succeeded.
	 */
	function walkParents(context, propertyName, cb) {
	  while (context) {
	    if (cb(context)) return true;
	    context = context[propertyName];
	  }
	  return false;
	}

	/** @template {Map<any, any> | WeakMap<any, any>} T */
	class DataStore {
	  /** @param {new () => T} kind */
	  constructor(kind) {
	    const store = new kind();
	    const get = store.get.bind(store);
	    const set = store.set.bind(store);
	    const has = store.has.bind(store);
	    const del = store.delete.bind(store);
	    this.set = set;
	    this.has = has;
	    this.delete = del;
	    this.get = (target, defaults = null) => {
	      const o = get(target);
	      if (defaults !== null && o === undefined) {
	        /**
	         * Default values should be passed as a function, so we dont
	         * constantly initialize values when giving them
	         */
	        defaults = defaults(target);
	        set(target, defaults);
	        return defaults;
	      }
	      return o;
	    };
	  }
	  *[Symbol.iterator]() {
	    yield this.get;
	    yield this.set;
	    yield this.has;
	    yield this.delete;
	  }
	}

	/**
	 * Creates a WeakMap-backed `DataStore` instance.
	 *
	 * @returns {DataStore<WeakMap<any, any>>}
	 */
	const weakStore = () => new DataStore(WeakMap);
	/**
	 * Creates a Map-backed `DataStore` instance.
	 *
	 * @returns {DataStore<Map<any, any>>}
	 */
	const cacheStore = () => new DataStore(Map);

	/**
	 * `console.warn` wrapper kept for consistent dependency
	 * injection/mocking.
	 *
	 * @param {...unknown} args
	 * @returns {void}
	 */
	const warn = (...args) => console.warn(...args);
	/**
	 * `console.error` wrapper kept for consistent dependency
	 * injection/mocking.
	 *
	 * @param {...unknown} args
	 * @returns {void}
	 */
	const error = (...args) => console.error(...args);

	/**
	 * 1. A non-extensible object must return the real object, but still its
	 *    children properties could be tracked/proxied
	 * 2. A non-configurable property must return the real value
	 *
	 * [[Get]] For proxy objects enforces the following invariants:
	 *
	 * - The value reported for a property must be the same as the value of
	 *   the corresponding target object property if the target object
	 *   property is a non-writable, non-configurable own data property.
	 * - The value reported for a property must be undefined if the
	 *   corresponding target object property is a non-configurable own
	 *   accessor property that has undefined as its [[Get]] attribute.
	 */
	const isProxyValueReturnInvariant = (target, key, value) => !isObject(value) || !reflectIsExtensible(target) || reflectGetOwnPropertyDescriptor(target, key)?.configurable === false;

	// symbols

	const $isComponent = Symbol();
	const $isMap = Symbol();
	const $isMutable = Symbol();

	// supported namespaces

	const prefix = 'http://www.w3.org/';

	// when a tag/attribute is missing the namespace this puts it back in

	const NS = {
	  __proto__: null,
	  svg: prefix + '2000/svg',
	  math: prefix + '1998/Math/MathML',
	  html: prefix + '1999/xhtml',
	  xlink: prefix + '1999/xlink',
	  xmlns: prefix + '2000/xmlns/',
	  xml: prefix + 'XML/1998/namespace'
	};

	/**
	 * This is so far the core of Solid JS 1.x Reactivity, but ported to
	 * classes and adapted to my taste.
	 *
	 * Adaptation for potas needs include:
	 *
	 * - Ported to Classes what does fit
	 * - Signal has any options
	 * - Writing to a signal returns `boolean` to tell if the value changed
	 * - Signal is an object that could be used as signal.read/write or
	 *   destructuring
	 * - Signals can save and won't run functions
	 * - `update` function on Signal that could be used to use the old value
	 *   to set a new value
	 * - The system is wrapped in a `createReactiveSystem` function so many
	 *   systems can be run at the same time, for example for the
	 *   developer tools context, so dev-tools context doesnt mess up the
	 *   real context
	 *
	 * WARNING: typings here are a mess, Im slowly working on it.
	 *
	 * @url https://www.solidjs.com/
	 * @url https://github.com/solidjs/solid
	 * @url https://github.com/solidjs/signals
	 */

	function createReactiveSystem() {
	  const CLEAN = 0;
	  const STALE = 1;
	  const CHECK = 2;

	  /** @type {undefined | Computation} */
	  let Owner;

	  /** @type {undefined | Computation} */
	  let Listener;

	  /** @type {undefined | Memo[]} */
	  let Updates;

	  /** @type {undefined | any[]} */
	  let Effects;
	  let Time = 0;

	  // ROOT

	  class Root {
	    /** @type {undefined | Root} */
	    owner;

	    /** @type {Computation | Computation[]} */
	    owned;

	    /** @type {undefined | Function | Function[]} */
	    cleanups;

	    /** @type {Record<symbol, unknown>} */
	    context;

	    /**
	     * @param {Computation} owner
	     * @param {object} [options]
	     */
	    constructor(owner, options) {
	      if (owner) {
	        this.owner = owner;
	        if (owner.context) {
	          this.context = owner.context;
	        }
	      }
	      options && assign(this, options);
	    }
	    /** @param {Function} fn */
	    addCleanups(fn) {
	      if (!this.cleanups) {
	        this.cleanups = fn;
	      } else if (isArray(this.cleanups)) {
	        this.cleanups.push(fn);
	      } else {
	        this.cleanups = [this.cleanups, fn];
	      }
	    }
	    /** @param {Function} fn */
	    cleanupCancel(fn) {
	      if (!this.cleanups) {} else if (this.cleanups === fn) {
	        this.cleanups = undefined;
	      } else if (isArray(this.cleanups)) {
	        removeFromArray(this.cleanups, fn);
	      }
	    }
	    /** @param {Computation} value */
	    addOwned(value) {
	      if (!this.owned) {
	        this.owned = value;
	      } else if (isArray(this.owned)) {
	        this.owned.push(value);
	      } else {
	        this.owned = [this.owned, value];
	      }
	    }
	    dispose() {
	      this.disposeOwned();
	      this.doCleanups();
	    }
	    disposeOwned() {
	      if (!this.owned) {} else if (isArray(this.owned)) {
	        for (let i = this.owned.length - 1; i >= 0; i--) {
	          this.owned[i].dispose();
	        }
	        this.owned = undefined;
	      } else {
	        this.owned.dispose();
	        this.owned = undefined;
	      }
	    }
	    doCleanups() {
	      if (!this.cleanups) {} else if (isArray(this.cleanups)) {
	        for (let i = this.cleanups.length - 1; i >= 0; i--) {
	          this.cleanups[i]();
	        }
	        this.cleanups = undefined;
	      } else {
	        this.cleanups();
	        this.cleanups = undefined;
	      }
	    }
	  }

	  // COMPUTATION

	  class Computation extends Root {
	    state = 1; /* STALE */

	    updatedAt = 0;

	    /** @type {Function | undefined} */
	    fn;
	    sources;
	    sourceSlots;

	    /**
	     * @param {Computation} owner
	     * @param {Function} fn
	     * @param {object} [options]
	     */
	    constructor(owner, fn, options) {
	      super(owner, options);
	      this.fn = fn;
	      owner && owner.addOwned(this);
	    }
	    update() {
	      this.dispose();
	      const time = Time;
	      runWith(this.fn, this, this);

	      /*} catch (err) {
	      	this.updatedAt = time + 1
	      }*/

	      if (this.updatedAt < time) {
	        this.updatedAt = time;
	      }
	    }
	    dispose() {
	      if (this.sources && this.sources.length) {
	        let source;
	        let observers;
	        let index;
	        let observer;
	        let slot;
	        while (this.sources.length) {
	          source = this.sources.pop();
	          observers = source.observers;
	          index = this.sourceSlots.pop();
	          if (observers && observers.length) {
	            observer = observers.pop();
	            slot = source.observerSlots.pop();
	            if (index < observers.length) {
	              observer.sourceSlots[slot] = index;
	              observers[index] = observer;
	              source.observerSlots[index] = slot;
	            }
	          }
	        }
	      }
	      super.dispose();
	      this.state = 0; /* CLEAN */
	    }
	    queue() {
	      Effects.push(this);
	    }
	  }
	  class Effect extends Computation {
	    user = true;

	    /**
	     * @param {Computation} owner
	     * @param {Function} fn
	     * @param {object} [options]
	     */
	    constructor(owner, fn, options) {
	      super(owner, fn, options);
	      Effects ? Effects.push(this) : batch(() => this.update());
	    }
	  }
	  class SyncEffect extends Computation {
	    /**
	     * @param {Computation} owner
	     * @param {Function} fn
	     * @param {object} [options]
	     */
	    constructor(owner, fn, options) {
	      super(owner, fn, options);
	      batch(() => this.update());
	    }
	  }

	  // SIGNALS

	  /** @template in T */
	  class Memo extends Computation {
	    value;
	    observers;
	    observerSlots;

	    // options:
	    // equals
	    /**
	     * @param {Computation} owner
	     * @param {Function} fn
	     * @param {object} [options]
	     */
	    constructor(owner, fn, options) {
	      super(owner, fn, options);
	      if (options) {
	        assign(this, options);
	        if (options.equals === false) {
	          this.equals = this.equalsFalse;
	        }
	      }
	    }
	    read = () => {
	      if (this.state === 1 /* STALE */) {
	        this.update();
	      } else if (this.state === 2 /* CHECK */) {
	        const updates = Updates;
	        Updates = undefined;
	        runUpdates(() => upstream(this));
	        Updates = updates;
	      }
	      if (Listener) {
	        const sourceSlot = this.observers ? this.observers.length : 0;
	        if (Listener.sources) {
	          Listener.sources.push(this);
	          Listener.sourceSlots.push(sourceSlot);
	        } else {
	          Listener.sources = [this];
	          Listener.sourceSlots = [sourceSlot];
	        }
	        const observerSlot = Listener.sources.length - 1;
	        if (sourceSlot) {
	          this.observers.push(Listener);
	          this.observerSlots.push(observerSlot);
	        } else {
	          this.observers = [Listener];
	          this.observerSlots = [observerSlot];
	        }
	      }
	      return this.value;
	    };
	    write(value) {
	      if (!this.equals(this.value, value)) {
	        this.value = value;
	        if (this.observers && this.observers.length) {
	          runUpdates(() => {
	            for (const observer of this.observers) {
	              if (observer.state === 0 /* CLEAN */) {
	                observer.queue();
	                observer.observers && downstream(observer);
	              }
	              observer.state = 1; /* STALE */
	            }
	          });
	        }
	      }
	    }
	    /**
	     * @param {T} a
	     * @param {T} b
	     */
	    equals(a, b) {
	      return a === b;
	    }
	    /**
	     * @param {T} a
	     * @param {T} b
	     */
	    equalsFalse(a, b) {
	      return false;
	    }
	    update() {
	      this.dispose();
	      const time = Time;
	      const nextValue = runWith(this.fn, this, this);

	      /*} catch (err) {
	      	this.state = 1 // STALE
	      	this.disposeOwned()
	      		this.updatedAt = time + 1
	      		throw err
	      } */

	      if (this.updatedAt <= time) {
	        this.write(nextValue);
	        this.updatedAt = time;
	      }
	    }
	    queue() {
	      Updates.push(this);
	    }
	  }

	  /** @template in T */
	  class Derived extends Memo {
	    value = nothing;
	    isResolved;

	    /**
	     * @param {Computation} owner
	     * @param {ChainedCallbacks<unknown>[]} fn
	     */
	    constructor(owner, fn) {
	      // @ts-ignore-error
	      super(owner, fn);
	      return this.self();
	    }
	    self() {
	      return assign(/** @type {SignalFunction<Accessed<T>>} */
	      /** @type {unknown} */(...args) => {
	        return args.length ? this.write(args[0]) : this.read();
	      }, this);
	    }
	    resolved = () => {
	      this.read(); // tracking
	      return this.isResolved === null;
	    };
	    run = () => {
	      this.update();
	    };
	    update() {
	      this.dispose();
	      runWith(() => {
	        // @ts-ignore-error
	        this.write(this.fn[0](), this.fn.slice(1));
	      }, this, this);
	      /*
	      	} catch (err) {
	      		this.state = 1 // STALE
	      		this.disposeOwned()
	      			this.updatedAt = time + 1
	      			throw err
	      	}
	      */
	    }
	    write(nextValue, fns) {
	      const time = Time;
	      if (this.updatedAt <= time) {
	        this.isResolved = undefined;
	        withValue(nextValue, nextValue => {
	          if (this.updatedAt <= time) {
	            if (fns && fns.length) {
	              const fn = fns.shift();
	              this.write(() => fn(nextValue), fns);
	            } else {
	              this.isResolved = null;
	              this.writeNextValue(nextValue);
	              this.updatedAt = time;
	              this.resolve && this.resolve(this);
	            }
	          }
	        }, () => {
	          // is a promise so restore `then`
	          this.thenRestore();

	          // remove the old value while the promise is resolving
	          // to avoid the "Florida - New York City" problem
	          this.writeNextValue(nothing);
	        });
	      }
	    }
	    writeNextValue(value) {
	      if (!this.equals(this.value, value)) {
	        this.value = value;
	        if (this.observers && this.observers.length) {
	          runUpdates(() => {
	            for (const observer of this.observers) {
	              if (observer.state === 0 /* CLEAN */) {
	                observer.queue();
	                observer.observers && downstream(observer);
	              }
	              observer.state = 1; /* STALE */
	            }
	          });
	        }
	      }
	    }

	    /**
	     * Thenable stuff. It has to be a property so assign works
	     * properly
	     */
	    then = (resolve, reject) => {
	      this._then(resolve, reject);
	    };
	    _then(resolve, reject) {
	      this.resolve = () => {
	        this.then = undefined;
	        this.resolve = undefined;
	        resolve(this.self());
	      };
	      if (this.resolved()) {
	        this.resolve();
	      }
	    }
	    thenRestore() {
	      if (!this.then) {
	        // TODO: unsure if has to be restored
	        this.then = this._then;
	      }
	    }
	  }

	  // SIGNAL

	  /**
	   * @template in T
	   * @type SignalObject<T>
	   */
	  class Signal {
	    value;

	    /** @private */
	    observers;
	    /** @private */
	    observerSlots;

	    // options:
	    // equals

	    /**
	     * @param {T} [value]
	     * @param {SignalOptions<T>} [options]
	     */
	    constructor(value, options) {
	      this.value = value;
	      if (options) {
	        assign(this, options);
	        if (options.equals === false) {
	          this.equals = this.equalsFalse;
	        }
	      }
	    }
	    /** @returns SignalAccessor<T> */
	    read = () => {
	      if (Listener) {
	        const sourceSlot = this.observers ? this.observers.length : 0;
	        if (Listener.sources) {
	          Listener.sources.push(this);
	          Listener.sourceSlots.push(sourceSlot);
	        } else {
	          Listener.sources = [this];
	          Listener.sourceSlots = [sourceSlot];
	        }
	        const observerSlot = Listener.sources.length - 1;
	        if (sourceSlot) {
	          this.observers.push(Listener);
	          this.observerSlots.push(observerSlot);
	        } else {
	          this.observers = [Listener];
	          this.observerSlots = [observerSlot];
	        }
	      }
	      return this.value;
	    };
	    /**
	     * @param {T} [value]
	     * @returns SignalSetter<T>
	     */
	    write = value => {
	      if (!this.equals(this.value, value)) {
	        this.value = value;
	        if (this.observers && this.observers.length) {
	          runUpdates(() => {
	            for (const observer of this.observers) {
	              if (observer.state === 0 /* CLEAN */) {
	                observer.queue();
	                observer.observers && downstream(observer);
	              }
	              observer.state = 1; /* STALE */
	            }
	          });
	        }
	        return true;
	      }
	      return false;
	    };
	    /**
	     * @type SignalUpdate<T>
	     * @returns SignalUpdate<T>
	     */
	    update = value => this.write(value(this.value));

	    /**
	     * @param {T} a
	     * @param {T} b
	     */
	    equals(a, b) {
	      return a === b;
	    }

	    /**
	     * @param {T} a
	     * @param {T} b
	     */
	    equalsFalse(a, b) {
	      return false;
	    }
	    *[Symbol.iterator]() {
	      /** @type SignalAccessor<T> */
	      yield this.read;
	      /** @type SignalSetter<T> */
	      yield this.write;
	      /** @type SignalUpdate<T> */
	      yield this.update;
	    }
	  }

	  // API

	  /**
	   * Creates a new root
	   *
	   * @template T
	   * @param {(dispose: () => void) => T} fn
	   * @param {object} [options]
	   * @returns {T}
	   */
	  function root(fn, options) {
	    const root = new Root(Owner, options);
	    return runWithOwner(root, () => fn(() => root.dispose()));
	  }

	  /**
	   * Creates a signal
	   *
	   * @template T
	   * @param {T} [initialValue] - Initial value of the signal
	   * @param {SignalOptions<T>} [options] - Signal options
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  function signal(initialValue, options) {
	    return /** @type {SignalObject<T>} */ /** @type {unknown} */new Signal(initialValue, options);
	  }

	  /**
	   * Creates an effect
	   *
	   * @template T
	   * @param {() => T} fn
	   * @param {object} [options]
	   */
	  function effect(fn, options) {
	    new Effect(Owner, fn, options);
	  }

	  /**
	   * Creates an run once effect
	   *
	   * @template T
	   * @param {() => T} fn
	   * @param {object} [options]
	   */
	  function track(fn, options) {
	    let ran;
	    new Effect(Owner, () => {
	      if (ran === undefined) {
	        ran = null;
	        fn();
	      }
	    }, options);
	  }

	  /**
	   * Creates a syncEffect
	   *
	   * @template T
	   * @param {() => T} fn
	   * @param {object} [options]
	   * @returns T
	   */
	  function syncEffect(fn, options) {
	    new SyncEffect(Owner, fn, options);
	  }

	  /**
	   * Creates an effect with explicit dependencies
	   *
	   * @template T
	   * @param {Function} depend - Function that causes tracking
	   * @param {() => T} fn - Function that wont cause tracking
	   * @param {object} [options]
	   */
	  function on(depend, fn, options) {
	    effect(() => {
	      depend();
	      untrack(fn);
	    }, options);
	  }

	  /**
	   * Creates a read-only signal from the return value of a function
	   * that automatically updates
	   *
	   * @template T
	   * @param {() => T} fn - Function to re-run when dependencies change
	   * @param {SignalOptions<T>} [options]
	   * @returns {SignalAccessor<T>}
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  function memo(fn, options = undefined) {
	    return /** @type {SignalAccessor<T>} */ /** @type {unknown} */new Memo(Owner, fn, options).read;
	  }

	  /**
	   * Lazy and writable version of `memo` that unwraps and tracks
	   * functions and promises recursively
	   *
	   * @template T
	   * @param {...ChainedCallbacks<unknown>} fn - Function(s) to re-run
	   *   when dependencies change
	   * @returns {import('../../pota.d.ts').Derived<Accessed<T>>}
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  function derived(...fn) {
	    return /** @type {import('../../pota.d.ts').Derived<Accessed<T>>} */ /** @type {unknown} */new Derived(Owner, fn);
	  }

	  /**
	   * Batches changes to signals
	   *
	   * @template T
	   * @param {() => T} fn
	   */
	  const batch = runUpdates;

	  /**
	   * Returns current owner
	   *
	   * @returns {Computation}
	   */
	  function owner() {
	    return Owner;
	  }

	  /**
	   * Runs a function with owner and listener
	   *
	   * @param {Function} fn
	   * @param {Computation} owner
	   * @param {Listener} [listener]
	   */
	  function runWith(fn, owner, listener = undefined) {
	    if (listener === Listener && owner === Owner) {
	      return fn();
	    }
	    const prevOwner = Owner;
	    const prevListener = Listener;
	    Owner = owner;
	    Listener = listener;
	    try {
	      return fn();
	    } finally {
	      Owner = prevOwner;
	      Listener = prevListener;
	    }
	  }
	  function runWithOwner(owner, fn) {
	    return runWith(() => runUpdates(fn, true), owner);
	  }

	  /**
	   * Disables tracking for a function
	   *
	   * @template T
	   * @param {() => T} fn - Function to run with tracking disabled
	   * @returns {T}
	   */
	  function untrack(fn) {
	    if (Listener === undefined) {
	      return fn();
	    }
	    return runWith(fn, Owner);
	  }

	  /**
	   * Runs a callback on cleanup, returns callback
	   *
	   * @template {Function} T
	   * @param {T} fn
	   * @returns {T}
	   */
	  function cleanup(fn) {
	    Owner?.addCleanups(fn);
	    return fn;
	  }

	  // UPDATES

	  function runTop(node) {
	    switch (node.state) {
	      case 0 /* CLEAN */:
	        {
	          break;
	        }
	      case 2 /* CHECK */:
	        {
	          upstream(node);
	          break;
	        }
	      default:
	        {
	          const ancestors = [];
	          do {
	            node.state && ancestors.push(node);
	            node = node.owner;
	          } while (node && node.updatedAt < Time);
	          for (let i = ancestors.length - 1, updates; i >= 0; i--) {
	            node = ancestors[i];
	            switch (node.state) {
	              case 1 /* STALE */:
	                {
	                  node.update();
	                  break;
	                }
	              case 2 /* CHECK */:
	                {
	                  updates = Updates;
	                  Updates = undefined;
	                  runUpdates(() => upstream(node, ancestors[0]));
	                  Updates = updates;
	                  break;
	                }
	            }
	          }
	        }
	    }
	  }

	  /**
	   * @template T
	   * @param {() => T} fn
	   * @param {boolean} init
	   * @returns {T}
	   */
	  function runUpdates(fn, init = false) {
	    if (Updates) {
	      return fn();
	    }
	    let wait = false;
	    if (!init) {
	      Updates = [];
	    }
	    if (Effects) {
	      wait = true;
	    } else {
	      Effects = [];
	    }
	    Time++;
	    try {
	      const res = fn();
	      if (Updates) {
	        for (const update of Updates) {
	          runTop(update);
	        }
	      }
	      Updates = undefined;
	      if (!wait) {
	        const effects = Effects;
	        Effects = undefined;
	        effects.length && runUpdates(() => runEffects(effects));
	      }
	      return res;
	    } catch (err) {
	      if (!wait) {
	        Effects = undefined;
	      }
	      Updates = undefined;
	      throw err;
	    }
	  }
	  function runEffects(queue) {
	    let userLength = 0;
	    for (const effect of queue) {
	      if (effect.user) {
	        queue[userLength++] = effect;
	      } else {
	        runTop(effect);
	      }
	    }
	    for (let i = 0; i < userLength; i++) {
	      runTop(queue[i]);
	    }
	  }
	  function upstream(node, ignore) {
	    node.state = 0; /* CLEAN */

	    for (const source of node.sources) {
	      if (source.sources) {
	        switch (source.state) {
	          case 1 /* STALE */:
	            {
	              if (source !== ignore && source.updatedAt < Time) {
	                runTop(source);
	              }
	              break;
	            }
	          case 2 /* CHECK */:
	            {
	              upstream(source, ignore);
	              break;
	            }
	        }
	      }
	    }
	  }
	  function downstream(node) {
	    for (const observer of node.observers) {
	      if (observer.state === 0 /* CLEAN */) {
	        observer.state = 2; /* CHECK */
	        observer.queue();
	        observer.observers && downstream(observer);
	      }
	    }
	  }

	  /**
	   * Creates a context and returns a function to get or set the value
	   *
	   * @template T
	   * @param {T} [defaultValue] - Default value for the context
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  function context(defaultValue = undefined) {
	    const id = Symbol();

	    /**
	     * @overload Runs `fn` with a new value as context
	     * @param {T} newValue - New value for the context
	     * @param {() => Children} fn - Callback to run with the new
	     *   context value
	     * @returns {Children} Context value
	     */
	    /**
	     * @overload Gets the context value
	     * @returns {T} Context value
	     */
	    function useContext(newValue, fn) {
	      if (newValue === undefined) {
	        return Owner?.context && Owner.context[id] !== undefined ? Owner.context[id] : defaultValue;
	      } else {
	        let ret;
	        syncEffect(() => {
	          Owner.context = {
	            ...Owner.context,
	            [id]: newValue
	          };
	          ret = untrack(fn);
	        });
	        return ret;
	      }
	    }

	    /**
	     * Sets the `value` for the context
	     *
	     * @param {object} props
	     * @param {Partial<T>} props.value
	     * @param {Children} props.children
	     * @returns {Children} Children
	     * @url https://pota.quack.uy/Reactivity/Context
	     */
	    useContext.Provider = props =>
	    // @ts-expect-error
	    useContext(props.value, () => context.toHTML(props.children));

	    /**
	     * Maps context following `parent` property (if any). When `true`
	     * is returned from the callback it stops walking.
	     *
	     * @param {(context: T) => boolean | void} callback
	     * @param {T} [context]
	     */
	    useContext.walk = (callback, context) => walkParents(context || useContext(), 'parent', callback);
	    return useContext;
	  }

	  /**
	   * Returns an owned function, that will only run if the owner wasnt
	   * dispose already. `onCancel` will run if the owner of the owned
	   * function is disposed, and wont run if the owned function runs.
	   *
	   * @template T
	   * @template A
	   * @param {((...args: A[]) => T) | Function} cb
	   * @param {() => void} [onCancel]
	   */
	  const owned = (cb, onCancel) => {
	    if (cb) {
	      const o = Owner;

	      /**
	       * Canceling prevent the callback from running and runs
	       * `onCancel` if provided.
	       */
	      let cleaned;
	      const clean = cleanup(() => {
	        cleaned = null;
	        onCancel && onCancel();
	      });
	      return (...args) => {
	        o?.cleanupCancel(clean);
	        return cleaned !== null && runWithOwner(o, () => cb(...args));
	      };
	    }
	    return noop;
	  };

	  /**
	   * Unwraps and tracks functions and promises recursively providing
	   * the result to a callback
	   *
	   * @template T
	   * @param {Accessor<T> | Promise<T>} value
	   * @param {(value: T) => void} fn
	   */
	  function withValue(value, fn, writeDefaultValue = noop) {
	    if (isFunction(value)) {
	      // TODO maybe change this to be a memo
	      effect(() => withValue(value(), fn, writeDefaultValue));
	    } else if (isPromise(value)) {
	      asyncTracking.add();
	      /**
	       * WriteDefaultValue is used to avoid a double write. If the
	       * value has no promises, then it will be a native value or a
	       * function, which will resolve without having to wait.
	       *
	       * In case of promises, the value is resolved at a later point
	       * in time, so we need an intermediate default
	       */
	      writeDefaultValue();
	      value.then(owned(value => {
	        asyncTracking.remove();
	        withValue(value, fn, noop);
	      }, () => asyncTracking.remove()));
	    } else {
	      fn(value);
	    }
	  }

	  /**
	   * Unwraps functions and promises recursively canceling if owner
	   * gets disposed
	   *
	   * @template T
	   * @param {Accessor<T> | Promise<T>} value
	   * @param {ChainedCallbacks<T>[]} cbs
	   */
	  const resolve = (value, cbs) => isFunction(value) ? track(() => resolve(getValue(value), cbs)) : isPromise(value) ? value.then(owned(value => resolve(value, cbs))) : cbs.length ? resolve(() => cbs[0](value), cbs.slice(1)) : value;

	  /**
	   * Unwraps functions and promises recursively canceling if owner
	   * gets disposed
	   *
	   * @template T
	   * @param {...ChainedCallbacks<T>} cbs
	   */
	  const action = (...cbs) => owned((...args) => resolve(() => cbs[0](...args), cbs.slice(1)));

	  /** Utilities exposed for tracking async work from user-land. */

	  const asyncTracking = (() => {
	    let added = false;
	    let fns = [];
	    let count = 0;
	    function add() {
	      count++;
	    }
	    function remove() {
	      --count === 0 && queue();
	    }
	    function ready(fn) {
	      fns.push(owned(fn));
	      queue();
	    }
	    function queue() {
	      if (!added && fns.length) {
	        added = true;
	        queueMicrotask(() => queueMicrotask(() => run()));
	      }
	    }
	    function run() {
	      added = false;
	      if (count === 0) {
	        const cbs = fns.slice();
	        fns.length = 0;
	        call(cbs);
	      }
	    }
	    return {
	      add,
	      remove,
	      ready
	    };
	  })();

	  /** Suspense */
	  class createSuspenseContext {
	    s = signal(false);
	    c = 0;
	    add() {
	      this.c++;
	      asyncTracking.add();
	    }
	    remove() {
	      if (--this.c === 0) {
	        this.s.write(true);
	      }
	      asyncTracking.remove();
	    }
	    isEmpty() {
	      return this.c === 0;
	    }
	  }
	  const useSuspense = context(new createSuspenseContext());

	  // export

	  return {
	    action,
	    asyncTracking,
	    batch,
	    cleanup,
	    context,
	    createSuspenseContext,
	    derived,
	    effect,
	    memo,
	    on,
	    owned,
	    owner,
	    root,
	    runWithOwner,
	    signal,
	    syncEffect,
	    untrack,
	    useSuspense,
	    withValue
	  };
	}

	const {
	  action,
	  asyncTracking,
	  batch,
	  cleanup,
	  context,
	  createSuspenseContext,
	  derived,
	  effect,
	  memo,
	  on,
	  owned,
	  owner,
	  root,
	  runWithOwner,
	  signal,
	  syncEffect,
	  untrack,
	  useSuspense,
	  withValue
	} = createReactiveSystem();

	/**
	 * A self contained signal function, when an argument is present it
	 * writes to the signal, when theres no argument it reads the signal.
	 *
	 * @template T
	 * @param {T} [value] - Optional initial value
	 * @returns {SignalFunction<T>}
	 */
	function signalFunction(value) {
	  const [read, write] = signal(value);
	  // @ts-expect-error
	  return (...args) => args.length ? write(args[0]) : read();
	}

	/**
	 * To set and read refs. To use in ref attribute.
	 *
	 * @template {DOMElement} T
	 * @returns {SignalFunction<T>}
	 */
	const ref = () => signalFunction();

	/**
	 * Runs a function inside an effect if value is a function
	 *
	 * @param {unknown} value
	 * @param {(value: unknown, prev?: unknown) => unknown} fn
	 */
	function withPrevValue(value, fn) {
	  if (isFunction(value)) {
	    let prev;
	    effect(() => {
	      const val = getValue(value);
	      fn(val, prev);
	      prev = val;
	    });
	  } else {
	    fn(value);
	  }
	}

	/**
	 * Returns `true` when all derived has been resolved
	 *
	 * @template {Derived<unknown>} T
	 * @param {...T} args
	 * @returns {boolean}
	 */
	function isResolved(...args) {
	  // @ts-ignore-error
	  return !args.some(x => !x.resolved());
	}

	/**
	 * Creates an asynchronously effect
	 *
	 * @param {(currentRunningEffect: Promise<any>) => any} fn - A
	 *   function that receives a `currentRunningEffect` that should be
	 *   awaited for when wanting to run effects synchronously, that's it
	 *   one effect after another.
	 */
	function asyncEffect(fn) {
	  const queue = [];
	  effect(() => {
	    const {
	      promise,
	      resolve
	    } = withResolvers();
	    queue.push(promise);
	    function onDone() {
	      removeFromArray(queue, promise);
	      resolve();
	    }
	    resolved(fn(queue.length === 1 ? undefined : queue[queue.length - 2]), onDone);
	  });
	}

	/** @param {() => unknown} fn */
	const microtask = fn => queueMicrotask(owned(fn));

	// MAP

	class Row {
	  runId;
	  item;
	  index;
	  isDupe;
	  disposer;
	  nodes;
	  indexSignal;
	  _begin;
	  _end;
	  constructor(item, index, fn, isDupe, reactiveIndex) {
	    this.item = item;
	    this.index = index;
	    this.isDupe = isDupe;
	    root(disposer => {
	      this.disposer = disposer;
	      if (reactiveIndex) {
	        this.indexSignal = signal(index);
	        /** @type Children[] */
	        this.nodes = fn(item, this.indexSignal.read);
	      } else {
	        /** @type Children[] */
	        this.nodes = fn(item, index);
	      }
	    });
	  }
	  updateIndex(index) {
	    if (this.index !== index) {
	      this.index = index; // save sort order
	      if (this.indexSignal) {
	        this.indexSignal.write(index);
	      }
	    }
	  }
	  begin() {
	    if (!this._begin) {
	      this.getBegin(this.nodes);
	    }
	    return this._begin;
	  }
	  getBegin(nodes) {
	    if (isArray(nodes)) {
	      return this.getBegin(nodes[0]);
	    }
	    this._begin = nodes;
	  }
	  end() {
	    if (!this._end) {
	      this.getEnd(this.nodes);
	    }
	    return this._end;
	  }
	  getEnd(nodes) {
	    if (isArray(nodes)) {
	      return this.getEnd(nodes[nodes.length - 1]);
	    }
	    this._end = nodes;
	  }
	  nodesForRow() {
	    const begin = this.begin();
	    const end = this.end();
	    const nodes = [begin];
	    let nextSibling = begin;
	    while (nextSibling !== end) {
	      nextSibling = nextSibling.nextSibling;
	      nodes.push(nextSibling);
	    }
	    return nodes;
	  }
	}

	/**
	 * Reactive Map
	 *
	 * @template T
	 * @param {Each<T>} list
	 * @param {(...args: unknown[]) => Children} callback
	 * @param {boolean} [noSort]
	 * @param {Children} [fallback]
	 * @param {boolean} [reactiveIndex] - Make indices reactive signals
	 */
	function map(list, callback, noSort, fallback, reactiveIndex) {
	  const cache = new Map();
	  const duplicates = new Map(); // for when caching by value is not possible [1, 2, 1, 1, 1]

	  let runId = 0;

	  /** @type Row[] */
	  let rows = [];
	  /** @type Row[] */
	  let prev = [];
	  function clear() {
	    for (const row of prev) {
	      row.disposer();
	    }
	    cache.clear();
	    duplicates.clear();
	    rows.length = 0;
	    prev.length = 0;
	  }

	  // to get rid of all nodes when parent disposes
	  cleanup(clear);
	  function dispose(row) {
	    // delete from cache
	    if (!row.isDupe) {
	      cache.delete(row.item);
	    } else {
	      const arr = duplicates.get(row.item);
	      arr.length === 1 ? duplicates.delete(row.item) : removeFromArray(arr, row);
	    }
	    row.disposer();
	  }

	  /**
	   * @param {Function} [fn]
	   * @returns {Children}
	   */
	  function mapper(fn) {
	    const cb = fn ? (item, index) => fn(callback(item, index), index) : callback;
	    const value = getValue(list) || emptyArray;

	    /** To allow iterate objects as if were an array with indexes */
	    const items = toEntries(value);
	    runId++;
	    rows = [];
	    const hasPrev = prev.length;
	    for (const [index, item] of items) {
	      let row = hasPrev ? cache.get(item) : undefined;
	      if (row === undefined) {
	        // if the item doesnt exists, create it
	        row = new Row(item, index, cb, false, reactiveIndex);
	        cache.set(item, row);
	      } else if (row.runId === runId) {
	        // a map will save only 1 of any primitive duplicates, say: [1, 1, 1, 1]
	        // if the saved value was already used on this run, create a new one
	        let dupes = duplicates.get(item);
	        if (!dupes) {
	          dupes = [];
	          duplicates.set(item, dupes);
	        }
	        for (const dupe of dupes) {
	          if (dupe.runId !== runId) {
	            row = dupe;
	            break;
	          }
	        }
	        if (row.runId === runId) {
	          row = new Row(item, index, cb, true, reactiveIndex);
	          dupes.push(row);
	        }
	      }
	      row.runId = runId; // mark used on this run
	      row.updateIndex(index); // Update existing row's index (reactive if needed)
	      rows.push(row);
	    }

	    // fast clear
	    if (rows.length === 0) {
	      hasPrev && clear();
	      prev = rows;
	      return fallback ? fn(fallback) : emptyArray;
	    }

	    // sort
	    if (hasPrev) {
	      // remove rows that arent present on the current run
	      for (let i = 0; i < prev.length; i++) {
	        if (prev[i].runId !== runId) {
	          dispose(prev[i]);
	          removeFromArray(prev, prev[i--]);
	        }
	      }

	      // reorder elements
	      // `rows.length > 1` because no need for sorting when there are no items
	      // `prev.length > 0` to skip sorting on creation as its already sorted
	      if (!noSort && rows.length > 1 && prev.length) {
	        // when appending to already created it shouldnt sort
	        // as its already sorted
	        const unsort = [];
	        for (let i = 0; i < prev.length && i < rows.length; i++) {
	          if (prev[i] !== rows[i]) {
	            unsort.push(rows[i]);
	          }
	        }
	        if (unsort.length) {
	          let unsorted = unsort.length;
	          if (unsorted) {
	            const sorted = [];

	            // handle swap - unsorted rows should move only next to already sorted
	            for (const usort of unsort) {
	              if (rows[usort.index - 1] && (!unsort.includes(rows[usort.index - 1]) || sorted.includes(rows[usort.index - 1]))) {
	                rows[usort.index - 1].end().after(...usort.nodesForRow());
	                sorted.push(usort);
	                unsorted--;
	              } else if (rows[usort.index + 1] && (!unsort.includes(rows[usort.index + 1]) || sorted.includes(rows[usort.index - 1]))) {
	                rows[usort.index + 1].begin().before(...usort.nodesForRow());
	                sorted.push(usort);
	                unsorted--;
	              }
	            }
	            if (unsorted) {
	              // handles all other cases
	              // best for any combination of: push/pop/shift/unshift/insertion/deletion
	              // must check in reverse as on creation stuff is added to the end

	              let current = rows[rows.length - 1];
	              for (let i = rows.length - 1; i > 0; i--) {
	                const previous = rows[i - 1];
	                if (current.begin().previousSibling !== previous.end()) {
	                  current.begin().before(...previous.nodesForRow());
	                }
	                current = previous;
	              }
	            }
	          }
	        }
	      }
	    }

	    // save sorted list
	    prev = rows;

	    // return external representation
	    return rows.map(item => item.nodes);
	  }
	  mapper[$isMap] = undefined;
	  return mapper;
	}

	/**
	 * Resolves and returns `children` in a memo. A memo in a memo, so
	 * reactivity on the inner memo doesnt trigger reactivity outside.
	 *
	 * @template {Children} T
	 * @param {T | (() => T)} fn
	 * @url https://pota.quack.uy/resolve
	 */
	function resolve(fn) {
	  const children = isFunction(fn) ? memo(fn) : () => fn;
	  return memo(() => unwrap(children()));
	}

	/**
	 * Recursively unwrap children functions
	 *
	 * @param {Children} children
	 */
	function unwrap(children) {
	  if (isFunction(children)) {
	    return unwrap(children());
	  }
	  if (isArray(children)) {
	    const childrens = [];
	    for (let child of children) {
	      child = unwrap(child);
	      isArray(child) ? childrens.push(...child) : childrens.push(child);
	    }
	    return childrens;
	  }
	  return children;
	}

	/**
	 * Returns true if the `value` is a `Component`
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isComponent = value => isFunction(value) && $isComponent in value;

	/**
	 * Makes of `children` a function. Reactive children will run as is,
	 * non-reactive children will run untracked, regular children will
	 * just return.
	 *
	 * @template {Children | Children[]} T
	 * @param {T} children
	 * @returns {(...args: unknown[]) => T}
	 */
	function makeCallback(children) {
	  /** Shortcut the most used case */
	  if (isFunction(children)) {
	    return markComponent(children);
	  }

	  /**
	   * When children is an array, as in `>${[0, 1, 2]}<` then children
	   * will end as `[[0, 1, 2]]`, so flat it
	   */
	  const childrenMaybeArray = flatNoArray(children);
	  return isArray(childrenMaybeArray) ? markComponent((...args) => childrenMaybeArray.map(child => isFunction(child) ? child(...args) : child)) : markComponent((...args) => isFunction(childrenMaybeArray) ? childrenMaybeArray(...args) : childrenMaybeArray);
	}

	/**
	 * Marks a function as a `Component`.
	 *
	 * Allows to tell a `signal function` from a `component function`.
	 * Signals and user functions go in effects, for reactivity.
	 * Components and callbacks are untracked and wont go in effects to
	 * avoid re-rendering if signals are used in the components body
	 */
	function markComponent(fn) {
	  fn[$isComponent] = undefined;
	  return fn;
	}

	/**
	 * Adds an event listener to a node
	 *
	 * @template {Document | typeof window | DOMElement} TargetElement
	 * @param {TargetElement} node - Element to add the event listener
	 * @param {EventName} type - The name of the event listener
	 * @param {EventHandler<Event, TargetElement>} handler - Function to
	 *   handle the event
	 * @returns {Function} - An `off` function for removing the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function addEvent(node, type, handler) {
	  node.addEventListener(type, /** @type {EventListenerOrEventListenerObject} */
	  /** @type unknown */handler, !isFunction(handler) ? (/** @type {EventHandlerOptions} */handler) : undefined);

	  /**
	   * Removes event on tracking scope disposal.
	   *
	   * Situation: the event was added to the `document` or `window`
	   * manually using `addEvent`, say to listen for clicks as a "click
	   * outside". The event needs to be removed when the component that
	   * added it is disposed.
	   */

	  return cleanup(() => removeEvent(node, type, handler));
	}

	/**
	 * Removes an event listener from a node
	 *
	 * @template {Document | typeof window | DOMElement} TargetElement
	 * @param {TargetElement} node - Element to add the event listener
	 * @param {EventName} type - The name of the event listener
	 * @param {EventHandler<Event, TargetElement>} handler - Function to
	 *   handle the event
	 * @returns {Function} - An `on` function for adding back the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function removeEvent(node, type, handler) {
	  node.removeEventListener(type, /** @type {EventListenerOrEventListenerObject} */
	  /** @type unknown */handler, !isFunction(handler) ? (/** @type {EventHandlerOptions} */handler) : undefined);
	  return () => addEvent(node, type, handler);
	}

	/**
	 * It gives a handler an owner, so stuff runs batched on it, and
	 * things like context and cleanup work
	 *
	 * @template {EventHandler<Event, Element>} T
	 * @param {T} handler
	 */
	const ownedEvent = handler => 'handleEvent' in handler ? {
	  ...handler,
	  handleEvent: owned(e => handler.handleEvent(e))
	} : owned(handler);

	const document = window.document;
	const head = document?.head;

	/**
	 * Checks whether a node is connected to a document tree.
	 *
	 * @param {Node} node
	 * @returns {boolean}
	 */
	const isConnected = node => node.isConnected;

	/** @returns {Element | null} The currently focused element. */
	const activeElement = () => document.activeElement;

	/**
	 * @returns {Element | undefined} The root `<html>` element if
	 *   available.
	 */
	const documentElement = document?.documentElement;

	/** DocumentFragment constructor exposed for convenience. */
	const DocumentFragment = window.DocumentFragment;

	/**
	 * Safely binds a document method so it can be called later.
	 *
	 * @param {string} fn
	 * @returns {Function | undefined}
	 */
	const bind = fn => document && document[fn].bind(document);
	const createElement = bind('createElement');
	const createElementNS = bind('createElementNS');
	const createTextNode = bind('createTextNode');
	const createComment = bind('createComment');
	const importNode = bind('importNode');
	const createTreeWalker = bind('createTreeWalker');

	// part

	/**
	 * Adds a part token to an element, enabling ::part styling.
	 *
	 * @param {Element & { part: DOMTokenList }} node
	 * @param {string} partName
	 * @returns {void}
	 */
	const addPart = (node, partName) => node.part.add(partName);

	/**
	 * Removes a part token from an element.
	 *
	 * @param {Element & { part: DOMTokenList }} node
	 * @param {string} partName
	 * @returns {void}
	 */
	const removePart = (node, partName) => node.part.remove(partName);

	// tokenList

	/**
	 * Splits a string by whitespace into tokens; returns `emptyArray` for
	 * falsy input.
	 *
	 * @param {string | undefined | null} s
	 * @returns {string[]}
	 */
	const tokenList = s => s ? s.trim().split(/\s+/) : (/** @type string[] */ /** @type unknown */emptyArray);

	/**
	 * Adds CSS classes to an element using either a string or an array.
	 *
	 * @param {Element} node
	 * @param {string | string[]} className
	 */
	const addClass = (node, className) => className.length && node.classList.add(...(isArray(className) ? className : tokenList(className)));

	/**
	 * Removes CSS classes from an element using either a string or an
	 * array.
	 *
	 * @param {Element} node
	 * @param {string | string[]} className
	 */
	const removeClass = (node, className) => className.length && node.classList.remove(...(isArray(className) ? className : tokenList(className)));

	// attributes

	/**
	 * Sets an attribute on a node.
	 *
	 * @param {Element} node
	 * @param {string} name
	 * @param {string} value
	 */
	const setAttribute$1 = (node, name, value) => node.setAttribute(name, value);

	/**
	 * Determines whether an attribute exists on a node.
	 *
	 * @param {Element} node
	 * @param {string} name
	 * @returns {boolean}
	 */
	const hasAttribute = (node, name) => node.hasAttribute(name);

	/**
	 * Removes an attribute from a node.
	 *
	 * @param {Element} node
	 * @param {string} name
	 */
	const removeAttribute = (node, name) => node.removeAttribute(name);

	// selector

	/**
	 * Finds the first matching descendant of `node` using a CSS selector.
	 *
	 * @param {ParentNode} node
	 * @param {string} query
	 * @returns {Element | null}
	 */
	const querySelector = (node, query) => node.querySelector(query);

	/**
	 * Finds all matching descendants of `node` using a CSS selector.
	 *
	 * @param {ParentNode} node
	 * @param {string} query
	 * @returns {NodeListOf<Element>}
	 */
	const querySelectorAll = (node, query) => node.querySelectorAll(query);

	/**
	 * Returns `document` for element. That could be a `shadowRoot`
	 *
	 * @template {Element | DocumentFragment} T
	 * @param {T} node
	 * @returns {Document | ShadowRoot}
	 */
	const getDocumentForElement = node => {
	  const document = /** @type {Document | ShadowRoot} */
	  node.getRootNode();
	  const {
	    nodeType
	  } = document;
	  // getRootNode returns:
	  // 1. Node for isConnected = false
	  // 2. Document for isConnected = true
	  // 3. ShadowRoot for custom elements

	  // always return a Document-like
	  return nodeType === 11 /* DOCUMENT_FRAGMENT_NODE (11) */ || nodeType === 9 /* DOCUMENT_NODE (9)*/ ? document : node.ownerDocument;
	};

	/**
	 * Traverses element nodes depth-first collecting up to `max` results.
	 *
	 * @param {TreeWalker} walk
	 * @param {Node} node
	 * @param {number} [max=Infinity] Default is `Infinity`
	 * @param {Node[]} [nodes=[]] Default is `[]`
	 * @returns {Node[]}
	 */
	const walkElements = function (walk, node, max = Infinity, nodes = []) {
	  /**
	   * The first node is not walked by the walker.
	   *
	   * Also the first node could be a DocumentFragment
	   */
	  node.nodeType === 1 && nodes.push(node);
	  walk.currentNode = node;
	  while (nodes.length !== max && (node = walk.nextNode())) {
	    nodes.push(node);
	  }
	  return nodes;
	}.bind(null, createTreeWalker && createTreeWalker(document, 1 /*NodeFilter.SHOW_ELEMENT*/));

	/**
	 * Unwraps `value` and returns `element` if result is a `Node`, else
	 * `undefined` in the case isn't a `Node`
	 *
	 * @template T
	 * @param {T} value - Maybe function
	 * @param {...unknown} args? - Arguments
	 * @returns {DOMElement | T | undefined}
	 */
	function getValueElement(value, ...args) {
	  const element = getValueWithArguments(value, ...args);
	  return element instanceof Node ? element : undefined;
	}

	const CSSStyleSheet$1 = window.CSSStyleSheet;

	/**
	 * Creates tagged css and returns a CSSStyleSheet. Mostly for css
	 * highlighting in js
	 *
	 * @param {TemplateStringsArray} template
	 * @param {...any} values
	 * @returns {CSSStyleSheet}
	 */
	const css = (template, ...values) => sheet(String.raw({
	  raw: template
	}, ...values));

	/**
	 * Creates a stylesheet from a css string
	 *
	 * @param {string} css
	 * @returns {CSSStyleSheet}
	 */
	const sheet = withCache(css => {
	  const sheet = new CSSStyleSheet$1();
	  /**
	   * Replace is asynchronous and can accept `@import` statements
	   * referencing external resources.
	   */
	  sheet.replace(css);
	  return sheet;
	});

	/**
	 * Returns `adoptedStyleSheets` for a document
	 *
	 * @param {Document | ShadowRoot} document
	 */
	const getAdoptedStyleSheets = document => document?.adoptedStyleSheets;
	const adoptedStyleSheets = /* #__PURE__*/getAdoptedStyleSheets(document);

	/**
	 * Adds a style sheet to the document
	 *
	 * @param {Document | ShadowRoot} document
	 * @param {CSSStyleSheet} styleSheet
	 */
	const addAdoptedStyleSheet = (document, styleSheet) => getAdoptedStyleSheets(document).push(styleSheet);

	/**
	 * Removes a style sheet from the document
	 *
	 * @param {Document | ShadowRoot} document
	 * @param {CSSStyleSheet} styleSheet
	 */
	const removeAdoptedStyleSheet = (document, styleSheet) => removeFromArray(getAdoptedStyleSheets(document), styleSheet);

	/**
	 * Adds multiple stylesheets to a document or shadow root.
	 *
	 * @param {Document | ShadowRoot} document - The document or shadow
	 *   root to add the stylesheets to.
	 * @param {(CSSStyleSheet | string)[]} styleSheets - Array of
	 *   stylesheets or stylesheet URLs to add.
	 */
	function addStyleSheets(document, styleSheets = []) {
	  for (const sheet of styleSheets) {
	    if (sheet) {
	      sheet instanceof CSSStyleSheet$1 ? addAdoptedStyleSheet(document, sheet) : addStyleSheetExternal(document, sheet);
	    }
	  }
	}

	/**
	 * Adds the stylesheet from urls. It uses a cache, to avoid having to
	 * fire a request for each external sheet when used in more than one
	 * custom element. Also, all reference the same object.
	 *
	 * @param {Document | ShadowRoot} document
	 * @param {string} text
	 */
	const addStyleSheetExternal = withState((state, document, text) => {
	  state.get(text, text => text.startsWith('http') ? fetch(text).then(r => r.text()).then(css => sheet(css)) : promise(resolve => resolve(sheet(text)))).then(styleSheet => addAdoptedStyleSheet(document, styleSheet));
	});

	/**
	 * The purpose of this file is to guarantee the timing of some
	 * callbacks. It queues a microtask, then the callbacks are added to a
	 * position in the array. These are run with a priority.
	 */

	/** @type boolean */
	let added;

	/** @type (()=>void)[][] */
	let queue;

	/** Initializes the priority queue buckets and clears the pending flag. */
	function reset() {
	  queue = [[], [], [], [], [], []];
	  added = false;
	}

	// initialization
	reset();

	/**
	 * Queues a callback at a priority
	 *
	 * @param {PropertyKey} priority - Priority
	 * @param {() => void} fn - Function to run once the callbacks at this
	 *   priority run
	 */
	function add(priority, fn) {
	  if (!added) {
	    added = true;
	    queueMicrotask(run);
	  }
	  queue[priority].push(owned(fn));
	}

	/** Runs and clears the current queue batch. */
	function run() {
	  const q = queue;
	  reset();
	  for (const fns of q) {
	    fns.length && call(fns);
	  }
	}

	/**
	 * Queue a function to run before everything else (onProps, onRef,
	 * onMount, ready) ex focus restoration
	 *
	 * @param {() => void} fn
	 */
	const onFixes = fn => add(0, fn);

	/**
	 * Queue a function to run before (onRef, onMount, ready) ex running
	 * user functions on elements via plugins
	 *
	 * @param {() => void} fn
	 */
	const onProps = fn => add(1, fn);

	/**
	 * Queue a function to run onMount (before ready, after onRef)
	 *
	 * @param {() => void} fn
	 */
	const onMount = fn => add(2, fn);

	/**
	 * Queue a function to run on ready (after onMount)
	 *
	 * @param {() => void} fn
	 * @url https://pota.quack.uy/ready
	 */
	const ready = fn => add(3, fn);

	/**
	 * Queue a function to run after all user defined processes
	 *
	 * @param {() => void} fn
	 */
	const onDone = fn => add(4, fn);

	/**
	 * Registers a callback that runs when all async tasks complete.
	 *
	 * @param {() => void} fn
	 */
	const readyAsync = asyncTracking.ready;

	const plugins = cacheStore();
	const pluginsNS = cacheStore();

	/** @type {Set<string> & { xmlns?: string }} */
	const namespaces = new Set(['on', 'prop', 'class', 'style', 'use']);

	/**
	 * Updates the xmlns string containing all registered namespaces Used
	 * for XML serialization of components
	 */
	function updateNamespaces() {
	  namespaces.xmlns = toArray(namespaces).map(ns => `xmlns:${ns}="/"`).join(' ');
	}
	updateNamespaces();

	/**
	 * Defines a prop that can be used on any Element
	 *
	 * @template T
	 * @param {string} propName - Name of the prop
	 * @param {(node: DOMElement, propValue: T) => void} fn - Function to
	 *   run when this prop is found on any Element
	 * @param {boolean} [onMicrotask=true] - To avoid the problem of
	 *   needed props not being set, or children elements not created yet.
	 *   Default is `true`
	 * @url https://pota.quack.uy/props/propsPlugin
	 */
	const propsPlugin = (propName, fn, onMicrotask) => {
	  plugin(plugins, propName, fn, onMicrotask);
	};

	/**
	 * Defines a namespaced prop that can be used on any Element
	 *
	 * @template T
	 * @param {string} NSName - Name of the namespace
	 * @param {(
	 * 	node: DOMElement,
	 * 	localName: string,
	 * 	propValue: T,
	 * 	ns?: string,
	 * ) => void} fn
	 *   - Function to run when this prop is found on any Element
	 *
	 * @param {boolean} [onMicrotask=true] - Set to run on a microtask to
	 *   avoid the problem of needed props not being set, or children
	 *   elements not being created yet. Default is `true`
	 */
	const propsPluginNS = (NSName, fn, onMicrotask) => {
	  // update namespace for the `xml` function
	  namespaces.add(NSName);
	  updateNamespaces();
	  plugin(pluginsNS, NSName, fn, onMicrotask);
	};

	/**
	 * Internal helper to register a prop plugin in a plugin store
	 *
	 * @param {typeof plugins} plugins - Plugin store to register in
	 * @param {string} name - Name of the plugin/prop
	 * @param {Function} fn - Handler function to run when prop is found
	 * @param {boolean} [onMicrotask=true] - Whether to run on microtask.
	 *   Default is `true`
	 */
	const plugin = (plugins, name, fn, onMicrotask = true) => {
	  plugins.set(name, !onMicrotask ? fn : (...args) => onProps(() => fn(...args)));
	};

	/**
	 * Sets DOM properties while unwrapping reactive accessors.
	 *
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @url https://pota.quack.uy/props/setProperty
	 */
	const setProperty = (node, name, value) => {
	  withValue(value, value => _setProperty(node, name, value));
	};

	/**
	 * Sets Namespace-awareDOM properties while unwrapping reactive
	 * accessors.
	 *
	 * @param {Element} node
	 * @param {string} localName
	 * @param {unknown} value
	 */
	const setPropertyNS = (node, localName, value) => {
	  setProperty(node, localName, value);
	};

	/**
	 * Writes raw values to DOM properties.
	 *
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	function _setProperty(node, name, value) {
	  // if the value is null or undefined it will be set to null
	  if (value == null) {
	    // defaulting to `undefined` breaks `progress` tag and the whole page
	    node[name] = null;
	  } else {
	    node[name] = value;
	  }
	}

	/**
	 * Attaches event handlers (singular or array) to an element.
	 *
	 * @template {DOMElement} T
	 * @param {T} node
	 * @param {string} name
	 * @param {EventHandlers<Event, T>} value
	 */
	const setEvent = (node, name, value) => {
	  flatForEach(value, value => {
	    addEvent(node, name, ownedEvent(/** @type EventHandler<Event, Element> */value));
	  });
	};

	/**
	 * Attaches namespaced event handlers, (singular or array) to an
	 * element.
	 *
	 * @template {DOMElement} T
	 * @param {T} node
	 * @param {string} localName
	 * @param {EventHandlers<Event, T>} value
	 */
	const setEventNS = (node, localName, value) => {
	  flatForEach(value, value => {
	    setEvent(node, localName, value);
	  });
	};

	/** Returns true or false with a `chance` of getting `true` */
	const chance = (chance = 50, generator = random) => {
	  return generator() < chance / 100;
	};

	/** Returns random number between 0 and 1 */
	const random = () => crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1);

	/**
	 * Returns an integer between `min` and `max` (inclusive) using the
	 * provided generator.
	 *
	 * @param {number} [min=0] Lowest value in the range. Default is `0`
	 * @param {number} [max=100] Highest value in the range. Default is
	 *   `100`
	 * @param {() => number} [generator=random] Source of uniform floats
	 *   between 0 and 1. Default is `random`
	 * @returns {number}
	 */
	const randomBetween = (min = 0, max = 100, generator = random) => Math.floor(generator() * (max - min + 1)) + min;

	/**
	 * Creates an RGB color string by sampling each channel in the
	 * [min,max] range.
	 *
	 * @param {number} [min=0] Lowest channel value. Default is `0`
	 * @param {number} [max=255] Highest channel value. Default is `255`
	 * @returns {string}
	 */
	const randomColor = (min = 0, max = 255) => 'rgb(' + randomBetween(min, max) + ',' + randomBetween(min, max) + ',' + randomBetween(min, max) + ')';

	/**
	 * Generates a base36 id string by reading 64 bits from `crypto`.
	 *
	 * @returns {string}
	 */
	const randomId = () => crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);

	/**
	 * Returns a random number generator based on a seed that generates
	 * numbers between 0 and 1
	 *
	 * @param {number} seed
	 */
	function randomSeeded(seed) {
	  const m = 2 ** 35 - 31;
	  let s = seed % m;
	  return () => (s = s * 185852 % m) / m;
	}

	/**
	 * @param {Element} node
	 * @param {string} value
	 */
	const setCSS = (node, value) => {
	  isConnected(node) ? setNodeCSS(node, value) : onMount(() => {
	    setNodeCSS(node, value);
	  });
	};

	/** @type {(node: Element, value: string) => void} */
	const setNodeCSS = withState((state, node, value) => {
	  if (value) {
	    addClass(node, state.get(value, value => {
	      const id = 'c' + randomId();
	      addAdoptedStyleSheet(getDocumentForElement(node), sheet(value.replace(/class/g, '.' + id)));
	      return id;
	    }));
	  }
	});

	/**
	 * Invokes `ref` callbacks immediately with the element instance.
	 *
	 * @param {Element} node
	 * @param {Function} value
	 */
	const setRef = (node, value) => {
	  flatForEach(value, fn => fn(node));
	};

	/**
	 * Runs callbacks once the node is connected (after mount).
	 *
	 * @param {Element} node
	 * @param {Function} value
	 */
	const setConnected = (node, value) => {
	  onMount(() => flatForEach(value, fn => fn(node)));
	};

	/**
	 * Registers cleanup callbacks that fire when the scope disposes.
	 *
	 * @param {Element} node
	 * @param {Function} value
	 */
	const setDisconnected = (node, value) => {
	  cleanup(() => flatForEach(value, fn => fn(node)));
	};

	// node style


	/**
	 * Applies style attributes (string/object/function) to an element.
	 *
	 * @param {DOMElement} node
	 * @param {StyleAttribute} value
	 * @url https://pota.quack.uy/props/setStyle
	 */
	const setStyle = (node, value) => {
	  setNodeStyle(node.style, value);
	};

	/**
	 * Applies styles within a namespace (e.g. `style:color` bindings).
	 *
	 * @param {DOMElement} node
	 * @param {string} localName
	 * @param {StyleAttribute} value
	 */
	const setStyleNS = (node, localName, value) => {
	  setNodeStyle(node.style, isObject(value) ? value : {
	    [localName]: value
	  });
	};

	/**
	 * Normalizes strings/functions/objects into concrete style
	 * assignments.
	 *
	 * @param {CSSStyleDeclaration} style
	 * @param {StyleAttribute} value
	 */
	function setNodeStyle(style, value) {
	  if (isString(value)) {
	    style.cssText = value;
	  } else if (isFunction(value)) {
	    withValue(value, value => setNodeStyle(style, value));
	  } else if (isObject(value)) {
	    for (const name in value) {
	      setStyleValue(style, name, value[name]);
	    }
	  }
	}

	/**
	 * Sets a single style property, unwrapping reactive values.
	 *
	 * @param {DOMElement} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	const setElementStyle = (node, name, value) => {
	  setStyleValue(node.style, name, value);
	};

	/**
	 * Resolves a possibly reactive style binding before delegating.
	 *
	 * @param {CSSStyleDeclaration} style
	 * @param {string} name
	 * @param {unknown} value
	 */
	const setStyleValue = (style, name, value) => {
	  withValue(value, value => _setStyleValue(style, name, value));
	};

	/**
	 * Writes raw styles, removing properties for falsy/nullish values.
	 *
	 * @param {CSSStyleDeclaration} style
	 * @param {string} name
	 * @param {unknown} value
	 */
	const _setStyleValue = (style, name, value) => {
	  // if the value is null or undefined it will be removed
	  value == null || value === false ? style.removeProperty(name) : style.setProperty(name, /** @type string */value);
	};

	// node class / classList


	/**
	 * @param {Element} node
	 * @param {object | string | ArrayLike<any>} value
	 */
	const setClass = (node, value) => {
	  isString(value) ? node.setAttribute('class', value) : setClassList(node, value);
	};

	/**
	 * @param {Element} node
	 * @param {object | string | ArrayLike<any>} value
	 * @param {string} localName
	 */
	const setClassNS = (node, localName, value) => {
	  isFunction(value) || !isObject(value) ? setElementClass(node, localName, value) : setClassList(node, value);
	};

	/**
	 * @param {Element} node
	 * @param {object | string | ArrayLike<any>} value
	 * @param {object | string | ArrayLike<any>} [prev]
	 */
	function setClassList(node, value, prev) {
	  if (isString(value) || value == null) {
	    prev && _setClassListValue(node, prev, false);
	    value && _setClassListValue(node, value, true);
	  } else if (isObject(value)) {
	    for (let name in value) {
	      setElementClass(node, name, value[name]);
	    }
	  } else if (isFunction(value)) {
	    withPrevValue(value, (value, prev) => {
	      setClassList(node, value, prev);
	    });
	  }
	}
	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	const setElementClass = (node, name, value) => {
	  withPrevValue(value, (value, prev) => {
	    if (!value && !prev) {
	      // on initialization do not remove whats not there
	    } else {
	      _setClassListValue(node, name, value);
	    }
	  });
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	const _setClassListValue = (node, name, value) => {
	  // null, undefined or false, the class is removed
	  !value ? removeClass(node, name) : addClass(node, name);
	};

	// NODE ATTRIBUTES

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Accessor<string | boolean>} value
	 * @url https://pota.quack.uy/props/setAttribute
	 */
	const setAttribute = (node, name, value) => {
	  withValue(value, value => _setAttribute(node, name, value));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {string | boolean} value
	 */
	function _setAttribute(node, name, value) {
	  // if the value is false/null/undefined it will be removed
	  value === false || value == null ? node.removeAttribute(name) : node.setAttribute(name, value === true ? '' : value);
	}

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Accessor<string | boolean>} value
	 * @param {string} ns
	 * @url https://pota.quack.uy/props/setAttribute
	 */
	const setAttributeNS = (node, name, value, ns) => {
	  withValue(value, value => _setAttributeNS(node, name, value, ns));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {string | boolean} value
	 * @param {string} ns
	 */
	function _setAttributeNS(node, name, value, ns) {
	  // if the value is false/null/undefined it will be removed
	  value === false || value == null ? NS[ns] ? node.removeAttributeNS(NS[ns], name) : node.removeAttribute(name) : NS[ns] ? node.setAttributeNS(NS[ns], name, value === true ? '' : value) : node.setAttribute(name, value === true ? '' : value);
	}

	propsPluginNS('prop', setPropertyNS, false);
	propsPluginNS('on', setEventNS, false);
	propsPlugin('use:css', setCSS); // run in microtask
	propsPlugin('use:connected', setConnected, false);
	propsPlugin('use:disconnected', setDisconnected, false);
	propsPlugin('use:ref', setRef, false);
	propsPlugin('style', setStyle, false);
	propsPluginNS('style', setStyleNS, false);
	propsPlugin('class', setClass, false);
	propsPluginNS('class', setClassNS, false);

	// catch all

	const propNS = empty();

	/**
	 * Assigns props to an Element
	 *
	 * @template T
	 * @param {Element} node - Element to which assign props
	 * @param {T} props - Props to assign
	 */
	function assignProps(node, props) {
	  for (const name in props) {
	    assignProp(node, name, props[name]);
	  }
	}

	/**
	 * Assigns a prop to an Element
	 *
	 * @template T
	 * @param {Element} node
	 * @param {string} name
	 * @param {any} value
	 */
	function assignProp(node, name, value) {
	  // run plugins
	  let plugin = plugins.get(name);
	  if (plugin) {
	    plugin(node, value);
	  } else if (propNS[name] || name.includes(':')) {
	    // with ns
	    propNS[name] = propNS[name] || name.split(':');

	    // run plugins NS
	    plugin = pluginsNS.get(propNS[name][0]);
	    plugin ? plugin(node, propNS[name][1], value) : setAttributeNS(node, name, value, propNS[name][0]);
	  } else {
	    // catch all
	    setAttribute(node, name, value);
	  }
	}

	/**
	 * Assigns a prop to an Element
	 *
	 * @template T
	 * @param {DOMElement} node
	 * @param {string} name
	 * @param {any} value
	 * @param {string} localName
	 * @param {string} ns
	 */
	function assignPropNS(node, name, value, localName, ns) {
	  // run plugins NS
	  let plugin = plugins.get(name);
	  if (plugin) {
	    plugin(node, value);
	  } else {
	    plugin = pluginsNS.get(ns);
	    plugin ? plugin(node, localName, value) : setAttributeNS(node, name, value, ns);
	  }
	}

	// CONSTANTS


	// STATE

	const useXMLNS = context();

	// COMPONENTS

	/**
	 * Used by the regular JSX transform, as `<>...</>` or
	 * `<Fragment>...</Fragment>`.
	 */
	const Fragment = props => props.children;

	/**
	 * Creates components for things. When props argument is given, the
	 * props become fixed. When props argument is ommited, it allows you
	 * to keep calling the returned function with new props. Returns a
	 * function because we need to render from parent to children instead
	 * of from children to parent. This allows to properly set the
	 * reactivity tree (think of nested effects that clear inner effects,
	 * context, etc).
	 *
	 * @template T
	 * @param {string | Function | Element | object | symbol} value -
	 *   Component
	 * @param {Props<T>} [props] - Props object
	 * @returns {(props: Partial<Props<T>>) => Children}
	 * @url https://pota.quack.uy/Component
	 */
	function Component(value, props) {
	  if (value === Fragment) {
	    return props.children;
	  }

	  /** Freeze props so isnt directly writable */
	  freeze(props);

	  /** Create a callable function to pass `props` */
	  const component = Factory(value);
	  return props === undefined ? component : markComponent(propsOverride => component(propsOverride ? freeze({
	    ...props,
	    ...propsOverride
	  }) : props));
	}

	/**
	 * Creates a component that could be called with a props object
	 *
	 * @template T
	 * @param {string | Function | Element | object | symbol} value -
	 *   Component value
	 * @returns {(props?: Props<T>) => Children}
	 */
	function Factory(value) {
	  switch (typeof value) {
	    case 'string':
	      {
	        // string component, 'div' becomes <div>
	        return markComponent(props => createTag(value, props));
	      }
	    case 'function':
	      {
	        return $isComponent in value ? value : markComponent(value);
	      }
	    default:
	      {
	        if (value instanceof Element) {
	          // node component <div>
	          return markComponent(props => createNode(value, props));
	        }

	        // creates anything
	        return markComponent(() => value);
	      }
	  }
	}

	/**
	 * Creates a x/html element from a tagName
	 *
	 * @template {Props<{ xmlns?: string; is?: string }>} P
	 * @param {string} tagName
	 * @param {P} props
	 * @returns {Element} Element
	 */
	function createTag(tagName, props) {
	  /**
	   * Namespace, use props xmlns or special case svg, math, etc in case
	   * of missing xmlns attribute
	   */
	  const xmlns = props?.xmlns || NS[tagName];
	  return withXMLNS(xmlns, xmlns => createNode(xmlns ? createElementNS(xmlns, tagName, {
	    is: props?.is
	  }) : createElement(tagName, {
	    is: props?.is
	  }), props), tagName);
	}
	let usedXML;

	/**
	 * Ensures children inherit the right namespace as elements are
	 * created.
	 *
	 * @template T
	 * @param {string} xmlns
	 * @param {(xmlns: string) => T} fn
	 * @param {string} [tagName]
	 */
	function withXMLNS(xmlns, fn, tagName) {
	  if (!usedXML) {
	    if (!xmlns) {
	      return fn(xmlns);
	    }
	    usedXML = true;
	  }
	  const nsContext = useXMLNS();
	  if (xmlns && xmlns !== nsContext) {
	    // the xmlns changed, use the new xmlns
	    return useXMLNS(xmlns, () => fn(xmlns));
	  }

	  /**
	   * `foreignObject` children are created with html xmlns (default
	   * browser behaviour)
	   */
	  if (nsContext && tagName === 'foreignObject') {
	    return useXMLNS(NS.html, () => fn(nsContext));
	  }
	  return fn(nsContext);
	}

	// PARTIALS

	/**
	 * Turns string markup into DOM nodes using the provided namespace.
	 *
	 * @param {string} content
	 * @param {string} [xmlns]
	 * @returns {Element | DocumentFragment}
	 */
	function parseXML(content, xmlns) {
	  const template = xmlns ? createElementNS(xmlns, 'template') : createElement('template');
	  template.innerHTML = content;

	  // xml
	  let tlpContent = template.content;
	  if (!tlpContent) {
	    const childNodes = template.childNodes;
	    if (childNodes.length === 1) {
	      return template.firstChild;
	    }
	    tlpContent = new DocumentFragment();
	    tlpContent.append(...childNodes);
	    return tlpContent;
	  }
	  return tlpContent.childNodes.length === 1 ? tlpContent.firstChild : tlpContent;
	}

	/**
	 * Wraps values for JSX runtime helpers, ensuring we always return a
	 * component function.
	 *
	 * @template T
	 * @param {string | Function | Element | object | symbol} value
	 * @returns {(props?: Props<T>) => Children}
	 */
	function createComponent(value) {
	  const component = Factory(value);
	  return props => {
	    /** Freeze props so isnt directly writable */
	    freeze(props);
	    return markComponent(() => component(props));
	  };
	}

	/**
	 * @template T
	 * @param {string} content
	 * @param {{
	 * 	x?: string
	 * 	[i: number]: number
	 * 	m?: number
	 * } & Record<string, unknown>} [propsData]
	 * @returns {(props: T[]) => Children}
	 */
	function createPartial(content, propsData = nothing) {
	  let clone = () => {
	    const node = withXMLNS(propsData.x, xmlns => parseXML(content, xmlns));
	    clone = 'i' in propsData ? importNode.bind(null, node, true) : node.cloneNode.bind(node, true);
	    return clone();
	  };
	  return props => markComponent(() => assignPartialProps(clone(), props, propsData));
	}

	/**
	 * @template T
	 * @param {Element} node
	 * @param {Children[]} props
	 * @param {{
	 * 	x?: string
	 * 	[i: number]: number
	 * 	m?: number
	 * } & Record<string, unknown>} propsData
	 * @returns {Children}
	 */
	function assignPartialProps(node, props, propsData) {
	  if (props) {
	    const nodes = walkElements(node, propsData.m);
	    withXMLNS(propsData.x, xmlns => {
	      for (let i = 0; i < props.length; i++) {
	        props[i](nodes[i in propsData ? propsData[i] : i]);
	      }
	    });
	  }
	  return node instanceof DocumentFragment ? toArray(node.childNodes) : node;
	}

	/**
	 * Assigns props to an element and creates its children
	 *
	 * @template T
	 * @param {Element} node - Element to assign props to
	 * @param {Props<T>} props - Props to assign
	 * @returns {Element} The element with props assigned
	 */
	function createNode(node, props) {
	  props && assignProps(node, props);
	  return node;
	}

	/**
	 * Creates the children for a parent
	 *
	 * @template T
	 * @param {Element | DocumentFragment} parent
	 * @param {Children | ((...unknonwn) => T)} child
	 * @param {boolean} [relative]
	 * @param {Text} [prev]
	 * @param {true} [isComponent]
	 * @returns {Children}
	 */
	function createChildren(parent, child, relative, prev, isComponent) {
	  switch (typeof child) {
	    // string/number
	    case 'string':
	    case 'number':
	      {
	        if (prev instanceof Text) {
	          prev.nodeValue = /** @type string */child;
	          return prev;
	        }

	        /**
	         * The text node could be created by just doing
	         * `parent.textContent = value` when the parent node has no
	         * children.
	         */
	        if (!relative && parent.childNodes.length === 0) {
	          parent.textContent = /** @type string */child;
	          return parent.firstChild;
	        }
	        return insertNode(parent, createTextNode(child), relative);
	      }
	    case 'function':
	      {
	        // component
	        if ($isComponent in child) {
	          return createChildren(parent, untrack(/** @type {() => Children} */child), relative, undefined, true);
	        }
	        let node = [];

	        // signal/memo/external/user provided function
	        // needs placeholder to stay in position
	        parent = createPlaceholder(parent, relative);

	        // For - TODO move this to the `For` component
	        $isMap in child ? effect(() => {
	          node = toDiff(node, flatToArray(child(child => createChildren(parent, child, true))), true);
	        }) : effect(() => {
	          // maybe a signal (at least a function) so needs an effect
	          node = toDiff(node, flatToArray(createChildren(parent, child(), true, node[0])), true);
	        });
	        cleanup(() => {
	          toDiff(node);
	          // @ts-expect-error
	          parent.remove();
	        });

	        /**
	         * A placeholder is created and added to the document but doesnt
	         * form part of the children. The placeholder needs to be
	         * returned so it forms part of the group of children. If
	         * children are moved and the placeholder is not moved with
	         * them, then, whenever children update these will be at the
	         * wrong place. wrong place: where the placeholder is and not
	         * where the children were moved to
	         */
	        return parent;
	      }
	    case 'object':
	      {
	        // Node/DocumentFragment
	        if (child instanceof Node) {
	          /**
	           * DocumentFragment are special as only the children get added
	           * to the document and the document becomes empty. If we dont
	           * insert them 1 by 1 then we wont have a reference to them
	           * for deletion on cleanup with node.remove()
	           */
	          if (child instanceof DocumentFragment) {
	            return createChildren(parent, toArray(child.childNodes), relative);
	          }
	          return insertNode(parent, /** @type Element */child, relative);
	        }

	        // children/fragments
	        if (isArray(child)) {
	          return child.length === 1 ? createChildren(parent, child[0], relative) : child.map(child => createChildren(parent, child, relative));
	        }

	        /**
	         * The value is `null`, as in {null} or like a show returning
	         * `null` on the falsy case
	         */
	        if (child === null || child === nothing) {
	          return undefined;
	        }

	        // async values
	        if ('then' in child) {
	          const suspense = useSuspense();
	          suspense.add();
	          const [value, setValue] = signal(undefined);
	          const onResult = owned(result => {
	            if (isComponent && isFunction(result)) {
	              markComponent(result);
	            }
	            setValue(result);
	            suspense.remove();
	          }, () => suspense.remove());
	          resolved(child, onResult);
	          return createChildren(parent, value, relative);
	        }

	        // iterable/Map/Set/NodeList
	        if (iterator in child) {
	          /**
	           * For some reason this breaks with a node list in the
	           * `Context` example of the `html` docs section.
	           *
	           *     return toArray(child.values(), child =>
	           *     	createChildren(parent, child, relative),
	           *     )
	           */
	          return createChildren(parent, toValues(child), relative);
	        }

	        // CSSStyleSheet
	        if (child instanceof CSSStyleSheet) {
	          /**
	           * Custom elements wont report a document unless is already
	           * connected. So our stylesheet would end on the main document
	           * instead of the shadowRoot
	           */
	          onFixes(() => {
	            if (isConnected(parent)) {
	              const doc = getDocumentForElement(parent);
	              addAdoptedStyleSheet(doc, child);
	              cleanup(() => removeAdoptedStyleSheet(doc, child));
	            }
	          });
	          return undefined;
	        }

	        // object.toString fancy objects
	        return createChildren(parent,
	        // Object.create(null) would fail to convert to string
	        'toString' in child ? child.toString() : stringify(child), relative);
	      }
	    case 'undefined':
	      {
	        return undefined;
	      }
	    default:
	      {
	        // boolean/bigint/symbol/catch all
	        // toString() is needed for `Symbol`
	        return insertNode(parent, createTextNode(child.toString()), relative);
	      }
	  }
	}
	propsPlugin('children', (node, propValue) => {
	  createChildren(node, propValue);
	}, false);

	/**
	 * Creates placeholder to keep nodes in position
	 *
	 * @param {Element | DocumentFragment} parent
	 * @param {boolean} [relative]
	 * @returns {Element} The placeholder element
	 */
	const createPlaceholder = (parent, relative) => insertNode(parent, createTextNode(''), relative);

	/**
	 * Adds the element to the document
	 *
	 * @param {Element | DocumentFragment | ChildNode} parent
	 * @param {Element} node
	 * @param {boolean} [relative]
	 * @returns {Element} The inserted node
	 */
	function insertNode(parent, node, relative) {
	  // special case `head`
	  if (parent === head) {
	    const name = node.tagName;

	    // search for tags that should be unique
	    let prev;
	    if (name === 'TITLE') {
	      prev = querySelector(head, 'title');
	    } else if (name === 'META') {
	      prev = querySelector(head, 'meta[name="' + node.getAttribute('name') + '"]') || querySelector(head, 'meta[property="' + node.getAttribute('property') + '"]');
	    } else if (name === 'LINK' && /** @type HTMLLinkElement */node.rel === 'canonical') {
	      prev = querySelector(head, 'link[rel="canonical"]');
	    }

	    // replace old node if there's any
	    prev ? prev.replaceWith(node) : parent.appendChild(node);
	  } else {
	    relative ? parent.parentNode.insertBefore(node, parent) : parent.appendChild(node);
	  }
	  return node;
	}

	// RENDERING

	/**
	 * WARNINGS Removal of the element on where you render/insert into,
	 * wont cause disposal of what you render/insert.
	 */

	/**
	 * Inserts children into a parent
	 *
	 * @param {any} children - Thing to render
	 * @param {Element | null} [parent] - Mount point, defaults to
	 *   document.body
	 * @param {{ clear?: boolean; relative?: boolean }} [options] -
	 *   Mounting options
	 * @returns {() => void} Disposer
	 * @url https://pota.quack.uy/render
	 */
	function render(children, parent, options = nothing) {
	  const dispose = root(dispose => {
	    insert(children, parent, options);
	    return dispose;
	  });

	  // run dispose when the parent scope disposes
	  cleanup(dispose);
	  return dispose;
	}

	/**
	 * @param {any} children - Thing to render
	 * @param {Element | null} [parent] - Mount point, defaults to
	 *   `document.body`
	 * @param {{ clear?: boolean; relative?: boolean }} [options] -
	 *   Mounting options
	 */
	function insert(children, parent = document.body, options = nothing) {
	  if (options.clear && parent) parent.textContent = '';
	  const node = createChildren(parent, Factory(isFunction(children) ? children : () => children), options.relative);
	  cleanup(() => toDiff(flatToArray(node)));
	  return node;
	}

	/**
	 * Creates and returns HTML Elements for `children`
	 *
	 * @param {Children} children
	 * @returns {Children}
	 * @url https://pota.quack.uy/toHTML
	 */
	function toHTML(children) {
	  /**
	   * DocumentFragment is transformed to an `Array` of `Node/Element`,
	   * that way we can keep a reference to the nodes. Because when the
	   * DocumentFragment is used, it removes the nodes from the
	   * DocumentFragment and then we will lose the reference.
	   */

	  return unwrapArray(toHTMLFragment(children).childNodes);
	}
	// @ts-ignore-next.error
	context.toHTML = toHTML;

	/**
	 * Creates and returns a DocumentFragment for `children`
	 *
	 * @param {Children} children
	 * @returns {DocumentFragment}
	 * @url https://pota.quack.uy/toHTML
	 */
	function toHTMLFragment(children) {
	  const fragment = new DocumentFragment();
	  createChildren(fragment, children);
	  return fragment;
	}

	/**
	 * Removes from the DOM `prev` elements not found in `next`
	 *
	 * @param {DOMElement[]} [prev=[]] - Array with previous elements.
	 *   Default is `[]`
	 * @param {DOMElement[]} [next=[]] - Array with next elements. Default
	 *   is `[]`
	 * @param {boolean} [short=false] - Whether to use fast clear. Default
	 *   is `false`
	 * @returns {DOMElement[]} The next array of elements
	 */
	function toDiff(prev = [], next = [], short = false) {
	  // if theres something to remove
	  if (prev.length) {
	    // fast clear
	    if (short && next.length === 0 &&
	    // + 1 because of the original placeholder
	    prev.length + 1 === prev[0].parentNode.childNodes.length) {
	      const parent = prev[0].parentNode;
	      // save the placeholder
	      const lastChild = parent.lastChild;
	      parent.textContent = '';
	      parent.appendChild(lastChild);
	    } else if (next.length === 0) {
	      for (const item of prev) {
	        item && item.remove();
	      }
	    } else {
	      for (const item of prev) {
	        if (item && !next.includes(item)) {
	          item.remove();
	        }
	      }
	    }
	  }
	  return next;
	}

	// VERSION

	var _Counter = createComponent(Counter),
	  _div = createPartial("<div></div>"),
	  _div2 = createPartial("<div style2='clamp(50px, 60px, 70px)'><p>abc</p> clamp(50px, 60px, 70px)</div>"),
	  _div3 = createPartial("<div data-true data-a0=0 data-aminus1=-1 data-adecimal1=0.00003 data-adecimal10=2 data-abigint1=1 data-empty data-emptytemplate='aloja from template' data-emptytemplatefsn1=' 2' data-emptywithfuction children=wth class='opa opa' style=border:3></div><div>undefined - </div><div>null - </div><div>true - true</div><div>false - false</div><div>void 0 - </div><div>0 - 0</div><div>-10 - -10</div><div>0.0222 - 0.0222</div><div>1+1 - 2</div><div>1n - 1</div><div>&#39;&#39; - </div><div>&#39;&#39; - aloja from template</div><div>&#39;&#39; - </div><div>&#39;&#39; - </div><div>&#39; &#39;.trim() - </div><div>fn() - </div><div>() =&gt;  - </div><div>`asdasd` - asdasd</div><div children=1></div><tm-textarea><iframe loading=lazy></iframe><kilo:svg xmlns:kilo=http://www.w3.org/2000/svg width=24 height=24 viewBox='0 0 24 24'><kilo:path d='M10 10.5h1.5v3H10zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 15H6v-4.5H4.5V9h3v6zm5.5-1c0 .55-.45 1-1 1H9.5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1H12c.55 0 1 .45 1 1v4zm6.5 1h-1.75L16 12.75V15h-1.5V9H16v2.25L17.75 9h1.75l-2.25 3 2.25 3z'></kilo:path></kilo:svg></tm-textarea>", {"1":13,"2":16,"3":17,"4":19,"5":21,"m":22,"i":1});
	const style = {
	  style: '3',
	  something: {
	    value: 1 + 1
	  }
	};
	const spread1 = _div([_node => {
	  assignProps(_node, {
	    "style": "1",
	    ...style,
	    "style": "2",
	    "prop:not-identifier": /* @static */""
	  });
	}]);
	const spread2 = _div([_node2 => {
	  assignProps(_node2, style);
	}]);
	const spread3 = _div([_node3 => {
	  assignProps(_node3, {
	    ...style,
	    ...{
	      ...style,
	      ...style2
	    },
	    "style": "2",
	    "nada:nada": "test"
	  });
	}]);
	const spread4 = _div([_node4 => {
	  assignProps(_node4, {
	    ...style,
	    ...style2
	  });
	}]);
	function Counter() {
	  const a = 50;
	  const b = 60;
	  const c = 70;
	  return _div2([_node6 => {
	    setStyle(_node6, {
	      'padding-left': "clamp(50px, 60px, 70px)",
	      'padding-right': 'clamp(10px, 20px, 30px)',
	      'padding-top': 'calc(12*6px)'
	    });
	  }]);
	}

	// async

	// empty
	{
	  const bña = async function () {};
	  async function asyncTest1() {}
	  const asyncTest2 = async () => {};
	  async () => {};
	  (async function () {})();
	  (async () => {})();
	}
	// return
	{
	  const bña2 = async function () {
	    return;
	  };
	  async function asyncTest12() {
	    return;
	  }
	  const asyncTest22 = async () => {
	    return;
	  };
	  async () => undefined;
	  async () => {
	    return;
	  };
	  (async function () {
	    return;
	  })();
	}

	// await
	{
	  const bña = async function () {
	    return await 1;
	  };
	  async function asyncTest1() {
	    return await 1;
	  }
	  const asyncTest2 = async () => {
	    return await 1;
	  };
	  async () => await 1;
	  (async function () {
	    return await 1;
	  })();
	}

	// await x 2
	{
	  const bña = async function () {
	    await 1;
	    return await 2;
	  };
	  async function asyncTest1() {
	    await 1;
	    return await 2;
	  }
	  const asyncTest2 = async () => {
	    await 1;
	    return await 2;
	  };
	  async () => {
	    await 1;
	    return await 2;
	  };
	  (async function () {
	    await 1;
	    return await 2;
	  })();
	}

	// await x 2
	{
	  const bña = async function () {
	    await 1;
	    return (await name()) + '-' + name();
	  };
	  async function asyncTest1LALA() {
	    await 1;
	    {
	      {
	        ;
	        (await name()) + '-' + name();
	      }
	    }
	    return (await name()) + '-' + name();
	  }
	  const asyncTest2 = async () => {
	    await 1;
	    return (await name()) + '-' + name();
	  };
	  async () => {
	    await 1;
	    return (await name()) + '-' + name();
	  };
	  (async function () {
	    await 1;
	    return (await name()) + '-' + name();
	  })();
	}
	{
	  async function lala() {
	    console.log(1);
	    console.log(2);
	    const x = name(await 1, await 2);
	    return x + '-' + x;
	  }
	}
	const lala2 = 2;
	const component = _div([_node29 => {
	  createChildren(_node29, [_Counter(), asyncTest, _div3([_node7 => {
	    _node7["not-identifier"] = /* @static  */"";
	    setAttribute(_node7, "data-emptytemplatefn", html` ${lala}`);
	    setAttribute(_node7, "data-emptytemplatefsn", ` ${lala}`);
	    setAttribute(_node7, "data-call", fn());
	    setEvent(_node7, "click", () => {});
	    setElementClass(_node7, "mitrocondria", true);
	    setStyleNS(_node7, "border", '0px');
	    setStyleNS(_node7, "background", "0px");
	    (function hola(node) {})(_node7);
	    setConnected(_node7, function connected(node) {});
	    setDisconnected(_node7, function disconnected(node) {});
	    setCSS(_node7, 'class {color:red}');
	  }, _node18 => {
	    createChildren(_node18, `aloja ${hotaloja} template`);
	  }, _node21 => {
	    createChildren(_node21, fn());
	  }, _node22 => {
	    createChildren(_node22, () => {});
	  }, _node24 => {
	    fn1(_node24);
	    setEvent(_node24, "click", [fn1, fn2]);
	    assignPropNS(_node24, "use:bind", [fn1, fn2], "bind", "use");
	    setConnected(_node24, [fn1, fn2]);
	    setDisconnected(_node24, [fn1, fn2]);
	  }, _node25 => {
	    setStyle(_node25, {
	      bla: true,
	      something: {
	        value: 2
	      }
	    });
	  }])]);
	}]);
	render(component);

})();
//# sourceMappingURL=transform.js.map
