(function () {
	'use strict';

	const window = globalThis;
	const queueMicrotask = window.queueMicrotask;
	const history = window.history;
	const location$2 = window.location;
	const origin = location$2?.origin;
	const Object$1 = window.Object;
	const Array$1 = window.Array;
	const Promise$1 = window.Promise;
	const Symbol = window.Symbol;
	const assign = Object$1.assign;
	const create$1 = Object$1.create;
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
	const is = Object$1.is;
	const isExtensible = Object$1.isExtensible;
	const setPrototypeOf = Object$1.setPrototypeOf;
	const toArray = Array$1.from;

	/**
	 * @template T
	 * @param {T} value
	 */
	const toValues = value => isArray(value) ? value : isObject(value) && 'values' in value ? /** @type {{ values(): IterableIterator<T> }} */value.values() : toArray(/** @type {Iterable<T> | ArrayLike<T>} */value);

	/**
	 * @template T
	 * @param {T} value
	 */
	const toEntries = value => isObject(value) && 'entries' in value ? /** @type {{ entries(): IterableIterator<[string, T]> }} */value.entries() : toArray(/** @type {Iterable<T> | ArrayLike<T>} */value);
	const iterator = Symbol.iterator;
	const Iterator = window.Iterator;
	const stringify = JSON.stringify;
	const PrototypeMap = Map.prototype;

	/**
	 * @param {(
	 * 	resolve: (value: unknown) => void,
	 * 	reject: (reason?: any) => void,
	 * ) => void} fn
	 */
	const promise = fn => new Promise$1(fn);

	/**
	 * Given a promise it adds `onDone` to `then` and `catch`
	 *
	 * ```js
	 * resolved(promise, onDone)
	 * // is same as
	 * promise.then(onDone).catch(onDone)
	 * ```
	 */
	const resolved = (promise, onDone) => promise.then(onDone).catch(onDone);

	/**
	 * Runs an array of functions
	 *
	 * @param {Iterable<Function>} fns
	 */
	const call = fns => {
	  for (const fn of fns) fn();
	};

	/**
	 * @template T
	 * @param {T} o
	 * @param {Map<T, T>} [seen]
	 * @returns {T}
	 */
	function copy(o, seen = new Map()) {
	  if (!isObject(o)) {
	    return o;
	  }
	  if (o instanceof Node || o instanceof Date || o instanceof Set || o instanceof Map || o instanceof WeakSet || o instanceof WeakMap || o instanceof Promise$1 || o instanceof RegExp) {
	    return o;
	  }
	  if (seen.has(o)) {
	    return /** @type {T} */seen.get(o);
	  }
	  const c = /** @type {T} */isArray(o) ? [] : (/** @type {{ [key: string]: unknown }} */{});
	  seen.set(o, c);
	  for (const k in o) {
	    c[k] = copy(o[k], seen);
	  }
	  return c;
	}

	/**
	 * Object.defineProperty with `enumerable` and `configurable` set to
	 * `true` unless overwriten by `descriptor` argument
	 *
	 * @template T
	 * @param {T} target
	 * @param {PropertyKey} key
	 * @param {PropertyDescriptor} descriptor
	 */
	const redefineProperty = (target, key, descriptor) => defineProperty(target, key, assign(create$1(redefinePropertyDefailts), descriptor));
	const redefinePropertyDefailts = {
	  __proto__: null,
	  configurable: true,
	  enumerable: true
	};

	/**
	 * Object.defineProperty with `configurable`, `writable` and
	 * `enumerable` as `false`
	 *
	 * @template T
	 * @param {T} target
	 * @param {PropertyKey} key
	 * @param {any} value
	 */
	const definePropertyReadOnly = (target, key, value) => {
	  const descriptor = create$1(definePropertyReadOnlyDefaults);
	  descriptor.value = value;
	  defineProperty(target, key, descriptor);
	};
	const definePropertyReadOnlyDefaults = {
	  __proto__: null,
	  configurable: false,
	  enumerable: false,
	  writable: false,
	  value: undefined
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
	function* entriesIncludingSymbols(target) {
	  for (const item of entries(target)) {
	    yield item;
	  }
	  for (const item of getOwnPropertySymbols(target)) {
	    // todo: causes access!
	    yield [item, target[item]];
	  }
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
	 * @template T
	 * @param {T[] | T} arr
	 */
	const flatToArray = arr => isArray(arr) ? arr.flat(Infinity) : [arr];

	/**
	 * Keeps state in the function as the first param
	 *
	 * @template T
	 * @param {T} fn - Function to which add state to it
	 * @param {DataStore<Map> | DataStore<WeakMap>} [state] - Passed to
	 *   `fn` as first param
	 * @returns {T} A copy of the function with the state
	 */
	const withState = /* #__NO_SIDE_EFFECTS__ */(fn, state = cacheStore) => fn.bind(null, state());

	/** Memoize functions with a map cache */
	const withCache = fn => withState((cache, thing) => cache.get(thing, thing => fn(thing)), cacheStore);
	/** Memoize functions with a weak cache */
	const withWeakCache = fn => withState((cache, thing) => cache.get(thing, thing => fn(thing)), weakStore);
	const getOwnValues = o => getOwnPropertyNames(o).map(key => {
	  try {
	    return o[key];
	  } catch (e) {}
	});

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
	 * @param {unknown} value
	 * @returns {value is function}
	 */
	const isFunction = value => typeof value === 'function';

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
	const isNullUndefined = value => value === undefined || value === null;

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
	 * Returns `true` when `typeof` of `value` is `symbol`
	 *
	 * @param {unknown} value
	 * @returns {value is symbol}
	 */
	const isSymbol = value => typeof value === 'symbol';

	/**
	 * Returns `true` when `value` may be a promise
	 *
	 * @param {unknown} value
	 * @returns {value is Promise<unknown>}
	 */
	const isPromise = value => isFunction(/** @type {any} */value?.then);

	/**
	 * @template T
	 * @param {T} value
	 * @returns {value is array}
	 */
	const isArray = Array$1.isArray;

	/**
	 * Returns `true` when object morphed between array/object
	 *
	 * @param {unknown} a
	 * @param {unknown} b
	 * @returns {boolean}
	 */
	const morphedBetweenArrayAndObject = (a, b) => isObject(a) && !isObject(b) || isObject(b) && !isObject(a) || isArray(a) && !isArray(b) || isArray(b) && !isArray(a);
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
	  getOwnPropertyDescriptor: reflectGetOwnPropertyDescriptor,
	  get: reflectGet,
	  apply: reflectApply,
	  set: reflectSet
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
	 * Replace a prototype in the prototype chain with another prototype
	 *
	 * @param {object} target - Target object
	 * @param {object} search - The prototype to replace
	 * @param {object} replacement - The replacement prototype
	 */
	function replacePrototypeWith(target, search, replacement) {
	  let prototype = target;
	  while (getPrototypeOf(prototype) !== search) {
	    prototype = getPrototypeOf(prototype);
	  }
	  setPrototypeOf(prototype, replacement);
	}
	function walkParents(context, propertyName, cb) {
	  while (context) {
	    if (cb(context)) return true;
	    context = context[propertyName];
	  }
	  return false;
	}

	/** @template T */
	class DataStore {
	  /** @param {T extends FunctionConstructor} kind */
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
	 * Store template
	 *
	 * @typedef {(
	 * 	reference: any,
	 * 	createIfNotExistsAs?: ((target: any) => any) | Function,
	 * ) => any} DataStoreGet
	 *
	 *
	 * @typedef {(key: any, value: any) => void} DataStoreSet
	 *
	 * @typedef {(key: any) => boolean} DataStoreHas
	 *
	 * @typedef {(key: any) => boolean} DataStoreDelete
	 *
	 * @typedef {[
	 * 	DataStoreGet,
	 * 	DataStoreSet,
	 * 	DataStoreHas,
	 * 	DataStoreDelete,
	 * ] & {
	 * 	get: DataStoreGet
	 * 	set: DataStoreSet
	 * 	has: DataStoreHas
	 * 	delete: DataStoreDelete
	 * }} DataStoreT
	 */

	/**
	 * Creates a WeakMap to store data
	 *
	 * @returns {DataStoreT}
	 */
	const weakStore = () => new DataStore(WeakMap);

	/**
	 * Creates a Map to store data
	 *
	 * @returns {DataStoreT}
	 */
	const cacheStore = () => new DataStore(Map);
	const warn = (...args) => console.warn(...args);
	const error = (...args) => console.error(...args);

	// symbols

	const $isComponent = Symbol();
	const $isMap = Symbol();

	// supported namespaces

	const prefix = 'http://www.w3.org/';

	// when a tag/attribute is missing the namespace this puts it back in

	const NS = {
	  __proto__: null,
	  svg: prefix + '2000/svg',
	  math: prefix + '1998/Math/MathML',
	  html: prefix + '1999/xhtml',
	  xlink: prefix + '1999/xlink'
	};

	/**
	 * This is so far the core of Solid JS 1.x Reactivity, but ported to
	 * classes and adapted to my taste.
	 *
	 * Adaptation for potas needs include:
	 *
	 * - Ported to Classes what does fit
	 * - Signal has more options: `label` and `save` previous value
	 * - Writing to a signal returns `bollean` to tell if the value changed
	 * - Signal is an object that could be used as signal.read/write or
	 *   destructured as an array
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

	  /** @type {Computation} */
	  let Owner;

	  /** @type {Computation | undefined} */
	  let Listener;

	  /** @type {Memo[]} */
	  let Updates = null;

	  /** @type {undefined | null | any[]} */
	  let Effects = null;
	  let Time = 0;

	  // ROOT

	  class Root {
	    /** @type {Root | undefined} */
	    owner;

	    /** @type {Computation | Computation[]} */
	    owned;

	    /** @type {Function | Function[]} */
	    cleanups;

	    /** @type {Record<symbol, unknown>} */
	    context;

	    /**
	     * @param {Root} owner
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
	    removeCleanups(fn) {
	      if (!this.cleanups) ; else if (this.cleanups === fn) {
	        this.cleanups = null;
	      } else {
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
	      if (!this.owned) ; else if (isArray(this.owned)) {
	        for (let i = this.owned.length - 1; i >= 0; i--) {
	          this.owned[i].dispose();
	        }
	        this.owned = null;
	      } else {
	        this.owned.dispose();
	        this.owned = null;
	      }
	    }
	    doCleanups() {
	      if (!this.cleanups) ; else if (isArray(this.cleanups)) {
	        for (let i = this.cleanups.length - 1; i >= 0; i--) {
	          this.cleanups[i]();
	        }
	        this.cleanups = null;
	      } else {
	        this.cleanups();
	        this.cleanups = null;
	      }
	    }
	  }

	  // COMPUTATION

	  class Computation extends Root {
	    state = STALE;
	    updatedAt = 0;

	    /** @type {Function | undefined} */
	    fn;
	    sources;
	    sourceSlots;

	    /**
	     * @param {Root} [owner]
	     * @param {Function} [fn]
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
	      const prevOwner = Owner;
	      const prevListener = Listener;
	      Listener = Owner = this;
	      try {
	        this.fn();
	      } catch (err) {
	        this.updatedAt = time + 1;
	        throw err;
	      } finally {
	        Owner = prevOwner;
	        Listener = prevListener;
	      }
	      if (this.updatedAt < time) {
	        this.updatedAt = time;
	      }
	    }
	    dispose() {
	      const {
	        sources,
	        sourceSlots
	      } = this;
	      if (sources && sources.length) {
	        let source;
	        let observers;
	        let index;
	        let observer;
	        let slot;
	        while (sources.length) {
	          source = sources.pop();
	          observers = source.observers;
	          index = sourceSlots.pop();
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
	      this.state = CLEAN;
	    }
	    queue() {
	      Effects.push(this);
	    }
	  }
	  class Effect extends Computation {
	    user = true;

	    /**
	     * @param {Root} [owner]
	     * @param {Function} [fn]
	     * @param {object} [options]
	     */
	    constructor(owner, fn, options) {
	      super(owner, fn, options);
	      Effects ? Effects.push(this) : batch(() => this.update());
	    }
	  }
	  class SyncEffect extends Computation {
	    /**
	     * @param {Root} [owner]
	     * @param {Function} [fn]
	     * @param {object} [options]
	     */
	    constructor(owner, fn, options) {
	      super(owner, fn, options);
	      batch(() => this.update());
	    }
	  }

	  // SIGNALS

	  class Memo extends Computation {
	    value;
	    observers;
	    observerSlots;

	    // options:
	    // equals
	    /**
	     * @param {Root} [owner]
	     * @param {Function} [fn]
	     * @param {object} [options]
	     */
	    constructor(owner, fn, options) {
	      super(owner, fn, options);
	      return this.read;
	    }
	    read = () => {
	      if (this.state) {
	        if (this.state === STALE) {
	          this.update();
	        } else {
	          const updates = Updates;
	          Updates = null;
	          runUpdates(() => upstream(this));
	          Updates = updates;
	        }
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
	      if (this.equals === false || !this.equals(this.value, value)) {
	        this.value = value;
	        if (this.observers && this.observers.length) {
	          runUpdates(() => {
	            for (const observer of this.observers) {
	              if (observer.state === CLEAN) {
	                observer.queue();
	                observer.observers && downstream(observer);
	              }
	              observer.state = STALE;
	            }
	          });
	        }
	      }
	    }
	    /**
	     * @param {unknown} a
	     * @param {unknown} b
	     */
	    equals(a, b) {
	      return a === b;
	    }
	    update() {
	      this.dispose();
	      let nextValue;
	      const time = Time;
	      const prevOwner = Owner;
	      const prevListener = Listener;
	      Listener = Owner = this;
	      try {
	        nextValue = this.fn();
	      } catch (err) {
	        this.state = STALE;
	        this.disposeOwned();
	        this.updatedAt = time + 1;
	        throw err;
	      } finally {
	        Owner = prevOwner;
	        Listener = prevListener;
	      }
	      if (this.updatedAt <= time) {
	        this.write(nextValue);
	        this.updatedAt = time;
	      }
	    }
	    queue() {
	      Updates.push(this);
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
	    // save

	    // `prev` if option save was given
	    /**
	     * @param {T} [value]
	     * @param {SignalOptions} [options]
	     */
	    constructor(value, options) {
	      this.value = value;
	      if (options) {
	        assign(this, options);
	        if (this.save) {
	          /** @private */
	          this.prev = value;
	        }
	      }
	    }
	    /** @returns SignalAccessor<T> */
	    read = () => {
	      // checkReadForbidden()

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
	      if (this.equals === false || !this.equals(this.value, value)) {
	        if (this.save) {
	          this.prev = this.value;
	        }
	        this.value = value;
	        if (this.observers && this.observers.length) {
	          runUpdates(() => {
	            for (const observer of this.observers) {
	              if (observer.state === CLEAN) {
	                observer.queue();
	                observer.observers && downstream(observer);
	              }
	              observer.state = STALE;
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
	    update = value => {
	      return this.write(value(this.value));
	    };

	    /**
	     * @private
	     * @type {((a, B) => boolean) | false}
	     */
	    equals(a, b) {
	      return a === b;
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
	   * @param {(dispose: () => void) => any} fn
	   * @param {object} [options]
	   * @returns {any}
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
	   * @param {SignalOptions} [options] - Signal options
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  function signal(initialValue, options) {
	    /** @type {SignalObject<T>} */
	    const s = new Signal(initialValue, options);
	    return s;
	  }

	  /**
	   * Creates an effect
	   *
	   * @param {Function} fn
	   * @param {object} [options]
	   */
	  function effect(fn, options) {
	    new Effect(Owner, fn, options);
	  }

	  /**
	   * Creates an effect with explicit dependencies
	   *
	   * @param {Function} depend - Function that causes tracking
	   * @param {Function} fn - Function that wont cause tracking
	   * @param {object} [options]
	   */
	  function on(depend, fn, options) {
	    effect(() => {
	      depend();
	      untrack(fn);
	    }, options);
	  }

	  /**
	   * Creates a syncEffect
	   *
	   * @param {Function} fn
	   * @param {object} [options]
	   */
	  function syncEffect(fn, options) {
	    return new SyncEffect(Owner, fn, options);
	  }

	  /**
	   * Creates a read-only signal from the return value of a function
	   * that automatically updates
	   *
	   * @template T
	   * @param {() => T} fn - Function to re-run when dependencies change
	   * @param {SignalOptions} [options]
	   */

	  /* #__NO_SIDE_EFFECTS__ */
	  function memo(fn, options = undefined) {
	    /** @type {SignalAccessor<T>} */
	    const s = new Memo(Owner, fn, options);
	    return s;
	  }

	  /**
	   * Batches changes to signals
	   *
	   * @param {Function} fn
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
	  function runWithOwner(owner, fn) {
	    const prevOwner = Owner;
	    const prevListener = Listener;
	    Owner = owner;
	    Listener = undefined;
	    try {
	      return runUpdates(fn, true);
	    } catch (err) {
	      throw err;
	    } finally {
	      Owner = prevOwner;
	      Listener = prevListener;
	    }
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
	    const prevListener = Listener;
	    Listener = undefined;
	    try {
	      return fn();
	    } finally {
	      Listener = prevListener;
	    }
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

	  /**
	   * Cancels a cleanup
	   *
	   * @template {Function} T
	   * @param {T} fn
	   * @returns {T}
	   */
	  function cleanupCancel(fn) {
	    Owner?.removeCleanups(fn);
	    return fn;
	  }

	  // UPDATES

	  function runTop(node) {
	    switch (node.state) {
	      case CLEAN:
	        {
	          break;
	        }
	      case CHECK:
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
	              case STALE:
	                {
	                  node.update();
	                  break;
	                }
	              case CHECK:
	                {
	                  updates = Updates;
	                  Updates = null;
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
	      Updates = null;
	      if (!wait) {
	        const effects = Effects;
	        Effects = null;
	        effects.length && runUpdates(() => runEffects(effects));
	      }
	      return res;
	    } catch (err) {
	      if (!wait) {
	        Effects = null;
	      }
	      Updates = null;
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
	    node.state = CLEAN;
	    for (const source of node.sources) {
	      if (source.sources) {
	        switch (source.state) {
	          case STALE:
	            {
	              if (source !== ignore && source.updatedAt < Time) {
	                runTop(source);
	              }
	              break;
	            }
	          case CHECK:
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
	      if (observer.state === CLEAN) {
	        observer.state = CHECK;
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
	  function Context(defaultValue = undefined) {
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
	        let res;
	        syncEffect(() => {
	          Owner.context = {
	            ...Owner.context,
	            [id]: newValue
	          };
	          res = untrack(fn);
	        });
	        return res;
	      }
	    }

	    /**
	     * Sets the `value` for the context
	     *
	     * @param {object} props
	     * @param {T} props.value
	     * @param {Children} props.children
	     * @returns {Children} Children
	     * @url https://pota.quack.uy/Reactivity/Context
	     */
	    useContext.Provider = props => useContext(props.value, () => useContext.toHTML(props.children));

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
	   * Returns an owned function
	   *
	   * @template T
	   * @template A
	   * @param {(...args: A[]) => T} cb
	   * @returns {() => T | void}
	   */
	  const owned = cb => {
	    const o = Owner;
	    return cb ? (...args) => runWithOwner(o, () => cb(...args)) : noop;
	  };

	  // export

	  return {
	    batch,
	    cleanup,
	    cleanupCancel,
	    Context,
	    effect,
	    memo,
	    on,
	    owned,
	    owner,
	    root,
	    runWithOwner,
	    signal,
	    syncEffect,
	    untrack
	  };
	}

	const {
	  batch,
	  cleanup,
	  Context,
	  effect,
	  memo,
	  owned,
	  root,
	  signal,
	  syncEffect,
	  untrack
	} = createReactiveSystem();

	/**
	 * Runs a function inside an effect if value is a function.
	 * Aditionally unwraps promises.
	 *
	 * @template T
	 * @param {Accessor<T> | Promise<T>} value
	 * @param {(value: Accessed<T> | T) => void} fn
	 */
	function withValue(value, fn) {
	  if (isFunction(value)) {
	    effect(() => withValue(getValue(value), fn));
	  } else if (isPromise(value)) {
	    value.then(owned(value => withValue(value, fn)));
	  } else {
	    fn(value);
	  }
	}

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

	// MAP

	class Row {
	  runId;
	  item;
	  index;
	  isDupe;
	  disposer;
	  nodes;
	  indexSignal;
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
	    return this.nodes[0];
	  }
	  end() {
	    return this.nodes[this.nodes.length - 1];
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
	 * @param {Function} callback
	 * @param {boolean} [noSort]
	 * @param {Children} [fallback]
	 * @param {boolean} [reactiveIndex] - Make indices reactive signals
	 */
	function map(list, callback, noSort, fallback, reactiveIndex) {
	  const cache = new Map();
	  const duplicates = new Map(); // for when caching by value is not possible [1, 2, 1, 1, 1]

	  let runId = 0;
	  let rows = [];
	  /** @type any[] */
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
	    const value = getValue(list) || [];

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
	      clear();
	      prev = rows;
	      return fallback ? fn(fallback) : emptyArray;
	    }

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
	    if (rows.length > 1 && prev.length) {
	      // when appending to already created it shouldnt sort
	      // as its already sorted
	      let sort = false;
	      for (let i = 0; i < prev.length && i < rows.length; i++) {
	        if (prev[i] !== rows[i]) {
	          sort = true;
	          break;
	        }
	      }
	      if (sort) {
	        // if the planets align it handles swapping
	        // a = sorted
	        // b = unsorted
	        const {
	          a,
	          b
	        } = groupBy(rows, (value, index) => rows[index] === prev[index] ? 'a' : 'b');
	        let unsorted = b?.length;
	        if (a && b && a.length && b.length && b.length < a.length && b.every(item => prev.includes(item))) {
	          for (const usort of b) {
	            for (const sort of a) {
	              if (usort.index === sort.index - 1) {
	                sort.begin().before(...usort.nodesForRow());
	                unsorted--;
	                break;
	              } else if (usort.index === sort.index + 1) {
	                sort.end().after(...usort.nodesForRow());
	                unsorted--;
	                break;
	              }
	            }
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

	    // save sorted list
	    prev = rows;

	    // return external representation
	    return rows.flatMap(item => item.nodes);
	  }
	  mapper[$isMap] = undefined;
	  return mapper;
	}

	/**
	 * Resolves and returns `children` in a memo. A memo in a memo, so
	 * reactivity on the inner memo doesnt trigger reactivity outside.
	 *
	 * @template {Children} T
	 * @param {Accessor<T>} fn
	 * @returns {SignalAccessor<T>}
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
	 * Makes of `children` a function. Reactive children will run as is,
	 * non-reactive children will run untracked, regular children will
	 * just return.
	 *
	 * @template {Children} T
	 * @param {T} children
	 * @returns {((...args: unknown[]) => T) | T}
	 */
	function makeCallback(children) {
	  /**
	   * 1. Shortcut the most used case
	   * 2. When children is an array, as in >${[0, 1, 2]}< then children
	   *    will end as `[[0, 1, 2]]`, so flat it
	   */
	  return isFunction(children) ? markComponent(children) :
	  // @ts-ignore
	  markComponent((...args) =>
	  // @ts-ignore
	  flatToArray(children).map(child => isFunction(child) ? child(...args) : child));
	}

	/**
	 * Marks a function as a `Component`.
	 *
	 * Allows to tell a `signal function` from a `component function`.
	 * Signals and user functions go in effects, for reactivity.
	 * Components and callbacks are untracked and wont go in effects to
	 * avoid re-rendering if signals are used in the components body
	 *
	 * @template T
	 * @param {T} fn - Function to mark as a `Component`
	 */
	function markComponent(fn) {
	  fn[$isComponent] = undefined;
	  return fn;
	}

	/**
	 * Adds an event listener to a node
	 *
	 * @template {Element | Document | typeof window} TargetElement
	 * @param {TargetElement} node - Element to add the event listener
	 * @param {EventType} type - The name of the event listener
	 * @param {EventHandler<Event, TargetElement>} handler - Function to
	 *   handle the event
	 * @returns {Function} - An `off` function for removing the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function addEvent(node, type, handler) {
	  node.addEventListener(type, handler, !isFunction(handler) ? (/** @type {EventHandlerOptions} */handler) : undefined);

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
	 * @template {Element | Document | typeof window} TargetElement
	 * @param {TargetElement} node - Element to add the event listener
	 * @param {EventType} type - The name of the event listener
	 * @param {EventHandler<Event, TargetElement>} handler - Function to
	 *   handle the event
	 * @returns {Function} - An `on` function for adding back the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function removeEvent(node, type, handler) {
	  node.removeEventListener(type, handler, !isFunction(handler) ? (/** @type {EventHandlerOptions} */handler) : undefined);
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

	const document$1 = window.document;
	const head = document$1?.head;
	const isConnected = node => node.isConnected;
	const activeElement = () => document$1.activeElement;
	const documentElement = document$1?.documentElement;
	const DocumentFragment = window.DocumentFragment;
	const bind = /* #__NO_SIDE_EFFECTS__ */fn => document$1 && document$1[fn].bind(document$1);
	const createElement = bind('createElement');
	const createElementNS = bind('createElementNS');
	const createTextNode = bind('createTextNode');
	const createComment = bind('createComment');
	const createTreeWalker = bind('createTreeWalker');
	const addClass = (node, className) => node.classList.add(className);
	const removeClass = (node, className) => node.classList.remove(className);
	const setAttribute$1 = (node, name, value) => node.setAttribute(name, value);
	const removeAttribute = (node, name) => node.removeAttribute(name);
	const querySelector = (node, query) => node.querySelector(query);

	/**
	 * Returns `document` for element. That could be a `shadowRoot`
	 *
	 * @param {Element} node
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
	(function (walk, node, max = Infinity, nodes = []) {
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
	}).bind(null, createTreeWalker && createTreeWalker(document$1, 1 /*NodeFilter.SHOW_ELEMENT*/));

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

	/** @type [][] */
	let queue$1;
	function reset() {
	  queue$1 = [[], [], [], [], [], []];
	  added = false;
	}

	// initialization
	reset();

	/**
	 * Queues a callback at a priority
	 *
	 * @param {PropertyKey} priority - Priority
	 * @param {Function} fn - Function to run once the callbacks at this
	 *   priority run
	 */
	function add(priority, fn) {
	  if (!added) {
	    added = true;
	    queueMicrotask(run);
	  }
	  queue$1[priority].push(owned(fn));
	}

	/** Runs all queued callbacks */
	function run() {
	  const q = queue$1;
	  reset();
	  for (const fns of q) {
	    fns.length && call(fns);
	  }
	}

	/**
	 * Queue a function to run before everything else (onProps, onRef,
	 * onMount, ready) ex focus restoration
	 *
	 * @param {Function} fn
	 */
	const onFixes = fn => add(0, fn);

	/**
	 * Queue a function to run before (onRef, onMount, ready) ex running
	 * user functions on elements via plugins
	 *
	 * @param {Function} fn
	 */
	const onProps = fn => add(1, fn);

	/**
	 * Queue a function to run onRef (before onMount, after onProps)
	 *
	 * @param {Function} fn
	 */
	const onRef = fn => add(2, fn);

	/**
	 * Queue a function to run onMount (before ready, after onRef)
	 *
	 * @param {Function} fn
	 */
	const onMount = fn => add(3, fn);

	/**
	 * Queue a function to run after all user defined processes
	 *
	 * @param {Function} fn
	 */
	const onDone = fn => add(5, fn);

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
	 * @param {string} propName - Name of the prop
	 * @param {(
	 * 	node: Element,
	 * 	propName: string,
	 * 	propValue: Function | any,
	 * 	props: object,
	 * ) => void} fn
	 *   - Function to run when this prop is found on any Element
	 *
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
	 * @param {string} NSName - Name of the namespace
	 * @param {(
	 * 	node: Element,
	 * 	propName: string,
	 * 	propValue: Function | any,
	 * 	props: object,
	 * 	localName: string,
	 * 	ns: string,
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
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setPropertyNS = (node, name, value, props, localName, ns) => {
	  setProperty(node, localName, value);
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @url https://pota.quack.uy/props/setProperty
	 */
	const setProperty = (node, name, value) => {
	  withValue(value, value => _setProperty(node, name, value));
	};
	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	function _setProperty(node, name, value) {
	  // if the value is null or undefined it will be set to null
	  if (isNullUndefined(value)) {
	    // defaulting to `undefined` breaks `progress` tag and the whole page
	    node[name] = null;
	  } else {
	    node[name] = value;
	  }
	}

	/**
	 * @template {Element} T
	 * @param {T} node
	 * @param {string} name
	 * @param {EventHandler<Event, T>} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setEventNS = (node, name, value, props, localName, ns) => {
	  // `value &&` because avoids crash when `on:click={prop.onClick}` and `prop.onClick === null`
	  value && addEvent(node, localName, ownedEvent(value));
	};

	/** Returns true or false with a `chance` of getting `true` */
	const randomId = () => crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {string} value
	 * @param {object} props
	 */
	const setCSS = (node, name, value, props) => {
	  setNodeCSS(node, value);
	};

	/** @type {(node: Element, value: string) => void} */
	const setNodeCSS = withState((state, node, value, retrying = false) => {
	  if (!node.isConnected && !retrying) {
	    return queueMicrotask(() => setNodeCSS(node, value, true));
	  }
	  addClass(node, state.get(value, value => {
	    const id = 'c' + randomId();
	    addAdoptedStyleSheet(getDocumentForElement(node), sheet(value.replace(/class/g, '.' + id)));
	    return id;
	  }));
	});

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setRef = (node, name, value, props) => {
	  onRef(() => value(node));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setConnected = (node, name, value, props) => {
	  onMount(() => value(node));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setDisconnected = (node, name, value, props) => {
	  cleanup(() => value(node));
	};

	// node style


	/**
	 * @param {DOMElement} node
	 * @param {string} name
	 * @param {StyleAttribute} value
	 * @param {object} props
	 * @url https://pota.quack.uy/props/setStyle
	 */
	const setStyle = (node, name, value, props) => {
	  setNodeStyle(node.style, value);
	};

	/**
	 * @param {DOMElement} node
	 * @param {string} name
	 * @param {StyleAttribute} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setStyleNS = (node, name, value, props, localName, ns) => {
	  setNodeStyle(node.style, isObject(value) ? value : {
	    [localName]: value
	  });
	};

	/**
	 * @param {CSSStyleDeclaration} style
	 * @param {StyleAttribute} value
	 */
	function setNodeStyle(style, value) {
	  if (isString(value)) {
	    style.cssText = value;
	  } else if (isFunction(value)) {
	    withValue(value, value => setNodeStyle(style, getValue(value)));
	  } else if (isObject(value)) {
	    for (const name in value) {
	      setStyleValue(style, name, value[name]);
	    }
	  }
	}

	/**
	 * @param {CSSStyleDeclaration} style
	 * @param {string} name
	 * @param {unknown} value
	 */
	const setStyleValue = (style, name, value) => {
	  withValue(value, value => _setStyleValue(style, name, value));
	};

	/**
	 * @param {CSSStyleDeclaration} style
	 * @param {string} name
	 * @param {string | null} value
	 */
	const _setStyleValue = (style, name, value) => {
	  // if the value is null or undefined it will be removed
	  isNullUndefined(value) ? style.removeProperty(name) : style.setProperty(name, value);
	};

	// node class / classList


	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {object | string | ArrayLike<any>} value
	 * @param {object} props
	 */
	const setClass = (node, name, value, props) => {
	  isString(value) ? node.setAttribute(name, value) : setClassList(node, value);
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {object | string | ArrayLike<any>} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setClassNS = (node, name, value, props, localName, ns) => {
	  isFunction(value) || !isObject(value) ? setElementClass(node, localName, value) : setClassList(node, value);
	};

	/**
	 * @param {Element} node
	 * @param {object | string | ArrayLike<any>} value
	 */
	function setClassList(node, value) {
	  switch (typeof value) {
	    case 'string':
	      {
	        _setClassListValue(node, value, true);
	        break;
	      }
	    case 'object':
	      {
	        let name;
	        for (name in value) {
	          setElementClass(node, name, value[name]);
	        }
	        break;
	      }
	    case 'function':
	      {
	        withValue(value, value => setClassList(node, value));
	        break;
	      }
	  }
	}
	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	const setElementClass = (node, name, value) => {
	  withPrevValue(value, (value, prev) => {
	    if (!value && !prev) ; else {
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
	  !value ? removeClass(node, name) : addClass(node, ...name.trim().split(/\s+/));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Accessor<string | boolean>} value
	 * @param {string} [ns]
	 * @url https://pota.quack.uy/props/setAttribute
	 */
	const setAttribute = (node, name, value, ns) => {
	  withValue(value, value => _setAttribute(node, name, value, ns));
	};
	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {string | boolean} value
	 * @param {string} [ns]
	 */
	function _setAttribute(node, name, value, ns) {
	  // @ts-ignore

	  // if the value is false/null/undefined it will be removed
	  if (value === false || isNullUndefined(value)) {
	    ns && NS[ns] ? node.removeAttributeNS(NS[ns], name) : node.removeAttribute(name);
	  } else {
	    ns && NS[ns] ? node.setAttributeNS(NS[ns], name, value === true ? '' : value) : node.setAttribute(name, value === true ? '' : value);
	  }
	}

	propsPluginNS('prop', setPropertyNS, false);
	propsPluginNS('on', setEventNS, false);
	propsPlugin('use:css', setCSS, false);
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
	 * Assigns a prop to an Element
	 *
	 * @template T
	 * @param {Element} node
	 * @param {string} name
	 * @param {any} value
	 * @param {T} props
	 */
	function assignProp(node, name, value, props) {
	  // run plugins
	  let plugin = plugins.get(name);
	  if (plugin) {
	    plugin(node, name, value, props);
	  } else if (propNS[name] || name.includes(':')) {
	    // with ns
	    propNS[name] = propNS[name] || name.split(':');

	    // run plugins NS
	    plugin = pluginsNS.get(propNS[name][0]);
	    plugin ? plugin(node, name, value, props, propNS[name][1], propNS[name][0]) : setAttribute(node, name, value, propNS[name][0]);
	  } else {
	    // catch all
	    setAttribute(node, name, value);
	  }
	}

	/**
	 * Assigns props to an Element
	 *
	 * @template T
	 * @param {Element} node - Element to which assign props
	 * @param {T} props - Props to assign
	 */
	function assignProps(node, props) {
	  for (const name in props) {
	    assignProp(node, name, props[name], props);
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
	 * @template {Props<{ xmlns?: string, is?: string }>} P
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

	/**
	 * @param {string} xmlns
	 * @param {(xmlns: string) => Element} fn
	 * @param {string} tagName
	 * @returns {Element}
	 */
	function withXMLNS(xmlns, fn, tagName) {
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
	 * @param {Element | DocumentFragment} parent
	 * @param {Children} child
	 * @param {boolean} [relative]
	 * @param {Text | undefined} [prev]
	 * @returns {Children}
	 */
	function createChildren(parent, child, relative = false, prev = undefined) {
	  switch (typeof child) {
	    // string/number
	    case 'string':
	    case 'number':
	      {
	        if (prev instanceof Text) {
	          prev.nodeValue = child;
	          return prev;
	        }

	        /**
	         * The text node could be created by just doing
	         * `parent.textContent = value` when the parent node has no
	         * children.
	         */
	        if (!relative && parent.childNodes.length === 0) {
	          parent.textContent = child;
	          return parent.firstChild;
	        }
	        return insertNode(parent, createTextNode(child), relative);
	      }
	    case 'function':
	      {
	        // component
	        if ($isComponent in child) {
	          return createChildren(parent, untrack(/** @type {() => Children} */child), relative);
	        }
	        let node = [];

	        // signal/memo/external/user provided function
	        // needs placeholder to stay in position
	        parent = createPlaceholder(parent, relative);

	        // For - TODO move this to the `For` component
	        $isMap in child ? effect(() => {
	          node = toDiff(node, flatToArray(child(child => {
	            /**
	             * Wrap the item with placeholders, for when stuff in
	             * between moves. If a `Show` adds and removes nodes,
	             * we dont have a reference to these nodes. By
	             * delimiting with a shore, we can just handle
	             * anything in between as a group.
	             */
	            const begin = createPlaceholder(parent, true);
	            const end = createPlaceholder(parent, true);
	            return [begin, createChildren(end, child, true), end];
	          })), true);
	        }) : effect(() => {
	          // maybe a signal (at least a function) so needs an effect
	          node = toDiff(node, flatToArray(createChildren(parent, child(), true, node[0])), true);
	        });
	        cleanup(() => {
	          toDiff(node);
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
	          return insertNode(parent, child, relative);
	        }

	        // children/fragments
	        if (isArray(child)) {
	          return child.length === 1 ? createChildren(parent, child[0], relative) : child.map(child => createChildren(parent, child, relative));
	        }

	        /**
	         * The value is `null`, as in {null} or like a show returning
	         * `null` on the falsy case
	         */
	        if (child === null) {
	          return undefined;
	        }

	        // async components
	        if ('then' in child) {
	          const [value, setValue] = signal(undefined);
	          const onResult = result => isConnected(parent) && setValue(result);
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
	        return insertNode(parent, createTextNode(/** @type object */child.toString()), relative);
	      }
	  }
	}
	propsPlugin('children', (node, propName, propValue) => {
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
	 * @param {Element | DocumentFragment} parent
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
	    } else if (name === 'LINK' && node.rel === 'canonical') {
	      prev = querySelector(head, 'link[rel="canonical"]');
	    }

	    // replace old node if there's any
	    prev ? prev.replaceWith(node) : parent.appendChild(node);
	  } else {
	    relative ? parent.before(node) : parent.appendChild(node);
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
	function insert(children, parent = document$1.body, options = nothing) {
	  if (options.clear && parent) parent.textContent = '';
	  const node = createChildren(parent, Factory(isFunction(children) ? children : () => children), options.relative);

	  // @ts-ignore
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
	 * Creates a context and returns a function to get or set the value
	 *
	 * @template T
	 * @param {T} [defaultValue] - Default value for the context
	 * @url https://pota.quack.uy/Reactivity/Context
	 */
	/* #__NO_SIDE_EFFECTS__ */
	function context(defaultValue = undefined) {
	  const ctx = Context(defaultValue);
	  // @ts-ignore
	  ctx.toHTML = toHTML;
	  return ctx;
	}

	/**
	 * Removes from the DOM `prev` elements not found in `next`
	 *
	 * @param {Element[]} [prev=[]] - Array with previous elements.
	 *   Default is `[]`
	 * @param {Element[]} [next=[]] - Array with next elements. Default is
	 *   `[]`
	 * @param {boolean} [short=false] - Whether to use fast clear. Default
	 *   is `false`
	 * @returns {Element[]} The next array of elements
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

	/**
	 * @template {Event} T
	 * @param {T} e
	 */
	const preventDefault = e => e.preventDefault();

	/**
	 * @param {Element | typeof globalThis} node
	 * @param {string} eventName
	 * @param {CustomEventInit} [data]
	 */

	const emit = (node, eventName, data = {
	  bubbles: true,
	  cancelable: true,
	  composed: true
	}) => node.dispatchEvent(new CustomEvent(eventName, data));

	/**
	 * Defines a custom Element (if isnt defined already)
	 *
	 * @param {string} name - Name for the custom element
	 * @param {CustomElementConstructor} constructor - Class for the
	 *   custom element
	 * @param {ElementDefinitionOptions} [options] - Options passed to
	 *   `customElements.define`
	 */
	function customElement(name, constructor, options) {
	  if (customElements.get(name) === undefined) {
	    customElements.define(name, constructor, options);
	  }
	}
	class CustomElement extends HTMLElement {
	  constructor() {
	    super();
	    const shadowRoot = this.attachShadow({
	      mode: 'open'
	    });

	    // this is needed because `baseStyleSheets/styleSheets` are `static`
	    const constructor = this.constructor;
	    addStyleSheets(shadowRoot, constructor.baseStyleSheets);
	    addStyleSheets(shadowRoot, constructor.styleSheets);
	  }

	  /* DOM API */

	  /**
	   * Shortcut for querySelector
	   *
	   * @param {string} query
	   */
	  query(query) {
	    return querySelector(this, query);
	  }
	  /**
	   * Shortcut for this.shadowRoot.innerHTML
	   *
	   * @param {string | Component} value
	   */
	  set html(value) {
	    if (isString(value)) {
	      this.shadowRoot.innerHTML = value;
	    } else {
	      this.shadowRoot.replaceChildren(toHTMLFragment(Component(value || 'slot')));
	    }
	  }

	  /**
	   * Toggles attribute `hidden`
	   *
	   * @param {boolean} value
	   */
	  set hidden(value) {
	    value ? setAttribute$1(this, 'hidden', '') : removeAttribute(this, 'hidden');
	  }

	  /* EVENTS API */

	  /**
	   * Emits an event
	   *
	   * @param {string} eventName
	   * @param {any} [data]
	   */
	  emit(eventName, data) {
	    emit(this, eventName, data);
	  }

	  /* SLOTS API */

	  hasSlot(name) {
	    return this.query(`:scope [slot="${name}"]`);
	  }
	}

	/**
	 * Similar to `Show`, but doesn't remove its children from the
	 * document
	 *
	 * @template T
	 * @param {{
	 * 	when: When<any> // Condition to show/hide children
	 * 	children?: Children // Content to show when condition is true
	 * 	fallback?: Children // Content to show when condition is false
	 * }} props
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Collapse
	 */
	function Collapse(props) {
	  // need to include the class here because else its not treeshaked

	  class CollapseElement extends CustomElement {
	    static styleSheets = [css`
				:host {
					display: contents;
				}
			`];

	    /** @param {any} value - To toggle children */
	    set when(value) {
	      this.html = value ? '<slot/>' : this.fb || '';
	    }
	    /** @param {any} fallback - To toggle children */
	    set fallback(fallback) {
	      // TODO make this reactive
	      this.fb = fallback;
	    }
	  }
	  const name = 'pota-collapse';
	  customElement(name, CollapseElement);
	  return Component(name, {
	    'prop:when': props.when,
	    'prop:fallback': props.fallback,
	    children: props.children
	  });
	}

	/**
	 * Creates components dynamically
	 *
	 * @param {Props<{
	 * 	component: Component
	 * }>} props
	 * @url https://pota.quack.uy/Components/Dynamic
	 */

	const Dynamic = props =>
	// `component` needs to be deleted else it will end in the tag as an attribute
	Component(props.component, {
	  ...props,
	  component: undefined
	});

	/**
	 * Renders reactive values from an signal that returns an Iterable
	 * object
	 *
	 * @template T
	 * @param {object} props
	 * @param {Each<T>} props.each
	 * @param {boolean} [props.restoreFocus] - If the focused element
	 *   moves it may lose focus
	 * @param {boolean} [props.reactiveIndex] - Make indices reactive signals
	 * @param {Children} [props.children]
	 * @param {Children} [props.fallback]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/For
	 */

	const For = props => map(() => {
	  props.restoreFocus && queue();
	  return props.each;
	}, makeCallback(props.children), false, props.fallback, props.reactiveIndex);

	/** @type {boolean} */
	let queued;

	// because re-ordering the elements trashes focus
	function queue() {
	  if (!queued) {
	    queued = true;
	    const active = activeElement();
	    const scroll = documentElement.scrollTop;
	    onFixes(() => {
	      queued = false;
	      // re-ordering the elements trashes focus
	      active && active !== activeElement() && isConnected(active) &&
	      // @ts-ignore
	      active.focus();
	      documentElement.scrollTop = scroll;
	    });
	  }
	}

	/**
	 * Portals children to a different element while keeping the original
	 * scope
	 *
	 * @param {object} props
	 * @param {Element} props.mount
	 * @param {Children} [props.children]
	 * @url https://pota.quack.uy/Components/Portal
	 */
	function Portal(props) {
	  insert(props.children, props.mount);
	}

	/**
	 * Mounts children on `document.head`
	 *
	 * @param {Props} props
	 * @url https://pota.quack.uy/Components/Head
	 */
	const Head = props => Component(Portal, {
	  mount: document$1.head,
	  children: props.children
	});

	/**
	 * Renders children based on the `range` function arguments
	 *
	 * @param {object} props
	 * @param {number} props.start
	 * @param {number} props.stop
	 * @param {number} props.step
	 * @param {Children} [props.children]
	 * @returns {Children}
	 */

	const Range = props => Component(For, {
	  each: toArray(range(props.start ?? 0, props.stop ?? 0, props.step ?? 1)),
	  children: props.children
	});

	// @ts-nocheck

	/** @type symbol */
	const $track = Symbol('track');
	/** @type symbol */
	const $trackSlot = Symbol('track-slot');

	/** Tracker */

	const [getTracker, setTracker] = weakStore();
	const createTracker = target => new Track(target, true);

	/**
	 * Returns a tracker for an object. A tracker is unique per object,
	 * always the same tracker for the same object.
	 *
	 * @template T
	 * @param {T} target
	 * @returns {Track}
	 */
	const tracker = target => getTracker(target, createTracker);

	/**
	 * Returns the signal tracking the value.
	 *
	 * @template T
	 * @param {T} target
	 * @param {Track} track
	 * @param {PropertyKey} key
	 * @returns {[(newValue) => any, (newValue) => boolean]}
	 */
	function trackerValueSignal(target, track, key) {
	  track = track || tracker(target);
	  return [track.valueRead.bind(track, key), track.valueWrite.bind(track, key)];
	}

	/** Track Class */

	const handleNaN = {
	  equals: is
	};
	const notEquals = {
	  equals: false
	};
	function signals(property, key, type, value, equalsType) {
	  if (property[type] === undefined) {
	    /*
	    log(
	    	{
	    		id() {
	    			return ''
	    		},
	    	},
	    	'creating signal',
	    	key,
	    	type,
	    	value,
	    )
	    */

	    property[type] = signal(value, equalsType === 1 && typeof value === 'number' ? handleNaN : equalsType === 2 ? notEquals : undefined);
	  }
	  return property[type];
	}
	const All = Symbol('All');
	const OwnKeys = Symbol('OwnKeys');
	const Value = Symbol('Value');
	const Has = Symbol('Has');
	const isUndefined = Symbol('isUndefined');
	const defaults = {
	  __proto__: null,
	  [Value]: undefined,
	  [Has]: undefined,
	  [isUndefined]: undefined
	};
	class Track {
	  #props = empty();

	  /*
	  #id = Math.random()
	  	id() {
	  	return this.#id
	  }
	  */

	  /**
	   * @param {object} value
	   * @param {boolean} [isNew]
	   */
	  constructor(value, isNew) {
	    if (!isNew) {
	      /**
	       * An object will already have a tracker when the tracker is
	       * created outside of mutable. Outside of the proxy handlers.
	       */
	      const tracker = getTracker(value);
	      if (tracker) {
	        this.#props = tracker.#props;
	      } else {
	        setTracker(value, this);
	      }
	    }
	  }
	  #prop(key) {
	    if (!(key in this.#props)) {
	      this.#props[key] = create$1(defaults);
	    }
	    return this.#props[key];
	  }

	  /**
	   * Return true if the signals has already been created
	   *
	   * @returns {boolean}
	   */
	  #hasSignal(propKey, valueKey) {
	    return propKey in this.#props && valueKey in this.#props[propKey] && this.#props[propKey][valueKey] !== undefined;
	  }

	  /**
	   * Keeps track of: a value for a `key`
	   *
	   * @param {PropertyKey} key
	   * @param {any} value
	   * @returns {any} Value
	   */
	  valueRead(key, value) {
	    // log(this, 'valueRead', key, value)

	    /** Do not write to the signal here it will cause a loop */
	    const signal = signals(this.#prop(key), key, Value, value, 1);
	    return signal.read(), value;
	  }
	  /**
	   * Keeps track of: a value for a `key`
	   *
	   * @param {PropertyKey} key
	   * @param {any} value
	   * @returns {boolean} Indicating if the value changed
	   */
	  valueWrite(key, value) {
	    // log(this, 'valueWrite', key, value)

	    const hasSignal = this.#hasSignal(key, Value);
	    /*
	    log(
	    	this,
	    	'has signal',
	    	hasSignal,
	    	this.#props[key] ? this.#props[key][Value] : undefined,
	    )
	    */
	    /**
	     * Write the value because tracking will re-execute when this
	     * value changes
	     */
	    const signal = signals(this.#prop(key), key, Value, value, 1);
	    const changed = signal.write(value) || !hasSignal;

	    // log(this, 'valueWrite changed?', changed)
	    return changed;
	  }

	  /**
	   * Keeps track of: if a `key` is in an object.
	   *
	   * @param {PropertyKey} key
	   * @param {boolean} value - Indicating if the property is `in`
	   */
	  hasRead(key, value) {
	    // log(this, 'hasRead', key, value)

	    signals(this.#prop(key), key, Has, value, 0).read();
	  }
	  /**
	   * Keeps track of: if a `key` is in an object.
	   *
	   * @param {PropertyKey} key
	   * @param {boolean} value - Indicating if the property is `in`
	   */
	  hasWrite(key, value) {
	    // log(this, 'hasWrite', key, value)

	    signals(this.#prop(key), key, Has, value, 0).write(value);
	  }

	  /**
	   * Keeps track of: if value is undefined, regardless if the `key`
	   * exists in the object or not.
	   *
	   * @param {PropertyKey} key
	   * @param {boolean} value - Indicating if the property is
	   *   `undefined`
	   */
	  isUndefinedRead(key, value) {
	    // log(this, 'isUndefinedRead', key, value)

	    signals(this.#prop(key), key, isUndefined, value, 0).read();
	  }
	  /**
	   * Keeps track of: if value is undefined, regardless if the `key`
	   * exists in the object or not.
	   *
	   * @param {PropertyKey} key
	   * @param {boolean} value - Indicating if the property is
	   *   `undefined`
	   */
	  isUndefinedWrite(key, value) {
	    // log(this, 'isUndefinedWrite', key, value)

	    signals(this.#prop(key), key, isUndefined, value, 0).write(value);
	  }

	  /**
	   * Adds a key.
	   *
	   * 1. Sets `has` state to `true`
	   * 2. Sets `undefined` state
	   * 3. Sets `value`
	   *
	   * @param {PropertyKey} key
	   * @param {any} value
	   */
	  add(key, value) {
	    // log(this, 'add', key, value)

	    this.hasWrite(key, true); // change has
	    this.isUndefinedWrite(key, value === undefined); // track when is undefined
	    this.valueWrite(key, value); // change value
	  }

	  /**
	   * Modifies a key.
	   *
	   * 1. Sets `value`
	   * 2. Sets `undefined` state
	   *
	   * @param {PropertyKey} key
	   * @param {any} value
	   */
	  modify(key, value) {
	    this.isUndefinedWrite(key, value === undefined); // track when is undefined

	    return this.valueWrite(key, value); // change value
	  }

	  /**
	   * Deletes a key.
	   *
	   * 1. Sets `has` state to `false`
	   * 2. Sets `undefined` state to true
	   * 3. Sets `value` to `undefined`
	   *
	   * @param {PropertyKey} key
	   */
	  delete(key) {
	    // log(this, 'delete', key)

	    this.hasWrite(key, false); // change has
	    this.isUndefinedWrite(key, true); // track when is undefined
	    this.valueWrite(key, undefined); // change value
	  }

	  // single signal

	  /** For using exclusively with Symbols by reusing the "Value" slot */

	  /**
	   * To indicate all values have been read
	   *
	   * @param {symbol} [key]
	   */
	  read(key = All) {
	    // log(this, 'read', key)

	    signals(this.#prop(key), key, Value, undefined, 2).read();
	  }
	  /**
	   * To indicate all values have changed *
	   *
	   * @param {symbol} [key]
	   */
	  write(key = All) {
	    // log(this, 'write', key)

	    signals(this.#prop(key), key, Value, undefined, 2).write();
	  }

	  /** `ownKeys` read */
	  ownKeysRead() {
	    this.read(OwnKeys);
	  }
	  /** To indicate keys have change */
	  ownKeysWrite() {
	    this.write(OwnKeys);
	  }
	}

	function apply(target, value, args) {
	  return mutable(reflectApply(value, target, args));
	}
	class ProxyHandlerBase extends Track {
	  // type = 'Base'

	  ownKeys(target) {
	    this.ownKeysRead();
	    return reflectOwnKeys(target);
	  }
	  has(target, key) {
	    const r = reflectHas(target, key);
	    this.hasRead(key, r);
	    return r;
	  }
	  deleteProperty(target, key) {
	    /** To not trigger effects when the property isn't in the object */
	    if (!(key in target)) {
	      return true;
	    }
	    return batch(() => {
	      this.ownKeysWrite();
	      this.delete(key);

	      /**
	       * Use `delete` instead of `reflectDeleteProperty` so it throws
	       * when not permitted
	       */
	      return delete target[key];
	    });
	  }
	  getOwnPropertyDescriptor(target, key) {
	    this.has(target, key);
	    return reflectGetOwnPropertyDescriptor(target, key);
	  }
	  returnValue(target, key, value) {
	    /**
	     * 1. A non-extensible object must return the real object, but still
	     *    its children properties must be tracked
	     * 2. A non-configurable property must return the real value
	     *
	     * [[Get]] For proxy objects enforces the following invariants:
	     *
	     * The value reported for a property must be the same as the value
	     * of the corresponding target object property if the target
	     * object property is a non-writable, non-configurable own data
	     * property.
	     *
	     * The value reported for a property must be undefined if the
	     * corresponding target object property is a non-configurable own
	     * accessor property that has undefined as its [[Get]] attribute.
	     */

	    return !isExtensible(target) || !isConfigurable(target, key, value) ? (mutable(value), value) : mutable(value);
	  }
	  returnFunction(target, key, value) {
	    return (...args) => {
	      /**
	       * 1. `Reflect.apply` to correct `receiver`. `TypeError: Method
	       *    Set.prototype.add called on incompatible receiver #<Set>`
	       * 2. Run in a batch to react to all changes at the same time.
	       */

	      return batch(() => Object.hasOwn(objectMethods, key) ? objectMethods[key](this, target, value, args) : apply(target, value, args));
	    };
	  }
	}
	var objectMethods = {
	  hasOwnProperty(track, target, value, args) {
	    track.has(target, args[0]);
	    return apply(target, value, args);
	  }
	};

	/**
	 * Proxy for objects. In objects, values are tracked by the
	 * setter/getters in the properties.
	 */
	class ProxyHandlerObject extends ProxyHandlerBase {
	  // type = 'Object'

	  get(target, key, proxy) {
	    /** To be able to track properties not yet set */
	    if (!(key in target)) {
	      this.isUndefinedRead(key, true);
	    }

	    /** Tracking + value */
	    const value = reflectGet(target, key, proxy);

	    /** Proxy all functions */
	    if (isFunction(value)) {
	      return this.returnFunction(target, key, value);
	    }
	    return this.returnValue(target, key, value);
	  }
	  set(target, key, value, proxy) {
	    return batch(() => {
	      /** Always work with mutables */
	      value = mutable(value);

	      /** New key */
	      if (!(key in target)) {
	        this.ownKeysWrite(); // change ownKeys
	        this.hasWrite(key, true); // change has
	        signalifyUndefinedKey(target, key, mutable, this, value); // track value
	      }
	      /**
	       * To trigger the change when was read but not yet defined. It
	       * handles the cases: deleting an undefined property, setting to
	       * undefined a property that was deleted.
	       */
	      this.isUndefinedWrite(key, value === undefined);
	      return reflectSet(target, key, value, proxy);
	    });
	  }
	}

	// @ts-nocheck

	/**
	 * Like Map but tracks.
	 *
	 * 1. Instances are supposed to be used Proxied, so theres no need for
	 *    batching, because the proxy already batches the functions.
	 * 2. This is an internal Class and is not meant to be used outside
	 *    `mutable`.
	 */

	class ReactiveMap extends Map {
	  /** @type {import('../tracker.js').Track} */
	  [$track];
	  [$trackSlot] = new Track(this);
	  get size() {
	    return super.size;
	  }
	  has(key) {
	    const r = super.has(key);
	    this[$trackSlot].hasRead(key, r);
	    return r;
	  }
	  get(key) {
	    const r = super.get(key);
	    this[$trackSlot].valueRead(key, r);
	    return r;
	  }
	  set(key, value) {
	    value = mutable(value);
	    const slot = this[$trackSlot];
	    if (super.has(key)) {
	      if (super.get(key) === value) {
	        return this;
	      }
	    } else {
	      slot.ownKeysWrite();
	    }
	    slot.write();
	    slot.hasWrite(key, true);
	    slot.valueWrite(key, value);
	    super.set(key, value);
	    this[$track].valueWrite('size', super.size);
	    return this;
	  }
	  delete(key) {
	    const r = super.delete(key);
	    if (r) {
	      const slot = this[$trackSlot];
	      slot.ownKeysWrite();
	      slot.write();
	      slot.hasWrite(key, false);
	      slot.valueWrite(key, undefined);
	      this[$track].valueWrite('size', super.size);
	    }
	    return r;
	  }
	  clear() {
	    if (super.size) {
	      const slot = this[$trackSlot];
	      slot.ownKeysWrite();
	      slot.write();
	      for (const key of super.keys()) {
	        slot.hasWrite(key, false);
	        slot.valueWrite(key, undefined);
	      }
	      super.clear();
	      this[$track].valueWrite('size', 0);
	    }
	  }
	  forEach(cb) {
	    const slot = this[$trackSlot];
	    slot.read();
	    slot.ownKeysRead();
	    for (const [key, value] of super.entries()) {
	      slot.valueRead(key, value);
	      cb(value, key, this);
	    }
	  }
	  *keys() {
	    const slot = this[$trackSlot];
	    for (const key of super.keys()) {
	      slot.hasRead(key, true);
	      yield key;
	    }

	    // for when empty and for when iterating all
	    slot.ownKeysRead();
	  }
	  *values() {
	    const slot = this[$trackSlot];
	    for (const [key, value] of super.entries()) {
	      slot.valueRead(key, value);
	      yield value;
	    }

	    // for when empty and for when iterating all
	    slot.read();
	    slot.ownKeysRead();
	  }
	  *entries() {
	    const slot = this[$trackSlot];
	    for (const entry of super.entries()) {
	      slot.valueRead(entry[0], entry[1]);
	      yield entry;
	    }

	    // for when empty and for when iterating all
	    slot.read();
	    slot.ownKeysRead();
	  }
	  [iterator]() {
	    return this.entries();
	  }
	}

	/** Keeps track of what objects have already been made into a proxy */
	const [getProxy, setProxy] = weakStore();
	const saveProxy = (value, proxy) => {
	  setProxy(value, proxy);
	  if (value !== proxy) setProxy(proxy, proxy);
	  return proxy;
	};
	function createProxy(target, Handler, setTrack = true) {
	  const handler = new Handler(target);
	  setTrack && definePropertyReadOnly(target, $track, handler);

	  /**
	   * Before mutating the content of it (for example calling
	   * `signalifyObject` or making the content of an array mutable),
	   * save it. In case the mutation triggers `mutable` before we have a
	   * chance to save it as a proxy. To avoid the posible situation of
	   * having 2 different proxies for the same value.
	   */

	  return saveProxy(target, new Proxy(target, handler));
	}

	/**
	 * Makes a recursive modifiable and trackeable object. Transforms in
	 * place properties into signals via get/set. Works with inherited
	 * getters/setters.
	 *
	 * @template T
	 * @param {T} value
	 * @param {boolean} [clone] - If to `copy` the value first
	 * @returns {T}
	 */
	function mutable(value, clone) {
	  /** Return value as is when is not an object */
	  if (!isObject(value)) {
	    return value;
	  }

	  /** Make a copy to avoid modifying original data (optional) */
	  value = clone ? copy(value) : value;

	  /**
	   * Return `proxy` if already exists for `value`. It could be
	   * possible that `value` is a `proxy`, which is already saved, so it
	   * will return the same thing.
	   */
	  let proxy = getProxy(value);
	  if (proxy) {
	    return proxy;
	  }

	  /**
	   * Values like Date, RegExp, HTMLElement are not proxied. The
	   * blacklist can be customized by editing the set from blacklist.js
	   */
	  if (isMutationBlacklisted(value)) {
	    return saveProxy(value, value);
	  }

	  /**
	   * Array methods are proxied by changing their prototype to be
	   * `ReactiveArray extends Array`. ReactiveArray is also proxied so
	   * functions can be batched.
	   */
	  if (isArray(value)) {
	    proxy = createProxy(value, ProxyHandlerArray);

	    /** Make the content of the array mutable. */
	    untrack(() => value.forEach((value, key, array) => {
	      array[key] = mutable(value);
	    }));
	    return proxy;
	  }

	  /**
	   * Map methods are proxied by changing their prototype to be
	   * `ReactiveMap extends Map`. ReactiveMap is also proxied so
	   * functions can be batched.
	   */
	  if (value instanceof Map) {
	    if (value instanceof ReactiveMap) {
	      /**
	       * If value is already an instance of ReactiveMap and not
	       * proxied (we didn't find a proxy for it a few lines above),
	       * then its a new copy of itself.
	       */

	      proxy = createProxy(value, ProxyHandlerObject);

	      // well I didnt comment this, now I wonder whats going on here
	      // seems like its tracking the map object but I wonder if thats needed at all
	      signalifyObject(value, mutable);
	      return proxy;
	    }

	    /** Class MyClass extends ... extends Map {} */
	    replacePrototypeWith(value, PrototypeMap, new ReactiveMap());
	    proxy = createProxy(value, ProxyHandlerObject);

	    /** Make the content mutable. */
	    untrack(() => value.forEach((value, key, map) => {
	      map.set(key, value);
	    }));

	    // well I didnt comment this, now I wonder whats going on here
	    // seems like its tracking the map object but I wonder if thats needed at all
	    signalifyObject(value, mutable);
	    return proxy;
	  }

	  /** An intance of something we dont have a special handler for it */
	  proxy = createProxy(value, ProxyHandlerObject, false);
	  signalifyObject(value, mutable);
	  return proxy;
	}

	/** Proxy for Arrays. In Arrays, values are tracked by the proxy. */

	class ProxyHandlerArray extends ProxyHandlerBase {
	  // type = 'Array'

	  get(target, key, proxy) {
	    /** To be able to track properties not yet set */
	    if (!(key in target)) {
	      this.isUndefinedRead(key, true);
	    }

	    /** Value */
	    const value = reflectGet(target, key, proxy);

	    /** Proxy all functions */
	    if (isFunction(value)) {
	      return this.returnFunction(target, key, value);
	    }
	    return this.valueRead(key, this.returnValue(target, key, value));
	  }
	  set(target, key, value, proxy) {
	    return batch(() => {
	      /** Always work with mutables */
	      value = mutable(value);

	      /** New key */
	      if (!(key in target)) {
	        this.ownKeysWrite(); // change ownKeys
	        this.hasWrite(key, true); // change has
	        this.write();
	      }
	      if (this.modify(key, value)) {
	        /**
	         * Dispatch that "something" changed, for these listening for
	         * every change
	         */
	        this.write();

	        /**
	         * When explicit setting `length` it needs to mark anything
	         * deleted as deleted
	         */
	        if (key === 'length') {
	          this.ownKeysWrite(); // change ownKeys

	          if (value < target.length) {
	            for (let k = value; k < target.length; k++) {
	              this.delete(k);
	            }
	          }
	        }
	      }
	      const r = reflectSet(target, key, value, proxy);

	      /**
	       * Always update length. `arr = [], arr[0] = true` length
	       * changed, so it needs to be updated to 1.
	       */
	      this.valueWrite('length', target.length);
	      return r;
	    });
	  }
	  returnFunction(target, key, value) {
	    return (...args) => {
	      /**
	       * 1. `Reflect.apply` to correct `receiver`. `TypeError: Method
	       *    Set.prototype.add called on incompatible receiver #<Set>`
	       * 2. Run in a batch to react to all changes at the same time.
	       */

	      return batch(() => Object.hasOwn(arrayMethods, key) ? arrayMethods[key](this, target, value, args) : apply(target, value, args));
	    };
	  }
	}

	/**
	 * Like Array but tracks.
	 *
	 * 1. Instances are supposed to be used Proxied, so theres no need for
	 *    batching, because the proxy already batches the functions.
	 * 2. This is an internal Class and is not meant to be used outside
	 *    `mutable`.
	 */

	const arrayMethods = {
	  hasOwnProperty(track, target, value, args) {
	    track.has(target, args[0]);
	    return apply(target, value, args);
	  },
	  /** WRITE METHODS */

	  pop(track, target, value, args) {
	    if (target.length) {
	      // "something" changed
	      track.write();

	      // ownKeys changed
	      track.ownKeysWrite();

	      // has, undefined state, value
	      track.delete(target.length - 1);

	      // length changed
	      track.valueWrite('length', target.length - 1);
	    }
	    return apply(target, value, args);
	  },
	  // lib.es5.d.ts

	  push(track, target, value, args) {
	    args = args.map(mutable);

	    // "something" changed
	    track.write();

	    // ownKeys changed
	    track.ownKeysWrite();

	    // add keys
	    for (let key = target.length, item = 0; key < target.length + args.length; key++, item++) {
	      track.add(key, args[item]);
	    }

	    // change length
	    track.valueWrite('length', target.length + args.length);
	    return apply(target, value, args);
	  },
	  /** Removes the first element from an array and returns it. */
	  shift(track, target, value, args) {
	    if (target.length) {
	      const r = apply(target, value, args);
	      trackDiff(track, target, target.length + 1);
	      return r;
	    }
	  },
	  /**
	   * Inserts new elements at the start of an array, and returns the
	   * new length of the array.
	   */
	  unshift(track, target, value, args) {
	    args = args.map(mutable);
	    const r = apply(target, value, args);
	    trackDiff(track, target, target.length - args.length);
	    return r;
	  },
	  splice(track, target, value, args) {
	    let items = args.slice(2);
	    items = items.map(mutable);
	    const oldLength = target.length;
	    const r = apply(target, value, args);
	    trackDiff(track, target, oldLength);
	    return r;
	  },
	  // @ts-ignore
	  sort(track, target, value, args) {
	    const r = apply(target, value, args);
	    trackDiff(track, target);
	    return r;
	  },
	  reverse(track, target, value, args) {
	    const r = apply(target, value, args);
	    trackDiff(track, target);
	    return r;
	  },
	  forEach(track, target, value, args) {
	    track.read();
	    apply(target, value, args);
	  },
	  map(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  every(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  some(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  // lib.es2015.core.d.ts

	  fill(track, target, value, args) {
	    args[0] = mutable(args[0]);

	    // @ts-ignore
	    const r = apply(target, value, args);
	    trackDiff(track, target);
	    return r;
	  },
	  copyWithin(track, target, value, args) {
	    // @ts-ignore
	    const r = apply(target, value, args);
	    trackDiff(track, target);
	    return r;
	  },
	  /** READ METHODS */

	  // lib.es5.d.ts

	  toString(track, target, value, args) {
	    console.log('toString');
	    track.read();
	    return apply(target, value, args);
	  },
	  toLocaleString(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  slice(track, target, value, args) {
	    let start = args[0];
	    let end = args[1];
	    start = start > 0 ? start : start < 0 ? start + target.length : 0;
	    end = end > 0 ? end : end < 0 ? end + target.length : target.length;
	    const r = apply(target, value, args);
	    trackKeysRange(track, target, start, end);
	    return r;
	  },
	  join(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  concat(track, target, value, args) {
	    track.read();
	    args = args.map(mutable);
	    return apply(target, value, args);
	  },
	  indexOf(track, target, value, args) {
	    const searchElement = args[0];
	    const fromIndex = args[1];
	    const key = target.indexOf(mutable(searchElement), fromIndex);
	    trackKey(track, target, key);
	    return key;
	  },
	  lastIndexOf(track, target, value, args) {
	    const searchElement = args[0];
	    const fromIndex = args[1];
	    const key = target.lastIndexOf(mutable(searchElement), fromIndex === undefined ? target.length - 1 : fromIndex);
	    trackKey(track, target, key);
	    return key;
	  },
	  filter(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  reduce(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  reduceRight(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  // lib.es2015.core.d.ts

	  find(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  findIndex(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  // lib.es2015.iterable.d.ts

	  *entries(track, target, value, args) {
	    for (const entry of target) {
	      track.valueRead(entry[0], entry[1]);
	      yield entry;
	    }

	    // for when empty and for when iterating all
	    track.read();
	    track.ownKeysRead();
	  },
	  *keys(track, target, value, args) {
	    for (const key of target.keys()) {
	      track.hasRead(key, true);
	      yield key;
	    }

	    // for when empty and for when iterating all
	    track.ownKeysRead();
	  },
	  *values(track, target, _value, args) {
	    for (const [key, value] of target.entries()) {
	      track.valueRead(key, value);
	      yield value;
	    }

	    // for when empty and for when iterating all
	    track.read();
	    track.ownKeysRead();
	  },
	  *[iterator](track, target, value, args) {
	    track.read();
	    track.ownKeysRead();
	    return target.values();
	  },
	  // lib.es2016.array.include.d.ts

	  includes(track, target, value, args) {
	    track.read();
	    args[0] = mutable(args[0]);
	    return apply(target, value, args);
	  },
	  // lib.es2019.array.d.ts

	  flat(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  flatMap(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  // lib.es2022.array.d.ts

	  at(track, target, value, args) {
	    let key = args[0];
	    key = key < 0 ? key + target.length : key;
	    trackKey(track, target, key);
	    return apply(target, value, args);
	  },
	  // lib.es2023.array.d.ts

	  findLast(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  findLastIndex(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  toReversed(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  toSorted(track, target, value, args) {
	    track.read();
	    return apply(target, value, args);
	  },
	  toSpliced(track, target, value, args) {
	    track.read();
	    for (let i = 2; i < args.length; i++) {
	      args[i] = mutable(args[i]);
	    }
	    return apply(target, value, args);
	  },
	  with(track, target, value, args) {
	    let key = args[0];
	    key = key < 0 ? key + target.length : key;
	    trackKey(track, target, key);
	    return apply(target, value, args);
	  }
	};

	/** Dispatch read to specific key */
	function trackKey(track, target, key) {
	  if (key in target) {
	    track.valueRead(key, target[key]);
	  }
	}

	/** Dispatch reads to a keys range */
	function trackKeysRange(track, target, start = 0, end = target.length) {
	  start = start < 0 ? 0 : start;
	  end = end > target.length ? target.length : end;
	  for (let key = start; key < end; key++) {
	    // console.log('reading', key)
	    track.valueRead(key, target[key]);
	  }
	}

	/** Dispatch writes to values that changed */
	function trackDiff(track, target, oldLength = target.length) {
	  let changed = false;
	  let key = 0;
	  for (let length = target.length; key < length; key++) {
	    if (key > oldLength) {
	      // it's new
	      track.add(key, target[key]);
	      changed = true;
	    } else {
	      // modify existing
	      if (track.modify(key, target[key])) {
	        changed = true;
	      }
	    }
	  }
	  // delete deleted
	  for (; key < oldLength; key++) {
	    track.delete(key);
	    changed = true;
	  }
	  if (oldLength != target.length) {
	    track.ownKeysWrite();

	    // change length
	    track.valueWrite('length', target.length);
	    changed = true;
	  }
	  if (changed) {
	    track.write();
	  }
	}

	const mutableBlacklist = [Date, Promise$1, RegExp, Set,
	// Map,

	Iterator,
	// handlers - to avoid walking the prototype
	ProxyHandlerBase, ProxyHandlerObject, ProxyHandlerArray, Track];
	const prototypeBlacklist = [Object, Array, Map, ...mutableBlacklist];

	/** @type PropertyKey[] */
	const keyBlacklist = ['constructor', '__proto__', $track, $trackSlot, ...getOwnValues(Symbol).filter(isSymbol)];
	const methodsBlacklist = [...getOwnValues(ReactiveMap.prototype)];

	/**
	 * Returns `true` when `object` can't be made mutable.
	 *
	 * @param {any} target
	 */
	const isMutationBlacklisted = target => target === window || target instanceof Node || mutableBlacklist.includes(target.constructor);

	/**
	 * Returns `true` when prototype is blacklisted. We won't gather
	 * getters/setters from the object.
	 *
	 * @param {any} target
	 */
	const isPrototypeBlacklisted = target => prototypeBlacklist.includes(target.constructor) || target[Symbol.toStringTag] === 'Generator';

	/**
	 * Returns `true` when `key` is blacklisted. It won't be signalified.
	 *
	 * @param {PropertyKey} key
	 */
	const isKeyBlacklisted = key => keyBlacklist.includes(key);

	/**
	 * Returns `true` when `method` is blacklisted. It won't be
	 * signalified.
	 *
	 * @param {Function} value
	 */
	const isMethodBlacklisted = value => methodsBlacklist.includes(value);

	/**
	 * It returns all property descriptors for `target`.
	 *
	 * It checks for getters/setters of the prototype chain. The idea is
	 * that if the prototype provides some getters/setters, then, we
	 * should be able to track them too.
	 */
	function getPropertyDescriptors(target) {
	  const constructor = target?.constructor;

	  // common built-ins prototype getters/setters are ignored
	  if (constructor === Object || constructor === undefined) {
	    return getOwnPropertyDescriptors(target);
	  }

	  // blacklisted by default
	  if (isMutationBlacklisted(target)) {
	    return nothing;
	  }

	  /**
	   * Walk the prototype chain to gather getters/setters from
	   * prototypes.
	   */
	  let proto = getPrototypeOf(target);
	  if (isPrototypeBlacklisted(proto)) {
	    return nothing;
	  }

	  /** Gather getters/setters from prototype */
	  const protos = [];
	  while (proto && !isPrototypeBlacklisted(proto)) {
	    protos.push(proto);
	    proto = getPrototypeOf(proto);
	  }
	  const descriptors = empty();
	  for (const proto of protos.reverse()) {
	    assign(descriptors, getOwnPropertyDescriptors(proto));
	  }
	  // TODO MOVE THIS UP
	  // Gather getters/setters from target
	  if (!isPrototypeBlacklisted(target)) {
	    assign(descriptors, getOwnPropertyDescriptors(target));
	  }
	  // console.log(descriptors, target)
	  return descriptors;
	}

	/**
	 * Signalify object properties
	 *
	 * @template T
	 * @param {T} target
	 * @param {Function} [wrapper] To wrap values
	 */
	function signalifyObject(target, wrapper) {
	  const descriptors = getPropertyDescriptors(target);
	  const track = tracker(target);
	  for (const [key, descriptor] of entriesIncludingSymbols(descriptors)) {
	    signalifyKey(target, key, descriptor, wrapper, track);
	  }
	}

	/**
	 * Signalify a specific property
	 *
	 * @template T
	 * @param {T} target
	 * @param {PropertyKey} key
	 * @param {PropertyDescriptor} descriptor
	 * @param {Function} [wrapper] To wrap values
	 * @param {any} [track] Tracker
	 */
	function signalifyKey(target, key, descriptor, wrapper = identity, track) {
	  if (isKeyBlacklisted(key)) {
	    return;
	  }

	  /** Happens when they are signalifying a key that doesn't exists */
	  if (!descriptor) {
	    return signalifyUndefinedKey(target, key, wrapper, track);
	  }

	  /** Avoid keys that cannot be redefined */
	  if (!descriptor.configurable) {
	    /** Proxy nested configurable objects */
	    wrapper(descriptor.value);
	    return;
	  }

	  /**
	   * As getters shouldn't be invoked till used, we dont know the
	   * value. Assume `descriptor.value` and then check for getters once
	   * read.
	   */

	  let value = descriptor.value;

	  /**
	   * Avoid functions when using `signalify` as it's meant to be used
	   * in classes.
	   */
	  if (isFunction(value)) {
	    /**
	     * But do not avoid functions when it has a `wrapper`, like
	     * `mutable`.
	     */
	    if (wrapper === identity) {
	      return;
	    }

	    // blacklist common prototype methods
	    if (isMethodBlacklisted(value)) {
	      return;
	    }
	  }

	  // console.log(key, target)

	  // tracker

	  const [read, write] = trackerValueSignal(target, track, key);
	  const getter = descriptor.get?.bind(target);
	  const setter = descriptor.set?.bind(target);
	  defineProperty(target, key, {
	    get:
	    /**
	     * 1. We cannot know if the getter will return the same thing that
	     *    has been set. For this reason we cant rely on the return
	     *    value of the signal.
	     * 2. We need to ensure the return value is always wrapped (for in
	     *    case of being used as a mutable).
	     */
	    getter ? () => {
	      value = wrapper(getter());
	      return read(value);
	    } : () => {
	      value = wrapper(value);
	      return read(value);
	    },
	    set: /** When it's only a getter it shouldn't have a setter */
	    getter && !setter ? undefined : setter ? val => {
	      batch(() => {
	        value = wrapper(val);
	        setter(value);
	        write(value);
	      });
	    } : val => {
	      batch(() => {
	        value = wrapper(val);
	        write(value);
	      });
	    },
	    enumerable: descriptor.enumerable,
	    configurable: true
	  });
	}

	/**
	 * Signalify an undefined property
	 *
	 * @template T
	 * @param {T} target
	 * @param {PropertyKey} key
	 * @param {Function} [wrapper] To wrap values
	 * @param {any} [track] Tracker
	 * @param {any} [value] Default value
	 */
	function signalifyUndefinedKey(target, key, wrapper = identity, track, value = undefined) {
	  if (isKeyBlacklisted(key)) {
	    return;
	  }
	  if (isExtensible(target)) {
	    const [read, write] = trackerValueSignal(target, track, key);
	    redefineProperty(target, key, {
	      get() {
	        return read(value);
	      },
	      set(val) {
	        batch(() => {
	          value = wrapper(val);
	          write(value);
	        });
	      }
	    });
	  }
	}

	// https://github.com/mobxjs/mobx/issues/1590


	/**
	 * Merge `source` into `target` and removes from `target` keys not
	 * present in `source`
	 *
	 * ```js
	 * import { replace } from 'pota/store'
	 *
	 * const target = { a: true, q: [1, 2] }
	 * const source = { b: true, q: [3] }
	 *
	 * replace(target, source)
	 *
	 * // target === { b: true, q: [3] }
	 * ```
	 *
	 * ```js
	 * import { replace } from 'pota/store'
	 *
	 * // replacing using keys keeps the references
	 *
	 * const target = {
	 * 	a: true,
	 * 	q: [{ id: 0 }, { id: 1, name: 'Quack' }],
	 * }
	 *
	 * const source = {
	 * 	b: true,
	 * 	q: [{ id: 1, lastName: 'Murci' }],
	 * }
	 *
	 * const ref = target.q[1]
	 *
	 * // replace moving target.q[1] to target.q[0]
	 *
	 * replace(target, source, { q: { key: 'id' } })
	 *
	 * console.log(ref === target.q[0])
	 *
	 * // target === { "q": [{ "id": 1, "lastName": "Murci" }], "b": true }
	 * ```
	 *
	 * @template T
	 * @param {T} target
	 * @param {object} source
	 * @param {object} [keys] Keep references on objects with the same key
	 */
	const replace = (target, source, keys) => batch(() => untrack(() => reconcile(target, copy(source), keys, '')));
	function reconcile(target, source, keys, id, inArray) {
	  for (id in source) {
	    if (!(id in target)) {
	      target[id] = source[id];
	    } else {
	      const prev = target[id];
	      const next = source[id];
	      if (isObject(next)) {
	        if (morphedBetweenArrayAndObject(prev, next)) {
	          // Morphed from object/array to the opposite array/object.
	          target[id] = next;
	        } else if (isArray(next)) {
	          const _keys = getKeys();

	          // merge or add by key
	          {
	            reconcile(prev, next, _keys, id, true);
	          }
	        } else {
	          // simple object
	          reconcile(prev, next, inArray ? keys : getKeys(), id);
	        }
	      } else if (prev !== next) {
	        // simple primitive value
	        target[id] = next;
	      }
	    }
	  }

	  // remove

	  if (isArray(target)) {
	    target.length = source.length;
	  } else {
	    for (id in target) {
	      if (!(id in source)) {
	        delete target[id];
	      }
	    }
	  }
	}
	const getKeys = (keys, id) => undefined;

	/**
	 * Scrolls to an element
	 *
	 * @param {Element} item - Element to scroll to
	 */
	function scrollToElement(item) {
	  /** Scroll children of element to the top */
	  item.scrollTop = 0;

	  /** Scroll to element */
	  item.scrollIntoView(true);
	}

	/** Scrolls to `window.location.hash` */
	const scrollToLocationHash = () => scrollToSelector(location$2.hash);

	/**
	 * Scrolls to element that matches the hash
	 *
	 * @param {string} selector - Hash to scroll to
	 * @returns {boolean} True on success
	 */
	function scrollToSelector(selector) {
	  if (selector) {
	    try {
	      // selector could be invalid
	      const item = querySelector(document$1, selector);
	      if (item) {
	        scrollToElement(item);
	        return true;
	      }
	    } catch (e) {}
	  }
	  return false;
	}

	/**
	 * Scrolls to hash and in case isnt found it scrolls to the top
	 *
	 * @param {string} selector - Hash to scroll to
	 */
	function scrollToSelectorWithFallback(selector) {
	  if (!scrollToSelector(selector)) scrollToTop();
	}

	/** Scrolls to the top of the window */
	const scrollToTop = () => window.scrollTo({
	  top: 0,
	  behavior: 'auto'
	});

	const encodeURIComponent = window.encodeURIComponent;

	/**
	 * Safe guard. `decodeURIComponent` will fail with malformed strings:
	 * links are copied, pasted, manipulated by people, software etc
	 *
	 * @param {string} string - String to decode
	 * @returns {string} Returns decoded string or original string on
	 *   error
	 */
	function _decodeURIComponent(string) {
	  try {
	    return decodeURIComponent(string);
	  } catch (e) {
	    return string;
	  }
	}
	const nestedProtocol = /^[a-z]+:([a-z]+:)\/\//;
	const nestedProtocolOptional = /^[a-z]+:([a-z]+:)?\/\//;

	/**
	 * Returns `true` if the link comes with a protocol as `http://local/`
	 * or `blob:http://local/`
	 *
	 * @param {string} href - URL
	 * @returns {boolean}
	 */
	const hasProtocol = href => nestedProtocolOptional.test(href);

	/**
	 * Removes nested protocol as in `blob:` from `blob:http://local/`
	 *
	 * @param {string} href - URL
	 * @returns {string}
	 */
	const removeNestedProtocol = href => href.replace(nestedProtocol, '$1//');

	/**
	 * Returns `true` if the link is absolute: starts with `/` or has a
	 * protocol
	 *
	 * @param {string} href - URL
	 * @returns {boolean} Returns true if the link is absolute
	 */
	const isAbsolute = href => href[0] === '/' || hasProtocol(href);

	/**
	 * Returns `true` if the link is external. It does so by checking that
	 * `window.location.origin` is present at the beginning of the url
	 *
	 * @param {string} href - URL
	 * @returns {boolean} Returns true if the link is external
	 */
	const isExternal = href =>
	// origin could be http://example.net and link could be http://example.net.ha.com, so add "/"
	!(href + '/').startsWith(origin + '/');
	const paramsRegExp = /\:([a-z0-9_\-]+)/gi;

	/**
	 * Replace `params` in an `url` for the encoded equivalent
	 *
	 * @param {string} href - URL
	 * @param {object} [params] - Key-value pair to replace
	 * @returns {string} URL with the params replaced
	 */
	const replaceParams = (href, params) => params ? href.replace(paramsRegExp, (a, b) =>
	// only replace the ones defined on params
	params[b] !== undefined ? encodeURIComponent(params[b]) : a) : href;

	function timing(fn) {
	  const start = performance.now();
	  fn();
	  return performance.now() - start;
	}

	/**
	 * Creates a `setTimeout` that autodisposes. The `delay` could be
	 * reactive. The timeout is NOT started automatically.
	 *
	 * @template T
	 * @param {(...args: unknown[]) => void} callback - Callback to run
	 *   once delay completes
	 * @param {Accessor<number>} delay - Delay number or signal
	 * @param {unknown[]} args - Arguments to pass to the callback
	 * @returns {{ start: Function; stop: Function }}
	 */
	function useTimeout(callback, delay, ...args) {
	  let id;
	  const fn = {
	    start: () => {
	      withValue(delay, delay => {
	        fn.stop();
	        if (delay < Infinity) id = setTimeout(owned(callback), delay, ...args);
	      });
	      return fn;
	    },
	    stop: () => clearTimeout(id)
	  };
	  cleanup(fn.stop);
	  return fn;
	}

	/// <Reference path="./context.js.d.ts"/>


	/**
	 * @param {Partial<RouteContextValue>} props
	 * @returns {RouteContextValue}
	 */
	function create(props) {
	  /** @type SignalObject<RouteContextValue[]> */
	  const [children, _, updateChildren] = signal(/** @type {RouteContextValue[]} */[]);
	  return {
	    // the composed base route
	    base: undefined,
	    href: () => '',
	    // the url of the route
	    parent: undefined,
	    // parent context
	    show: () => undefined,
	    // if the route is shown
	    params: () => () => nothing,
	    // params of the route
	    scroll: undefined,
	    // elements to scroll
	    // the children routes
	    addChild(child) {
	      updateChildren(children => {
	        children.push(child);
	        return [...children];
	      });
	      cleanup(() => updateChildren(children => {
	        removeFromArray(children, child);
	        return [...children];
	      }));
	    },
	    shouldShowDefault: memo(() => {
	      const child = children();
	      return (
	        // when it has siblings, check if at least 1 rendered
	        // `every` instead of `some`, needs to read the signal for tracking
	        child.length && child.every(child => !child.show())
	      );
	    }),
	    resolve(href) {
	      // link is relative to the `<Route>`
	      const base = this.href() || location.href;
	      return isAbsolute(href) ? href :
	      // making link dos/ relative to http://localhost:11433/#uno/
	      // becomes http://localhost:11433/#uno/dos/
	      // this should be window.location.protocol
	      (location.protocol === 'blob:' ? 'blob:' : '') + (base.includes('#') ? base + href : new URL(href, base).href);
	    },
	    // override
	    ...props
	  };
	}
	const RouteContext = context(create(nothing));

	// window.location signal

	const [getLocation, setLocation] = signal(location$2.href);

	// only trigger on what changed
	const locationObject = memo(() => new URL(removeNestedProtocol(getLocation())));
	const href = memo(() => locationObject().href);
	const pathname = memo(() => locationObject().pathname);
	// http://location/# reports hash to be empty
	// http://location/ reports hash to be empty
	const hash = memo(() => locationObject().hash || '#');
	const path = memo(() => pathname() + hash());
	const search = memo(() => locationObject().search);
	const searchParams = mutable({});
	const searchParamsMemo = memo(() => {
	  const entries = fromEntries(locationObject().searchParams.entries());
	  replace(searchParams, entries);
	  return entries;
	});
	searchParamsMemo();
	const params = mutable({});
	const paramsMemo = memo(() => {
	  const values = empty();
	  RouteContext.walk(context => {
	    for (const [key, value] of entries(context.params()())) {
	      values[key] = value !== undefined ? _decodeURIComponent(/** @type {string} */value) : value;
	    }
	  });
	  replace(params, values);
	  return values;
	});
	paramsMemo();
	const location$1 = freeze({
	  protocol: locationObject().protocol,
	  origin: locationObject().origin,
	  //
	  href,
	  pathname,
	  path,
	  hash,
	  search,
	  searchParams,
	  // searchParamsMemo,
	  params
	  // paramsMemo,
	});
	let BeforeLeave = [];

	/**
	 * Returns a boolean telling if navigation is allowed
	 *
	 * @param {string} href
	 * @returns {Promise<boolean>}
	 */
	async function canNavigate(href) {
	  const newBeforeLeave = [];
	  for (const beforeLeave of BeforeLeave) {
	    if (href.indexOf(beforeLeave.href) !== 0) {
	      if (!(await beforeLeave.cb().catch(() => false))) {
	        return false;
	      }
	    } else {
	      newBeforeLeave.push(beforeLeave);
	    }
	  }
	  BeforeLeave = newBeforeLeave;
	  return true;
	}

	/**
	 * Navigates to a new location
	 *
	 * @param {string} href
	 * @param {{
	 * 	scroll?: boolean
	 * 	replace?: boolean
	 * }} options
	 * @url https://pota.quack.uy/Components/Route/Navigate
	 */
	async function navigate(href, options = nothing) {
	  if (location$2.href !== href) {
	    if (await canNavigate(href)) {
	      const fn = () => navigateInternal(href, options);
	      const transition = document$1.startViewTransition && document$1.startViewTransition.bind(document$1);
	      // navigate with transition if available
	      transition && location$2.href.replace(/#.*/, '') !== href.replace(/#.*/, '') ? transition(fn) : fn();
	    }
	  }
	}

	/**
	 * Internal navigation function that updates history and location
	 *
	 * @param {string} href - The URL to navigate to
	 * @param {{ replace?: boolean; scroll?: boolean }} options -
	 *   Navigation options
	 */
	function navigateInternal(href, options) {
	  options.replace ? history.replaceState(null, '', href) : history.pushState(null, '', href);
	  setLocation(location$2.href);
	  if (optional(options.scroll)) {
	    scrollToSelectorWithFallback(location$2.hash);
	  }
	}

	/**
	 * Navigates to a new location programmatically
	 *
	 * @param {string} href
	 * @param {{
	 * 	params?: object
	 * 	scroll?: boolean
	 * 	replace?: boolean
	 * 	delay?: number
	 * }} options
	 * @url https://pota.quack.uy/Components/Route/Navigate
	 */
	function navigateUser(href, options = nothing) {
	  addListeners();
	  href = replaceParams(href, options.params);

	  /**
	   * When the user provides the url, it may pass a relative path, this
	   * makes it absolute
	   */
	  href = isAbsolute(href) ? href : new URL(href, location$2.href).href;
	  const nav = () => navigate(href, options);
	  options.delay ? useTimeout(nav, options.delay).start() : nav();
	}

	// listeners

	let addListenersAdded = false;

	/**
	 * Adds event listeners for client-side navigation. Only adds
	 * listeners once to prevent duplicate handlers
	 */
	function addListeners() {
	  if (!addListenersAdded) {
	    addListenersAdded = true;
	    document$1.addEventListener('click', onLinkClick);
	    addEventListener('hashchange', onLocationChange);
	    addEventListener('popstate', onLocationChange);
	  }
	}

	/**
	 * Handles browser history changes (back/forward buttons) Fixes Chrome
	 * title bug and ensures navigation is allowed
	 *
	 * @returns {Promise<void>}
	 */
	async function onLocationChange() {
	  // chrome has a bug on which if you use the back/forward button
	  // it will change the title of the tab to whatever it was before
	  // if the navigation is prevented (therefore the title/page wont change)
	  // it will still use the old title even if the title tag didn't change at all
	  const title = document$1.title;
	  document$1.title = title + ' ';
	  document$1.title = title;
	  if (await canNavigate(location$2.href)) {
	    setLocation(location$2.href);
	  } else {
	    history.pushState(null, '', location$1.href());
	  }
	}

	/**
	 * Handles click events on anchor elements to enable client-side
	 * navigation
	 *
	 * @param {MouseEvent} e - The click event
	 */
	function onLinkClick(e) {
	  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

	  // find link
	  const node = e.composedPath().find(item => item instanceof HTMLAnchorElement);

	  // validate
	  if (!node || !node.href || node.download || node.target || isExternal(node.href) || node.rel.includes('external')) {
	    return;
	  }
	  preventDefault(e);
	  navigate(node.href, {
	    replace: node.hasAttribute('replace')
	  });
	}

	/**
	 * Renders its children based on a condition
	 *
	 * @template T
	 * @param {object} props
	 * @param {When<any>} props.when
	 * @param {Children} [props.fallback]
	 * @param {Children} [props.children]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Show
	 */
	function Show(props) {
	  // callback
	  const callback = makeCallback(props.children);

	  // shortcircuit non-functions
	  if (!isFunction(props.when)) {
	    return props.when ? callback(() => props.when) : props.fallback;
	  }
	  // signals/functions
	  const value = memo(() => getValue(props.when));
	  const condition = memo(() => !!value());
	  return memo(() => condition() ? callback(value) : props.fallback);
	}

	/**
	 * Scroll to hash first, if doesnt, scroll to positions defined by the
	 * Routes.
	 * @param {RouteContextValue} context
	 */
	function scroll(context) {
	  if (!scrollToLocationHash() && !RouteContext.walk(context => {
	    if (context.scroll) {
	      for (const item of isArray(context.scroll) ? context.scroll : [context.scroll]) {
	        if (scrollToSelector(item)) {
	          return true;
	        }
	      }
	    }
	  }, context)) {
	    scrollToTop();
	  }
	}

	/**
	 * @typedef {Object} RouteProps
	 * @property {string} path - Path to match relative to the parent
	 *   Route. When `path` is missing, it will render only when the
	 *   parent's route path is matched exactly.
	 * @property {string[] | string} scroll - Elements to scroll when the
	 *   route matches.
	 * @property {Record<string, string>} params - Key-value pairs params
	 *   to encode and replace on the path.
	 * @property {When<any>} collapse - To hide the route instead of
	 *   removing it from the document.
	 * @property {When<any>} when - To stop rendering the route even if
	 *   the path matches.
	 * @property {Children} fallback - Fallback children.
	 * @property {Children} children - Children to render.
	 */

	/**
	 * Renders children if the path matches the current location
	 *
	 * @param {Partial<RouteProps>} props
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Route/Route
	 */
	function Route(props) {
	  addListeners();
	  const parent = RouteContext();
	  const path = props.path;

	  // this concatenates our route to the parent route
	  const base =
	  // base +
	  (parent.base === undefined ? location$1.protocol === 'file:' ? location$1.pathname() // when is `file:` protocol, it defaults to `pathname`
	  : '' : parent.base) +
	  // path +
	  replaceParams(
	  /**
	   * 1. When `<Route>` lacks a `path` prop, is treated as the final
	   *    route
	   * 2. Ends with nothing or has a hash followed of stuff
	   * 3. Allow hash so people can scroll to stuff
	   */
	  path === undefined ? '(|#.*)$' : path.replace(/\$$/, '(|#.*)$'), props.params);
	  const route = new RegExp('^' + base.replace(paramsRegExp, '(?<$1>[^/#]+)'));
	  let href = '';
	  const [params, setParams] = signal(() => nothing);
	  const show = memo(() => {
	    const path = location$1.path();

	    // console.log(path, route)

	    if (route.test(path)) {
	      setParams(() => route.exec(path)?.groups || nothing);
	      if (href === '') {
	        href = location$1.origin + path.replace(path.replace(route, ''), '');
	      }
	      onDone(() => scroll(context));
	      return true;
	    }
	  });
	  const context = create({
	    base,
	    href: () => href,
	    params,
	    scroll: props.scroll,
	    parent,
	    show
	  });
	  parent.addChild(context);
	  return Component(RouteContext.Provider, {
	    value: context,
	    children: Component(Dynamic, {
	      component: props.collapse ? Collapse : Show,
	      when: () => show() && optional(props.when),
	      fallback: props.fallback,
	      children: props.children
	    })
	  });
	}

	/**
	 * Renders children when no sibling `Route` matches
	 *
	 * @param {object} props
	 * @param {Children} [props.children]
	 * @returns {Children}
	 */
	Route.Default = props => {
	  return Component(Show, {
	    when: RouteContext().shouldShowDefault,
	    children: props.children
	  });
	};

	/**
	 * Navigates to a new location from JSX
	 *
	 * @param {{
	 * 	path: string
	 * 	scroll?: boolean
	 * 	replace?: boolean
	 * 	params?: object
	 * 	delay?: number
	 * 	children?: Children
	 * }} props
	 * @url https://pota.quack.uy/Components/Route/Navigate
	 */
	function Navigate(props) {
	  addListeners();
	  navigateUser(props.path, props);
	  return props.children;
	}

	/**
	 * Creates a link with Route features
	 *
	 * @param {{
	 * 	href: string
	 * 	params?: Record<string, string>
	 * 	replace?: boolean
	 * } & Elements['a']} props
	 *
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Route/A
	 */

	function A(props) {
	  addListeners();
	  const href = RouteContext().resolve(replaceParams(props.href, props.params));
	  return Component('a', {
	    ...props,
	    href,
	    params: undefined
	  });
	}

	/**
	 * Renders the first child that matches the given `when` condition, or
	 * a fallback in case of no match
	 *
	 * @param {object} props
	 * @param {Children} [props.children]
	 * @param {Children} [props.fallback]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Switch
	 */
	function Switch(props) {
	  const matches = resolve(() => isArray(props.children) ? props.children : [props.children]);
	  const fallback = isNullUndefined(props.fallback) ? memo(() => {
	    const r = matches().find(match => !('when' in match));
	    return r && r.children;
	  }) : memo(() => resolve(props.fallback));
	  const match = memo(() => matches().find(match => !!getValue(match.when)));
	  const value = memo(() => match() && getValue(match().when));
	  const callback = memo(() => match() && makeCallback(match().children));
	  return memo(() => match() ? callback()(value) : fallback);
	}

	/**
	 * Renders the content if the `when` condition is true
	 *
	 * @template T
	 * @param {object} props
	 * @param {When<any>} props.when
	 * @param {Children} [props.children]
	 * @returns {Children}
	 */
	const Match = identity;

	/** @type {Record<string, Component>} */
	const defaultRegistry = {
	  A,
	  Collapse,
	  Dynamic,
	  For,
	  Head,
	  Match,
	  Navigate,
	  Portal,
	  Range,
	  Route,
	  Show,
	  Switch
	};

	// parseXML

	const id = 'rosa19611227';
	const splitId = /(rosa19611227)/;

	/**
	 * Makes Nodes from TemplateStringsArray
	 *
	 * @param {TemplateStringsArray} content
	 * @returns {Element[]}
	 */
	const parseXML = withWeakCache(content => {
	  const html = new DOMParser().parseFromString(`<xml ${namespaces.xmlns}>${content.join(id)}</xml>`, 'text/xml').firstChild.childNodes;
	  if (html[0].tagName === 'parsererror') {
	    const err = html[0];
	    err.style.padding = '1em';
	    err.firstChild.textContent = 'HTML Syntax Error:';
	    err.firstChild.nextSibling.style.cssText = '';
	    err.lastChild.replaceWith(createTextNode(content));
	  }
	  return html;
	});

	/**
	 * Recursively walks a template and transforms it to `h` calls
	 *
	 * @param {typeof xml} xml
	 * @param {Element[]} cached
	 * @param {...unknown} values
	 * @returns {Children}
	 */
	function toH(xml, cached, values) {
	  let index = 0;
	  /**
	   * Recursively transforms DOM nodes into Component calls
	   *
	   * @param {ChildNode} node - The DOM node to transform
	   * @param {ChildNode} node
	   * @returns {Children} Transformed node(s) as Components
	   */
	  function nodes(node) {
	    const {
	      nodeType
	    } = node;
	    if (nodeType === 1) {
	      // element
	      const {
	        tagName,
	        attributes,
	        childNodes
	      } = /** @type {Element} */node;

	      // gather props
	      /** @type {Record<string, Accessor<unknown>>} */
	      const props = empty();
	      for (let {
	        name,
	        value
	      } of attributes) {
	        if (value === id) {
	          value = values[index++];
	        } else if (value.includes(id)) {
	          const val = value.split(splitId).map(x => x === id ? values[index++] : x);
	          value = () => val.map(getValue).join('');
	        }
	        props[name] = value;
	      }

	      // gather children
	      if (childNodes.length) {
	        props.children = unwrapArray(toArray(childNodes).map(nodes));
	      }
	      /[A-Z]/.test(tagName) && !xml.components[tagName] && warn(`xml: Forgot to ´xml.define({ ${tagName} })´?`);
	      return Component(xml.components[tagName] || tagName, props);
	    } else if (nodeType === 3) {
	      // text
	      const value = node.nodeValue;
	      return value.includes(id) ? value.split(splitId).map(x => x === id ? values[index++] : x) : value;
	    } else if (nodeType === 8) {
	      // comment
	      const value = node.nodeValue;
	      if (value.includes(id)) {
	        const val = value.split(splitId).map(x => x === id ? values[index++] : x);
	        return () => createComment(val.map(getValue).join(''));
	      } else {
	        return createComment(value);
	      }
	    } else {
	      error(`xml: ´nodeType´ not supported ´${nodeType}´`);
	    }
	  }
	  return unwrapArray(toArray(cached).map(nodes));
	}

	/**
	 * Function to create cached tagged template components
	 *
	 * @url https://pota.quack.uy/XML
	 */
	function XML() {
	  /**
	   * Creates tagged template components
	   *
	   * @param {TemplateStringsArray} template
	   * @param {...unknown} values
	   * @url https://pota.quack.uy/XML
	   */
	  function xml(template, ...values) {
	    return toH(xml, parseXML(template), values);
	  }
	  xml.components = {
	    ...defaultRegistry
	  };
	  /** @param {Record<string, Component>} userComponents */
	  xml.define = userComponents => {
	    for (const name in userComponents) {
	      xml.components[name] = userComponents[name];
	    }
	  };
	  return xml;
	}
	const xml = XML();

	/**
	 * Returns a `isSelected` function that will return `true` when the
	 * argument for it matches the original signal `value`.
	 *
	 * @param {SignalAccessor<any>} value - Signal with the current value
	 */
	function useSelector(value) {
	  const map = new Map();
	  let prev = [];
	  syncEffect(() => {
	    const val = value();
	    const selected = isIterable(val) ? toArray(val.values()) : val === undefined ? [] : [val];

	    // unselect
	    for (const value of prev) {
	      if (!selected.includes(value)) {
	        const current = map.get(value);
	        current && current.write(false);
	      }
	    }

	    // select
	    for (const value of selected) {
	      if (!prev.includes(value)) {
	        const current = map.get(value);
	        current && current.write(true);
	      }
	    }
	    prev = selected;
	  });

	  /**
	   * Is selected function, it will return `true` when the value
	   * matches the current signal.
	   *
	   * @template T
	   * @param {T} item - Values to compare with current
	   * @returns {SignalAccessor<T>} A signal with a boolean value
	   */
	  return function isSelected(item) {
	    let selected = map.get(item);
	    if (!selected) {
	      selected = signal(prev.includes(item));
	      selected.counter = 1;
	      map.set(item, selected);
	    } else {
	      selected.counter++;
	    }
	    cleanup(() => {
	      if (--selected.counter === 0) {
	        map.delete(item);
	      }
	    });
	    return selected.read;
	  };
	}

	let idCounter = 1;
	const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'],
	  colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'],
	  nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
	function _random(max) {
	  return Math.round(Math.random() * 1000) % max;
	}
	function buildData(count) {
	  let data = new Array(count);
	  for (let i = 0; i < count; i++) {
	    const [label, setLabel] = signal(`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`);
	    data[i] = {
	      id: idCounter++,
	      label,
	      setLabel
	    };
	  }
	  return data;
	}
	const bbutton = ({
	  id,
	  text,
	  fn
	}) => xml`<div class="col-sm-6 smallpad">
    <button
      id="${id}"
      class="btn btn-primary btn-block"
      type="button"
      on:click="${fn}"
    >
      ${text}
    </button>
  </div>`;
	const App = () => {
	  const [data, setData, updateData] = signal([]);
	  const [selected, setSelected] = signal([]);
	  const run = () => setData(buildData(1000));
	  const runLots = () => {
	    setData(buildData(10000));
	  };
	  const bench = () => {
	    //  console.clear()
	    // warm
	    for (let k = 0; k < 5; k++) {
	      setData(buildData(10000));
	      setData([]);
	    }
	    let createLarge = 0;
	    let clearLarge = 0;
	    let createSmall = 0;
	    let clearSmall = 0;
	    for (let k = 0; k < 10; k++) {
	      createLarge += timing(() => setData(buildData(10000)));
	      clearLarge += timing(() => setData([]));
	      console.log(k + ' createLarge', createLarge / (k + 1), k + ' clearLarge', clearLarge / (k + 1));
	    }
	    console.log('------------');
	    for (let k = 0; k < 10; k++) {
	      createSmall += timing(() => setData(buildData(1000)));
	      clearSmall += timing(() => setData([]));
	      console.log(k + ' createSmall', createSmall / (k + 1), k + ' clearSmall', clearSmall / (k + 1));
	    }
	  };
	  const add = () => updateData(d => [...d, ...buildData(1000)]);
	  const update = () => batch(() => {
	    for (let i = 0, d = data(), len = d.length; i < len; i += 10) d[i].setLabel(l => l + ' !!!');
	  });
	  const swapRows = () => {
	    const d = data().slice();
	    if (d.length > 998) {
	      let tmp = d[1];
	      d[1] = d[998];
	      d[998] = tmp;
	      setData(d);
	    }
	  };
	  const clear = () => setData([]);
	  const remove = id => updateData(d => {
	    const idx = d.findIndex(datum => datum.id === id);
	    d.splice(idx, 1);
	    return [...d];
	  });
	  const isSelected = useSelector(selected);
	  xml.define({
	    bbutton
	  });
	  return xml`<div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>pota Keyed</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <bbutton
              id="run"
              text="Create 1,000 rows"
              fn="${run}"
            />
            <bbutton
              id="runlots"
              text="Create 10,000 rows"
              fn="${runLots}"
            />
            <bbutton
              id="add"
              text="Append 1,000 rows"
              fn="${add}"
            />
            <bbutton
              id="update"
              text="Update every 10th row"
              fn="${update}"
            />
            <bbutton
              id="clear"
              text="Clear"
              fn="${clear}"
            />
            <bbutton
              id="swaprows"
              text="Swap Rows"
              fn="${swapRows}"
            />
            <bbutton
              id="bench"
              text="bench"
              fn="${bench}"
            />
          </div>
        </div>
      </div>
    </div>
    <table
      class="table table-hover table-striped test-data"
      on:click="${e => {
    const element = e.target;
    if (element.setSelected !== undefined) {
      setSelected(element.setSelected);
    } else if (element.removeRow !== undefined) {
      remove(element.removeRow);
    }
  }}"
    >
      <tbody>
        <For each="${data}">
          ${row => {
    const {
      id,
      label
    } = row;
    return xml`<tr class:danger="${isSelected(id)}">
              <td class="col-md-1">${id}</td>
              <td class="col-md-4">
                <a prop:setSelected="${id}">${label}</a>
              </td>
              <td class="col-md-1">
                <a>
                  <span
                    class="glyphicon glyphicon-remove"
                    aria-hidden="true"
                    prop:removeRow="${id}"
                  />
                </a>
              </td>
              <td class="col-md-6" />
            </tr>`;
  }}
        </For>
      </tbody>
    </table>
    <span
      class="preloadicon glyphicon glyphicon-remove"
      aria-hidden="true"
    />
  </div>`;
	};
	render(App, document.getElementById('main'));

})();
//# sourceMappingURL=main.js.map
