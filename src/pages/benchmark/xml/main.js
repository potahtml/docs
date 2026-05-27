(function () {
	'use strict';

	const version = '0.20.233';

	// `globalThis` alone is typed as `typeof globalThis` — but in the
	// DOM lib the real `window` is `Window & typeof globalThis`. Cast
	// so consumers (e.g. `addEvent`'s `typeof window` template
	// parameter) accept it without each call needing its own cast.
	const window$1 = /** @type {Window & typeof globalThis} */
	globalThis;
	const queueMicrotask = window$1.queueMicrotask;
	const history = window$1.history;
	const location$2 = window$1.location;
	const origin = location$2?.origin;
	const Object$1 = window$1.Object;
	const Array$1 = window$1.Array;
	const Promise$1 = window$1.Promise;
	const Symbol$1 = window$1.Symbol;
	const assign = Object$1.assign;
	const create$1 = Object$1.create;
	const defineProperty = Object$1.defineProperty;
	const entries = Object$1.entries;
	const freeze = Object$1.freeze;
	const fromEntries = Object$1.fromEntries;
	const getOwnPropertyDescriptors = Object$1.getOwnPropertyDescriptors;
	const getOwnPropertyNames = Object$1.getOwnPropertyNames;
	const getOwnPropertySymbols = Object$1.getOwnPropertySymbols;
	const getPrototypeOf = Object$1.getPrototypeOf;
	const is = Object$1.is;
	const isExtensible = Object$1.isExtensible;
	const keys = Object$1.keys;
	const toArray = Array$1.from;

	/**
	 * @param {unknown} value
	 * @returns {Iterable<unknown>}
	 */
	const toValues = value => isArray(value) ? value : isObject(value) && 'values' in (/** @type {object} */value) ? /** @type {{ values(): IterableIterator<unknown> }} */value.values() : toArray(/** @type {Iterable<unknown>} */value);

	/**
	 * @param {unknown} value
	 * @returns {Iterable<[unknown, unknown]>}
	 */
	const toEntries = value => isObject(value) && 'entries' in (/** @type {object} */value) ? /** @type {{ entries(): IterableIterator<[unknown, unknown]> }} */value.entries() : toArray(/** @type {Iterable<[unknown, unknown]>} */value);
	const iterator = Symbol$1.iterator;
	const stringify = JSON.stringify;

	/** @param {(resolve: (value: unknown) => void, reject: (reason?: any) => void) => void} fn */
	const promise = fn => new Promise$1(fn);

	/**
	 * Given a promise it adds `onDone` to `then` and `catch` that gets
	 * ignored.
	 *
	 * ```js
	 * resolved(promise, onDone)
	 * // is same as
	 * promise.then(onDone).catch(onDone)
	 * ```
	 */
	const resolvedIgnoreError = (promise, onDone) => promise.then(onDone).catch(e => onDone(e.toString()));

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
	const redefineProperty = (target, key, descriptor) => defineProperty(target, key, assign(create$1(redefinePropertyDefaults), descriptor));
	const redefinePropertyDefaults = {
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
	 * @param {T | T[]} arr
	 * @returns {T[]}
	 */
	const flatToArray = arr => (/** @type {T[]} */isArray(arr) ? arr.flat(Infinity) : [arr]);

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
	 * @template {((...args: any[]) => void) & Function} T
	 * @param {T} fn - Function to which add state to it
	 * @param {() => DataStore<Map<unknown, unknown>>} [state]
	 * @returns {(
	 * 	...args: Parameters<T> extends [any, ...infer P] ? P : never
	 * ) => ReturnType<T>}
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
	 * Returns `true` when `typeof` of `value` is `function`
	 *
	 * @template T
	 * @param {T} value
	 * @returns {value is ((...args:unknown[])=>T)}
	 */
	const isFunction = value => typeof value === 'function';

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
	 * Returns `true` when `typeof` of `value` is `symbol`
	 *
	 * @param {unknown} value
	 * @returns {value is symbol}
	 */
	const isSymbol = value => typeof value === 'symbol';

	/**
	 * Returns `true` when `value` may be a promise (any thenable)
	 *
	 * @template T
	 * @param {T} value
	 * @returns {value is Extract<T, PromiseLike<unknown>>}
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
	  defineProperty: reflectDefineProperty,
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
	  *[Symbol$1.iterator]() {
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

	const $isComponent = Symbol$1();
	const $isMap = Symbol$1();
	const $isClass = Symbol$1();
	const $isDerived = Symbol$1();
	const $isMutable = Symbol$1();

	// supported namespaces

	const prefix = 'http://www.w3.org/';

	// when a tag/attribute is missing the namespace this puts it back in

	/** @type {Record<string, string>} */
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
	 * @url https://www.solidjs.com/
	 * @url https://github.com/solidjs/solid
	 * @url https://github.com/solidjs/signals
	 */

	function createReactiveSystem() {

	  // Shared empty-array sentinel for `owned` / `cleanups` slots.
	  // Never mutated; addOwned/addCleanups replace it with a fresh
	  // array on first write. Stable JSArray slot type lets V8 skip
	  // the undefined/single/array polymorphism on the hot Root
	  // lifecycle methods.
	  const EMPTY = [];

	  /** @type {undefined | Computation} */
	  let Owner;

	  /** @type {undefined | Computation} */
	  let Listener;

	  /** @type {undefined | Memo[]} */
	  let Updates;

	  /** @type {undefined | any[]} */
	  let Effects;
	  let Time = 0;
	  const errorHandlerId = Symbol$1();
	  function routeError(node, err) {
	    const handler = node?.context?.[errorHandlerId];
	    if (handler) handler(err);else console.error(err);
	  }
	  function doRead(o) {
	    if (Listener) {
	      const observers = o.observers;
	      const sourceSlot = observers.length;
	      if (Listener.sources !== EMPTY) {
	        Listener.sources.push(o);
	        Listener.sourceSlots.push(sourceSlot);
	      } else {
	        Listener.sources = [o];
	        Listener.sourceSlots = [sourceSlot];
	      }
	      const observerSlot = Listener.sources.length - 1;
	      if (observers === EMPTY) {
	        o.observers = [Listener];
	        o.observerSlots = [observerSlot];
	      } else {
	        observers.push(Listener);
	        o.observerSlots.push(observerSlot);
	      }
	    }
	  }
	  let _writeTarget;
	  function _markObservers() {
	    for (const observer of _writeTarget) {
	      if (observer.state === 0 /* CLEAN */) {
	        observer.queue();
	        observer.observers && downstream(observer);
	      }
	      observer.state = 1; /* STALE */
	    }
	  }
	  function doWrite(o) {
	    if (o.observers.length) {
	      _writeTarget = o.observers;
	      runUpdates(_markObservers);
	    }
	  }

	  // ROOT

	  class Root {
	    /** @type {undefined | Root} */
	    owner;

	    /** @type {Computation[]} */
	    owned = EMPTY;

	    /** @type {Function[]} */
	    cleanups = EMPTY;

	    /** @type {Record<symbol, unknown>} */
	    context;

	    /**
	     * @param {Computation} owner
	     * @param {EffectOptions} [options]
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
	    /** @param {() => void} fn */
	    addCleanups(fn) {
	      if (this.cleanups === EMPTY) this.cleanups = [fn];else this.cleanups.push(fn);
	    }
	    /** @param {() => void} fn */
	    cleanupCancel(fn) {
	      if (this.cleanups !== EMPTY) removeFromArray(this.cleanups, fn);
	    }
	    /** @param {Computation} value */
	    addOwned(value) {
	      if (this.owned === EMPTY) this.owned = [value];else this.owned.push(value);
	    }
	    dispose() {
	      this.disposeOwned();
	      this.doCleanups();
	    }
	    disposeOwned() {
	      const owned = this.owned;
	      if (owned.length) {
	        for (let i = owned.length - 1; i >= 0; i--) {
	          owned[i].dispose();
	        }
	        owned.length = 0;
	      }
	    }
	    doCleanups() {
	      const cleanups = this.cleanups;
	      if (cleanups.length) {
	        for (let i = cleanups.length - 1; i >= 0; i--) {
	          try {
	            cleanups[i]();
	          } catch (err) {
	            routeError(this, err);
	          }
	        }
	        cleanups.length = 0;
	      }
	    }
	  }

	  // COMPUTATION

	  class Computation extends Root {
	    state = 1; /* STALE */

	    updatedAt = 0;

	    /** @type {Function | undefined} */
	    fn;

	    // Initialized to the shared `EMPTY` sentinel so V8 sees a
	    // stable JSArray slot type from the first read. Without it,
	    // each fresh Computation transitions `sources` / `sourceSlots`
	    // from undefined to array on its first tracked read, which
	    // matches the pattern documented for `observers` /
	    // `observerSlots` on `Memo` / `Signal`.
	    /** @type {any[]} */
	    sources = EMPTY;

	    /** @type {number[]} */
	    sourceSlots = EMPTY;

	    /**
	     * @param {Computation} owner
	     * @param {Function} fn
	     * @param {EffectOptions} [options]
	     */
	    constructor(owner, fn, options) {
	      super(owner, options);
	      this.fn = fn;
	      owner && owner.addOwned(this);
	    }
	    update() {
	      this.dispose();
	      const time = Time;
	      try {
	        runWith(this.fn, this, this);
	      } catch (err) {
	        this.state = 1; /* STALE */
	        this.disposeOwned();
	        this.updatedAt = time + 1;
	        routeError(this, err);
	      }
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
	     * @param {EffectOptions} [options]
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
	     * @param {EffectOptions} [options]
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

	    /** @type {Computation[]} */
	    observers = EMPTY;

	    /** @type {number[]} */
	    observerSlots = EMPTY;

	    /**
	     * @param {Computation} owner
	     * @param {Function} fn
	     * @param {SignalOptions<T>} [options] - Accepts `equals`
	     */
	    constructor(owner, fn, options) {
	      // Memo extends Computation (EffectOptions) but accepts
	      // SignalOptions<T>. Pass undefined to super — Memo
	      // applies the signal-specific options itself below.
	      super(owner, fn, undefined);
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
	      doRead(this);
	      return this.value;
	    };
	    write(value) {
	      if (!this.equals(this.value, value)) {
	        this.value = value;
	        doWrite(this);
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
	      try {
	        const nextValue = runWith(this.fn, this, this);
	        if (this.updatedAt <= time) {
	          this.write(nextValue);
	          this.updatedAt = time;
	        }
	      } catch (err) {
	        this.state = 1; /* STALE */
	        this.disposeOwned();
	        this.updatedAt = time + 1;
	        routeError(this, err);
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
	    [$isDerived] = true;

	    /**
	     * Monotonic write token. Bumped on every direct write or fresh
	     * `update()`; recursive resolve steps capture and compare the
	     * current value to detect stale promise resolutions. Was a fresh
	     * `{}` per write — counter avoids the per-update allocation while
	     * preserving identity-via-`===` semantics for the staleness
	     * check.
	     *
	     * @type {number}
	     */
	    lastWrite = 0;

	    /**
	     * @param {Computation} owner
	     * @param {unknown[]} fn
	     */
	    constructor(owner, fn) {
	      // @ts-expect-error
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
	    _runFn = () => {
	      // @ts-expect-error
	      this.write(this.fn[0](), this.fn.slice(1));
	    };
	    update() {
	      this.dispose();
	      const time = Time;
	      try {
	        this.lastWrite++;
	        runWith(this._runFn, this, this);
	      } catch (err) {
	        this.state = 1; /* STALE */
	        this.disposeOwned();
	        this.updatedAt = time + 1;
	        routeError(this, err);
	      }
	    }
	    write(nextValue, fns) {
	      this.isResolved = undefined;
	      const mine = fns === undefined ? ++this.lastWrite : this.lastWrite;
	      withValue(nextValue, nextValue => {
	        if (Listener || this.lastWrite === mine) {
	          if (fns && fns.length) {
	            this.write(() => fns[0](nextValue), fns.slice(1));
	          } else {
	            this.isResolved = null;
	            this.writeNextValue(nextValue);
	            this.updatedAt = Time;
	            // Mark CLEAN so a subsequent read does
	            // not re-run the original fn and clobber
	            // the user-written value. The update()
	            // path already set CLEAN via dispose(),
	            // so this is a no-op there.
	            this.state = 0; /* CLEAN */

	            this._fireThens();
	          }
	        }
	      }, () => {
	        // remove the old value while the promise is resolving
	        // to avoid the "Florida - New York City" problem
	        this.writeNextValue(nothing);
	      });
	    }
	    writeNextValue(value) {
	      if (!this.equals(this.value, value)) {
	        this.value = value;
	        doWrite(this);
	      }
	    }

	    /**
	     * Thenable surface. Stays defined across commits so consumers can
	     * register more than once: each call to `then` either fires
	     * synchronously (if already resolved) or queues onto
	     * `thenCallbacks`, drained by `_fireThens` on commit. Has to be
	     * an instance arrow so `assign(self(), this)` carries it onto the
	     * callable wrapper.
	     *
	     * We resolve with `_unwrap()` rather than `self()`: `self()`
	     * carries `then` onto every fresh wrapper, which makes the
	     * resolved value itself thenable — JS's `await` would recursively
	     * `then` it forever. `_unwrap()` returns the same callable shape
	     * but with `then` stripped, terminating the recursion.
	     */
	    then = (resolve, reject) => {
	      // `resolved()` reads through `this.read()` which triggers
	      // `update()` on a STALE derived. Without it, awaiting a
	      // freshly-constructed derived would queue forever because
	      // the source fn never runs.
	      if (this.resolved()) {
	        resolve(this._unwrap());
	        return;
	      }
	      if (!this.thenCallbacks) this.thenCallbacks = [];
	      this.thenCallbacks.push(resolve);
	    };
	    _fireThens() {
	      if (this.thenCallbacks) {
	        const cbs = this.thenCallbacks;
	        this.thenCallbacks = undefined;
	        const wrap = this._unwrap();
	        cbs.forEach(cb => cb(wrap));
	      }
	    }
	    _unwrap() {
	      // Bare read/write callable — no `assign(this)`, so no
	      // `then` is carried onto it. JS's await thenability
	      // check terminates here.
	      return (...args) => args.length ? this.write(args[0]) : this.read();
	    }
	  }

	  // API

	  /**
	   * Creates a new root
	   *
	   * @template T
	   * @param {(dispose: () => void) => T} fn
	   * @param {EffectOptions} [options]
	   * @returns {T}
	   */
	  function root(fn, options) {
	    const root = new Root(Owner, options);
	    return runWithOwner(root, () => fn(() => root.dispose()));
	  }

	  // SIGNAL

	  /**
	   * Plain leaf observable shared with Memo/Derived for the
	   * `o.observers` access in doRead/doWrite. observers / observerSlots
	   * start as the EMPTY sentinel so the slot type is always JSArray —
	   * eliminates the undefined→array transition that was making doRead
	   * megamorphic across signal-literal vs Memo vs Derived shapes.
	   */
	  class Signal {
	    /** @type {any} */
	    value;

	    /** @type {Computation[]} */
	    observers = EMPTY;

	    /** @type {number[]} */
	    observerSlots = EMPTY;

	    /**
	     * @param {any} value
	     * @param {SignalOptions<any>} [options]
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
	    read = () => {
	      if (Listener) doRead(this);
	      return this.value;
	    };
	    write = val => {
	      if (!this.equals(this.value, val)) {
	        this.value = val;
	        doWrite(this);
	        return true;
	      }
	      return false;
	    };
	    update = val => this.write(untrack(() => val(this.value)));

	    /** @param {any} a @param {any} b */
	    equals(a, b) {
	      return a === b;
	    }

	    /** @param {any} a @param {any} b */
	    equalsFalse(a, b) {
	      return false;
	    }
	  }

	  /**
	   * Creates a signal
	   *
	   * @template T
	   * @param {T} [value] - Initial value of the signal
	   * @param {SignalOptions<T>} [options] - Signal options
	   * @returns {SignalObject<T>}
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  function signal(value, options) {
	    return new Signal(value, options);
	  }

	  /**
	   * Creates an effect
	   *
	   * @template T
	   * @param {() => T} fn
	   * @param {EffectOptions} [options]
	   * @returns {void}
	   */
	  function effect(fn, options) {
	    new Effect(Owner, fn, options);
	  }

	  /**
	   * Creates an run once effect
	   *
	   * @template T
	   * @param {() => T} fn
	   * @param {EffectOptions} [options]
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
	   * @param {EffectOptions} [options]
	   * @returns {void}
	   */
	  function syncEffect(fn, options) {
	    new SyncEffect(Owner, fn, options);
	  }

	  /**
	   * Creates an effect with explicit dependencies
	   *
	   * @template T
	   * @param {() => any} depend - Function that causes tracking
	   * @param {() => T} fn - Function that wont cause tracking
	   * @param {EffectOptions} [options]
	   * @returns {void}
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
	   * The return type intersects `SignalAccessor<T>` with a phantom `{
	   * readonly memo?: void }` property. The phantom never exists at
	   * runtime — its sole purpose is to give TypeScript more structural
	   * information so it can infer `T` cleanly when memo() is called
	   * inline inside another generic context, e.g. `<For each={memo(()
	   * => [...])}>`. Without it, bidirectional inference between two
	   * generic calls collapses `T` to `unknown`.
	   *
	   * @template T
	   * @param {() => T} fn - Function to re-run when dependencies change
	   * @param {SignalOptions<T>} [options]
	   * @returns {SignalAccessor<T> & { readonly memo?: void }}
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  function memo(fn, options = undefined) {
	    return /** @type {SignalAccessor<T> & { readonly memo?: void }} */ /** @type {unknown} */new Memo(Owner, fn, options).read;
	  }

	  /**
	   * Lazy and writable version of `memo` that unwraps and tracks
	   * functions and promises recursively
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  const derived = /** @type {import('#type/derived.d.ts').derived} */
	  /** @type {unknown} */(...fn) => (/** @type {import('#type/derived.d.ts').derived} */
	  /** @type {unknown} */new Derived(Owner, fn));

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
	    try {
	      return runWith(() => runUpdates(fn, true), owner);
	    } catch (err) {
	      routeError(owner, err);
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
	    return runWith(fn, Owner);
	  }

	  /**
	   * Runs a callback on cleanup, returns callback
	   *
	   * @template {() => void} T
	   * @param {T} fn
	   * @returns {T}
	   */
	  function cleanup(fn) {
	    Owner?.addCleanups(fn);
	    return fn;
	  }

	  /**
	   * Runs `fn` and routes any error — synchronous or reactive — from
	   * its descendants to `handler` instead of the console.
	   *
	   * @template T
	   * @param {() => T} fn
	   * @param {(err: unknown) => void} handler
	   * @returns {T | undefined}
	   */
	  function catchError(fn, handler) {
	    let result;
	    syncEffect(() => {
	      const parentHandler = /** @type {((err: unknown) => void) | undefined} */
	      Owner.context && Owner.context[errorHandlerId];
	      const safeHandler = err => {
	        try {
	          handler(err);
	        } catch (handlerErr) {
	          if (parentHandler) parentHandler(handlerErr);else console.error(handlerErr);
	        }
	      };
	      Owner.context = {
	        ...Owner.context,
	        [errorHandlerId]: safeHandler
	      };
	      try {
	        result = untrack(fn);
	      } catch (err) {
	        Owner.disposeOwned();
	        safeHandler(err);
	      }
	    });
	    return result;
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

	  // Pools for Updates and Effects. Reused across calls so the array
	  // literal sites don't deopt with "Insufficient type feedback for
	  // array literal" and V8 keeps a stable JSArray elements kind.
	  //
	  // Both must be pools, not single scratch arrays. Updates can have
	  // multiple arrays alive at once because the save/restore pattern
	  // at solid.js:340-343 and solid.js:892-895 deliberately bypasses
	  // the `if (Updates) return fn()` early-exit by setting Updates to
	  // undefined before re-entering — so the inner runUpdates needs an
	  // array independent of the outer's. Effects can also have multiple
	  // arrays alive when runEffects iterates the captured queue while
	  // nested work queues into a fresh one.
	  const _updatesPool = [[]];
	  const _effectsPool = [[]];

	  // Static helper used by `runUpdates` to drain `Effects` in a fresh
	  // nested batch. Replaces the `() => runEffects(effects)` closure
	  // that was previously allocated on every top-level batch — heap
	  // profile flagged it as a hot small-object allocation. The slot
	  // is module-scoped (created once) and is only set immediately
	  // before the recursive `runUpdates` call, so there is no risk of
	  // re-entrant overwrite: nested `runUpdates` calls hit the
	  // `if (Updates) return fn()` early-exit before reaching this
	  // path.
	  let _pendingEffects;
	  function _drainEffects() {
	    const effects = _pendingEffects;
	    _pendingEffects = undefined;
	    runEffects(effects);
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
	    let myUpdates;
	    if (!init) {
	      myUpdates = Updates = _updatesPool.pop() || [];
	    }
	    let myEffects;
	    if (Effects) {
	      wait = true;
	    } else {
	      myEffects = Effects = _effectsPool.pop() || [];
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
	        if (effects.length) {
	          _pendingEffects = effects;
	          runUpdates(_drainEffects);
	        }
	      }
	      return res;
	    } catch (err) {
	      if (!wait) {
	        Effects = undefined;
	      }
	      Updates = undefined;
	      throw err;
	    } finally {
	      if (myUpdates) {
	        myUpdates.length = 0;
	        _updatesPool.push(myUpdates);
	      }
	      if (myEffects) {
	        myEffects.length = 0;
	        _effectsPool.push(myEffects);
	      }
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
	   * @returns {Context<T>}
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  function context(defaultValue = undefined) {
	    const id = Symbol$1();

	    /**
	     * @overload Runs `fn` with the full context value
	     * @param {T} newValue - New value for the context
	     * @param {() => JSX.Element} fn - Callback to run with the new
	     *   context value
	     * @returns {JSX.Element} Context value
	     */
	    /**
	     * @overload Runs `fn` with a partial override of the context
	     * @param {Partial<T>} newValue - Partial override
	     * @param {() => JSX.Element} fn - Callback to run with the new
	     *   context value
	     * @returns {JSX.Element} Context value
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
	     * @param {Partial<T> | { [K in keyof T]?: Accessor<T[K]> }} props.value
	     * @param {JSX.Element} [props.children]
	     * @returns {JSX.Element}
	     * @url https://pota.quack.uy/Reactivity/Context
	     */
	    useContext.Provider = props => useContext(/** @type {Partial<T>} */props.value, () =>
	    // @ts-expect-error `toHTML` is attached by renderer.js at module init
	    context.toHTML(props.children));

	    /**
	     * Maps context following `parent` property (if any). When `true`
	     * is returned from the callback it stops walking.
	     *
	     * @param {(context: T) => boolean | void} callback
	     * @param {T} [context]
	     * @returns {boolean}
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
	      cleanup(() => {
	        // only run onCancel when actually is canceled
	        onCancel && cleaned === undefined && onCancel();
	        cleaned = null;
	      });
	      return (...args) => {
	        // if the function runs, then it wont be canceled
	        onCancel = null;

	        // only run callback when owner wasnt disposed
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
	   * @param {Attribute<T>} value
	   * @param {(value: T) => void} fn
	   */
	  function withValue(value, fn, writeDefaultValue = noop, wroteValue = undefined, resolved = undefined) {
	    // `wroteValue` and `resolved` are lazily allocated INSIDE the
	    // branches that need them. The terminal `fn(value)` path is
	    // the common case (every reactive prop assignment for a
	    // primitive/element value goes through it) — making the
	    // defaults eager allocated `{ value: false }` + `[]` per
	    // call, even for the terminal path that never reads them.
	    // Lazy init keeps that hot path allocation-free.
	    if (isFunction(value)) {
	      // TODO maybe change this to be a memo

	      if (wroteValue === undefined) wroteValue = {
	        value: false
	      };
	      if (resolved === undefined) resolved = [];
	      syncEffect(() => withValue(value(), fn, writeDefaultValue, wroteValue, resolved));
	    } else if (isArray(value) && (resolved === undefined || !resolved.includes(value))) {
	      // TODO maybe do same for objects ...

	      if (wroteValue === undefined) wroteValue = {
	        value: false
	      };
	      if (resolved === undefined) resolved = [];
	      resolved.push(value);

	      // when empty it should update too
	      if (value.length === 0) {
	        fn(value);
	        return;
	      }
	      let pending = value.length;
	      value.forEach((item, i) => {
	        withValue(item, item => {
	          value[i] = item;
	          if (--pending === 0) {
	            withValue(value, fn, writeDefaultValue, wroteValue, resolved);
	          }
	        }, writeDefaultValue, wroteValue, resolved);
	      });
	    } else if (isPromise(value)) {
	      if (wroteValue === undefined) wroteValue = {
	        value: false
	      };
	      if (resolved === undefined) resolved = [];
	      const remove = asyncTracking.add();
	      /**
	       * WriteDefaultValue is used to avoid a double write. If the
	       * value has no promises, then it will be a native value or a
	       * function, which will resolve without having to wait.
	       *
	       * In case of promises, the value is resolved at a later point
	       * in time, so we need an intermediate default
	       */
	      !wroteValue.value && writeDefaultValue();
	      wroteValue.value = true;
	      value.then(owned(value => {
	        remove();
	        withValue(value, fn, writeDefaultValue, wroteValue, resolved);
	      }, remove), owned(err => {
	        remove();
	        throw err;
	      }, remove));
	    } else {
	      fn(value);
	    }
	  }

	  /**
	   * Unwraps functions and promises recursively canceling if owner
	   * gets disposed
	   */
	  const resolve = (value, cbs) => isFunction(value) ? track(() => resolve(getValue(value), cbs)) : isPromise(value) ? value.then(owned(value => resolve(value, cbs)), owned(err => {
	    throw err;
	  })) : cbs.length ? resolve(() => cbs[0](value), cbs.slice(1)) : value;

	  /**
	   * Unwraps functions and promises recursively canceling if owner
	   * gets disposed
	   *
	   * @type {import('#type/action.d.ts').action}
	   */
	  const action = (...cbs) => owned((...args) => {
	    resolve(() => cbs[0](...args), cbs.slice(1));
	  });

	  /** Utilities exposed for tracking async work from user-land. */

	  const asyncTracking = (() => {
	    let added = false;
	    let fns = [];
	    let count = 0;
	    function add() {
	      count++;
	      let removed;
	      return () => {
	        if (removed === undefined) {
	          removed = null;
	          --count === 0 && queue();
	        }
	      };
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
	      ready
	    };
	  })();

	  /** Suspense */
	  class createSuspenseContext {
	    s = signal(false);
	    c = 0;
	    add() {
	      this.c++;
	      const asyncRemove = asyncTracking.add();
	      let removed;
	      return () => {
	        if (removed === undefined) {
	          removed = null;
	          if (--this.c === 0) {
	            this.s.write(true);
	          }
	          asyncRemove();
	        }
	      };
	    }
	    isEmpty() {
	      return this.c === 0;
	    }
	  }
	  const useSuspense = context(new createSuspenseContext());

	  // export

	  /** Returns the current reactive listener, if any. */
	  function listener() {
	    return Listener;
	  }
	  return {
	    action,
	    asyncTracking,
	    batch,
	    catchError,
	    cleanup,
	    context,
	    createSuspenseContext,
	    derived,
	    effect,
	    listener,
	    memo,
	    on,
	    owned,
	    owner,
	    root,
	    Root,
	    runWithOwner,
	    signal,
	    syncEffect,
	    untrack,
	    useSuspense,
	    withValue
	  };
	}

	const document$1 = /** @type {Document} */window$1.document;
	const head = document$1?.head;

	/**
	 * Checks whether a node is connected to a document tree.
	 *
	 * @param {Node} node
	 * @returns {boolean}
	 */
	const isConnected = node => node.isConnected;

	/** @returns {Element | null} The currently focused element. */
	const activeElement = () => document$1.activeElement;

	/** @returns {Element | undefined} The root `<html>` element if available. */
	const documentElement = document$1?.documentElement;

	/** DocumentFragment constructor exposed for convenience. */
	const DocumentFragment = window$1.DocumentFragment;

	/**
	 * Safely binds a document method so it can be called later.
	 *
	 * @param {string} fn
	 * @returns {Function | undefined}
	 */
	const bind = fn => document$1 && document$1[fn].bind(document$1);
	const createElement = bind('createElement');
	const createElementNS = bind('createElementNS');
	const createTextNode = bind('createTextNode');
	const createComment = bind('createComment');

	/**
	 * Cleans a text value using the same whitespace rules JSX applies to
	 * `JSXText` children: strip leading/trailing whitespace adjacent to
	 * tags, drop blank lines, and add a single trailing space to non-last
	 * lines that survived. Returns `''` when the input was pure
	 * whitespace. Mirrors `cleanJSXElementLiteralChild` in
	 * `babel-preset/transform/children.js` so xml↔jsx round-trips don't
	 * have to fix up whitespace.
	 *
	 * @param {string} value
	 * @returns {string}
	 */
	function cleanJSXText(value) {
	  const lines = value.split(/\r\n|\n|\r/);
	  let lastNonEmptyLine = 0;
	  for (let i = 0; i < lines.length; i++) {
	    if (/[^ \t]/.test(lines[i])) {
	      lastNonEmptyLine = i;
	    }
	  }
	  let str = '';
	  for (let i = 0; i < lines.length; i++) {
	    let trimmedLine = lines[i].replace(/\t/g, ' ');
	    if (i !== 0) trimmedLine = trimmedLine.replace(/^ +/, '');
	    if (i !== lines.length - 1) trimmedLine = trimmedLine.replace(/ +$/, '');
	    if (trimmedLine) {
	      if (i !== lastNonEmptyLine) trimmedLine += ' ';
	      str += trimmedLine;
	    }
	  }
	  return str;
	}
	bind('importNode');
	const createTreeWalker = bind('createTreeWalker');

	// tokenList

	/**
	 * Splits a string by whitespace into tokens; returns `emptyArray` for
	 * falsy or whitespace-only input.
	 *
	 * @param {string | undefined | null} s
	 * @returns {string[]}
	 */
	const tokenList = s => {
	  s = s?.trim();
	  return s ? s.split(/\s+/) : (/** @type string[] */ /** @type unknown */emptyArray);
	};

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
	(function (walk, node, max = Infinity, nodes = []) {
	  /**
	   * The first node is not walked by the walker.
	   *
	   * Also the first node could be a DocumentFragment
	   */
	  node.nodeType === 1 && max > 0 && nodes.push(node);
	  walk.currentNode = node;
	  while (nodes.length < max && (node = walk.nextNode())) {
	    nodes.push(node);
	  }
	  return nodes;
	}).bind(null, createTreeWalker && createTreeWalker(document$1, 1 /*NodeFilter.SHOW_ELEMENT*/));

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
	    if (short && next.length === 0) {
	      const parent = prev[0] && prev[0].parentNode;
	      if (parent) {
	        // + 1 because of the original placeholder
	        if (prev.length + 1 === parent.childNodes.length) {
	          // console.log('fast clear')
	          // save the placeholder
	          const lastChild = parent.lastChild;
	          parent.textContent = '';
	          parent.appendChild(lastChild);
	          return next;
	        }
	      } else {
	        // console.log('parent gone already')
	        return next;
	      }
	    }
	    if (next.length === 0) {
	      // console.log('removing each separately')
	      for (const item of prev) {
	        item && item.remove();
	      }
	      return next;
	    }
	    for (const item of prev) {
	      // console.log('removing some')
	      if (item && !next.includes(item)) {
	        item.remove();
	      }
	    }
	  }
	  return next;
	}

	const {
	  asyncTracking,
	  batch,
	  catchError,
	  cleanup,
	  context,
	  createSuspenseContext,
	  effect,
	  memo,
	  owned,
	  owner,
	  root,
	  Root,
	  runWithOwner,
	  signal,
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
	  const s = signal(value);
	  // @ts-expect-error
	  return (...args) => args.length ? s.write(args[0]) : s.read();
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

	// MAP

	class Row extends Root {
	  runId = 0;
	  item;
	  index;
	  isDupe;
	  nodes;
	  indexSignal = null;
	  _begin = null;
	  _end = null;
	  _fn;
	  reactiveIndex;
	  constructor(item, index, fn, isDupe, reactiveIndex) {
	    // Row IS its own Root — no separate root() / Root allocation.
	    super(owner());
	    this.item = item;
	    this.index = index;
	    this.isDupe = isDupe;
	    this._fn = fn;
	    this.reactiveIndex = reactiveIndex;

	    // Run init with `this` as the active owner so any
	    // effects/cleanups created inside attach to this Row.
	    runWithOwner(this, () => this.rowInit());
	  }
	  rowInit() {
	    if (this.reactiveIndex) {
	      this.indexSignal = signal(this.index);
	      /** @type JSX.Element[] */
	      this.nodes = this._fn(this.item, this.indexSignal.read);
	    } else {
	      /** @type JSX.Element[] */
	      this.nodes = this._fn(this.item, this.index);
	    }
	  }

	  // Default disposal path — also remove DOM nodes. Used by
	  // mapper.dispose(row) and by parent owner cascades.
	  dispose() {
	    this.remove();
	    super.dispose();
	  }

	  // mapper.clear() path — the parent has already detached all rows
	  // in one batch (toDiff fast-clear), so skip per-row remove() and
	  // just clean up reactivity.
	  disposeKeepingNodes() {
	    super.dispose();
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
	    if (this._begin === null) {
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
	    if (this._end === null) {
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
	  /** @returns {DOMElement[]} */
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
	  remove() {
	    this.nodesForRow().forEach(node => node.remove());
	  }
	}

	/**
	 * Reactive Map
	 *
	 * @type {{
	 * 	<T>(
	 * 		list: Each<T>,
	 * 		callback: (item: T, index: () => number) => JSX.Element,
	 * 		noSort: boolean | undefined,
	 * 		fallback: JSX.Element | undefined,
	 * 		reactiveIndex: true,
	 * 	): (fn?: Function) => JSX.Element
	 * 	<T>(
	 * 		list: Each<T>,
	 * 		callback: (item: T, index: number) => JSX.Element,
	 * 		noSort?: boolean,
	 * 		fallback?: JSX.Element,
	 * 		reactiveIndex?: boolean,
	 * 	): (fn?: Function) => JSX.Element
	 * }}
	 */
	const map = (list, callback, noSort, fallback, reactiveIndex) => {
	  const cache = new Map();
	  const duplicates = new Map(); // for when caching by value is not possible [1, 2, 1, 1, 1]

	  let runId = 0;

	  /** @type Row[] */
	  let rows = [];
	  /** @type Row[] */
	  let prev = [];
	  function clear() {
	    toDiff(flatToArray(prev.map(item => item.nodes)), [], true);
	    for (const row of prev) {
	      row.disposeKeepingNodes();
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
	    row.dispose();
	  }

	  /**
	   * @param {Function} [fn]
	   * @returns {JSX.Element}
	   */
	  function mapper(fn) {
	    const cb = fn ? (item, index) => fn(callback(item, index), index) : callback;
	    const value = getValue(list) || emptyArray;
	    runId++;
	    rows = [];

	    /** `toEntries` To allow iterate objects as if were an array */

	    // all has been replaced?
	    if (prev.length) {
	      let clearit = true;
	      for (const [index, item] of toEntries(value)) {
	        if (cache.get(item)) {
	          clearit = false;
	          break;
	        }
	      }
	      if (clearit) {
	        clear();
	      }
	    }
	    const hasPrev = prev.length;
	    for (const [index, item] of toEntries(value)) {
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
	      if (fallback) {
	        const f = fn(fallback);
	        cleanup(() => toDiff(flatToArray(f)));
	        return f;
	      }
	      return emptyArray;
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
	      if (rows.length > 1 && prev.length) {
	        const unsort = [];
	        const sorted = [];

	        // handles append/prepend/insert in middle/swap
	        for (let i = 0; i < prev.length && i < rows.length; i++) {
	          if (prev[i] !== rows[i]) {
	            unsort.push(rows[i]);
	            for (let i2 = 1; rows.length - i2 > i; i2++) {
	              const k = rows.length - i2;
	              if (prev[prev.length - i2] !== rows[k]) {
	                unsort.push(rows[k]);
	              } else {
	                sorted.push(rows[k]);
	              }
	            }
	            break;
	          } else {
	            sorted.push(rows[i]);
	          }
	        }
	        if (unsort.length) {
	          let unsorted = unsort.length;
	          if (unsorted) {
	            if (sorted.length) {
	              // handle swap - unsorted rows should move only next to already sorted
	              for (const usort of unsort) {
	                if (rows[usort.index - 1] && (unsorted === 1 || !unsort.includes(rows[usort.index - 1]) || sorted.includes(rows[usort.index - 1]))) {
	                  rows[usort.index - 1].end().after(...usort.nodesForRow());
	                  sorted.push(usort);
	                  unsorted--;
	                } else if (rows[usort.index + 1] && (unsorted === 1 || !unsort.includes(rows[usort.index + 1]) || sorted.includes(rows[usort.index + 1]))) {
	                  rows[usort.index + 1].begin().before(...usort.nodesForRow());
	                  sorted.push(usort);
	                  unsorted--;
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
	      }
	    }

	    // save sorted list
	    prev = rows;

	    // return external representation
	    return rows.map(item => item.nodes);
	  }
	  mapper[$isMap] = undefined;
	  return mapper;
	};

	/**
	 * Resolves and returns `children` in a memo. A memo in a memo, so
	 * reactivity on the inner memo doesnt trigger reactivity outside.
	 *
	 * @template {JSX.Element} T
	 * @param {T | (() => T)} fn
	 * @returns {SignalAccessor<Resolved<T>>}
	 * @url https://pota.quack.uy/resolve
	 */
	function resolve(fn) {
	  const children = isFunction(fn) ? memo(/** @type {() => T} */fn) : () => fn;
	  return memo(() => unwrap(children()));
	}

	/**
	 * Recursively unwrap children functions
	 *
	 * @template T
	 * @param {T} children
	 * @returns {Resolved<T>}
	 */
	function unwrap(children) {
	  if (isFunction(children)) {
	    return unwrap(/** @type {any} */children());
	  }
	  if (isArray(children)) {
	    const childrens = [];
	    for (let child of children) {
	      child = unwrap(child);
	      isArray(child) ? childrens.push(...child) : childrens.push(child);
	    }
	    return /** @type {Resolved<T>} */childrens;
	  }
	  return /** @type {Resolved<T>} */children;
	}

	/**
	 * Makes of `children` a function. Reactive children will run as is,
	 * non-reactive children will run untracked, regular children will
	 * just return.
	 *
	 * @template {JSX.Element | JSX.Element[]} T
	 * @param {T} children
	 * @returns {(...args: unknown[]) => T}
	 */
	function makeCallback(children) {
	  /** Shortcut the most used case */
	  if (isFunction(children)) {
	    // JSX-component children (`<Inner />`) carry `$isComponent`. The
	    // renderer untracks marked functions when it inserts them as
	    // children, but flow components like `Show`/`Switch` invoke the
	    // callback themselves inside a memo, bypassing that path. Mirror
	    // the renderer's behavior here so the marked component runs
	    // untracked regardless of the call site.
	    // User callbacks (`{v => ...}`) are not marked and stay tracked.
	    if ($isComponent in children) {
	      return markComponent((...args) => untrack(() => children(...args)));
	    }
	    return markComponent(children);
	  }

	  /**
	   * When children is an array, as in `>${[0, 1, 2]}<` then children
	   * will end as `[[0, 1, 2]]`, so flat it
	   */
	  const childrenMaybeArray = flatNoArray(children);
	  return isArray(childrenMaybeArray) ? markComponent((...args) => childrenMaybeArray.map(child => isFunction(child) ? $isComponent in child ? untrack(() => child(...args)) : child(...args) : child)) : markComponent((...args) => isFunction(childrenMaybeArray) ? $isComponent in childrenMaybeArray ? untrack(() => childrenMaybeArray(...args)) : childrenMaybeArray(...args) : childrenMaybeArray);
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
	 * @template {JSX.EventName} Name
	 * @param {TargetElement} node - Element to add the event listener
	 * @param {Name} type - The name of the event listener
	 * @param {JSX.EventHandler<JSX.EventTypeFor<Name>, TargetElement>} handler
	 *   - Function to handle the event
	 *
	 * @returns {Function} - An `off` function for removing the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function addEvent(node, type, handler) {
	  node.addEventListener(type, /** @type {EventListenerOrEventListenerObject} */
	  /** @type unknown */handler, !isFunction(handler) ? (/** @type {JSX.EventHandlerOptions} */handler) : undefined);

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
	 * @template {JSX.EventName} Name
	 * @param {TargetElement} node - Element to add the event listener
	 * @param {Name} type - The name of the event listener
	 * @param {JSX.EventHandler<JSX.EventTypeFor<Name>, TargetElement>} handler
	 *   - Function to handle the event
	 *
	 * @returns {Function} - An `on` function for adding back the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function removeEvent(node, type, handler) {
	  node.removeEventListener(type, /** @type {EventListenerOrEventListenerObject} */
	  /** @type unknown */handler, !isFunction(handler) ? (/** @type {JSX.EventHandlerOptions} */handler) : undefined);
	  return () => addEvent(node, type, handler);
	}

	/**
	 * It gives a handler an owner, so stuff runs batched on it, and
	 * things like context and cleanup work
	 *
	 * @template {JSX.EventHandler<Event, Element>} T
	 * @param {T} handler
	 */
	const ownedEvent = handler => 'handleEvent' in handler ? {
	  ...handler,
	  handleEvent: owned(e => handler.handleEvent(e))
	} : owned(handler);

	const CSSStyleSheet$1 = window$1.CSSStyleSheet;

	/**
	 * Creates a stylesheet from a css string
	 *
	 * @param {string} css
	 * @returns {CSSStyleSheet}
	 */
	const sheet = withCache(css => {
	  const sheet = new CSSStyleSheet$1();
	  /** Replace is asynchronous and can accept `@import` statements referencing external resources. */
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
	 * Adds a style sheet to the document. Idempotent — adding the same
	 * sheet twice leaves a single entry.
	 *
	 * @param {Document | ShadowRoot} document
	 * @param {CSSStyleSheet} styleSheet
	 */
	const addAdoptedStyleSheet = (document, styleSheet) => {
	  const sheets = getAdoptedStyleSheets(document);
	  if (!sheets.includes(styleSheet)) sheets.push(styleSheet);
	};

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
	let queue$1;

	/** Initializes the priority queue buckets and clears the pending flag. */
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
	 * @param {() => void} fn - Function to run once the callbacks at this
	 *   priority run
	 */
	function add(priority, fn) {
	  if (!added) {
	    added = true;
	    queueMicrotask(run);
	  }
	  queue$1[priority].push(owned(fn));
	}

	/** Runs and clears the current queue batch. */
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
	 * @template {(
	 * 	node: DOMElement,
	 * 	localName: any,
	 * 	propValue: any,
	 * 	ns?: string,
	 * ) => void} F
	 * @param {string} NSName - Name of the namespace
	 * @param {F} fn - Function to run when this prop is found on any
	 *   Element
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
	 * @template {DOMElement} TargetElement
	 * @template {JSX.EventName} Name
	 * @param {TargetElement} node
	 * @param {Name} name
	 * @param {JSX.EventHandlers<
	 * 	JSX.EventTypeFor<Name>,
	 * 	TargetElement
	 * >} value
	 */
	const setEvent = (node, name, value) => {
	  flatForEach(value, value => {
	    addEvent(node, name, ownedEvent(/** @type JSX.EventHandler<Event, Element> */value));
	  });
	};

	/**
	 * Attaches namespaced event handlers, (singular or array) to an
	 * element.
	 *
	 * @template {DOMElement} TargetElement
	 * @template {JSX.EventName} Name
	 * @param {TargetElement} node
	 * @param {Name} localName
	 * @param {JSX.EventHandlers<
	 * 	JSX.EventTypeFor<Name>,
	 * 	TargetElement
	 * >} value
	 */
	const setEventNS = (node, localName, value) => {
	  flatForEach(value, value => {
	    setEvent(node, localName, value);
	  });
	};

	/** Returns true or false with a `chance` of getting `true` */

	/**
	 * Generates a base36 id string by reading 64 bits from `crypto`.
	 *
	 * @returns {string}
	 */
	const randomId = () => crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);

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
	 * @param {JSX.StyleAttribute} value
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
	 * @param {JSX.StyleAttribute} value
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
	 * @param {JSX.StyleAttribute} value
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
	  } else if (isArray(value)) {
	    prev && _setClassListValue(node, prev, false);
	    _setClassListValue(node, value.filter(Boolean), true);
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
	  isFunction(value) ? withPrevValue(value, (value, prev) => {
	    if (!value && !prev) ; else {
	      _setClassListValue(node, name, value);
	    }
	  }) : _setClassListValue(node, name, value);
	};

	/**
	 * @param {Element} node
	 * @param {string | string[]} name
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
	 * @param {Accessor<string | number | boolean>} value
	 * @url https://pota.quack.uy/props/setAttribute
	 */
	const setAttribute = (node, name, value) => {
	  withValue(value, value => _setAttribute(node, name, value));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {string | number | boolean} value
	 */
	function _setAttribute(node, name, value) {
	  // if the value is false/null/undefined it will be removed
	  value === false || value == null ? node.removeAttribute(name) : node.setAttribute(name, value === true ? '' : (/** @type {string} */value));
	}

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Accessor<string | number | boolean>} value
	 * @param {string} ns
	 * @param {string} localName
	 * @url https://pota.quack.uy/props/setAttribute
	 */
	const setAttributeNS = (node, name, value, ns, localName) => {
	  withValue(value, value => _setAttributeNS(node, name, value, ns, localName));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {string | number | boolean} value
	 * @param {string} ns
	 * @param {string} localName
	 */
	function _setAttributeNS(node, name, value, ns, localName) {
	  // if the value is false/null/undefined it will be removed
	  value === false || value == null ? NS[ns] ?
	  // removeAttributeNS takes the local name, not the qualified
	  node.removeAttributeNS(NS[ns], localName) : node.removeAttribute(name) : NS[ns] ? node.setAttributeNS(NS[ns], name, value === true ? '' : (/** @type {string} */value)) : node.setAttribute(name, value === true ? '' : (/** @type {string} */value));
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
	    plugin ? plugin(node, propNS[name][1], value) : setAttributeNS(node, name, value, propNS[name][0], propNS[name][1]);
	  } else {
	    // catch all
	    setAttribute(node, name, value);
	  }
	}

	// CONSTANTS


	// STATE

	const useXMLNS = context();

	// COMPONENTS

	/**
	 * Used by the regular JSX transform, as `<>...</>` or
	 * `<Fragment>...</Fragment>`.
	 *
	 * @type {ParentComponent}
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
	 * @type {{
	 * 	<T extends string | Function | Element | object | symbol>(
	 * 		value: T,
	 * 	): (props?: Partial<ComponentProps<T>>) => JSX.Element
	 * 	<T extends keyof JSX.IntrinsicElements>(
	 * 		value: T,
	 * 		props: ComponentProps<T>,
	 * 	): (props?: Partial<ComponentProps<T>>) => JSX.Element
	 * 	<T extends Function | Element | object | symbol, P>(
	 * 		value: T,
	 * 		props: P,
	 * 	): (props?: Partial<P>) => JSX.Element
	 * }}
	 * @url https://pota.quack.uy/Component
	 */
	const Component = (value, props = undefined) => {
	  if (value === Fragment) {
	    return /** @type {(props?: object) => JSX.Element} */ /** @type {unknown} */ /** @type {{ children: JSX.Element }} */(/** @type {unknown} */props).children;
	  }

	  /** Freeze props so isnt directly writable */
	  freeze(props);

	  /** Create a callable function to pass `props` */
	  const component = Factory(value);
	  return props === undefined ? component : markComponent(propsOverride => component(propsOverride ? freeze({
	    ...(/** @type {object} */props),
	    ...propsOverride
	  }) : props));
	};

	/**
	 * Creates a component that could be called with a props object
	 *
	 * @template T
	 * @param {string | Function | Element | object | symbol} value -
	 *   Component value
	 * @returns {(props?: JSX.Props<T>) => JSX.Element}
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
	        return $isComponent in value ? value : $isClass in value ? markComponent(props => createClass(value, props)) : markComponent(value);
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
	 * @template {JSX.Props<{ xmlns?: string; is?: string }>} P
	 * @param {string} tagName
	 * @param {P} props
	 * @returns {Element} Element
	 */
	function createTag(tagName, props = nothing) {
	  /**
	   * Namespace, use props xmlns or special case svg, math, etc in case
	   * of missing xmlns attribute
	   */
	  const xmlns = props.xmlns || NS[tagName];
	  return withXMLNS(xmlns, xmlns => createNode(xmlns ? createElementNS(xmlns, tagName, {
	    is: props.is
	  }) : createElement(tagName, {
	    is: props.is
	  }), props), tagName);
	}

	/** @type {boolean} */
	let usedXML;

	/**
	 * Ensures children inherit the right namespace as elements are
	 * created.
	 *
	 * @template T
	 * @param {string} xmlns
	 * @param {(xmlns: string) => T} fn
	 * @param {string} [tagName]
	 * @returns {T}
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
	    return /** @type {T} */useXMLNS(xmlns, () => fn(xmlns));
	  }

	  /**
	   * `foreignObject` children are created with html xmlns (default
	   * browser behaviour)
	   */
	  if (nsContext && tagName === 'foreignObject') {
	    return /** @type {T} */useXMLNS(NS.html, () => fn(nsContext));
	  }
	  return fn(nsContext);
	}

	/**
	 * Creates an instance of a class component and handles lifecycle
	 * methods
	 *
	 * @param {{ new (props: any): JSX.ElementClass }} value - The class
	 *   constructor
	 * @param {JSX.Props<unknown>} props - Props to pass to the class
	 *   constructor
	 * @returns {JSX.Element} The rendered output
	 */
	function createClass(value, props = nothing) {
	  const i = new value(props);
	  i.props = freeze({
	    ...(i.props || nothing),
	    ...props
	  });
	  i.ready && ready(() => i.ready());
	  i.cleanup && cleanup(() => i.cleanup());
	  return i.render(i.props);
	}

	/**
	 * Assigns props to an element and creates its children
	 *
	 * @template T
	 * @param {Element} node - Element to assign props to
	 * @param {JSX.Props<T>} props - Props to assign
	 * @returns {Element} The element with props assigned
	 */
	function createNode(node, props = nothing) {
	  props && assignProps(node, props);
	  return node;
	}

	/**
	 * Creates the children for a parent
	 *
	 * @template T
	 * @param {Element | DocumentFragment} parent
	 * @param {JSX.Element | ((...unknonwn) => T)} child
	 * @param {boolean} [relative]
	 * @param {Text} [prev]
	 * @param {true} [isComponent]
	 * @returns {JSX.Element}
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
	          return createChildren(parent, untrack(/** @type {() => JSX.Element} */child), relative, undefined, true);
	        }

	        // signal/memo/external/user provided function
	        // needs placeholder to stay in position
	        parent = createPlaceholder(parent, relative);

	        // For - TODO move this to the `For` component
	        if ($isMap in child) {
	          effect(() => {
	            // @ts-expect-error freaking typescript
	            child(child => createChildren(parent, child, true));
	          });
	          // map has own dom removal
	        } else {
	          let node = [];

	          // `Derived` while pending. The renderer's other thenable
	          // branch lives under `case 'object'` and never sees
	          // these because `typeof derived === 'function'`. Register
	          // with the active Suspense so the fallback shows until
	          // the derived first resolves. `d.then` is multi-consumer,
	          // so a user `await d` later won't clobber our
	          // registration. `cleanup(remove)` covers dispose; `remove`
	          // is idempotent so the two paths are safe to converge.
	          if ($isDerived in child) {
	            const d = /** @type {Derived<unknown>} */child;
	            const remove = useSuspense().add();
	            cleanup(remove);
	            d.then(remove);
	          }
	          effect(() => {
	            // maybe a signal (at least a function) so needs an effect
	            node = toDiff(node, /** @type {DOMElement[]} */
	            flatToArray(createChildren(parent, /** @type {() => JSX.Element} */child(), true, node[0])), true);
	          });
	          cleanup(() => {
	            // console.log('clearing parent and node', parent, node)
	            if (parent.isConnected || node[0]?.isConnected) {
	              toDiff(node);
	              // @ts-expect-error freaking typescript
	              /** @type {Element} */
	              parent.remove();
	            }
	          });
	        }

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
	          const remove = useSuspense().add();
	          const value = signal(undefined);
	          child.then(owned(result => {
	            if (isComponent && isFunction(result)) {
	              markComponent(result);
	            }
	            value.write(result);
	            remove();
	          }, remove), owned(err => {
	            remove();
	            throw err;
	          }, remove));
	          return createChildren(parent, value.read, relative);
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
	    case 'boolean':
	      {
	        // Dynamic booleans (e.g. from `cond && <span/>` short-
	        // circuits) render as nothing. Literal booleans in markup
	        // are filtered out at compile time by the Babel preset
	        // (babel-preset/transform/children.js), so compile-time
	        // and runtime behavior stay consistent.
	        return undefined;
	      }
	    default:
	      {
	        // bigint/symbol/catch all
	        // toString() is needed for `Symbol`
	        return createChildren(parent, child.toString(), relative);
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
	    // maybe use relative ? parent.before(node) : parent.appendChild(node)

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
	 * @param {JSX.Element} children - Thing to render
	 * @param {Element | null} [parent] - Mount point, defaults to
	 *   document.body
	 * @param {{ clear?: boolean; relative?: boolean }} [options] -
	 *   Mounting options
	 * @returns {() => void} Disposer
	 * @url https://pota.quack.uy/render
	 */
	function render$1(children, parent, options = nothing) {
	  const dispose = root(dispose => {
	    insert(Factory(isFunction(children) ? children : () => children), parent, options);
	    return dispose;
	  });

	  // run dispose when the parent scope disposes
	  cleanup(dispose);
	  return dispose;
	}

	/**
	 * @param {JSX.Element} children - Thing to render
	 * @param {Element | null} [parent] - Mount point, defaults to
	 *   `document.body`
	 * @param {{ clear?: boolean; relative?: boolean }} [options] -
	 *   Mounting options
	 */
	function insert(children, parent = document$1.body, options = nothing) {
	  if (options.clear && parent) parent.textContent = '';
	  let node;
	  cleanup(() => toDiff(flatToArray(node)));
	  node = createChildren(parent, children, options.relative);
	  return node;
	}

	/**
	 * Creates and returns HTML Elements for `children`
	 *
	 * @param {JSX.Element} children
	 * @returns {ChildNode | NodeListOf<ChildNode>}
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

	/* @type {typeof context & { toHTML: typeof toHTML }} */
	// @ts-expect-error freaking typescript
	context.toHTML = toHTML;

	/**
	 * Creates and returns a DocumentFragment for `children`
	 *
	 * @param {JSX.Element} children
	 * @returns {DocumentFragment}
	 * @url https://pota.quack.uy/toHTML
	 */
	function toHTMLFragment(children) {
	  const fragment = new DocumentFragment();
	  createChildren(fragment, children);
	  return fragment;
	}

	/**
	 * Similar to `Show`, but doesn't remove its children from the
	 * document
	 *
	 * @type {FlowComponent<{
	 * 	when: When<any>
	 * 	fallback?: JSX.Element
	 * }>}
	 * @url https://pota.quack.uy/Components/Collapse
	 */
	const Collapse = props => {
	  const visible = () => !!getValue(props.when);
	  return [Component('div', {
	    'style:display': () => visible() ? 'contents' : 'none',
	    children: props.children
	  }), () => visible() ? undefined : props.fallback];
	};

	/**
	 * Creates components dynamically
	 *
	 * @template {JSX.ElementType} T
	 * @param {Dynamic<T>} props
	 * @returns {JSX.Element}
	 * @url https://pota.quack.uy/Components/Dynamic
	 */
	function Dynamic(props) {
	  // `component` needs to be deleted else it will end in the tag as an attribute
	  return Component(props.component, {
	    ...props,
	    component: undefined
	  });
	}

	const noError = Symbol();

	/**
	 * Catches errors thrown by descendants and renders a fallback.
	 *
	 * Protects its subtree from both synchronous throws during render and
	 * reactive throws inside descendant effects, memos, and deriveds. The
	 * `fallback` can be a JSX element, plain value, or a `(err, reset) =>
	 * JSX.Element` function.
	 *
	 * @type {FlowComponent<{
	 * 	fallback?:
	 * 		| JSX.Element
	 * 		| ((err: unknown, reset: () => void) => JSX.Element)
	 * }>}
	 * @url https://pota.quack.uy/Components/Errored
	 */
	const Errored = props => {
	  const err = signal(/** @type {unknown} */noError);
	  const attempt = signal(0);
	  const fallback = makeCallback(props.fallback);
	  const reset = () => {
	    batch(() => {
	      err.write(noError);
	      attempt.update(n => n + 1);
	    });
	  };
	  const children = memo(() => {
	    attempt.read();
	    return catchError(() => toHTMLFragment(props.children), err.write);
	  });
	  return memo(() => {
	    const e = err.read();
	    if (e !== noError) return fallback(e, reset);
	    return children();
	  });
	};

	/**
	 * Renders reactive values from a signal that returns an Iterable
	 * object
	 *
	 * @type {{
	 * 	<T>(props: {
	 * 		each: Each<T>
	 * 		restoreFocus?: boolean
	 * 		reactiveIndex?: false
	 * 		children?: Children<(item: T, index: number) => JSX.Element>
	 * 		fallback?: JSX.Element
	 * 	}): JSX.Element
	 * 	<T>(props: {
	 * 		each: Each<T>
	 * 		restoreFocus?: boolean
	 * 		reactiveIndex: true
	 * 		children?: Children<
	 * 			(item: T, index: () => number) => JSX.Element
	 * 		>
	 * 		fallback?: JSX.Element
	 * 	}): JSX.Element
	 * }}
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
	    const active = activeElement();
	    // nothing focused, nothing to restore — skip so the stale
	    // capture doesn't block the next meaningful queue() call
	    if (!active || active === document.body) return;
	    queued = true;
	    const scroll = documentElement.scrollTop;
	    onFixes(() => {
	      queued = false;
	      // re-ordering the elements trashes focus
	      active !== activeElement() && isConnected(active) &&
	      // @ts-expect-error
	      active.focus();
	      documentElement.scrollTop = scroll;
	    });
	  }
	}

	/**
	 * Portals children to a different element while keeping the original
	 * scope
	 *
	 * @type {ParentComponent<{ mount: DOMElement }>}
	 * @url https://pota.quack.uy/Components/Portal
	 */
	const Portal = props => {
	  insert(props.children, props.mount);
	  // its portaling, it shouldnt return !
	};

	/**
	 * Mounts children on `document.head`
	 *
	 * @type {FlowComponent}
	 * @url https://pota.quack.uy/Components/Head
	 */
	const Head = props => Component(Portal, {
	  mount: document$1.head,
	  children: props.children
	});

	/**
	 * Copies a string to the clipboard, ignoring errors.
	 *
	 * @param {string} s
	 * @returns {Promise<void>}
	 */
	const copyToClipboard = s => resolvedIgnoreError(navigator.clipboard.writeText(s), noop);

	/**
	 * Checks if a string contains emoji characters.
	 *
	 * @param {string} value
	 * @returns {boolean}
	 */
	const isEmoji = value => /(\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F?|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD]))/g.test(value);

	var Emoji = {
		"#ABW": "🇦🇼",
		"#AC": "🇦🇨",
		"#AD": "🇦🇩",
		"#AE": "🇦🇪",
		"#AF": "🇦🇫",
		"#AFG": "🇦🇫",
		"#AG": "🇦🇬",
		"#AGO": "🇦🇴",
		"#AHO": "🇧🇶",
		"#AI": "🇦🇮",
		"#AIA": "🇦🇮",
		"#AL": "🇦🇱",
		"#ALA": "🇦🇽",
		"#ALB": "🇦🇱",
		"#ALD": "🇦🇽",
		"#ALG": "🇩🇿",
		"#AM": "🇦🇲",
		"#AND": "🇦🇩",
		"#ANG": "🇦🇴",
		"#ANT": "🇧🇶",
		"#AO": "🇦🇴",
		"#AQ": "🇦🇶",
		"#AR": "🇦🇷",
		"#ARE": "🇦🇪",
		"#ARG": "🇦🇷",
		"#ARM": "🇦🇲",
		"#ARU": "🇦🇼",
		"#AS": "🇦🇸",
		"#ASA": "🇦🇸",
		"#ASM": "🇦🇸",
		"#AT": "🇦🇹",
		"#ATA": "🇦🇶",
		"#ATF": "🇹🇫",
		"#ATG": "🇦🇬",
		"#AU": "🇦🇺",
		"#AUS": "🇦🇺",
		"#AUT": "🇦🇹",
		"#AW": "🇦🇼",
		"#AX": "🇦🇽",
		"#AZ": "🇦🇿",
		"#AZE": "🇦🇿",
		"#BA": "🇧🇦",
		"#BAH": "🇧🇸",
		"#BAN": "🇧🇩",
		"#BAR": "🇧🇧",
		"#BB": "🇧🇧",
		"#BD": "🇧🇩",
		"#BDI": "🇧🇮",
		"#BE": "🇧🇪",
		"#BEL": "🇧🇪",
		"#BEN": "🇧🇯",
		"#BER": "🇧🇲",
		"#BES": "🇧🇶",
		"#BF": "🇧🇫",
		"#BFA": "🇧🇫",
		"#BG": "🇧🇬",
		"#BGD": "🇧🇩",
		"#BGR": "🇧🇬",
		"#BH": "🇧🇭",
		"#BHR": "🇧🇭",
		"#BHS": "🇧🇸",
		"#BHU": "🇧🇹",
		"#BI": "🇧🇮",
		"#BIH": "🇧🇦",
		"#BIZ": "🇧🇿",
		"#BJ": "🇧🇯",
		"#BL": "🇧🇱",
		"#BLM": "🇧🇱",
		"#BLR": "🇧🇾",
		"#BLZ": "🇧🇿",
		"#BM": "🇧🇲",
		"#BMU": "🇧🇲",
		"#BN": "🇧🇳",
		"#BO": "🇧🇴",
		"#BOL": "🇧🇴",
		"#BOT": "🇧🇼",
		"#BQ": "🇧🇶",
		"#BR": "🇧🇷",
		"#BRA": "🇧🇷",
		"#BRB": "🇧🇧",
		"#BRN": "🇧🇭",
		"#BRU": "🇧🇳",
		"#BS": "🇧🇸",
		"#BT": "🇧🇹",
		"#BTN": "🇧🇹",
		"#BUL": "🇧🇬",
		"#BUR": "🇧🇫",
		"#BV": "🇧🇻",
		"#BVT": "🇧🇻",
		"#BW": "🇧🇼",
		"#BWA": "🇧🇼",
		"#BY": "🇧🇾",
		"#BZ": "🇧🇿",
		"#CA": "🇨🇦",
		"#CAF": "🇨🇫",
		"#CAM": "🇰🇭",
		"#CAN": "🇨🇦",
		"#CAY": "🇰🇾",
		"#CC": "🇨🇨",
		"#CCK": "🇨🇨",
		"#CD": "🇨🇩",
		"#CF": "🇨🇫",
		"#CG": "🇨🇬",
		"#CGO": "🇨🇬",
		"#CH": "🇨🇭",
		"#CHA": "🇹🇩",
		"#CHE": "🇨🇭",
		"#CHI": "🇨🇱",
		"#CHL": "🇨🇱",
		"#CHN": "🇨🇳",
		"#CI": "🇨🇮",
		"#CIV": "🇨🇮",
		"#CK": "🇨🇰",
		"#CL": "🇨🇱",
		"#CM": "🇨🇲",
		"#CMR": "🇨🇲",
		"#CN": "🇨🇳",
		"#CO": "🇨🇴",
		"#COD": "🇨🇩",
		"#COG": "🇨🇬",
		"#COK": "🇨🇰",
		"#COL": "🇨🇴",
		"#COM": "🇰🇲",
		"#CP": "🇨🇵",
		"#CPV": "🇨🇻",
		"#CR": "🇨🇷",
		"#CRC": "🇨🇷",
		"#CRI": "🇨🇷",
		"#CRO": "🇭🇷",
		"#CTA": "🇨🇫",
		"#CU": "🇨🇺",
		"#CUB": "🇨🇺",
		"#CUW": "🇨🇼",
		"#CV": "🇨🇻",
		"#CW": "🇨🇼",
		"#CX": "🇨🇽",
		"#CXR": "🇨🇽",
		"#CY": "🇨🇾",
		"#CYM": "🇰🇾",
		"#CYP": "🇨🇾",
		"#CZ": "🇨🇿",
		"#CZE": "🇨🇿",
		"#DE": "🇩🇪",
		"#DEN": "🇩🇰",
		"#DEU": "🇩🇪",
		"#DG": "🇩🇬",
		"#DJ": "🇩🇯",
		"#DJI": "🇩🇯",
		"#DK": "🇩🇰",
		"#DM": "🇩🇲",
		"#DMA": "🇩🇲",
		"#DNK": "🇩🇰",
		"#DO": "🇩🇴",
		"#DOM": "🇩🇴",
		"#DZ": "🇩🇿",
		"#DZA": "🇩🇿",
		"#EA": "🇪🇦",
		"#EC": "🇪🇨",
		"#ECU": "🇪🇨",
		"#EE": "🇪🇪",
		"#EG": "🇪🇬",
		"#EGY": "🇪🇬",
		"#EH": "🇪🇭",
		"#ENG": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
		"#EQG": "🇬🇶",
		"#ER": "🇪🇷",
		"#ERI": "🇪🇷",
		"#ES": "🇪🇸",
		"#ESA": "🇸🇻",
		"#ESH": "🇪🇭",
		"#ESP": "🇪🇸",
		"#EST": "🇪🇪",
		"#ET": "🇪🇹",
		"#ETH": "🇪🇹",
		"#EU": "🇪🇺",
		"#FAR": "🇫🇴",
		"#FGU": "🇬🇫",
		"#FI": "🇫🇮",
		"#FIJ": "🇫🇯",
		"#FIN": "🇫🇮",
		"#FJ": "🇫🇯",
		"#FJI": "🇫🇯",
		"#FK": "🇫🇰",
		"#FLK": "🇫🇰",
		"#FM": "🇫🇲",
		"#FO": "🇫🇴",
		"#FPO": "🇵🇫",
		"#FR": "🇫🇷",
		"#FRA": "🇫🇷",
		"#FRO": "🇫🇴",
		"#FSM": "🇫🇲",
		"#GA": "🇬🇦",
		"#GAB": "🇬🇦",
		"#GAE": "🏳🌈",
		"#GAM": "🇬🇲",
		"#GAY": "🏳🌈",
		"#GB": "🇬🇧",
		"#GBG": "🇬🇬",
		"#GBJ": "🇯🇪",
		"#GBM": "🇮🇲",
		"#GBR": "🇬🇧",
		"#GBS": "🇬🇼",
		"#GBZ": "🇬🇮",
		"#GD": "🇬🇩",
		"#GE": "🇬🇪",
		"#GEO": "🇬🇪",
		"#GEQ": "🇬🇶",
		"#GER": "🇩🇪",
		"#GF": "🇬🇫",
		"#GG": "🇬🇬",
		"#GGY": "🇬🇬",
		"#GH": "🇬🇭",
		"#GHA": "🇬🇭",
		"#GI": "🇬🇮",
		"#GIB": "🇬🇮",
		"#GIN": "🇬🇳",
		"#GL": "🇬🇱",
		"#GLP": "🇬🇵",
		"#GM": "🇬🇲",
		"#GMB": "🇬🇲",
		"#GN": "🇬🇳",
		"#GNB": "🇬🇼",
		"#GNQ": "🇬🇶",
		"#GP": "🇬🇵",
		"#GQ": "🇬🇶",
		"#GR": "🇬🇷",
		"#GRC": "🇬🇷",
		"#GRD": "🇬🇩",
		"#GRE": "🇬🇷",
		"#GRL": "🇬🇱",
		"#GRN": "🇬🇩",
		"#GS": "🇬🇸",
		"#GT": "🇬🇹",
		"#GTM": "🇬🇹",
		"#GU": "🇬🇺",
		"#GUA": "🇬🇹",
		"#GUD": "🇬🇵",
		"#GUF": "🇬🇫",
		"#GUI": "🇬🇳",
		"#GUM": "🇬🇺",
		"#GUY": "🇬🇾",
		"#GW": "🇬🇼",
		"#GY": "🇬🇾",
		"#HAI": "🇭🇹",
		"#HEL": "🇸🇭",
		"#HK": "🇭🇰",
		"#HKG": "🇭🇰",
		"#HM": "🇭🇲",
		"#HMD": "🇭🇲",
		"#HN": "🇭🇳",
		"#HND": "🇭🇳",
		"#HON": "🇭🇳",
		"#HR": "🇭🇷",
		"#HRV": "🇭🇷",
		"#HT": "🇭🇹",
		"#HTI": "🇭🇹",
		"#HU": "🇭🇺",
		"#HUN": "🇭🇺",
		"#IC": "🇮🇨",
		"#ID": "🇮🇩",
		"#IDN": "🇮🇩",
		"#IE": "🇮🇪",
		"#IL": "🇮🇱",
		"#IM": "🇮🇲",
		"#IMN": "🇮🇲",
		"#IN": "🇮🇳",
		"#INA": "🇮🇩",
		"#IND": "🇮🇳",
		"#IO": "🇮🇴",
		"#IOT": "🇮🇴",
		"#IQ": "🇮🇶",
		"#IR": "🇮🇷",
		"#IRI": "🇮🇷",
		"#IRL": "🇮🇪",
		"#IRN": "🇮🇷",
		"#IRQ": "🇮🇶",
		"#IS": "🇮🇸",
		"#ISL": "🇮🇸",
		"#ISR": "🇮🇱",
		"#ISV": "🇻🇮",
		"#IT": "🇮🇹",
		"#ITA": "🇮🇹",
		"#IVB": "🇻🇬",
		"#JAM": "🇯🇲",
		"#JE": "🇯🇪",
		"#JEY": "🇯🇪",
		"#JM": "🇯🇲",
		"#JO": "🇯🇴",
		"#JOR": "🇯🇴",
		"#JP": "🇯🇵",
		"#JPN": "🇯🇵",
		"#KAZ": "🇰🇿",
		"#KE": "🇰🇪",
		"#KEN": "🇰🇪",
		"#KG": "🇰🇬",
		"#KGZ": "🇰🇬",
		"#KH": "🇰🇭",
		"#KHM": "🇰🇭",
		"#KI": "🇰🇮",
		"#KIR": "🇰🇮",
		"#KM": "🇰🇲",
		"#KN": "🇰🇳",
		"#KNA": "🇰🇳",
		"#KOR": "🇰🇷",
		"#KP": "🇰🇵",
		"#KR": "🇰🇷",
		"#KSA": "🇸🇦",
		"#KUW": "🇰🇼",
		"#KVX": "🇽🇰",
		"#KW": "🇰🇼",
		"#KWT": "🇰🇼",
		"#KY": "🇰🇾",
		"#KZ": "🇰🇿",
		"#LA": "🇱🇦",
		"#LAO": "🇱🇦",
		"#LAT": "🇱🇻",
		"#LB": "🇱🇧",
		"#LBA": "🇱🇾",
		"#LBN": "🇱🇧",
		"#LBR": "🇱🇷",
		"#LBY": "🇱🇾",
		"#LC": "🇱🇨",
		"#LCA": "🇱🇨",
		"#LES": "🇱🇸",
		"#LI": "🇱🇮",
		"#LIB": "🇱🇧",
		"#LIE": "🇱🇮",
		"#LK": "🇱🇰",
		"#LKA": "🇱🇰",
		"#LR": "🇱🇷",
		"#LS": "🇱🇸",
		"#LSO": "🇱🇸",
		"#LT": "🇱🇹",
		"#LTU": "🇱🇹",
		"#LU": "🇱🇺",
		"#LUX": "🇱🇺",
		"#LV": "🇱🇻",
		"#LVA": "🇱🇻",
		"#LY": "🇱🇾",
		"#MA": "🇲🇦",
		"#MAC": "🇲🇴",
		"#MAD": "🇲🇬",
		"#MAF": "🇲🇫",
		"#MAR": "🇲🇦",
		"#MAS": "🇲🇾",
		"#MAW": "🇲🇼",
		"#MAY": "🇾🇹",
		"#MC": "🇲🇨",
		"#MCO": "🇲🇨",
		"#MD": "🇲🇩",
		"#MDA": "🇲🇩",
		"#MDG": "🇲🇬",
		"#MDV": "🇲🇻",
		"#ME": "🇲🇪",
		"#MEX": "🇲🇽",
		"#MF": "🇲🇫",
		"#MG": "🇲🇬",
		"#MGL": "🇲🇳",
		"#MGO": "🇲🇪",
		"#MH": "🇲🇭",
		"#MHL": "🇲🇭",
		"#MK": "🇲🇰",
		"#MKD": "🇲🇰",
		"#ML": "🇲🇱",
		"#MLI": "🇲🇱",
		"#MLT": "🇲🇹",
		"#MM": "🇲🇲",
		"#MMR": "🇲🇲",
		"#MN": "🇲🇳",
		"#MNE": "🇲🇪",
		"#MNG": "🇲🇳",
		"#MNP": "🇲🇵",
		"#MNT": "🇲🇸",
		"#MO": "🇲🇴",
		"#MON": "🇲🇨",
		"#MOZ": "🇲🇿",
		"#MP": "🇲🇵",
		"#MQ": "🇲🇶",
		"#MR": "🇲🇷",
		"#MRI": "🇲🇺",
		"#MRT": "🇲🇶",
		"#MS": "🇲🇸",
		"#MSH": "🇲🇭",
		"#MSR": "🇲🇸",
		"#MT": "🇲🇹",
		"#MTN": "🇲🇷",
		"#MTQ": "🇲🇶",
		"#MU": "🇲🇺",
		"#MUS": "🇲🇺",
		"#MV": "🇲🇻",
		"#MW": "🇲🇼",
		"#MWI": "🇲🇼",
		"#MX": "🇲🇽",
		"#MY": "🇲🇾",
		"#MYA": "🇲🇲",
		"#MYS": "🇲🇾",
		"#MYT": "🇾🇹",
		"#MZ": "🇲🇿",
		"#NA": "🇳🇦",
		"#NAM": "🇳🇦",
		"#NC": "🇳🇨",
		"#NCA": "🇳🇮",
		"#NCD": "🇳🇨",
		"#NCL": "🇳🇨",
		"#NE": "🇳🇪",
		"#NED": "🇳🇱",
		"#NEP": "🇳🇵",
		"#NER": "🇳🇪",
		"#NF": "🇳🇫",
		"#NFI": "🇳🇫",
		"#NFK": "🇳🇫",
		"#NG": "🇳🇬",
		"#NGA": "🇳🇬",
		"#NGR": "🇳🇬",
		"#NI": "🇳🇮",
		"#NIC": "🇳🇮",
		"#NIG": "🇳🇪",
		"#NIU": "🇳🇺",
		"#NL": "🇳🇱",
		"#NLD": "🇳🇱",
		"#NMA": "🇲🇵",
		"#NMI": "🇲🇵",
		"#NO": "🇳🇴",
		"#NOR": "🇳🇴",
		"#NP": "🇳🇵",
		"#NPL": "🇳🇵",
		"#NR": "🇳🇷",
		"#NRU": "🇳🇷",
		"#NU": "🇳🇺",
		"#NZ": "🇳🇿",
		"#NZL": "🇳🇿",
		"#OM": "🇴🇲",
		"#OMA": "🇴🇲",
		"#OMN": "🇴🇲",
		"#PA": "🇵🇦",
		"#PAK": "🇵🇰",
		"#PAN": "🇵🇦",
		"#PAR": "🇵🇾",
		"#PCN": "🇵🇳",
		"#PE": "🇵🇪",
		"#PER": "🇵🇪",
		"#PF": "🇵🇫",
		"#PG": "🇵🇬",
		"#PH": "🇵🇭",
		"#PHI": "🇵🇭",
		"#PHL": "🇵🇭",
		"#PK": "🇵🇰",
		"#PL": "🇵🇱",
		"#PLE": "🇵🇸",
		"#PLU": "🇵🇼",
		"#PLW": "🇵🇼",
		"#PM": "🇵🇲",
		"#PN": "🇵🇳",
		"#PNG": "🇵🇬",
		"#POL": "🇵🇱",
		"#POR": "🇵🇹",
		"#PR": "🇵🇷",
		"#PRI": "🇵🇷",
		"#PRK": "🇰🇵",
		"#PRT": "🇵🇹",
		"#PRY": "🇵🇾",
		"#PS": "🇵🇸",
		"#PSE": "🇵🇸",
		"#PT": "🇵🇹",
		"#PUR": "🇵🇷",
		"#PW": "🇵🇼",
		"#PY": "🇵🇾",
		"#PYF": "🇵🇫",
		"#QA": "🇶🇦",
		"#QAT": "🇶🇦",
		"#RE": "🇷🇪",
		"#REU": "🇷🇪",
		"#RO": "🇷🇴",
		"#ROS": "🇦🇶",
		"#ROU": "🇷🇴",
		"#RS": "🇷🇸",
		"#RSA": "🇿🇦",
		"#RU": "🇷🇺",
		"#RUS": "🇷🇺",
		"#RW": "🇷🇼",
		"#RWA": "🇷🇼",
		"#SA": "🇸🇦",
		"#SAH": "🇪🇭",
		"#SAM": "🇼🇸",
		"#SAU": "🇸🇦",
		"#SB": "🇸🇧",
		"#SC": "🇸🇨",
		"#SCO": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
		"#SCT": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
		"#SD": "🇸🇩",
		"#SDN": "🇸🇩",
		"#SE": "🇸🇪",
		"#SEN": "🇸🇳",
		"#SEY": "🇸🇨",
		"#SG": "🇸🇬",
		"#SGP": "🇸🇬",
		"#SGS": "🇬🇸",
		"#SH": "🇸🇭",
		"#SHN": "🇸🇭",
		"#SI": "🇸🇮",
		"#SIN": "🇸🇬",
		"#SJ": "🇸🇯",
		"#SJM": "🇸🇯",
		"#SK": "🇸🇰",
		"#SKN": "🇰🇳",
		"#SL": "🇸🇱",
		"#SLB": "🇸🇧",
		"#SLE": "🇸🇱",
		"#SLO": "🇸🇮",
		"#SLV": "🇸🇻",
		"#SM": "🇸🇲",
		"#SMR": "🇸🇲",
		"#SN": "🇸🇳",
		"#SO": "🇸🇴",
		"#SOL": "🇸🇧",
		"#SOM": "🇸🇴",
		"#SPM": "🇵🇲",
		"#SR": "🇸🇷",
		"#SRB": "🇷🇸",
		"#SRI": "🇱🇰",
		"#SS": "🇸🇸",
		"#SSD": "🇸🇸",
		"#ST": "🇸🇹",
		"#STP": "🇸🇹",
		"#SUD": "🇸🇩",
		"#SUI": "🇨🇭",
		"#SUR": "🇸🇷",
		"#SV": "🇸🇻",
		"#SVK": "🇸🇰",
		"#SVN": "🇸🇮",
		"#SWE": "🇸🇪",
		"#SWZ": "🇸🇿",
		"#SX": "🇸🇽",
		"#SXM": "🇸🇽",
		"#SY": "🇸🇾",
		"#SYC": "🇸🇨",
		"#SYR": "🇸🇾",
		"#SZ": "🇸🇿",
		"#TA": "🇹🇦",
		"#TAH": "🇵🇫",
		"#TAN": "🇹🇿",
		"#TC": "🇹🇨",
		"#TCA": "🇹🇨",
		"#TCD": "🇹🇩",
		"#TD": "🇹🇩",
		"#TF": "🇹🇫",
		"#TG": "🇹🇬",
		"#TGA": "🇹🇴",
		"#TGO": "🇹🇬",
		"#TH": "🇹🇭",
		"#THA": "🇹🇭",
		"#TJ": "🇹🇯",
		"#TJK": "🇹🇯",
		"#TK": "🇹🇰",
		"#TKL": "🇹🇰",
		"#TKM": "🇹🇲",
		"#TKS": "🇹🇨",
		"#TL": "🇹🇱",
		"#TLS": "🇹🇱",
		"#TM": "🇹🇲",
		"#TN": "🇹🇳",
		"#TO": "🇹🇴",
		"#TOG": "🇹🇬",
		"#TON": "🇹🇴",
		"#TPE": "🇹🇼",
		"#TR": "🇹🇷",
		"#TRI": "🇹🇹",
		"#TT": "🇹🇹",
		"#TTO": "🇹🇹",
		"#TUN": "🇹🇳",
		"#TUR": "🇹🇷",
		"#TUV": "🇹🇻",
		"#TV": "🇹🇻",
		"#TW": "🇹🇼",
		"#TWN": "🇹🇼",
		"#TZ": "🇹🇿",
		"#TZA": "🇹🇿",
		"#UA": "🇺🇦",
		"#UAE": "🇦🇪",
		"#UG": "🇺🇬",
		"#UGA": "🇺🇬",
		"#UKR": "🇺🇦",
		"#UM": "🇺🇲",
		"#UMI": "🇺🇲",
		"#UN": "🇺🇳",
		"#URU": "🇺🇾",
		"#URY": "🇺🇾",
		"#US": "🇺🇸",
		"#USA": "🇺🇸",
		"#UY": "🇺🇾",
		"#UZ": "🇺🇿",
		"#UZB": "🇺🇿",
		"#VA": "🇻🇦",
		"#VAN": "🇻🇺",
		"#VAT": "🇻🇦",
		"#VC": "🇻🇨",
		"#VCT": "🇻🇨",
		"#VE": "🇻🇪",
		"#VEN": "🇻🇪",
		"#VG": "🇻🇬",
		"#VGB": "🇻🇬",
		"#VI": "🇻🇮",
		"#VIE": "🇻🇳",
		"#VIN": "🇻🇨",
		"#VIR": "🇻🇮",
		"#VN": "🇻🇳",
		"#VNM": "🇻🇳",
		"#VU": "🇻🇺",
		"#VUT": "🇻🇺",
		"#WAF": "🇼🇫",
		"#WAL": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
		"#WF": "🇼🇫",
		"#WLF": "🇼🇫",
		"#WLS": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
		"#WS": "🇼🇸",
		"#WSM": "🇼🇸",
		"#XK": "🇽🇰",
		"#YE": "🇾🇪",
		"#YEM": "🇾🇪",
		"#YT": "🇾🇹",
		"#ZA": "🇿🇦",
		"#ZAF": "🇿🇦",
		"#ZAM": "🇿🇲",
		"#ZIM": "🇿🇼",
		"#ZM": "🇿🇲",
		"#ZMB": "🇿🇲",
		"#ZW": "🇿🇼",
		"#ZWE": "🇿🇼",
		"#⃣": "#⃣",
		":#:": "#",
		":*:": "*",
		":+1:": "👍",
		":-1:": "👎",
		":0:": "0",
		":100:": "💯",
		":1234:": "🔢",
		":1:": "1",
		":2:": "2",
		":3:": "3",
		":4:": "4",
		":5:": "5",
		":6:": "6",
		":7:": "7",
		":8:": "8",
		":8ball:": "🎱",
		":9:": "9",
		":a:": "🅰",
		":ab:": "🆎",
		":abacus:": "🧮",
		":abc:": "🔤",
		":abcd:": "🔡",
		":ac:": "🇦🇨",
		":accept:": "🉑",
		":ad:": "🇦🇩",
		":adhesive_bandage:": "🩹",
		":admission_tickets:": "🎟",
		":adult:": "🧑",
		":ae:": "🇦🇪",
		":aerial_tramway:": "🚡",
		":af:": "🇦🇫",
		":ag:": "🇦🇬",
		":ai:": "🇦🇮",
		":airplane:": "✈",
		":airplane_arriving:": "🛬",
		":airplane_departure:": "🛫",
		":airplane_small:": "🛩",
		":al:": "🇦🇱",
		":alarm_clock:": "⏰",
		":alembic:": "⚗",
		":alien:": "👽",
		":am:": "🇦🇲",
		":ambulance:": "🚑",
		":amphora:": "🏺",
		":anchor:": "⚓",
		":angel:": "👼",
		":anger:": "💢",
		":anger_right:": "🗯",
		":angry:": "😠",
		":anguished:": "😧",
		":ant:": "🐜",
		":ao:": "🇦🇴",
		":apple:": "🍎",
		":aq:": "🇦🇶",
		":aquarius:": "♒",
		":ar:": "🇦🇷",
		":archery:": "🏹",
		":aries:": "♈",
		":arrow_backward:": "◀",
		":arrow_double_down:": "⏬",
		":arrow_double_up:": "⏫",
		":arrow_down:": "⬇",
		":arrow_down_small:": "🔽",
		":arrow_forward:": "▶",
		":arrow_heading_down:": "⤵",
		":arrow_heading_up:": "⤴",
		":arrow_left:": "⬅",
		":arrow_lower_left:": "↙",
		":arrow_lower_right:": "↘",
		":arrow_right:": "➡",
		":arrow_right_hook:": "↪",
		":arrow_up:": "⬆",
		":arrow_up_down:": "↕",
		":arrow_up_small:": "🔼",
		":arrow_upper_left:": "↖",
		":arrow_upper_right:": "↗",
		":arrows_clockwise:": "🔃",
		":arrows_counterclockwise:": "🔄",
		":art:": "🎨",
		":articulated_lorry:": "🚛",
		":as:": "🇦🇸",
		":asterisk:": "*⃣",
		":asterisk_symbol:": "*",
		":astonished:": "😲",
		":at:": "🇦🇹",
		":athletic_shoe:": "👟",
		":atm:": "🏧",
		":atom:": "⚛",
		":atom_symbol:": "⚛",
		":au:": "🇦🇺",
		":auto_rickshaw:": "🛺",
		":avocado:": "🥑",
		":aw:": "🇦🇼",
		":ax:": "🇦🇽",
		":axe:": "🪓",
		":az:": "🇦🇿",
		":b:": "🅱",
		":ba:": "🇧🇦",
		":baby:": "👶",
		":baby_bottle:": "🍼",
		":baby_chick:": "🐤",
		":baby_symbol:": "🚼",
		":back:": "🔙",
		":back_of_hand:": "🤚",
		":bacon:": "🥓",
		":badger:": "🦡",
		":badminton:": "🏸",
		":bagel:": "🥯",
		":baggage_claim:": "🛄",
		":baguette_bread:": "🥖",
		":bald:": "🦲",
		":ballet_shoes:": "🩰",
		":balloon:": "🎈",
		":ballot_box:": "🗳",
		":bamboo:": "🎍",
		":banana:": "🍌",
		":bangbang:": "‼",
		":banjo:": "🪕",
		":bank:": "🏦",
		":bar_chart:": "📊",
		":barber:": "💈",
		":baseball:": "⚾",
		":basket:": "🧺",
		":basketball:": "🏀",
		":basketball_player:": "⛹",
		":bat:": "🦇",
		":bath:": "🛀",
		":bathtub:": "🛁",
		":battery:": "🔋",
		":bb:": "🇧🇧",
		":bd:": "🇧🇩",
		":be:": "🇧🇪",
		":beach:": "🏖",
		":beach_umbrella:": "⛱",
		":beach_with_umbrella:": "🏖",
		":bear:": "🐻",
		":bearded_person:": "🧔",
		":bed:": "🛏",
		":bee:": "🐝",
		":beer:": "🍺",
		":beers:": "🍻",
		":beetle:": "🐞",
		":beginner:": "🔰",
		":bell:": "🔔",
		":bellhop:": "🛎",
		":bellhop_bell:": "🛎",
		":bento:": "🍱",
		":beverage_box:": "🧃",
		":bf:": "🇧🇫",
		":bg:": "🇧🇬",
		":bh:": "🇧🇭",
		":bi:": "🇧🇮",
		":bicyclist:": "🚴",
		":bike:": "🚲",
		":bikini:": "👙",
		":billed_cap:": "🧢",
		":biohazard:": "☣",
		":biohazard_sign:": "☣",
		":bird:": "🐦",
		":birthday:": "🎂",
		":bj:": "🇧🇯",
		":bl:": "🇧🇱",
		":black_circle:": "⚫",
		":black_heart:": "🖤",
		":black_joker:": "🃏",
		":black_large_square:": "⬛",
		":black_medium_square:": "◼",
		":black_nib:": "✒",
		":black_small_square:": "▪",
		":black_square_button:": "🔲",
		":blond-haired_man:": "👱♂",
		":blond-haired_woman:": "👱♀",
		":blond_haired_person:": "👱",
		":blossom:": "🌼",
		":blowfish:": "🐡",
		":blue_book:": "📘",
		":blue_car:": "🚙",
		":blue_circle:": "🔵",
		":blue_heart:": "💙",
		":blue_square:": "🟦",
		":blush:": "😊",
		":bm:": "🇧🇲",
		":bn:": "🇧🇳",
		":bo:": "🇧🇴",
		":boar:": "🐗",
		":bomb:": "💣",
		":bone:": "🦴",
		":book:": "📖",
		":bookmark:": "🔖",
		":bookmark_tabs:": "📑",
		":books:": "📚",
		":boom:": "💥",
		":boot:": "👢",
		":bouquet:": "💐",
		":bow:": "🙇",
		":bow_and_arrow:": "🏹",
		":bowl_with_spoon:": "🥣",
		":bowling:": "🎳",
		":boxing_glove:": "🥊",
		":boxing_gloves:": "🥊",
		":boy:": "👦",
		":bq:": "🇧🇶",
		":br:": "🇧🇷",
		":brain:": "🧠",
		":bread:": "🍞",
		":breast_feeding:": "🤱",
		":bricks:": "🧱",
		":bride_with_veil:": "👰",
		":bridge_at_night:": "🌉",
		":briefcase:": "💼",
		":briefs:": "🩲",
		":broccoli:": "🥦",
		":broken_heart:": "💔",
		":broom:": "🧹",
		":brown_circle:": "🟤",
		":brown_heart:": "🤎",
		":brown_square:": "🟫",
		":bs:": "🇧🇸",
		":bt:": "🇧🇹",
		":bug:": "🐛",
		":building_construction:": "🏗",
		":bulb:": "💡",
		":bullettrain_front:": "🚅",
		":bullettrain_side:": "🚄",
		":burrito:": "🌯",
		":bus:": "🚌",
		":busstop:": "🚏",
		":bust_in_silhouette:": "👤",
		":busts_in_silhouette:": "👥",
		":butter:": "🧈",
		":butterfly:": "🦋",
		":bv:": "🇧🇻",
		":bw:": "🇧🇼",
		":by:": "🇧🇾",
		":bz:": "🇧🇿",
		":ca:": "🇨🇦",
		":cactus:": "🌵",
		":cake:": "🍰",
		":calendar:": "📆",
		":calendar_spiral:": "🗓",
		":call_me:": "🤙",
		":call_me_hand:": "🤙",
		":calling:": "📲",
		":camel:": "🐫",
		":camera:": "📷",
		":camera_with_flash:": "📸",
		":camping:": "🏕",
		":cancer:": "♋",
		":candle:": "🕯",
		":candy:": "🍬",
		":canned_food:": "🥫",
		":canoe:": "🛶",
		":capital_abcd:": "🔠",
		":capricorn:": "♑",
		":card_box:": "🗃",
		":card_file_box:": "🗃",
		":card_index:": "📇",
		":card_index_dividers:": "🗂",
		":carousel_horse:": "🎠",
		":carrot:": "🥕",
		":cartwheel:": "🤸",
		":cat2:": "🐈",
		":cat:": "🐱",
		":cc:": "🇨🇨",
		":cd:": "💿",
		":cf:": "🇨🇫",
		":cg:": "🇨🇬",
		":ch:": "🇨🇭",
		":chains:": "⛓",
		":chair:": "🪑",
		":champagne:": "🍾",
		":champagne_glass:": "🥂",
		":chart:": "💹",
		":checkered_flag:": "🏁",
		":cheese:": "🧀",
		":cheese_wedge:": "🧀",
		":cherries:": "🍒",
		":cherry_blossom:": "🌸",
		":chess_pawn:": "♟",
		":chestnut:": "🌰",
		":chicken:": "🐔",
		":child:": "🧒",
		":children_crossing:": "🚸",
		":chile:": "🇨🇱",
		":chipmunk:": "🐿",
		":chocolate_bar:": "🍫",
		":chopsticks:": "🥢",
		":christmas_tree:": "🎄",
		":church:": "⛪",
		":ci:": "🇨🇮",
		":cinema:": "🎦",
		":circus_tent:": "🎪",
		":city_dusk:": "🌆",
		":city_sunrise:": "🌇",
		":city_sunset:": "🌇",
		":cityscape:": "🏙",
		":ck:": "🇨🇰",
		":cl:": "🆑",
		":clap:": "👏",
		":clapper:": "🎬",
		":classical_building:": "🏛",
		":clinking_glass:": "🥂",
		":clipboard:": "📋",
		":clock1030:": "🕥",
		":clock10:": "🕙",
		":clock1130:": "🕦",
		":clock11:": "🕚",
		":clock1230:": "🕧",
		":clock12:": "🕛",
		":clock130:": "🕜",
		":clock1:": "🕐",
		":clock230:": "🕝",
		":clock2:": "🕑",
		":clock330:": "🕞",
		":clock3:": "🕒",
		":clock430:": "🕟",
		":clock4:": "🕓",
		":clock530:": "🕠",
		":clock5:": "🕔",
		":clock630:": "🕡",
		":clock6:": "🕕",
		":clock730:": "🕢",
		":clock7:": "🕖",
		":clock830:": "🕣",
		":clock8:": "🕗",
		":clock930:": "🕤",
		":clock9:": "🕘",
		":clock:": "🕰",
		":closed_book:": "📕",
		":closed_umbrella:": "🌂",
		":cloud:": "☁",
		":cloud_lightning:": "🌩",
		":cloud_rain:": "🌧",
		":cloud_snow:": "🌨",
		":cloud_tornado:": "🌪",
		":cloud_with_lightning:": "🌩",
		":cloud_with_rain:": "🌧",
		":cloud_with_snow:": "🌨",
		":cloud_with_tornado:": "🌪",
		":clown:": "🤡",
		":clown_face:": "🤡",
		":clubs:": "♣",
		":cm:": "🇨🇲",
		":cn:": "🇨🇳",
		":co:": "🇨🇴",
		":coat:": "🧥",
		":cocktail:": "🍸",
		":coconut:": "🥥",
		":coffee:": "☕",
		":coffin:": "⚰",
		":cold_face:": "🥶",
		":cold_sweat:": "😰",
		":comet:": "☄",
		":compass:": "🧭",
		":compression:": "🗜",
		":computer:": "💻",
		":confetti_ball:": "🎊",
		":confounded:": "😖",
		":confused:": "😕",
		":congo:": "🇨🇩",
		":congratulations:": "㊗",
		":construction:": "🚧",
		":construction_site:": "🏗",
		":construction_worker:": "👷",
		":control_knobs:": "🎛",
		":convenience_store:": "🏪",
		":cookie:": "🍪",
		":cooking:": "🍳",
		":cool:": "🆒",
		":cop:": "👮",
		":copyright:": "©",
		":corn:": "🌽",
		":couch:": "🛋",
		":couch_and_lamp:": "🛋",
		":couple:": "👫",
		":couple_mm:": "👨❤👨",
		":couple_with_heart:": "💑",
		":couple_ww:": "👩❤👩",
		":couplekiss:": "💏",
		":couplekiss_mm:": "👨❤💋👨",
		":couplekiss_ww:": "👩❤💋👩",
		":cow2:": "🐄",
		":cow:": "🐮",
		":cowboy:": "🤠",
		":cp:": "🇨🇵",
		":cr:": "🇨🇷",
		":crab:": "🦀",
		":crayon:": "🖍",
		":credit_card:": "💳",
		":crescent_moon:": "🌙",
		":cricket:": "🦗",
		":cricket_bat_ball:": "🏏",
		":cricket_game:": "🏏",
		":crocodile:": "🐊",
		":croissant:": "🥐",
		":cross:": "✝",
		":crossed_flags:": "🎌",
		":crossed_swords:": "⚔",
		":crown:": "👑",
		":cruise_ship:": "🛳",
		":cry:": "😢",
		":crying_cat_face:": "😿",
		":crystal_ball:": "🔮",
		":cu:": "🇨🇺",
		":cucumber:": "🥒",
		":cup_with_straw:": "🥤",
		":cupcake:": "🧁",
		":cupid:": "💘",
		":curling_stone:": "🥌",
		":curly_haired:": "🦱",
		":curly_loop:": "➰",
		":currency_exchange:": "💱",
		":curry:": "🍛",
		":custard:": "🍮",
		":customs:": "🛃",
		":cut_of_meat:": "🥩",
		":cv:": "🇨🇻",
		":cw:": "🇨🇼",
		":cx:": "🇨🇽",
		":cy:": "🇨🇾",
		":cyclone:": "🌀",
		":cz:": "🇨🇿",
		":dagger:": "🗡",
		":dagger_knife:": "🗡",
		":dancer:": "💃",
		":dancers:": "👯",
		":dango:": "🍡",
		":dark_sunglasses:": "🕶",
		":dart:": "🎯",
		":dash:": "💨",
		":date:": "📅",
		":de:": "🇩🇪",
		":deaf_man:": "🧏♂",
		":deaf_person:": "🧏",
		":deaf_woman:": "🧏♀",
		":deciduous_tree:": "🌳",
		":deer:": "🦌",
		":department_store:": "🏬",
		":derelict_house_building:": "🏚",
		":desert:": "🏜",
		":desert_island:": "🏝",
		":desktop:": "🖥",
		":desktop_computer:": "🖥",
		":detective:": "🕵",
		":dg:": "🇩🇬",
		":diamonds:": "♦",
		":disappointed:": "😞",
		":disappointed_relieved:": "😥",
		":dividers:": "🗂",
		":diving_mask:": "🤿",
		":diya_lamp:": "🪔",
		":dizzy:": "💫",
		":dizzy_face:": "😵",
		":dj:": "🇩🇯",
		":dk:": "🇩🇰",
		":dm:": "🇩🇲",
		":dna:": "🧬",
		":do:": "🇩🇴",
		":do_not_litter:": "🚯",
		":dog2:": "🐕",
		":dog:": "🐶",
		":dollar:": "💵",
		":dolls:": "🎎",
		":dolphin:": "🐬",
		":door:": "🚪",
		":double_vertical_bar:": "⏸",
		":doughnut:": "🍩",
		":dove:": "🕊",
		":dove_of_peace:": "🕊",
		":dragon:": "🐉",
		":dragon_face:": "🐲",
		":dress:": "👗",
		":dromedary_camel:": "🐪",
		":drool:": "🤤",
		":drooling_face:": "🤤",
		":drop_of_blood:": "🩸",
		":droplet:": "💧",
		":drum:": "🥁",
		":drum_with_drumsticks:": "🥁",
		":duck:": "🦆",
		":dumpling:": "🥟",
		":dvd:": "📀",
		":dz:": "🇩🇿",
		":e-mail:": "📧",
		":ea:": "🇪🇦",
		":eagle:": "🦅",
		":ear:": "👂",
		":ear_of_rice:": "🌾",
		":earth_africa:": "🌍",
		":earth_americas:": "🌎",
		":earth_asia:": "🌏",
		":ec:": "🇪🇨",
		":ee:": "🇪🇪",
		":eg:": "🇪🇬",
		":egg:": "🥚",
		":eggplant:": "🍆",
		":eh:": "🇪🇭",
		":eight:": "8⃣",
		":eight_spoked_asterisk:": "✳",
		":eject:": "⏏",
		":eject_symbol:": "⏏",
		":electric_plug:": "🔌",
		":elephant:": "🐘",
		":elf:": "🧝",
		":email:": "📧",
		":end:": "🔚",
		":england:": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
		":envelope:": "✉",
		":envelope_with_arrow:": "📩",
		":er:": "🇪🇷",
		":es:": "🇪🇸",
		":et:": "🇪🇹",
		":eu:": "🇪🇺",
		":euro:": "💶",
		":european_castle:": "🏰",
		":european_post_office:": "🏤",
		":evergreen_tree:": "🌲",
		":exclamation:": "❗",
		":expecting_woman:": "🤰",
		":exploding_head:": "🤯",
		":expressionless:": "😑",
		":eye:": "👁",
		":eyeglasses:": "👓",
		":eyes:": "👀",
		":face_palm:": "🤦",
		":face_vomiting:": "🤮",
		":face_with_monocle:": "🧐",
		":face_with_thermometer:": "🤒",
		":facepalm:": "🤦",
		":factory:": "🏭",
		":fairy:": "🧚",
		":falafel:": "🧆",
		":fallen_leaf:": "🍂",
		":family:": "👪",
		":family_man_boy:": "👨👦",
		":family_man_girl:": "👨👧",
		":family_mmb:": "👨👨👦",
		":family_mmbb:": "👨👨👦👦",
		":family_mmg:": "👨👨👧",
		":family_mmgb:": "👨👨👧👦",
		":family_mmgg:": "👨👨👧👧",
		":family_mwbb:": "👨👩👦👦",
		":family_mwg:": "👨👩👧",
		":family_mwgb:": "👨👩👧👦",
		":family_mwgg:": "👨👩👧👧",
		":family_woman_boy:": "👩👦",
		":family_woman_girl:": "👩👧",
		":family_wwb:": "👩👩👦",
		":family_wwbb:": "👩👩👦👦",
		":family_wwg:": "👩👩👧",
		":family_wwgb:": "👩👩👧👦",
		":family_wwgg:": "👩👩👧👧",
		":fast_forward:": "⏩",
		":fax:": "📠",
		":fearful:": "😨",
		":feet:": "🐾",
		":female_sign:": "♀",
		":fencer:": "🤺",
		":fencing:": "🤺",
		":ferris_wheel:": "🎡",
		":ferry:": "⛴",
		":fi:": "🇫🇮",
		":field_hockey:": "🏑",
		":file_cabinet:": "🗄",
		":file_folder:": "📁",
		":film_frames:": "🎞",
		":film_projector:": "📽",
		":fingers_crossed:": "🤞",
		":fire:": "🔥",
		":fire_engine:": "🚒",
		":fire_extinguisher:": "🧯",
		":firecracker:": "🧨",
		":fireworks:": "🎆",
		":first_place:": "🥇",
		":first_place_medal:": "🥇",
		":first_quarter_moon:": "🌓",
		":fish:": "🐟",
		":fish_cake:": "🍥",
		":fist:": "✊",
		":five:": "5⃣",
		":fj:": "🇫🇯",
		":fk:": "🇫🇰",
		":flag_ac:": "🇦🇨",
		":flag_ad:": "🇦🇩",
		":flag_ae:": "🇦🇪",
		":flag_af:": "🇦🇫",
		":flag_ag:": "🇦🇬",
		":flag_ai:": "🇦🇮",
		":flag_al:": "🇦🇱",
		":flag_am:": "🇦🇲",
		":flag_ao:": "🇦🇴",
		":flag_aq:": "🇦🇶",
		":flag_ar:": "🇦🇷",
		":flag_as:": "🇦🇸",
		":flag_at:": "🇦🇹",
		":flag_au:": "🇦🇺",
		":flag_aw:": "🇦🇼",
		":flag_ax:": "🇦🇽",
		":flag_az:": "🇦🇿",
		":flag_ba:": "🇧🇦",
		":flag_bb:": "🇧🇧",
		":flag_bd:": "🇧🇩",
		":flag_be:": "🇧🇪",
		":flag_bf:": "🇧🇫",
		":flag_bg:": "🇧🇬",
		":flag_bh:": "🇧🇭",
		":flag_bi:": "🇧🇮",
		":flag_bj:": "🇧🇯",
		":flag_bl:": "🇧🇱",
		":flag_black:": "🏴",
		":flag_bm:": "🇧🇲",
		":flag_bn:": "🇧🇳",
		":flag_bo:": "🇧🇴",
		":flag_bq:": "🇧🇶",
		":flag_br:": "🇧🇷",
		":flag_bs:": "🇧🇸",
		":flag_bt:": "🇧🇹",
		":flag_bv:": "🇧🇻",
		":flag_bw:": "🇧🇼",
		":flag_by:": "🇧🇾",
		":flag_bz:": "🇧🇿",
		":flag_ca:": "🇨🇦",
		":flag_cc:": "🇨🇨",
		":flag_cd:": "🇨🇩",
		":flag_cf:": "🇨🇫",
		":flag_cg:": "🇨🇬",
		":flag_ch:": "🇨🇭",
		":flag_ci:": "🇨🇮",
		":flag_ck:": "🇨🇰",
		":flag_cl:": "🇨🇱",
		":flag_cm:": "🇨🇲",
		":flag_cn:": "🇨🇳",
		":flag_co:": "🇨🇴",
		":flag_cp:": "🇨🇵",
		":flag_cr:": "🇨🇷",
		":flag_cu:": "🇨🇺",
		":flag_cv:": "🇨🇻",
		":flag_cw:": "🇨🇼",
		":flag_cx:": "🇨🇽",
		":flag_cy:": "🇨🇾",
		":flag_cz:": "🇨🇿",
		":flag_de:": "🇩🇪",
		":flag_dg:": "🇩🇬",
		":flag_dj:": "🇩🇯",
		":flag_dk:": "🇩🇰",
		":flag_dm:": "🇩🇲",
		":flag_do:": "🇩🇴",
		":flag_dz:": "🇩🇿",
		":flag_ea:": "🇪🇦",
		":flag_ec:": "🇪🇨",
		":flag_ee:": "🇪🇪",
		":flag_eg:": "🇪🇬",
		":flag_eh:": "🇪🇭",
		":flag_er:": "🇪🇷",
		":flag_es:": "🇪🇸",
		":flag_et:": "🇪🇹",
		":flag_eu:": "🇪🇺",
		":flag_fi:": "🇫🇮",
		":flag_fj:": "🇫🇯",
		":flag_fk:": "🇫🇰",
		":flag_fm:": "🇫🇲",
		":flag_fo:": "🇫🇴",
		":flag_fr:": "🇫🇷",
		":flag_ga:": "🇬🇦",
		":flag_gb:": "🇬🇧",
		":flag_gd:": "🇬🇩",
		":flag_ge:": "🇬🇪",
		":flag_gf:": "🇬🇫",
		":flag_gg:": "🇬🇬",
		":flag_gh:": "🇬🇭",
		":flag_gi:": "🇬🇮",
		":flag_gl:": "🇬🇱",
		":flag_gm:": "🇬🇲",
		":flag_gn:": "🇬🇳",
		":flag_gp:": "🇬🇵",
		":flag_gq:": "🇬🇶",
		":flag_gr:": "🇬🇷",
		":flag_gs:": "🇬🇸",
		":flag_gt:": "🇬🇹",
		":flag_gu:": "🇬🇺",
		":flag_gw:": "🇬🇼",
		":flag_gy:": "🇬🇾",
		":flag_hk:": "🇭🇰",
		":flag_hm:": "🇭🇲",
		":flag_hn:": "🇭🇳",
		":flag_hr:": "🇭🇷",
		":flag_ht:": "🇭🇹",
		":flag_hu:": "🇭🇺",
		":flag_ic:": "🇮🇨",
		":flag_id:": "🇮🇩",
		":flag_ie:": "🇮🇪",
		":flag_il:": "🇮🇱",
		":flag_im:": "🇮🇲",
		":flag_in:": "🇮🇳",
		":flag_io:": "🇮🇴",
		":flag_iq:": "🇮🇶",
		":flag_ir:": "🇮🇷",
		":flag_is:": "🇮🇸",
		":flag_it:": "🇮🇹",
		":flag_je:": "🇯🇪",
		":flag_jm:": "🇯🇲",
		":flag_jo:": "🇯🇴",
		":flag_jp:": "🇯🇵",
		":flag_ke:": "🇰🇪",
		":flag_kg:": "🇰🇬",
		":flag_kh:": "🇰🇭",
		":flag_ki:": "🇰🇮",
		":flag_km:": "🇰🇲",
		":flag_kn:": "🇰🇳",
		":flag_kp:": "🇰🇵",
		":flag_kr:": "🇰🇷",
		":flag_kw:": "🇰🇼",
		":flag_ky:": "🇰🇾",
		":flag_kz:": "🇰🇿",
		":flag_la:": "🇱🇦",
		":flag_lb:": "🇱🇧",
		":flag_lc:": "🇱🇨",
		":flag_li:": "🇱🇮",
		":flag_lk:": "🇱🇰",
		":flag_lr:": "🇱🇷",
		":flag_ls:": "🇱🇸",
		":flag_lt:": "🇱🇹",
		":flag_lu:": "🇱🇺",
		":flag_lv:": "🇱🇻",
		":flag_ly:": "🇱🇾",
		":flag_ma:": "🇲🇦",
		":flag_mc:": "🇲🇨",
		":flag_md:": "🇲🇩",
		":flag_me:": "🇲🇪",
		":flag_mf:": "🇲🇫",
		":flag_mg:": "🇲🇬",
		":flag_mh:": "🇲🇭",
		":flag_mk:": "🇲🇰",
		":flag_ml:": "🇲🇱",
		":flag_mm:": "🇲🇲",
		":flag_mn:": "🇲🇳",
		":flag_mo:": "🇲🇴",
		":flag_mp:": "🇲🇵",
		":flag_mq:": "🇲🇶",
		":flag_mr:": "🇲🇷",
		":flag_ms:": "🇲🇸",
		":flag_mt:": "🇲🇹",
		":flag_mu:": "🇲🇺",
		":flag_mv:": "🇲🇻",
		":flag_mw:": "🇲🇼",
		":flag_mx:": "🇲🇽",
		":flag_my:": "🇲🇾",
		":flag_mz:": "🇲🇿",
		":flag_na:": "🇳🇦",
		":flag_nc:": "🇳🇨",
		":flag_ne:": "🇳🇪",
		":flag_nf:": "🇳🇫",
		":flag_ng:": "🇳🇬",
		":flag_ni:": "🇳🇮",
		":flag_nl:": "🇳🇱",
		":flag_no:": "🇳🇴",
		":flag_np:": "🇳🇵",
		":flag_nr:": "🇳🇷",
		":flag_nu:": "🇳🇺",
		":flag_nz:": "🇳🇿",
		":flag_om:": "🇴🇲",
		":flag_pa:": "🇵🇦",
		":flag_pe:": "🇵🇪",
		":flag_pf:": "🇵🇫",
		":flag_pg:": "🇵🇬",
		":flag_ph:": "🇵🇭",
		":flag_pk:": "🇵🇰",
		":flag_pl:": "🇵🇱",
		":flag_pm:": "🇵🇲",
		":flag_pn:": "🇵🇳",
		":flag_pr:": "🇵🇷",
		":flag_ps:": "🇵🇸",
		":flag_pt:": "🇵🇹",
		":flag_pw:": "🇵🇼",
		":flag_py:": "🇵🇾",
		":flag_qa:": "🇶🇦",
		":flag_re:": "🇷🇪",
		":flag_ro:": "🇷🇴",
		":flag_rs:": "🇷🇸",
		":flag_ru:": "🇷🇺",
		":flag_rw:": "🇷🇼",
		":flag_sa:": "🇸🇦",
		":flag_sb:": "🇸🇧",
		":flag_sc:": "🇸🇨",
		":flag_sd:": "🇸🇩",
		":flag_se:": "🇸🇪",
		":flag_sg:": "🇸🇬",
		":flag_sh:": "🇸🇭",
		":flag_si:": "🇸🇮",
		":flag_sj:": "🇸🇯",
		":flag_sk:": "🇸🇰",
		":flag_sl:": "🇸🇱",
		":flag_sm:": "🇸🇲",
		":flag_sn:": "🇸🇳",
		":flag_so:": "🇸🇴",
		":flag_sr:": "🇸🇷",
		":flag_ss:": "🇸🇸",
		":flag_st:": "🇸🇹",
		":flag_sv:": "🇸🇻",
		":flag_sx:": "🇸🇽",
		":flag_sy:": "🇸🇾",
		":flag_sz:": "🇸🇿",
		":flag_ta:": "🇹🇦",
		":flag_tc:": "🇹🇨",
		":flag_td:": "🇹🇩",
		":flag_tf:": "🇹🇫",
		":flag_tg:": "🇹🇬",
		":flag_th:": "🇹🇭",
		":flag_tj:": "🇹🇯",
		":flag_tk:": "🇹🇰",
		":flag_tl:": "🇹🇱",
		":flag_tm:": "🇹🇲",
		":flag_tn:": "🇹🇳",
		":flag_to:": "🇹🇴",
		":flag_tr:": "🇹🇷",
		":flag_tt:": "🇹🇹",
		":flag_tv:": "🇹🇻",
		":flag_tw:": "🇹🇼",
		":flag_tz:": "🇹🇿",
		":flag_ua:": "🇺🇦",
		":flag_ug:": "🇺🇬",
		":flag_um:": "🇺🇲",
		":flag_us:": "🇺🇸",
		":flag_uy:": "🇺🇾",
		":flag_uz:": "🇺🇿",
		":flag_va:": "🇻🇦",
		":flag_vc:": "🇻🇨",
		":flag_ve:": "🇻🇪",
		":flag_vg:": "🇻🇬",
		":flag_vi:": "🇻🇮",
		":flag_vn:": "🇻🇳",
		":flag_vu:": "🇻🇺",
		":flag_wf:": "🇼🇫",
		":flag_white:": "🏳",
		":flag_ws:": "🇼🇸",
		":flag_xk:": "🇽🇰",
		":flag_ye:": "🇾🇪",
		":flag_yt:": "🇾🇹",
		":flag_za:": "🇿🇦",
		":flag_zm:": "🇿🇲",
		":flag_zw:": "🇿🇼",
		":flags:": "🎏",
		":flame:": "🔥",
		":flamingo:": "🦩",
		":flan:": "🍮",
		":flashlight:": "🔦",
		":fleur-de-lis:": "⚜",
		":floppy_disk:": "💾",
		":flower_playing_cards:": "🎴",
		":flushed:": "😳",
		":flying_disc:": "🥏",
		":flying_saucer:": "🛸",
		":fm:": "🇫🇲",
		":fo:": "🇫🇴",
		":fog:": "🌫",
		":foggy:": "🌁",
		":foot:": "🦶",
		":football:": "🏈",
		":footprints:": "👣",
		":fork_and_knife:": "🍴",
		":fork_knife_plate:": "🍽",
		":fortune_cookie:": "🥠",
		":fountain:": "⛲",
		":four:": "4⃣",
		":four_leaf_clover:": "🍀",
		":fox:": "🦊",
		":fox_face:": "🦊",
		":fr:": "🇫🇷",
		":frame_photo:": "🖼",
		":frame_with_picture:": "🖼",
		":free:": "🆓",
		":french_bread:": "🥖",
		":fried_shrimp:": "🍤",
		":fries:": "🍟",
		":frog:": "🐸",
		":frowning2:": "☹",
		":frowning:": "😦",
		":fuelpump:": "⛽",
		":full_moon:": "🌕",
		":funeral_urn:": "⚱",
		":ga:": "🇬🇦",
		":game_die:": "🎲",
		":garlic:": "🧄",
		":gay_pride_flag:": "🏳🌈",
		":gb:": "🇬🇧",
		":gd:": "🇬🇩",
		":ge:": "🇬🇪",
		":gear:": "⚙",
		":gem:": "💎",
		":gemini:": "♊",
		":genie:": "🧞",
		":gf:": "🇬🇫",
		":gg:": "🇬🇬",
		":gh:": "🇬🇭",
		":ghost:": "👻",
		":gi:": "🇬🇮",
		":gift:": "🎁",
		":gift_heart:": "💝",
		":giraffe:": "🦒",
		":girl:": "👧",
		":gl:": "🇬🇱",
		":glass_of_milk:": "🥛",
		":globe_with_meridians:": "🌐",
		":gloves:": "🧤",
		":gm:": "🇬🇲",
		":gn:": "🇬🇳",
		":goal:": "🥅",
		":goal_net:": "🥅",
		":goat:": "🐐",
		":goggles:": "🥽",
		":golf:": "⛳",
		":golfer:": "🏌",
		":gorilla:": "🦍",
		":gp:": "🇬🇵",
		":gq:": "🇬🇶",
		":gr:": "🇬🇷",
		":grandma:": "👵",
		":grapes:": "🍇",
		":green_apple:": "🍏",
		":green_book:": "📗",
		":green_circle:": "🟢",
		":green_heart:": "💚",
		":green_salad:": "🥗",
		":green_square:": "🟩",
		":grey_exclamation:": "❕",
		":grey_question:": "❔",
		":grimacing:": "😬",
		":grin:": "😁",
		":grinning:": "😀",
		":gs:": "🇬🇸",
		":gt:": "🇬🇹",
		":gu:": "🇬🇺",
		":guard:": "💂",
		":guardsman:": "💂",
		":guide_dog:": "🦮",
		":guitar:": "🎸",
		":gun:": "🔫",
		":gw:": "🇬🇼",
		":gy:": "🇬🇾",
		":haircut:": "💇",
		":hamburger:": "🍔",
		":hammer:": "🔨",
		":hammer_and_pick:": "⚒",
		":hammer_and_wrench:": "🛠",
		":hammer_pick:": "⚒",
		":hamster:": "🐹",
		":hand_splayed:": "🖐",
		":handbag:": "👜",
		":handball:": "🤾",
		":handshake:": "🤝",
		":hankey:": "💩",
		":hash:": "#⃣",
		":hatched_chick:": "🐥",
		":hatching_chick:": "🐣",
		":head_bandage:": "🤕",
		":headphones:": "🎧",
		":hear_no_evil:": "🙉",
		":heart:": "❤",
		":heart_decoration:": "💟",
		":heart_exclamation:": "❣",
		":heart_eyes:": "😍",
		":heart_eyes_cat:": "😻",
		":heartbeat:": "💓",
		":heartpulse:": "💗",
		":hearts:": "♥",
		":heavy_check_mark:": "✔",
		":heavy_division_sign:": "➗",
		":heavy_dollar_sign:": "💲",
		":heavy_minus_sign:": "➖",
		":heavy_multiplication_x:": "✖",
		":heavy_plus_sign:": "➕",
		":hedgehog:": "🦔",
		":helicopter:": "🚁",
		":helmet_with_cross:": "⛑",
		":herb:": "🌿",
		":hibiscus:": "🌺",
		":high_brightness:": "🔆",
		":high_heel:": "👠",
		":hiking_boot:": "🥾",
		":hindu_temple:": "🛕",
		":hippopotamus:": "🦛",
		":hk:": "🇭🇰",
		":hm:": "🇭🇲",
		":hn:": "🇭🇳",
		":hockey:": "🏒",
		":hole:": "🕳",
		":homes:": "🏘",
		":honey_pot:": "🍯",
		":horse:": "🐴",
		":horse_racing:": "🏇",
		":hospital:": "🏥",
		":hot_dog:": "🌭",
		":hot_face:": "🥵",
		":hot_pepper:": "🌶",
		":hotdog:": "🌭",
		":hotel:": "🏨",
		":hotsprings:": "♨",
		":hourglass:": "⌛",
		":hourglass_flowing_sand:": "⏳",
		":house:": "🏠",
		":house_abandoned:": "🏚",
		":house_buildings:": "🏘",
		":house_with_garden:": "🏡",
		":hr:": "🇭🇷",
		":ht:": "🇭🇹",
		":hu:": "🇭🇺",
		":hugging:": "🤗",
		":hugging_face:": "🤗",
		":hushed:": "😯",
		":ic:": "🇮🇨",
		":ice_cream:": "🍨",
		":ice_cube:": "🧊",
		":ice_skate:": "⛸",
		":icecream:": "🍦",
		":id:": "🆔",
		":ideograph_advantage:": "🉐",
		":ie:": "🇮🇪",
		":il:": "🇮🇱",
		":im:": "🇮🇲",
		":imp:": "👿",
		":in:": "🇮🇳",
		":inbox_tray:": "📥",
		":incoming_envelope:": "📨",
		":indonesia:": "🇮🇩",
		":infinity:": "♾",
		":information_desk_person:": "💁",
		":information_source:": "ℹ",
		":innocent:": "😇",
		":interrobang:": "⁉",
		":io:": "🇮🇴",
		":iphone:": "📱",
		":iq:": "🇮🇶",
		":ir:": "🇮🇷",
		":is:": "🇮🇸",
		":island:": "🏝",
		":it:": "🇮🇹",
		":izakaya_lantern:": "🏮",
		":jack_o_lantern:": "🎃",
		":japan:": "🗾",
		":japanese_castle:": "🏯",
		":japanese_goblin:": "👺",
		":japanese_ogre:": "👹",
		":je:": "🇯🇪",
		":jeans:": "👖",
		":jigsaw:": "🧩",
		":jm:": "🇯🇲",
		":jo:": "🇯🇴",
		":joy:": "😂",
		":joy_cat:": "😹",
		":joystick:": "🕹",
		":jp:": "🇯🇵",
		":juggler:": "🤹",
		":juggling:": "🤹",
		":kaaba:": "🕋",
		":kangaroo:": "🦘",
		":karate_uniform:": "🥋",
		":kayak:": "🛶",
		":ke:": "🇰🇪",
		":key2:": "🗝",
		":key:": "🔑",
		":keyboard:": "⌨",
		":keycap_asterisk:": "*⃣",
		":keycap_ten:": "🔟",
		":kg:": "🇰🇬",
		":kh:": "🇰🇭",
		":ki:": "🇰🇮",
		":kimono:": "👘",
		":kiss:": "💋",
		":kiss_mm:": "👨❤💋👨",
		":kiss_woman_man:": "👩❤💋👨",
		":kiss_ww:": "👩❤💋👩",
		":kissing:": "😗",
		":kissing_cat:": "😽",
		":kissing_closed_eyes:": "😚",
		":kissing_heart:": "😘",
		":kissing_smiling_eyes:": "😙",
		":kite:": "🪁",
		":kiwi:": "🥝",
		":kiwifruit:": "🥝",
		":km:": "🇰🇲",
		":kn:": "🇰🇳",
		":knife:": "🔪",
		":koala:": "🐨",
		":koko:": "🈁",
		":kp:": "🇰🇵",
		":kr:": "🇰🇷",
		":kw:": "🇰🇼",
		":ky:": "🇰🇾",
		":kz:": "🇰🇿",
		":la:": "🇱🇦",
		":lab_coat:": "🥼",
		":label:": "🏷",
		":lacrosse:": "🥍",
		":large_blue_diamond:": "🔷",
		":large_orange_diamond:": "🔶",
		":last_quarter_moon:": "🌗",
		":latin_cross:": "✝",
		":laughing:": "😆",
		":lb:": "🇱🇧",
		":lc:": "🇱🇨",
		":leafy_green:": "🥬",
		":leaves:": "🍃",
		":ledger:": "📒",
		":left_facing_fist:": "🤛",
		":left_fist:": "🤛",
		":left_luggage:": "🛅",
		":left_right_arrow:": "↔",
		":left_speech_bubble:": "🗨",
		":leg:": "🦵",
		":lemon:": "🍋",
		":leo:": "♌",
		":leopard:": "🐆",
		":level_slider:": "🎚",
		":levitate:": "🕴",
		":li:": "🇱🇮",
		":liar:": "🤥",
		":libra:": "♎",
		":lifter:": "🏋",
		":light_rail:": "🚈",
		":link:": "🔗",
		":linked_paperclips:": "🖇",
		":lion:": "🦁",
		":lion_face:": "🦁",
		":lips:": "👄",
		":lipstick:": "💄",
		":lizard:": "🦎",
		":lk:": "🇱🇰",
		":llama:": "🦙",
		":lobster:": "🦞",
		":lock:": "🔒",
		":lollipop:": "🍭",
		":loop:": "➿",
		":loud_sound:": "🔊",
		":loudspeaker:": "📢",
		":love_hotel:": "🏩",
		":love_letter:": "💌",
		":love_you_gesture:": "🤟",
		":low_brightness:": "🔅",
		":lower_left_crayon:": "🖍",
		":lower_left_paintbrush:": "🖌",
		":lr:": "🇱🇷",
		":ls:": "🇱🇸",
		":lt:": "🇱🇹",
		":lu:": "🇱🇺",
		":luggage:": "🧳",
		":lv:": "🇱🇻",
		":ly:": "🇱🇾",
		":lying_face:": "🤥",
		":m:": "Ⓜ",
		":ma:": "🇲🇦",
		":mag:": "🔍",
		":mag_right:": "🔎",
		":mage:": "🧙",
		":magnet:": "🧲",
		":mahjong:": "🀄",
		":mailbox:": "📫",
		":mailbox_closed:": "📪",
		":mailbox_with_mail:": "📬",
		":male_dancer:": "🕺",
		":male_sign:": "♂",
		":man:": "👨",
		":man_artist:": "👨🎨",
		":man_astronaut:": "👨🚀",
		":man_bald:": "👨🦲",
		":man_biking:": "🚴♂",
		":man_bouncing_ball:": "⛹♂",
		":man_bowing:": "🙇♂",
		":man_cartwheeling:": "🤸♂",
		":man_climbing:": "🧗♂",
		":man_construction_worker:": "👷♂",
		":man_cook:": "👨🍳",
		":man_curly_haired:": "👨🦱",
		":man_dancing:": "🕺",
		":man_detective:": "🕵♂",
		":man_elf:": "🧝♂",
		":man_facepalming:": "🤦♂",
		":man_factory_worker:": "👨🏭",
		":man_fairy:": "🧚♂",
		":man_farmer:": "👨🌾",
		":man_firefighter:": "👨🚒",
		":man_frowning:": "🙍♂",
		":man_genie:": "🧞♂",
		":man_gesturing_no:": "🙅♂",
		":man_gesturing_ok:": "🙆♂",
		":man_getting_haircut:": "💇♂",
		":man_golfing:": "🏌♂",
		":man_guard:": "💂♂",
		":man_health_worker:": "👨⚕",
		":man_in_tuxedo:": "🤵",
		":man_judge:": "👨⚖",
		":man_juggling:": "🤹♂",
		":man_kneeling:": "🧎♂",
		":man_lifting_weights:": "🏋♂",
		":man_mage:": "🧙♂",
		":man_mechanic:": "👨🔧",
		":man_mountain_biking:": "🚵♂",
		":man_office_worker:": "👨💼",
		":man_pilot:": "👨✈",
		":man_playing_handball:": "🤾♂",
		":man_police_officer:": "👮♂",
		":man_pouting:": "🙎♂",
		":man_raising_hand:": "🙋♂",
		":man_red_haired:": "👨🦰",
		":man_rowing_boat:": "🚣♂",
		":man_running:": "🏃♂",
		":man_scientist:": "👨🔬",
		":man_shrugging:": "🤷♂",
		":man_singer:": "👨🎤",
		":man_standing:": "🧍♂",
		":man_student:": "👨🎓",
		":man_superhero:": "🦸♂",
		":man_supervillain:": "🦹♂",
		":man_surfing:": "🏄♂",
		":man_swimming:": "🏊♂",
		":man_teacher:": "👨🏫",
		":man_technologist:": "👨💻",
		":man_tipping_hand:": "💁♂",
		":man_vampire:": "🧛♂",
		":man_walking:": "🚶♂",
		":man_wearing_turban:": "👳♂",
		":man_white_haired:": "👨🦳",
		":man_with_turban:": "👳",
		":man_zombie:": "🧟♂",
		":mango:": "🥭",
		":mans_shoe:": "👞",
		":mantlepiece_clock:": "🕰",
		":manual_wheelchair:": "🦽",
		":map:": "🗺",
		":maple_leaf:": "🍁",
		":martial_arts_uniform:": "🥋",
		":mask:": "😷",
		":massage:": "💆",
		":mate:": "🧉",
		":mc:": "🇲🇨",
		":md:": "🇲🇩",
		":me:": "🇲🇪",
		":meat_on_bone:": "🍖",
		":mechanical_arm:": "🦾",
		":mechanical_leg:": "🦿",
		":medal:": "🏅",
		":medical_symbol:": "⚕",
		":mega:": "📣",
		":melon:": "🍈",
		":memo:": "📝",
		":men_wrestling:": "🤼♂",
		":menorah:": "🕎",
		":mens:": "🚹",
		":mermaid:": "🧜♀",
		":merman:": "🧜♂",
		":merperson:": "🧜",
		":metal:": "🤘",
		":metro:": "🚇",
		":mf:": "🇲🇫",
		":mg:": "🇲🇬",
		":mh:": "🇲🇭",
		":microbe:": "🦠",
		":microphone2:": "🎙",
		":microphone:": "🎤",
		":microscope:": "🔬",
		":middle_finger:": "🖕",
		":military_medal:": "🎖",
		":milk:": "🥛",
		":milky_way:": "🌌",
		":minibus:": "🚐",
		":minidisc:": "💽",
		":mk:": "🇲🇰",
		":ml:": "🇲🇱",
		":mm:": "🇲🇲",
		":mn:": "🇲🇳",
		":mo:": "🇲🇴",
		":mobile_phone_off:": "📴",
		":money_mouth:": "🤑",
		":money_mouth_face:": "🤑",
		":money_with_wings:": "💸",
		":moneybag:": "💰",
		":monkey:": "🐒",
		":monkey_face:": "🐵",
		":monorail:": "🚝",
		":moon_cake:": "🥮",
		":mortar_board:": "🎓",
		":mosque:": "🕌",
		":mosquito:": "🦟",
		":mother_christmas:": "🤶",
		":motor_scooter:": "🛵",
		":motorbike:": "🛵",
		":motorboat:": "🛥",
		":motorcycle:": "🏍",
		":motorized_wheelchair:": "🦼",
		":motorway:": "🛣",
		":mount_fuji:": "🗻",
		":mountain:": "⛰",
		":mountain_bicyclist:": "🚵",
		":mountain_cableway:": "🚠",
		":mountain_railway:": "🚞",
		":mountain_snow:": "🏔",
		":mouse2:": "🐁",
		":mouse:": "🐭",
		":mouse_three_button:": "🖱",
		":movie_camera:": "🎥",
		":moyai:": "🗿",
		":mp:": "🇲🇵",
		":mq:": "🇲🇶",
		":mr:": "🇲🇷",
		":mrs_claus:": "🤶",
		":ms:": "🇲🇸",
		":mt:": "🇲🇹",
		":mu:": "🇲🇺",
		":muscle:": "💪",
		":mushroom:": "🍄",
		":musical_keyboard:": "🎹",
		":musical_note:": "🎵",
		":musical_score:": "🎼",
		":mute:": "🔇",
		":mv:": "🇲🇻",
		":mw:": "🇲🇼",
		":mx:": "🇲🇽",
		":my:": "🇲🇾",
		":mz:": "🇲🇿",
		":na:": "🇳🇦",
		":nail_care:": "💅",
		":name_badge:": "📛",
		":national_park:": "🏞",
		":nauseated_face:": "🤢",
		":nazar_amulet:": "🧿",
		":nc:": "🇳🇨",
		":ne:": "🇳🇪",
		":necktie:": "👔",
		":nerd:": "🤓",
		":nerd_face:": "🤓",
		":neutral_face:": "😐",
		":new:": "🆕",
		":new_moon:": "🌑",
		":newspaper2:": "🗞",
		":newspaper:": "📰",
		":next_track:": "⏭",
		":nf:": "🇳🇫",
		":ng:": "🆖",
		":ni:": "🇳🇮",
		":nigeria:": "🇳🇬",
		":night_with_stars:": "🌃",
		":nine:": "9⃣",
		":nl:": "🇳🇱",
		":no:": "🇳🇴",
		":no_bell:": "🔕",
		":no_bicycles:": "🚳",
		":no_entry:": "⛔",
		":no_entry_sign:": "🚫",
		":no_good:": "🙅",
		":no_mobile_phones:": "📵",
		":no_mouth:": "😶",
		":no_pedestrians:": "🚷",
		":no_smoking:": "🚭",
		":non-potable_water:": "🚱",
		":nose:": "👃",
		":notebook:": "📓",
		":notepad_spiral:": "🗒",
		":notes:": "🎶",
		":np:": "🇳🇵",
		":nr:": "🇳🇷",
		":nu:": "🇳🇺",
		":nut_and_bolt:": "🔩",
		":nz:": "🇳🇿",
		":o2:": "🅾",
		":o:": "⭕",
		":ocean:": "🌊",
		":octagonal_sign:": "🛑",
		":octopus:": "🐙",
		":oden:": "🍢",
		":office:": "🏢",
		":oil:": "🛢",
		":oil_drum:": "🛢",
		":ok:": "🆗",
		":ok_hand:": "👌",
		":ok_woman:": "🙆",
		":old_key:": "🗝",
		":older_adult:": "🧓",
		":older_man:": "👴",
		":older_woman:": "👵",
		":om:": "🇴🇲",
		":om_symbol:": "🕉",
		":on:": "🔛",
		":oncoming_automobile:": "🚘",
		":oncoming_bus:": "🚍",
		":oncoming_police_car:": "🚔",
		":oncoming_taxi:": "🚖",
		":one:": "1⃣",
		":one_piece_swimsuit:": "🩱",
		":onion:": "🧅",
		":open_file_folder:": "📂",
		":open_hands:": "👐",
		":open_mouth:": "😮",
		":ophiuchus:": "⛎",
		":orange_book:": "📙",
		":orange_circle:": "🟠",
		":orange_heart:": "🧡",
		":orange_square:": "🟧",
		":orangutan:": "🦧",
		":orthodox_cross:": "☦",
		":otter:": "🦦",
		":outbox_tray:": "📤",
		":owl:": "🦉",
		":ox:": "🐂",
		":oyster:": "🦪",
		":pa:": "🇵🇦",
		":package:": "📦",
		":paella:": "🥘",
		":page_facing_up:": "📄",
		":page_with_curl:": "📃",
		":pager:": "📟",
		":paintbrush:": "🖌",
		":palm_tree:": "🌴",
		":palms_up_together:": "🤲",
		":pancakes:": "🥞",
		":panda_face:": "🐼",
		":paperclip:": "📎",
		":paperclips:": "🖇",
		":parachute:": "🪂",
		":park:": "🏞",
		":parking:": "🅿",
		":parrot:": "🦜",
		":part_alternation_mark:": "〽",
		":partly_sunny:": "⛅",
		":partying_face:": "🥳",
		":passenger_ship:": "🛳",
		":passport_control:": "🛂",
		":pause_button:": "⏸",
		":paw_prints:": "🐾",
		":pe:": "🇵🇪",
		":peace:": "☮",
		":peace_symbol:": "☮",
		":peach:": "🍑",
		":peacock:": "🦚",
		":peanuts:": "🥜",
		":pear:": "🍐",
		":pen_ballpoint:": "🖊",
		":pen_fountain:": "🖋",
		":pencil2:": "✏",
		":pencil:": "📝",
		":penguin:": "🐧",
		":pensive:": "😔",
		":people_holding_hands:": "🧑🤝🧑",
		":people_wrestling:": "🤼",
		":performing_arts:": "🎭",
		":persevere:": "😣",
		":person_biking:": "🚴",
		":person_bouncing_ball:": "⛹",
		":person_bowing:": "🙇",
		":person_climbing:": "🧗",
		":person_doing_cartwheel:": "🤸",
		":person_facepalming:": "🤦",
		":person_fencing:": "🤺",
		":person_frowning:": "🙍",
		":person_gesturing_no:": "🙅",
		":person_gesturing_ok:": "🙆",
		":person_getting_haircut:": "💇",
		":person_getting_massage:": "💆",
		":person_golfing:": "🏌",
		":person_juggling:": "🤹",
		":person_kneeling:": "🧎",
		":person_lifting_weights:": "🏋",
		":person_mountain_biking:": "🚵",
		":person_playing_handball:": "🤾",
		":person_pouting:": "🙎",
		":person_raising_hand:": "🙋",
		":person_rowing_boat:": "🚣",
		":person_running:": "🏃",
		":person_shrugging:": "🤷",
		":person_standing:": "🧍",
		":person_surfing:": "🏄",
		":person_swimming:": "🏊",
		":person_tipping_hand:": "💁",
		":person_walking:": "🚶",
		":person_wearing_turban:": "👳",
		":person_with_ball:": "⛹",
		":petri_dish:": "🧫",
		":pf:": "🇵🇫",
		":pg:": "🇵🇬",
		":ph:": "🇵🇭",
		":pick:": "⛏",
		":pie:": "🥧",
		":pig2:": "🐖",
		":pig:": "🐷",
		":pig_nose:": "🐽",
		":pill:": "💊",
		":pinching_hand:": "🤏",
		":pineapple:": "🍍",
		":ping_pong:": "🏓",
		":pirate_flag:": "🏴☠",
		":pisces:": "♓",
		":pizza:": "🍕",
		":pk:": "🇵🇰",
		":pl:": "🇵🇱",
		":place_of_worship:": "🛐",
		":play_pause:": "⏯",
		":pleading_face:": "🥺",
		":pm:": "🇵🇲",
		":pn:": "🇵🇳",
		":point_down:": "👇",
		":point_left:": "👈",
		":point_right:": "👉",
		":point_up:": "☝",
		":point_up_2:": "👆",
		":police_car:": "🚓",
		":police_officer:": "👮",
		":poo:": "💩",
		":poodle:": "🐩",
		":poop:": "💩",
		":popcorn:": "🍿",
		":post_office:": "🏣",
		":postal_horn:": "📯",
		":postbox:": "📮",
		":potable_water:": "🚰",
		":potato:": "🥔",
		":pouch:": "👝",
		":poultry_leg:": "🍗",
		":pound:": "💷",
		":pound_symbol:": "#",
		":pouting_cat:": "😾",
		":pr:": "🇵🇷",
		":pray:": "🙏",
		":prayer_beads:": "📿",
		":pregnant_woman:": "🤰",
		":pretzel:": "🥨",
		":previous_track:": "⏮",
		":prince:": "🤴",
		":princess:": "👸",
		":printer:": "🖨",
		":probing_cane:": "🦯",
		":projector:": "📽",
		":ps:": "🇵🇸",
		":pt:": "🇵🇹",
		":pudding:": "🍮",
		":punch:": "👊",
		":purple_circle:": "🟣",
		":purple_heart:": "💜",
		":purple_square:": "🟪",
		":purse:": "👛",
		":pushpin:": "📌",
		":pw:": "🇵🇼",
		":py:": "🇵🇾",
		":qa:": "🇶🇦",
		":question:": "❓",
		":rabbit2:": "🐇",
		":rabbit:": "🐰",
		":raccoon:": "🦝",
		":race_car:": "🏎",
		":racehorse:": "🐎",
		":racing_car:": "🏎",
		":racing_motorcycle:": "🏍",
		":radio:": "📻",
		":radio_button:": "🔘",
		":radioactive:": "☢",
		":radioactive_sign:": "☢",
		":rage:": "😡",
		":railroad_track:": "🛤",
		":railway_car:": "🚃",
		":railway_track:": "🛤",
		":rainbow:": "🌈",
		":rainbow_flag:": "🏳🌈",
		":raised_hand:": "✋",
		":raised_hands:": "🙌",
		":raising_hand:": "🙋",
		":ram:": "🐏",
		":ramen:": "🍜",
		":rat:": "🐀",
		":razor:": "🪒",
		":re:": "🇷🇪",
		":receipt:": "🧾",
		":record_button:": "⏺",
		":recycle:": "♻",
		":red_car:": "🚗",
		":red_circle:": "🔴",
		":red_envelope:": "🧧",
		":red_haired:": "🦰",
		":red_square:": "🟥",
		":registered:": "®",
		":relaxed:": "☺",
		":relieved:": "😌",
		":reminder_ribbon:": "🎗",
		":repeat:": "🔁",
		":repeat_one:": "🔂",
		":restroom:": "🚻",
		":revolving_hearts:": "💞",
		":rewind:": "⏪",
		":rhino:": "🦏",
		":rhinoceros:": "🦏",
		":ribbon:": "🎀",
		":rice:": "🍚",
		":rice_ball:": "🍙",
		":rice_cracker:": "🍘",
		":rice_scene:": "🎑",
		":right_anger_bubble:": "🗯",
		":right_facing_fist:": "🤜",
		":right_fist:": "🤜",
		":ring:": "💍",
		":ringed_planet:": "🪐",
		":ro:": "🇷🇴",
		":robot:": "🤖",
		":robot_face:": "🤖",
		":rocket:": "🚀",
		":rofl:": "🤣",
		":roll_of_paper:": "🧻",
		":rolled_up_newspaper:": "🗞",
		":roller_coaster:": "🎢",
		":rolling_eyes:": "🙄",
		":rooster:": "🐓",
		":rose:": "🌹",
		":rosette:": "🏵",
		":rotating_light:": "🚨",
		":round_pushpin:": "📍",
		":rowboat:": "🚣",
		":rs:": "🇷🇸",
		":ru:": "🇷🇺",
		":rugby_football:": "🏉",
		":runner:": "🏃",
		":rw:": "🇷🇼",
		":sa:": "🈂",
		":safety_pin:": "🧷",
		":safety_vest:": "🦺",
		":sagittarius:": "♐",
		":sailboat:": "⛵",
		":sake:": "🍶",
		":salad:": "🥗",
		":salt:": "🧂",
		":sandal:": "👡",
		":sandwich:": "🥪",
		":santa:": "🎅",
		":sari:": "🥻",
		":satellite:": "📡",
		":satellite_orbital:": "🛰",
		":satisfied:": "😆",
		":saudi:": "🇸🇦",
		":saudiarabia:": "🇸🇦",
		":sauropod:": "🦕",
		":saxophone:": "🎷",
		":sb:": "🇸🇧",
		":sc:": "🇸🇨",
		":scales:": "⚖",
		":scarf:": "🧣",
		":school:": "🏫",
		":school_satchel:": "🎒",
		":scissors:": "✂",
		":scooter:": "🛴",
		":scorpion:": "🦂",
		":scorpius:": "♏",
		":scotland:": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
		":scream:": "😱",
		":scream_cat:": "🙀",
		":scroll:": "📜",
		":sd:": "🇸🇩",
		":se:": "🇸🇪",
		":seat:": "💺",
		":second_place:": "🥈",
		":second_place_medal:": "🥈",
		":secret:": "㊙",
		":see_no_evil:": "🙈",
		":seedling:": "🌱",
		":selfie:": "🤳",
		":service_dog:": "🐕🦺",
		":seven:": "7⃣",
		":sg:": "🇸🇬",
		":sh:": "🇸🇭",
		":shaking_hands:": "🤝",
		":shamrock:": "☘",
		":shark:": "🦈",
		":shaved_ice:": "🍧",
		":sheep:": "🐑",
		":shell:": "🐚",
		":shelled_peanut:": "🥜",
		":shield:": "🛡",
		":shinto_shrine:": "⛩",
		":ship:": "🚢",
		":shirt:": "👕",
		":shit:": "💩",
		":shopping_bags:": "🛍",
		":shopping_cart:": "🛒",
		":shopping_trolley:": "🛒",
		":shorts:": "🩳",
		":shower:": "🚿",
		":shrimp:": "🦐",
		":shrug:": "🤷",
		":shushing_face:": "🤫",
		":si:": "🇸🇮",
		":sick:": "🤢",
		":signal_strength:": "📶",
		":six:": "6⃣",
		":six_pointed_star:": "🔯",
		":sj:": "🇸🇯",
		":sk:": "🇸🇰",
		":skateboard:": "🛹",
		":skeleton:": "💀",
		":ski:": "🎿",
		":skier:": "⛷",
		":skull:": "💀",
		":skull_and_crossbones:": "☠",
		":skull_crossbones:": "☠",
		":skunk:": "🦨",
		":sl:": "🇸🇱",
		":sled:": "🛷",
		":sleeping:": "😴",
		":sleeping_accommodation:": "🛌",
		":sleepy:": "😪",
		":sleuth_or_spy:": "🕵",
		":slight_frown:": "🙁",
		":slight_smile:": "🙂",
		":slightly_frowning_face:": "🙁",
		":slightly_smiling_face:": "🙂",
		":slot_machine:": "🎰",
		":sloth:": "🦥",
		":sm:": "🇸🇲",
		":small_airplane:": "🛩",
		":small_blue_diamond:": "🔹",
		":small_orange_diamond:": "🔸",
		":small_red_triangle:": "🔺",
		":smile:": "😄",
		":smile_cat:": "😸",
		":smiley:": "😃",
		":smiley_cat:": "😺",
		":smiling_imp:": "😈",
		":smirk:": "😏",
		":smirk_cat:": "😼",
		":smoking:": "🚬",
		":sn:": "🇸🇳",
		":snail:": "🐌",
		":snake:": "🐍",
		":sneeze:": "🤧",
		":sneezing_face:": "🤧",
		":snow_capped_mountain:": "🏔",
		":snowboarder:": "🏂",
		":snowflake:": "❄",
		":snowman2:": "☃",
		":snowman:": "⛄",
		":so:": "🇸🇴",
		":soap:": "🧼",
		":sob:": "😭",
		":soccer:": "⚽",
		":socks:": "🧦",
		":softball:": "🥎",
		":soon:": "🔜",
		":sos:": "🆘",
		":sound:": "🔉",
		":space_invader:": "👾",
		":spades:": "♠",
		":spaghetti:": "🍝",
		":sparkle:": "❇",
		":sparkler:": "🎇",
		":sparkles:": "✨",
		":sparkling_heart:": "💖",
		":speak_no_evil:": "🙊",
		":speaker:": "🔈",
		":speaking_head:": "🗣",
		":speech_balloon:": "💬",
		":speech_left:": "🗨",
		":speedboat:": "🚤",
		":spider:": "🕷",
		":spider_web:": "🕸",
		":spiral_calendar_pad:": "🗓",
		":spiral_note_pad:": "🗒",
		":sponge:": "🧽",
		":spoon:": "🥄",
		":sports_medal:": "🏅",
		":spy:": "🕵",
		":squeeze_bottle:": "🧴",
		":squid:": "🦑",
		":sr:": "🇸🇷",
		":ss:": "🇸🇸",
		":st:": "🇸🇹",
		":stadium:": "🏟",
		":star2:": "🌟",
		":star:": "⭐",
		":star_and_crescent:": "☪",
		":star_of_david:": "✡",
		":star_struck:": "🤩",
		":stars:": "🌠",
		":station:": "🚉",
		":statue_of_liberty:": "🗽",
		":steam_locomotive:": "🚂",
		":stethoscope:": "🩺",
		":stew:": "🍲",
		":stop_button:": "⏹",
		":stop_sign:": "🛑",
		":stopwatch:": "⏱",
		":straight_ruler:": "📏",
		":strawberry:": "🍓",
		":stuck_out_tongue:": "😛",
		":studio_microphone:": "🎙",
		":stuffed_flatbread:": "🥙",
		":stuffed_pita:": "🥙",
		":sun_with_face:": "🌞",
		":sunflower:": "🌻",
		":sunglasses:": "😎",
		":sunny:": "☀",
		":sunrise:": "🌅",
		":sunrise_over_mountains:": "🌄",
		":superhero:": "🦸",
		":supervillain:": "🦹",
		":surfer:": "🏄",
		":sushi:": "🍣",
		":suspension_railway:": "🚟",
		":sv:": "🇸🇻",
		":swan:": "🦢",
		":sweat:": "😓",
		":sweat_drops:": "💦",
		":sweat_smile:": "😅",
		":sweet_potato:": "🍠",
		":swimmer:": "🏊",
		":sx:": "🇸🇽",
		":sy:": "🇸🇾",
		":symbols:": "🔣",
		":synagogue:": "🕍",
		":syringe:": "💉",
		":sz:": "🇸🇿",
		":t_rex:": "🦖",
		":ta:": "🇹🇦",
		":table_tennis:": "🏓",
		":taco:": "🌮",
		":tada:": "🎉",
		":takeout_box:": "🥡",
		":tanabata_tree:": "🎋",
		":tangerine:": "🍊",
		":taurus:": "♉",
		":taxi:": "🚕",
		":tc:": "🇹🇨",
		":td:": "🇹🇩",
		":tea:": "🍵",
		":teddy_bear:": "🧸",
		":telephone:": "☎",
		":telephone_receiver:": "📞",
		":telescope:": "🔭",
		":tennis:": "🎾",
		":tent:": "⛺",
		":test_tube:": "🧪",
		":tf:": "🇹🇫",
		":tg:": "🇹🇬",
		":th:": "🇹🇭",
		":thermometer:": "🌡",
		":thermometer_face:": "🤒",
		":thinking:": "🤔",
		":thinking_face:": "🤔",
		":third_place:": "🥉",
		":third_place_medal:": "🥉",
		":thought_balloon:": "💭",
		":thread:": "🧵",
		":three:": "3⃣",
		":three_button_mouse:": "🖱",
		":thumbdown:": "👎",
		":thumbsdown:": "👎",
		":thumbsup:": "👍",
		":thumbup:": "👍",
		":thunder_cloud_rain:": "⛈",
		":ticket:": "🎫",
		":tickets:": "🎟",
		":tiger2:": "🐅",
		":tiger:": "🐯",
		":timer:": "⏲",
		":timer_clock:": "⏲",
		":tired_face:": "😫",
		":tj:": "🇹🇯",
		":tk:": "🇹🇰",
		":tl:": "🇹🇱",
		":tm:": "™",
		":tn:": "🇹🇳",
		":to:": "🇹🇴",
		":toilet:": "🚽",
		":tokyo_tower:": "🗼",
		":tomato:": "🍅",
		":tongue:": "👅",
		":toolbox:": "🧰",
		":tools:": "🛠",
		":tooth:": "🦷",
		":top:": "🔝",
		":tophat:": "🎩",
		":tr:": "🇹🇷",
		":track_next:": "⏭",
		":track_previous:": "⏮",
		":trackball:": "🖲",
		":tractor:": "🚜",
		":traffic_light:": "🚥",
		":train2:": "🚆",
		":train:": "🚋",
		":tram:": "🚊",
		":triangular_ruler:": "📐",
		":trident:": "🔱",
		":triumph:": "😤",
		":trolleybus:": "🚎",
		":trophy:": "🏆",
		":tropical_drink:": "🍹",
		":tropical_fish:": "🐠",
		":truck:": "🚚",
		":trumpet:": "🎺",
		":tt:": "🇹🇹",
		":tulip:": "🌷",
		":tumbler_glass:": "🥃",
		":turkey:": "🦃",
		":turkmenistan:": "🇹🇲",
		":turtle:": "🐢",
		":tuvalu:": "🇹🇻",
		":tv:": "📺",
		":tw:": "🇹🇼",
		":twisted_rightwards_arrows:": "🔀",
		":two:": "2⃣",
		":two_hearts:": "💕",
		":tz:": "🇹🇿",
		":u5272:": "🈹",
		":u5408:": "🈴",
		":u55b6:": "🈺",
		":u6307:": "🈯",
		":u6708:": "🈷",
		":u6709:": "🈶",
		":u6e80:": "🈵",
		":u7121:": "🈚",
		":u7533:": "🈸",
		":u7981:": "🈲",
		":u7a7a:": "🈳",
		":ua:": "🇺🇦",
		":ug:": "🇺🇬",
		":um:": "🇺🇲",
		":umbrella2:": "☂",
		":umbrella:": "☔",
		":umbrella_on_ground:": "⛱",
		":unamused:": "😒",
		":underage:": "🔞",
		":unicorn:": "🦄",
		":unicorn_face:": "🦄",
		":united_nations:": "🇺🇳",
		":unlock:": "🔓",
		":up:": "🆙",
		":upside_down:": "🙃",
		":upside_down_face:": "🙃",
		":urn:": "⚱",
		":us:": "🇺🇸",
		":uy:": "🇺🇾",
		":uz:": "🇺🇿",
		":v:": "✌",
		":va:": "🇻🇦",
		":vampire:": "🧛",
		":vc:": "🇻🇨",
		":ve:": "🇻🇪",
		":vertical_traffic_light:": "🚦",
		":vg:": "🇻🇬",
		":vhs:": "📼",
		":vi:": "🇻🇮",
		":vibration_mode:": "📳",
		":video_camera:": "📹",
		":video_game:": "🎮",
		":violin:": "🎻",
		":virgo:": "♍",
		":vn:": "🇻🇳",
		":volcano:": "🌋",
		":volleyball:": "🏐",
		":vs:": "🆚",
		":vu:": "🇻🇺",
		":vulcan:": "🖖",
		":waffle:": "🧇",
		":wales:": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
		":walking:": "🚶",
		":waning_crescent_moon:": "🌘",
		":waning_gibbous_moon:": "🌖",
		":warning:": "⚠",
		":wastebasket:": "🗑",
		":watch:": "⌚",
		":water_buffalo:": "🐃",
		":water_polo:": "🤽",
		":watermelon:": "🍉",
		":wave:": "👋",
		":waving_black_flag:": "🏴",
		":waving_white_flag:": "🏳",
		":wavy_dash:": "〰",
		":waxing_crescent_moon:": "🌒",
		":waxing_gibbous_moon:": "🌔",
		":wc:": "🚾",
		":weary:": "😩",
		":wedding:": "💒",
		":weight_lifter:": "🏋",
		":wf:": "🇼🇫",
		":whale2:": "🐋",
		":whale:": "🐳",
		":wheel_of_dharma:": "☸",
		":wheelchair:": "♿",
		":whisky:": "🥃",
		":white_check_mark:": "✅",
		":white_circle:": "⚪",
		":white_flower:": "💮",
		":white_frowning_face:": "☹",
		":white_haired:": "🦳",
		":white_heart:": "🤍",
		":white_large_square:": "⬜",
		":white_medium_square:": "◻",
		":white_small_square:": "▫",
		":white_square_button:": "🔳",
		":white_sun_cloud:": "🌥",
		":wilted_flower:": "🥀",
		":wilted_rose:": "🥀",
		":wind_blowing_face:": "🌬",
		":wind_chime:": "🎐",
		":wine_glass:": "🍷",
		":wink:": "😉",
		":wolf:": "🐺",
		":woman:": "👩",
		":woman_artist:": "👩🎨",
		":woman_astronaut:": "👩🚀",
		":woman_bald:": "👩🦲",
		":woman_biking:": "🚴♀",
		":woman_bouncing_ball:": "⛹♀",
		":woman_bowing:": "🙇♀",
		":woman_cartwheeling:": "🤸♀",
		":woman_climbing:": "🧗♀",
		":woman_construction_worker:": "👷♀",
		":woman_cook:": "👩🍳",
		":woman_curly_haired:": "👩🦱",
		":woman_detective:": "🕵♀",
		":woman_elf:": "🧝♀",
		":woman_facepalming:": "🤦♀",
		":woman_factory_worker:": "👩🏭",
		":woman_fairy:": "🧚♀",
		":woman_farmer:": "👩🌾",
		":woman_firefighter:": "👩🚒",
		":woman_frowning:": "🙍♀",
		":woman_genie:": "🧞♀",
		":woman_gesturing_no:": "🙅♀",
		":woman_gesturing_ok:": "🙆♀",
		":woman_getting_haircut:": "💇♀",
		":woman_golfing:": "🏌♀",
		":woman_guard:": "💂♀",
		":woman_health_worker:": "👩⚕",
		":woman_judge:": "👩⚖",
		":woman_juggling:": "🤹♀",
		":woman_kneeling:": "🧎♀",
		":woman_lifting_weights:": "🏋♀",
		":woman_mage:": "🧙♀",
		":woman_mechanic:": "👩🔧",
		":woman_mountain_biking:": "🚵♀",
		":woman_office_worker:": "👩💼",
		":woman_pilot:": "👩✈",
		":woman_playing_handball:": "🤾♀",
		":woman_police_officer:": "👮♀",
		":woman_pouting:": "🙎♀",
		":woman_raising_hand:": "🙋♀",
		":woman_red_haired:": "👩🦰",
		":woman_rowing_boat:": "🚣♀",
		":woman_running:": "🏃♀",
		":woman_scientist:": "👩🔬",
		":woman_shrugging:": "🤷♀",
		":woman_singer:": "👩🎤",
		":woman_standing:": "🧍♀",
		":woman_student:": "👩🎓",
		":woman_superhero:": "🦸♀",
		":woman_supervillain:": "🦹♀",
		":woman_surfing:": "🏄♀",
		":woman_swimming:": "🏊♀",
		":woman_teacher:": "👩🏫",
		":woman_technologist:": "👩💻",
		":woman_tipping_hand:": "💁♀",
		":woman_vampire:": "🧛♀",
		":woman_walking:": "🚶♀",
		":woman_wearing_turban:": "👳♀",
		":woman_white_haired:": "👩🦳",
		":woman_with_headscarf:": "🧕",
		":woman_zombie:": "🧟♀",
		":womans_clothes:": "👚",
		":womans_flat_shoe:": "🥿",
		":womans_hat:": "👒",
		":women_wrestling:": "🤼♀",
		":womens:": "🚺",
		":woozy_face:": "🥴",
		":world_map:": "🗺",
		":worried:": "😟",
		":worship_symbol:": "🛐",
		":wrench:": "🔧",
		":wrestlers:": "🤼",
		":wrestling:": "🤼",
		":writing_hand:": "✍",
		":ws:": "🇼🇸",
		":x:": "❌",
		":xk:": "🇽🇰",
		":yarn:": "🧶",
		":yawning_face:": "🥱",
		":ye:": "🇾🇪",
		":yellow_circle:": "🟡",
		":yellow_heart:": "💛",
		":yellow_square:": "🟨",
		":yen:": "💴",
		":yin_yang:": "☯",
		":yo_yo:": "🪀",
		":yt:": "🇾🇹",
		":yum:": "😋",
		":za:": "🇿🇦",
		":zany_face:": "🤪",
		":zap:": "⚡",
		":zebra:": "🦓",
		":zero:": "0⃣",
		":zipper_mouth:": "🤐",
		":zipper_mouth_face:": "🤐",
		":zm:": "🇿🇲",
		":zombie:": "🧟",
		":zw:": "🇿🇼",
		":zzz:": "💤"
	};

	const constructorsTracked = [Object, Array, Map, Set, undefined /** Object.create(null) */];

	/**
	 * Returns `true` when `object` can't be made mutable.
	 *
	 * @param {any} target
	 */
	const isMutationBlacklisted = target => constructorsBlacklist.has(target.constructor) || isGeneratorFunction(target);
	const constructorsBlacklist = new Set(Object.getOwnPropertyNames(window$1).map(value => window$1[value]));
	constructorsTracked.forEach(value => constructorsBlacklist.delete(value));
	const prototypeBlacklist = new Set([...constructorsTracked, ...constructorsBlacklist]);

	/**
	 * Returns `true` when prototype is blacklisted. We won't gather
	 * getters/setters from the object.
	 *
	 * @param {any} target
	 */
	const isPrototypeBlacklisted = target => prototypeBlacklist.has(target.constructor) || isGeneratorFunction(target);

	/**
	 * Returns `true` when `key` is blacklisted. It won't be signalified.
	 *
	 * @param {PropertyKey} key
	 */
	const isKeyBlacklisted = key => keyBlacklist.has(key);
	/** @type {Set<PropertyKey>} */
	const keyBlacklist = new Set(['constructor', '__proto__', /** @ts-expect-error non-sense */
	...getOwnValues(Symbol$1).filter(isSymbol)]);

	/**
	 * It returns all property descriptors for `target`.
	 *
	 * It checks for getters/setters of the prototype chain. The idea is
	 * that if the prototype provides some getters/setters, then, we
	 * should be able to track them too.
	 */
	function getPropertyDescriptors(target) {
	  // blacklisted by default
	  if (isMutationBlacklisted(target)) {
	    return nothing;
	  }
	  let proto = getPrototypeOf(target);

	  /** Walk the prototype chain to gather getters/setters */
	  const protos = [target];
	  while (proto && !isPrototypeBlacklisted(proto)) {
	    protos.push(proto);
	    proto = getPrototypeOf(proto);
	  }

	  /** Cocktail */
	  const descriptors = empty();
	  for (const proto of protos.reverse()) {
	    assign(descriptors, getOwnPropertyDescriptors(proto));
	  }
	  return descriptors;
	}

	/** Tracker */

	const [getTracker] = weakStore();
	const createTracker = () => new Track(false);

	/**
	 * Returns a tracker for an object. A tracker is unique per object,
	 * always the same tracker for the same object. Uses null-proto object
	 * storage — number keys coerce to strings (matches array index
	 * semantics).
	 *
	 * For handler-private trackers that need identity-keyed storage
	 * (Map/Set per-key reactivity), instantiate directly via `new
	 * Track(true)`.
	 *
	 * @template T
	 * @param {T} target
	 * @returns {Track}
	 */
	const tracker = target => getTracker(target, createTracker);

	/** Track Class */

	const equalsIs = {
	  equals: is
	};
	const equalsNope = {
	  equals: false
	};
	const equalsDefault = undefined;
	const Values = Symbol$1('Values');
	const Keys = Symbol$1('Keys');
	const Value = 'Value';
	const Key = 'Key';
	const isUndefined = 'isUndefined';
	const Getter = 'Getter';
	const kinds = {
	  __proto__: null,
	  [Value]: undefined,
	  [Key]: undefined,
	  [isUndefined]: undefined,
	  [Getter]: undefined
	};

	/**
	 * Track class — per-key reactive signal store.
	 *
	 * Use the `tracker(target)` factory for trackers memoized per target
	 * (typical case: main proxy tracker). Instantiate directly via `new
	 * Track(identity)` when the tracker is handler-private and should NOT
	 * be memoized — e.g. Map/Set's `trackSlot`.
	 */
	class Track {
	  // id = Date.now()

	  /**
	   * Per-key signal storage.
	   *
	   * - Default (`isIdentity=false`): null-proto object. Numbers
	   *   auto-coerce to strings, matching array index semantics.
	   * - Identity (`isIdentity=true`): `Map`. Keys preserved by identity —
	   *   required for Map/Set where object keys, number-vs-string, and
	   *   boolean-vs-string distinctions matter.
	   */
	  #props;
	  isIdentity;
	  constructor(identity) {
	    this.isIdentity = !!identity;
	    this.#props = identity ? new Map() : empty();
	  }
	  #prop(kind, key, value, equalsType) {
	    let entry;
	    if (this.isIdentity) {
	      entry = this.#props.get(key);
	      if (!entry) {
	        entry = create$1(kinds);
	        this.#props.set(key, entry);
	      }
	    } else {
	      if (!(key in this.#props)) {
	        this.#props[key] = create$1(kinds);
	      }
	      entry = this.#props[key];
	    }
	    if (entry[kind] === undefined) {
	      entry[kind] = signal(value, equalsType);
	    }
	    return entry[kind];
	  }

	  /**
	   * Keeps track of: a value for a `key`
	   *
	   * @param {PropertyKey} key
	   * @param {any} value
	   * @returns {any} Value
	   */
	  valueRead(key, value) {
	    /** Do not write to the signal here it will cause a loop */
	    this.#prop(Value, key, value, equalsIs).read();
	    return value;
	  }
	  /**
	   * Keeps track of: a value for a `key`
	   *
	   * @param {PropertyKey} key
	   * @param {any} value
	   * @returns {boolean} Indicating if the value changed
	   */
	  valueWrite(key, value) {
	    /**
	     * Write the value because tracking will re-execute when this
	     * value changes
	     */
	    return this.#prop(Value, key, undefined, equalsIs).write(value);
	  }

	  /**
	   * Keeps track of: if a `key` is in an object.
	   *
	   * @param {PropertyKey} key
	   * @param {boolean} value - Indicating if the property is `in`
	   */
	  keyRead(key, value) {
	    this.#prop(Key, key, value, equalsDefault).read();
	  }
	  /**
	   * Keeps track of: if a `key` is in an object.
	   *
	   * @param {PropertyKey} key
	   * @param {boolean} value - Indicating if the property is `in`
	   */
	  keyWrite(key, value) {
	    this.#prop(Key, key, value, equalsDefault).write(value);
	  }

	  /**
	   * Keeps track of: if value is undefined, regardless if the `key`
	   * exists in the object or not.
	   *
	   * @param {PropertyKey} key
	   * @param {boolean} value
	   */
	  isUndefinedRead(key, value) {
	    this.#prop(isUndefined, key, value, equalsDefault).read();
	  }
	  /**
	   * Keeps track of: if value is undefined, regardless if the `key`
	   * exists in the object or not.
	   *
	   * @param {PropertyKey} key
	   * @param {any} value
	   */
	  isUndefinedWrite(key, value) {
	    this.#prop(isUndefined, key, value === undefined, equalsDefault).write(value === undefined);
	  }

	  /**
	   * Keeps track of: the getter function identity for an accessor
	   * `key`. Subscribers are effects reading through a signalified
	   * accessor wrapper; the signal fires when `defineProperty` swaps in
	   * a getter with a different identity.
	   *
	   * @param {PropertyKey} key
	   * @param {any} value - The getter function
	   */
	  getterRead(key, value) {
	    this.#prop(Getter, key, value, equalsDefault).read();
	  }
	  /**
	   * Writes the getter function identity for `key`.
	   *
	   * @param {PropertyKey} key
	   * @param {any} value - The getter function
	   */
	  getterWrite(key, value) {
	    return this.#prop(Getter, key, undefined, equalsDefault).write(value);
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
	    this.keyWrite(key, true); // change has
	    this.isUndefinedWrite(key, value); // track when is undefined
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
	    this.isUndefinedWrite(key, value); // track when is undefined

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
	    this.keyWrite(key, false); // change has
	    this.isUndefinedWrite(key, undefined); // track when is undefined
	    this.valueWrite(key, undefined); // change value
	  }

	  /** To indicate keys have been read */
	  keysRead() {
	    this.#read(Keys);
	  }
	  /** To indicate keys have changed */
	  keysWrite() {
	    this.#write(Keys);
	  }

	  /** To indicate values have been read */
	  valuesRead() {
	    this.#read(Values);
	  }
	  /** To indicate values have changed */
	  valuesWrite() {
	    this.#write(Values);
	  }

	  /**
	   * To indicate all values have been read
	   *
	   * @param {symbol} [key]
	   */
	  #read(key) {
	    this.#prop(Value, key, undefined, equalsNope).read();
	  }
	  /**
	   * To indicate all values have changed
	   *
	   * @param {symbol} [key]
	   */
	  #write(key) {
	    this.#prop(Value, key, undefined, equalsNope).write();
	  }
	}

	/**
	 * Per-wrapper pointer back to the user's original getter/setter.
	 * Proxy traps that expose descriptors (`getOwnPropertyDescriptor`)
	 * and compare getter identity (`defineProperty`) unwrap through this
	 * so callers never see our signalify wrappers.
	 */
	const originalGetSet = new WeakMap();

	/**
	 * @template {((...a: any[]) => any) | undefined} F
	 * @param {F} fn
	 * @returns {F} The user's original if `fn` is one of our signalify
	 *   wrappers, otherwise `fn` unchanged.
	 */
	const unwrapGetSet = fn => fn && originalGetSet.has(fn) ? originalGetSet.get(fn) : fn;

	/**
	 * Signalify object properties
	 *
	 * @template T
	 * @param {T} target
	 * @param {Function} [wrapper] To wrap values
	 */
	function signalifyObject(target, wrapper) {
	  untrack(() => {
	    const descriptors = getPropertyDescriptors(target);
	    const track = tracker(target);
	    for (const [key, descriptor] of entriesIncludingSymbols(descriptors)) {
	      signalifyKey(target, key, descriptor, wrapper, track);
	    }
	  });
	}

	/**
	 * Signalify a specific property
	 *
	 * @template T
	 * @param {T} target
	 * @param {PropertyKey} key
	 * @param {PropertyDescriptor} descriptor
	 * @param {Function} [wrapper] To wrap values
	 * @param {import('./tracker.js').Track} [track] Tracker
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
	   * in classes. But do not avoid functions when it has a `wrapper`,
	   * like `mutable`.
	   */
	  if (isFunction(value) && wrapper === identity) {
	    return;
	  }

	  /**
	   * If the caller handed us a descriptor that came back through one
	   * of our proxy traps (e.g. a `defineProperty` that retained a
	   * previously-installed wrapper via spec merge), unwrap to the
	   * user's originals. Ensures we never re-wrap our own wrappers and
	   * that `originalGetSet` always maps to true originals.
	   */
	  if (descriptor.get) descriptor.get = unwrapGetSet(descriptor.get);
	  if (descriptor.set) descriptor.set = unwrapGetSet(descriptor.set);
	  const getter = descriptor.get?.bind(target);
	  const setter = descriptor.set?.bind(target);

	  /** Needs to wrap to recurse the object */
	  if (!setter && wrapper) {
	    value = wrapper(value);
	  }

	  /**
	   * 1. We cannot know if the getter will return the same thing that has
	   *    been set. For this reason we cant rely on the return value of
	   *    the signal.
	   * 2. We need to ensure the return value is always wrapped (for in case
	   *    of being used as a mutable).
	   * 3. For accessor descriptors we subscribe to a per-key `Getter`
	   *    signal keyed to the user's original getter identity.
	   *    `signalifyKey` writes the current getter identity below, so
	   *    `defineProperty` swapping the getter for a different identity
	   *    fires the signal; same-identity redefines are absorbed by the
	   *    signal's equality check.
	   */
	  const wrapperGet = getter ? () => {
	    value = wrapper(getter());
	    descriptor.get && track.getterRead(key, descriptor.get);
	    return track.valueRead(key, value);
	  } : () => {
	    value = wrapper(value);
	    return track.valueRead(key, value);
	  };

	  /** When it's only a getter it shouldn't have a setter */
	  const wrapperSet = getter && !setter ? undefined : setter ? val => {
	    batch(() => {
	      value = wrapper(val);
	      setter(value);
	      track.valueWrite(key, value);
	    });
	  } : val => {
	    batch(() => {
	      value = wrapper(val);
	      track.valueWrite(key, value);
	    });
	  };

	  /**
	   * Record the user's original get/set on the wrapper so proxy traps
	   * that expose descriptors can return the originals, and identity
	   * comparisons stay meaningful.
	   */
	  if (descriptor.get) originalGetSet.set(wrapperGet, descriptor.get);
	  if (descriptor.set) originalGetSet.set(wrapperSet, descriptor.set);
	  defineProperty(target, key, {
	    get: wrapperGet,
	    set: wrapperSet,
	    enumerable: descriptor.enumerable,
	    configurable: true
	  });

	  /**
	   * Publish the current getter identity so subscribers on the
	   * `Getter` signal fire when the user swaps the getter via
	   * `defineProperty`. Same-identity redefines are absorbed by the
	   * signal's equality check (a no-op write).
	   */
	  descriptor.get && track.getterWrite(key, descriptor.get);
	}

	/**
	 * Signalify an undefined property
	 *
	 * @template T
	 * @param {T} target
	 * @param {PropertyKey} key
	 * @param {Function} [wrapper] To wrap values
	 * @param {import('./tracker.js').Track} [track] Tracker
	 * @param {any} [value] Default value
	 */
	function signalifyUndefinedKey(target, key, wrapper = identity, track, value = undefined) {
	  if (isKeyBlacklisted(key)) {
	    return;
	  }
	  if (isExtensible(target)) {
	    redefineProperty(target, key, {
	      get() {
	        return track.valueRead(key, value);
	      },
	      set(val) {
	        batch(() => {
	          value = wrapper(val);
	          track.valueWrite(key, value);
	        });
	      }
	    });
	  }
	}

	class ProxyHandlerBase {
	  // type = 'Base'

	  constructor(value) {
	    this.track = tracker(value);
	  }
	  ownKeys(target) {
	    this.track.keysRead();
	    return reflectOwnKeys(target);
	  }
	  has(target, key) {
	    const r = reflectHas(target, key);
	    if (this.shouldTrackKey(key)) this.track.keyRead(key, r);
	    return r;
	  }
	  deleteProperty(target, key) {
	    /** To not trigger effects when the property isn't in the object */
	    if (!(key in target)) {
	      return true;
	    }
	    if (!this.shouldTrackKey(key)) return delete target[key];
	    return batch(() => {
	      this.track.keysWrite();
	      this.track.delete(key);

	      /**
	       * Use `delete` instead of `reflectDeleteProperty` so it throws
	       * when not permitted
	       */
	      return delete target[key];
	    });
	  }
	  getOwnPropertyDescriptor(target, key) {
	    this.has(target, key);
	    const desc = reflectGetOwnPropertyDescriptor(target, key);
	    if (desc) {
	      // Return the user's original get/set — never expose our
	      // signalify wrappers through a standard descriptor read.
	      if (desc.get) desc.get = unwrapGetSet(desc.get);
	      if (desc.set) desc.set = unwrapGetSet(desc.set);
	    }
	    return desc;
	  }
	  defineProperty(target, key, descriptor) {
	    if (!this.shouldTrackKey(key)) {
	      return reflectDefineProperty(target, key, descriptor);
	    }
	    return batch(() => {
	      const wasIn = key in target;
	      const oldDesc = wasIn ? reflectGetOwnPropertyDescriptor(target, key) : undefined;
	      const r = reflectDefineProperty(target, key, descriptor);
	      if (r) {
	        const newDesc = reflectGetOwnPropertyDescriptor(target, key);
	        const oldEnum = oldDesc ? oldDesc.enumerable : false;
	        const newEnum = newDesc ? newDesc.enumerable : false;
	        if (!wasIn) {
	          this.track.keyWrite(key, true); // has changed
	          if (newEnum) this.track.keysWrite(); // added to ownKeys
	        } else if (oldEnum !== newEnum) {
	          this.track.keysWrite(); // enumerability transitioned
	        }

	        // Wrap for per-key reactivity. Handles both data and
	        // accessor descriptors; skips internally for
	        // non-configurable and for blacklisted keys. Pass the
	        // effective (merged) descriptor so accessor overrides
	        // see retained get/set from the original.
	        signalifyKey(target, key, newDesc, mutable, this.track);

	        // Gate `valuesWrite()` on whether anything actually
	        // changed — otherwise same-value redefines wake
	        // `forEach`-style `valuesRead` subscribers unnecessarily.
	        let changed = !wasIn;
	        if ('value' in newDesc) {
	          // Data descriptor — effective value is newDesc.value.
	          // shall NOT run getters.
	          const newValue = mutable(newDesc.value);
	          this.track.isUndefinedWrite(key, newValue);
	          if (this.track.valueWrite(key, newValue)) changed = true;
	        } else {
	          // Accessor descriptor — `signalifyKey` updates the
	          // per-key `Getter` signal above, so same-identity
	          // redefines are absorbed and real getter swaps fire
	          // subscribers. We only need to flip `isUndefined`
	          // for newly-added keys so effects that read the
	          // key while undefined wake up; existing keys
	          // already have `isUndefined` = false.
	          if (!wasIn) {
	            this.track.isUndefinedWrite(key, null);
	          }
	        }
	        if (changed) this.track.valuesWrite();
	      }
	      return r;
	    });
	  }
	  returnValue(target, key, value) {
	    return isProxyValueReturnInvariant(target, key, value) ? (mutable(value), value) : mutable(value);
	  }
	  returnFunction(target, key, value, proxy) {
	    /**
	     * 1. `Reflect.apply` to correct `receiver`. `TypeError: Method
	     *    Set.prototype.add called on incompatible receiver #<Set>`
	     * 2. Run in a batch to react to all changes at the same time.
	     */
	    return (...args) => batch(() => mutable(key in objectMethods ? objectMethods[key](this, target, value, args, proxy) : reflectApply(value, target, args)));
	  }
	  /**
	   * `true` when reactive tracking should run for `key`. Skips
	   * engine-internal keys (well-known symbols, `constructor`,
	   * `__proto__`) so they don't create spurious subscriptions.
	   *
	   * @param {PropertyKey} key
	   * @returns {boolean}
	   */
	  shouldTrackKey(key) {
	    return !isKeyBlacklisted(key);
	  }
	  /**
	   * `true` when `key` is an identity-sensitive blacklisted key. The
	   * get trap returns the raw value for these so `obj.constructor ===
	   * Object` and `obj.__proto__ === Object.prototype` hold. Other
	   * blacklisted keys (well-known symbols) still go through
	   * `returnFunction` so internal-slot methods like
	   * `Map.prototype[Symbol.iterator]` receive the raw target as
	   * receiver.
	   *
	   * @param {PropertyKey} key
	   * @returns {boolean}
	   */
	  isIdentityKey(key) {
	    return key === 'constructor' || key === '__proto__';
	  }
	}
	const objectMethods = {
	  __proto__: null,
	  hasOwnProperty(track, target, value, args, proxy) {
	    track.has(target, args[0]);
	    return reflectApply(value, target, args);
	  }
	};

	/** Proxy for Arrays. In Arrays, values are tracked by the proxy. */

	class ProxyHandlerArray extends ProxyHandlerBase {
	  // type = 'Array'

	  get(target, key, proxy) {
	    if (key === $isMutable) {
	      return true;
	    }
	    if (this.isIdentityKey(key)) {
	      return reflectGet(target, key, proxy);
	    }
	    const shouldTrack = this.shouldTrackKey(key);

	    /** To be able to track properties not yet set */
	    if (shouldTrack && !(key in target)) {
	      this.track.isUndefinedRead(key, true);
	    }
	    const value = reflectGet(target, key, proxy);
	    if (isFunction(value)) {
	      return this.returnFunction(target, key, value, proxy);
	    }
	    return shouldTrack ? this.track.valueRead(key, this.returnValue(target, key, value)) : this.returnValue(target, key, value);
	  }
	  set(target, key, value, proxy) {
	    if (!this.shouldTrackKey(key)) {
	      return reflectSet(target, key, mutable(value), proxy);
	    }
	    return batch(() => {
	      /** Always work with mutables */
	      value = mutable(value);

	      /** New key */
	      if (!(key in target)) {
	        this.track.keysWrite(); // change ownKeys
	        this.track.keyWrite(key, true); // change has
	        this.track.valuesWrite();
	      }
	      if (this.track.modify(key, value)) {
	        /**
	         * Dispatch that "something" changed, for these listening for
	         * every change
	         */
	        this.track.valuesWrite();

	        /**
	         * When explicit setting `length` it needs to mark anything
	         * deleted as deleted
	         */
	        if (key === 'length') {
	          this.track.keysWrite(); // change ownKeys

	          if (value < target.length) {
	            for (let k = value; k < target.length; k++) {
	              this.track.delete(k);
	            }
	          }
	        }
	      }
	      const r = reflectSet(target, key, value, proxy);

	      /**
	       * Always update length. `arr = [], arr[0] = true` length
	       * changed, so it needs to be updated to 1.
	       */
	      this.track.valueWrite('length', target.length);
	      return r;
	    });
	  }

	  /**
	   * Arrays track every key via the proxy's `get`/`set` traps (see
	   * above), so the base class's `signalifyKey` step would install a
	   * redundant accessor wrapper on top, double-tracking numeric
	   * indices. Override here to do the descriptor work and fire tracker
	   * notifications directly — without accessor wrapping.
	   */
	  defineProperty(target, key, descriptor) {
	    if (!this.shouldTrackKey(key)) {
	      return reflectDefineProperty(target, key, descriptor);
	    }
	    return batch(() => {
	      const wasIn = key in target;
	      const oldDesc = wasIn ? reflectGetOwnPropertyDescriptor(target, key) : undefined;
	      const r = reflectDefineProperty(target, key, descriptor);
	      if (r) {
	        const newDesc = reflectGetOwnPropertyDescriptor(target, key);
	        const oldEnum = oldDesc ? oldDesc.enumerable : false;
	        const newEnum = newDesc ? newDesc.enumerable : false;
	        if (!wasIn) {
	          this.track.keyWrite(key, true);
	          if (newEnum) this.track.keysWrite();
	        } else if (oldEnum !== newEnum) {
	          this.track.keysWrite();
	        }

	        // Gate `valuesWrite()` on whether anything actually
	        // changed. We compare old vs new value directly
	        // (arrays keep data descriptors on the raw target, so
	        // `oldDesc.value` is meaningful). `valueWrite`'s
	        // return can't be trusted alone — first write to a
	        // never-read key always "fires" because the signal is
	        // initialized with `undefined`.
	        let changed = !wasIn;
	        if ('value' in newDesc) {
	          const newValue = mutable(newDesc.value);
	          const oldValue = oldDesc && 'value' in oldDesc ? oldDesc.value : undefined;
	          this.track.isUndefinedWrite(key, newValue);
	          if (!is(oldValue, newValue)) {
	            this.track.valueWrite(key, newValue);
	            changed = true;
	          }
	        } else if (!wasIn) {
	          this.track.isUndefinedWrite(key, null);
	        }
	        if (changed) this.track.valuesWrite();
	      }
	      return r;
	    });
	  }
	  returnFunction(target, key, value, proxy) {
	    /**
	     * 1. `Reflect.apply` to correct `receiver`. `TypeError: Method
	     *    Set.prototype.add called on incompatible receiver #<Set>`
	     * 2. Run in a batch to react to all changes at the same time.
	     */
	    return (...args) => batch(() => mutable(key in arrayMethods ? arrayMethods[key](this, target, value, args, proxy) : reflectApply(value, target, args)));
	  }

	  /** Special track methods for array */

	  /** Dispatch read to specific key */
	  trackKey(target, key) {
	    if (key in target) {
	      this.track.valueRead(key, target[key]);
	    }
	  }

	  /** Dispatch reads to a keys range */
	  trackKeysRange(target, start = 0, end = target.length) {
	    start = start < 0 ? 0 : start;
	    end = end > target.length ? target.length : end;
	    for (let key = start; key < end; key++) {
	      this.track.valueRead(key, target[key]);
	    }
	  }

	  /** Dispatch writes to values that changed */
	  trackDiff(target, oldLength = target.length) {
	    let changed = false;
	    let key = 0;
	    for (let length = target.length; key < length; key++) {
	      if (key > oldLength) {
	        // it's new
	        this.track.add(key, target[key]);
	        changed = true;
	      } else {
	        // modify existing
	        if (this.track.modify(key, target[key])) {
	          changed = true;
	        }
	      }
	    }
	    // delete deleted
	    for (; key < oldLength; key++) {
	      this.track.delete(key);
	      changed = true;
	    }
	    if (oldLength != target.length) {
	      this.track.keysWrite();

	      // change length
	      this.track.valueWrite('length', target.length);
	      changed = true;
	    }
	    if (changed) {
	      this.track.valuesWrite();
	    }
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
	  __proto__: null,
	  hasOwnProperty(handler, target, value, args, proxy) {
	    handler.has(target, args[0]);
	    return reflectApply(value, target, args);
	  },
	  /** WRITE METHODS */

	  pop(handler, target, value, args, proxy) {
	    if (target.length) {
	      // "something" changed
	      handler.track.valuesWrite();

	      // ownKeys changed
	      handler.track.keysWrite();

	      // has, undefined state, value
	      handler.track.delete(target.length - 1);

	      // length changed
	      handler.track.valueWrite('length', target.length - 1);
	    }
	    return reflectApply(value, target, args);
	  },
	  // lib.es5.d.ts

	  push(handler, target, value, args, proxy) {
	    args = args.map(value => mutable(value));

	    // "something" changed
	    handler.track.valuesWrite();

	    // ownKeys changed
	    handler.track.keysWrite();

	    // add keys
	    for (let key = target.length, item = 0; key < target.length + args.length; key++, item++) {
	      handler.track.add(key, args[item]);
	    }

	    // change length
	    handler.track.valueWrite('length', target.length + args.length);
	    return reflectApply(value, target, args);
	  },
	  /** Removes the first element from an array and returns it. */
	  shift(handler, target, value, args, proxy) {
	    if (target.length) {
	      const r = reflectApply(value, target, args);
	      handler.trackDiff(target, target.length + 1);
	      return r;
	    }
	  },
	  /**
	   * Inserts new elements at the start of an array, and returns the
	   * new length of the array.
	   */
	  unshift(handler, target, value, args, proxy) {
	    args = args.map(value => mutable(value));
	    const r = reflectApply(value, target, args);
	    handler.trackDiff(target, target.length - args.length);
	    return r;
	  },
	  splice(handler, target, value, args, proxy) {
	    let items = args.slice(2);
	    items = items.map(value => mutable(value));
	    const oldLength = target.length;
	    const r = reflectApply(value, target, args);
	    handler.trackDiff(target, oldLength);
	    return r;
	  },
	  sort(handler, target, value, args, proxy) {
	    const r = reflectApply(value, target, args);
	    handler.trackDiff(target);
	    return r;
	  },
	  reverse(handler, target, value, args, proxy) {
	    const r = reflectApply(value, target, args);
	    handler.trackDiff(target);
	    return r;
	  },
	  forEach(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  map(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  every(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  some(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  // lib.es2015.core.d.ts

	  fill(handler, target, value, args, proxy) {
	    args[0] = mutable(args[0]);
	    const r = reflectApply(value, target, args);
	    handler.trackDiff(target);
	    return r;
	  },
	  copyWithin(handler, target, value, args, proxy) {
	    const r = reflectApply(value, target, args);
	    handler.trackDiff(target);
	    return r;
	  },
	  /** READ METHODS */

	  // lib.es5.d.ts

	  toString(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  toLocaleString(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  slice(handler, target, value, args, proxy) {
	    let start = args[0];
	    let end = args[1];
	    start = start > 0 ? start : start < 0 ? start + target.length : 0;
	    end = end > 0 ? end : end < 0 ? end + target.length : target.length;
	    const r = reflectApply(value, target, args);
	    handler.trackKeysRange(target, start, end);
	    return r;
	  },
	  join(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  concat(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    args = args.map(value => mutable(value));
	    return reflectApply(value, target, args);
	  },
	  indexOf(handler, target, value, args, proxy) {
	    const searchElement = args[0];
	    const fromIndex = args[1];
	    const key = target.indexOf(mutable(searchElement), fromIndex);
	    handler.trackKey(target, key);
	    return key;
	  },
	  lastIndexOf(handler, target, value, args, proxy) {
	    const searchElement = args[0];
	    const fromIndex = args[1];
	    const key = target.lastIndexOf(mutable(searchElement), fromIndex === undefined ? target.length - 1 : fromIndex);
	    handler.trackKey(target, key);
	    return key;
	  },
	  filter(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  reduce(handler, target, value, args, proxy) {
	    const cb = args[0];
	    handler.track.valuesRead();
	    const wrapped = (acc, element, index) => cb(acc, element, index, proxy);
	    return reflectApply(value, target, args.length > 1 ? [wrapped, args[1]] : [wrapped]);
	  },
	  reduceRight(handler, target, value, args, proxy) {
	    const cb = args[0];
	    handler.track.valuesRead();
	    const wrapped = (acc, element, index) => cb(acc, element, index, proxy);
	    return reflectApply(value, target, args.length > 1 ? [wrapped, args[1]] : [wrapped]);
	  },
	  // lib.es2015.core.d.ts

	  find(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  findIndex(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  // lib.es2015.iterable.d.ts

	  *entries(handler, target, value, args, proxy) {
	    for (const entry of target.entries()) {
	      handler.track.valueRead(entry[0], entry[1]);
	      yield entry;
	    }

	    // for when empty and for when iterating all
	    handler.track.valuesRead();
	    handler.track.keysRead();
	  },
	  *keys(handler, target, value, args, proxy) {
	    for (const key of target.keys()) {
	      handler.track.keyRead(key, true);
	      yield key;
	    }

	    // for when empty and for when iterating all
	    handler.track.keysRead();
	  },
	  *values(handler, target, value, args, proxy) {
	    for (const [key, _value] of target.entries()) {
	      handler.track.valueRead(key, _value);
	      yield _value;
	    }

	    // for when empty and for when iterating all
	    handler.track.valuesRead();
	    handler.track.keysRead();
	  },
	  [iterator](handler, target, value, args, proxy) {
	    return this.values(handler, target, value, args, proxy);
	  },
	  // lib.es2016.array.include.d.ts

	  includes(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    args[0] = mutable(args[0]);
	    return reflectApply(value, target, args);
	  },
	  // lib.es2019.array.d.ts

	  flat(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  flatMap(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  // lib.es2022.array.d.ts

	  at(handler, target, value, args, proxy) {
	    let key = args[0];
	    key = key < 0 ? key + target.length : key;
	    handler.trackKey(target, key);
	    return reflectApply(value, target, args);
	  },
	  // lib.es2023.array.d.ts

	  findLast(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  findLastIndex(handler, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    handler.track.valuesRead();
	    return reflectApply(value, target, [(element, index) => cb.call(thisArg, element, index, proxy)]);
	  },
	  toReversed(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  toSorted(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  toSpliced(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    for (let i = 2; i < args.length; i++) {
	      args[i] = mutable(args[i]);
	    }
	    return reflectApply(value, target, args);
	  },
	  with(handler, target, value, args, proxy) {
	    let key = args[0];
	    key = key < 0 ? key + target.length : key;
	    handler.trackKey(target, key);
	    return reflectApply(value, target, args);
	  }
	};

	/**
	 * Proxy for objects. In objects, values are tracked by the
	 * setter/getters in the properties.
	 */
	class ProxyHandlerObject extends ProxyHandlerBase {
	  // type = 'Object'

	  get(target, key, proxy) {
	    if (key === $isMutable) {
	      return true;
	    }
	    if (this.isIdentityKey(key)) {
	      return reflectGet(target, key, proxy);
	    }

	    /** To be able to track properties not yet set */
	    if (this.shouldTrackKey(key) && !(key in target)) {
	      this.track.isUndefinedRead(key, true);
	    }
	    const value = reflectGet(target, key, proxy);
	    return isFunction(value) ? this.returnFunction(target, key, value, proxy) : this.returnValue(target, key, value);
	  }
	  set(target, key, value, proxy) {
	    if (!this.shouldTrackKey(key)) {
	      return reflectSet(target, key, mutable(value), proxy);
	    }
	    return batch(() => {
	      /** Always work with mutables */
	      value = mutable(value);

	      /** New key */
	      if (!(key in target)) {
	        this.track.keysWrite(); // change ownKeys
	        this.track.keyWrite(key, true); // change has
	        signalifyUndefinedKey(target, key, mutable, this.track, value); // track value
	      }
	      /**
	       * To trigger the change when was read but not yet defined. It
	       * handles the cases: deleting an undefined property, setting to
	       * undefined a property that was deleted.
	       */
	      this.track.isUndefinedWrite(key, value);
	      return reflectSet(target, key, value, proxy);
	    });
	  }
	}

	/**
	 * Proxy for Maps. Per-key `has` / `get` tracking goes through
	 * `trackSlot` (the shared `Track` keys the #props Map by identity, so
	 * object keys are tracked precisely). Iteration methods (`forEach`,
	 * `keys`, `values`, `entries`) subscribe to the coarse `valuesRead` /
	 * `keysRead` sentinels, plus per-key subscriptions at each yield so
	 * partial iteration via `break` remains reactive.
	 */
	class ProxyHandlerMap extends ProxyHandlerObject {
	  // type = 'Map'

	  constructor(value) {
	    super(value);
	    this.trackSlot = new Track(true);
	  }
	  get(target, key, proxy) {
	    if (key === $isMutable) {
	      return true;
	    }
	    if (this.isIdentityKey(key)) {
	      return reflectGet(target, key, proxy);
	    }
	    const shouldTrack = this.shouldTrackKey(key);

	    /** To be able to track properties not yet set */
	    if (shouldTrack && !(key in target)) {
	      this.track.isUndefinedRead(key, true);
	    }

	    /** `size` needs the receiver to be the raw Map */
	    const value = shouldTrack && key === 'size' ? this.track.valueRead(key, reflectGet(target, key, target)) : reflectGet(target, key, proxy);
	    return isFunction(value) ? this.returnFunction(target, key, value, proxy) : this.returnValue(target, key, value);
	  }
	  returnFunction(target, key, value, proxy) {
	    /**
	     * 1. `Reflect.apply` to correct `receiver`. `TypeError: Method
	     *    Map.prototype.set called on incompatible receiver #<Map>`
	     * 2. Run in a batch to react to all changes at the same time.
	     */
	    return (...args) => batch(() => mutable(key in mapMethods ? mapMethods[key](this, this.trackSlot, target, value, args, proxy) : reflectApply(value, target, args)));
	  }
	}
	const mapMethods = {
	  __proto__: null,
	  has(handler, trackSlot, target, value, args, proxy) {
	    const key = args[0];
	    const r = reflectApply(value, target, args);
	    trackSlot.keyRead(key, r);
	    return r;
	  },
	  get(handler, trackSlot, target, value, args, proxy) {
	    const key = args[0];
	    const r = reflectApply(value, target, args);
	    trackSlot.valueRead(key, r);
	    return r;
	  },
	  set(handler, trackSlot, target, value, args, proxy) {
	    const key = args[0];
	    const val = mutable(args[1]);
	    if (target.has(key)) {
	      if (target.get(key) === val) {
	        return reflectApply(value, target, args);
	      }
	    } else {
	      trackSlot.keysWrite();
	    }
	    trackSlot.valuesWrite();
	    trackSlot.keyWrite(key, true);
	    trackSlot.valueWrite(key, val);
	    const r = reflectApply(value, target, args);
	    handler.track.valueWrite('size', target.size);
	    return r;
	  },
	  delete(handler, trackSlot, target, value, args, proxy) {
	    const key = args[0];
	    const r = reflectApply(value, target, args);
	    if (r) {
	      trackSlot.keysWrite();
	      trackSlot.valuesWrite();
	      trackSlot.keyWrite(key, false);
	      trackSlot.valueWrite(key, undefined);
	      handler.track.valueWrite('size', target.size);
	    }
	    return r;
	  },
	  clear(handler, trackSlot, target, value, args, proxy) {
	    if (target.size) {
	      trackSlot.keysWrite();
	      trackSlot.valuesWrite();
	      for (const key of target.keys()) {
	        trackSlot.keyWrite(key, false);
	        trackSlot.valueWrite(key, undefined);
	      }
	      reflectApply(value, target, args);
	      handler.track.valueWrite('size', 0);
	    }
	  },
	  forEach(handler, trackSlot, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    trackSlot.valuesRead();
	    trackSlot.keysRead();
	    for (const [key, value] of target.entries()) {
	      trackSlot.valueRead(key, value);
	      cb.call(thisArg, value, key, proxy);
	    }
	  },
	  *keys(handler, trackSlot, target, value, args, proxy) {
	    for (const key of target.keys()) {
	      trackSlot.keyRead(key, true);
	      yield key;
	    }
	    // covers "iterated to completion" and "iterated empty"; partial
	    // iteration with `break` relies on per-key subscriptions above.
	    trackSlot.keysRead();
	  },
	  *values(handler, trackSlot, target, value, args, proxy) {
	    for (const [key, value] of target.entries()) {
	      trackSlot.valueRead(key, value);
	      yield value;
	    }
	    trackSlot.valuesRead();
	    trackSlot.keysRead();
	  },
	  *entries(handler, trackSlot, target, value, args, proxy) {
	    for (const entry of target.entries()) {
	      trackSlot.valueRead(entry[0], entry[1]);
	      yield entry;
	    }
	    trackSlot.valuesRead();
	    trackSlot.keysRead();
	  },
	  [iterator](handler, trackSlot, target, value, args, proxy) {
	    return this.entries(handler, trackSlot, target, value, args, proxy);
	  }
	};

	/**
	 * Proxy for Sets. Per-value `has` tracking goes through `trackSlot`
	 * (the shared `Track` keys the #props Map by identity). Iteration
	 * (`forEach`, `values`, etc.) subscribes to the coarse `valuesRead()`
	 * sentinel.
	 */
	class ProxyHandlerSet extends ProxyHandlerObject {
	  // type = 'Set'

	  constructor(value) {
	    super(value);
	    this.trackSlot = new Track(true);
	  }
	  get(target, key, proxy) {
	    if (key === $isMutable) {
	      return true;
	    }
	    if (this.isIdentityKey(key)) {
	      return reflectGet(target, key, proxy);
	    }
	    const shouldTrack = this.shouldTrackKey(key);

	    /** To be able to track properties not yet set */
	    if (shouldTrack && !(key in target)) {
	      this.track.isUndefinedRead(key, true);
	    }

	    /** `size` needs the receiver to be the raw Set */
	    const value = shouldTrack && key === 'size' ? this.track.valueRead(key, reflectGet(target, key, target)) : reflectGet(target, key, proxy);
	    return isFunction(value) ? this.returnFunction(target, key, value, proxy) : this.returnValue(target, key, value);
	  }
	  returnFunction(target, key, value, proxy) {
	    /**
	     * 1. `Reflect.apply` to correct `receiver`. `TypeError: Method
	     *    Set.prototype.add called on incompatible receiver #<Set>`
	     * 2. Run in a batch to react to all changes at the same time.
	     */
	    return (...args) => batch(() => mutable(key in setMethods ? setMethods[key](this, this.trackSlot, target, value, args, proxy) : reflectApply(value, target, args)));
	  }
	}
	const setMethods = {
	  __proto__: null,
	  has(handler, trackSlot, target, value, args, proxy) {
	    const v = mutable(args[0]);
	    const r = reflectApply(value, target, [v]);
	    trackSlot.keyRead(v, r);
	    return r;
	  },
	  add(handler, trackSlot, target, value, args, proxy) {
	    const v = mutable(args[0]);
	    if (target.has(v)) {
	      // Already in — Set.add is a no-op semantically.
	      return reflectApply(value, target, [v]);
	    }
	    trackSlot.keyWrite(v, true);
	    trackSlot.valuesWrite();
	    const r = reflectApply(value, target, [v]);
	    handler.track.valueWrite('size', target.size);
	    return r;
	  },
	  delete(handler, trackSlot, target, value, args, proxy) {
	    const v = mutable(args[0]);
	    const r = reflectApply(value, target, [v]);
	    if (r) {
	      trackSlot.keyWrite(v, false);
	      trackSlot.valuesWrite();
	      handler.track.valueWrite('size', target.size);
	    }
	    return r;
	  },
	  clear(handler, trackSlot, target, value, args, proxy) {
	    if (target.size) {
	      for (const v of target.values()) {
	        trackSlot.keyWrite(v, false);
	      }
	      trackSlot.valuesWrite();
	      reflectApply(value, target, args);
	      handler.track.valueWrite('size', 0);
	    }
	  },
	  forEach(handler, trackSlot, target, value, args, proxy) {
	    const cb = args[0];
	    const thisArg = args[1];
	    trackSlot.valuesRead();
	    for (const v of target.values()) {
	      cb.call(thisArg, v, v, proxy);
	    }
	  },
	  *values(handler, trackSlot, target, value, args, proxy) {
	    for (const v of target.values()) {
	      yield v;
	    }
	    trackSlot.valuesRead();
	  },
	  *keys(handler, trackSlot, target, value, args, proxy) {
	    // Set.prototype.keys === Set.prototype.values
	    for (const v of target.values()) {
	      yield v;
	    }
	    trackSlot.valuesRead();
	  },
	  *entries(handler, trackSlot, target, value, args, proxy) {
	    for (const v of target.values()) {
	      yield [v, v];
	    }
	    trackSlot.valuesRead();
	  },
	  [iterator](handler, trackSlot, target, value, args, proxy) {
	    return this.values(handler, trackSlot, target, value, args, proxy);
	  }
	};

	/**
	 * Deep-copies a value, preserving as much fidelity as practical:
	 *
	 * - Arrays, Sets, and Maps are reconstructed with their native types.
	 * - Prototype chain is preserved (class instances stay `instanceof`
	 *   their class).
	 * - Own string AND symbol keys are copied, including non-enumerable
	 *   properties and full descriptor attributes (writable, enumerable,
	 *   configurable).
	 * - Accessor descriptors are snapshotted: the getter is invoked once
	 *   (inside `untrack` so reactive reads don't leak) and the result is
	 *   stored as data on the copy. The original accessor shape is lost —
	 *   copy returns a value snapshot, not a live recomputing view.
	 * - Cycles are handled via the `seen` map.
	 * - Frozen / sealed / non-extensible state is re-applied.
	 * - Built-ins listed in `isMutationBlacklisted` (Date, RegExp,
	 *   HTMLElement, …) are returned by reference.
	 *
	 * @template T
	 * @param {T} o
	 * @returns {T}
	 */
	function copy(o, seen = new Map()) {
	  if (!isObject(o)) {
	    return o;
	  }
	  if (isMutationBlacklisted(o)) {
	    return o;
	  }
	  if (seen.has(o)) {
	    return /** @type {T} */seen.get(o);
	  }
	  let c;
	  if (isArray(o)) {
	    c = [];
	  } else if (o instanceof Set) {
	    c = new Set();
	  } else if (o instanceof Map) {
	    c = new Map();
	  } else {
	    // Preserve prototype for class instances.
	    c = Object.create(Object.getPrototypeOf(o));
	  }
	  seen.set(o, c);

	  // Collection contents. Done before the own-properties loop so
	  // circular cycles register in `seen` consistently.
	  if (o instanceof Set) {
	    for (const v of o) c.add(copy(v, seen));
	  } else if (o instanceof Map) {
	    for (const [k, v] of o) {
	      c.set(copy(k, seen), copy(v, seen));
	    }
	  }

	  // Own keys (string + symbol, enumerable + non-enumerable).
	  // `isObject(o)` narrowed via type guard, but TS keeps the
	  // generic `T` view; cast to `object` for the Reflect API.
	  const obj = /** @type {object} */o;
	  for (const k of Reflect.ownKeys(obj)) {
	    const desc = Object.getOwnPropertyDescriptor(obj, k);
	    if (!desc) continue;
	    let value;
	    if ('value' in desc) {
	      value = copy(desc.value, seen);
	    } else if (desc.get) {
	      // Snapshot: invoke getter once, untracked.
	      try {
	        value = copy(untrack(() => desc.get.call(o)), seen);
	      } catch {}
	    }
	    Object.defineProperty(c, k, {
	      value,
	      writable: 'value' in desc ? desc.writable : true,
	      enumerable: desc.enumerable,
	      configurable: desc.configurable
	    });
	  }

	  // Preserve frozen / sealed / non-extensible state.
	  if (Object.isFrozen(o)) Object.freeze(c);else if (Object.isSealed(o)) Object.seal(c);else if (!Object.isExtensible(o)) Object.preventExtensions(c);
	  return /** @type {T} */c;
	}

	/** Keeps track of what objects have already been made into a proxy */
	const [getProxy, setProxy] = weakStore();

	/**
	 * Wraps a value with the provided proxy handler and caches the proxy.
	 *
	 * @template {object} T
	 * @returns {T}
	 */
	function createProxy(target, Handler) {
	  const proxy = new Proxy(target, new Handler(target));
	  /**
	   * Before mutating the content of it (for example calling
	   * `signalifyObject` or making the content of an array mutable),
	   * save it. In case the mutation triggers `mutable` on the same
	   * object, before we have a chance to save it as a proxy. To avoid
	   * the posible situation of having 2 different proxies for the same
	   * value.
	   */
	  setProxy(target, proxy);
	  return proxy;
	}

	/**
	 * Makes a recursive modifiable and trackeable object. Transforms in
	 * place properties into signals via get/set. Works with inherited
	 * getters/setters. New keys can be added at runtime; reads of
	 * not-yet-existing keys are tracked until they are added.
	 *
	 * @template T
	 * @param {T} value
	 * @param {boolean} [clone] - If to `copy` the value first
	 * @returns {import('#type/store.d.ts').Mutable<T>}
	 */
	function mutable(value, clone) {
	  /** Return value as is when is not an object */
	  if (!isObject(value)) {
	    return value;
	  }

	  /** Make a copy to avoid modifying original data (optional) */
	  value = clone ? untrack(() => copy(value)) : value;

	  /** Avoid unwrapping external proxies */
	  if (value[$isMutable]) {
	    return /** @type {import('#type/store.d.ts').Mutable<T>} */value;
	  }

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
	    setProxy(value, value);
	    return /** @type {import('#type/store.d.ts').Mutable<T>} */value;
	  }

	  /** Array methods are proxied by ProxyHandlerArray */
	  if (isArray(value)) {
	    proxy = createProxy(value, ProxyHandlerArray);

	    /** Make the content of the array mutable. */
	    untrack(() => value.forEach((value, key, array) => {
	      array[key] = mutable(value);
	    }));
	    return proxy;
	  }

	  /** Map methods are proxied by ProxyHandlerMap */
	  if (value instanceof Map) {
	    proxy = createProxy(value, ProxyHandlerMap);

	    /** Make the content mutable. */
	    untrack(() => value.forEach((value, key, map) => {
	      map.set(key, mutable(value));
	    }));
	    return proxy;
	  }

	  /** Set methods are proxied by ProxyHandlerSet */
	  if (value instanceof Set) {
	    proxy = createProxy(value, ProxyHandlerSet);

	    /**
	     * Replace each element with its mutable wrap so nested objects
	     * are reactive. Preserves insertion order.
	     */
	    untrack(() => {
	      const items = [...value];
	      value.clear();
	      for (const item of items) {
	        value.add(mutable(item));
	      }
	    });
	    return proxy;
	  }

	  /** An intance of something we dont have a special handler for it */
	  proxy = createProxy(value, ProxyHandlerObject);
	  signalifyObject(value, mutable);
	  return proxy;
	}

	// https://github.com/mobxjs/mobx/issues/1590


	/**
	 * Merge `source` into `target` and removes from `target` keys not
	 * present in `source`. Returns `target` for convenience; the returned
	 * reference is the same object that was passed in. Note that the
	 * returned type `T & U` approximates the final shape — keys of `T`
	 * absent from `U` are deleted at runtime but still appear in the
	 * returned type.
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
	 * @template U
	 * @param {T} target
	 * @param {U} source
	 * @param {import('#type/store.d.ts').ReconcileKeys<U>} [keys] Keep
	 *   references on objects with the same key. Shape mirrors `source`.
	 * @returns {T & U}
	 */
	const replace = (target, source, keys) => (batch(() => untrack(() => reconcile(target, copy(source), keys, ''))), (/** @type {T & U} */target));
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
	 * Provides a fallback till children promises resolve (recursively)
	 *
	 * @type {FlowComponent<{ fallback?: JSX.Element }>}
	 * @url https://pota.quack.uy/Components/Suspense
	 */
	const Suspense = props => useSuspense(new createSuspenseContext(), () => {
	  const children = toHTMLFragment(props.children);
	  const context = useSuspense();
	  // for when `Suspense` was used with children that dont have promises
	  return context.isEmpty() ? children : memo(() => context.s.read() ? children : props.fallback);
	});

	/**
	 * Trims trailing punctuation that often appears in copied links.
	 *
	 * @param {string} v
	 * @returns {string}
	 */
	const cleanLink = v => v.replace(/[\.,"]$/, '');

	/** Re-export of the platform `encodeURIComponent`. */
	const encodeURIComponent = window$1.encodeURIComponent;

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

	/**
	 * Audio player. `scroll` fires once the resource is playable, so the
	 * surrounding layout can scroll it into view.
	 *
	 * @type {Component<{ url: string; scroll?: () => void }>}
	 */
	const Audio = props => Component('audio', {
	  controls: true,
	  src: cleanLink(props.url),
	  title: props.url,
	  'on:canplay': props.scroll,
	  children: Component('source', {
	    src: cleanLink(props.url)
	  })
	});

	/**
	 * Anchor with same-origin detection. Off-origin links open in a new
	 * tab; explicit `blank` forces it.
	 *
	 * @type {Component<{
	 * 	url: string
	 * 	blank?: boolean
	 * 	children?: JSX.Element
	 * }>}
	 */
	const Link = props => Component('a', {
	  href: cleanLink(props.url),
	  title: props.url,
	  target: props.blank || props.url.indexOf(window.location.protocol + '//' + window.location.host + '/') !== 0 ? '_blank' : undefined,
	  rel: 'noopener external',
	  children: props.children || props.url
	});

	/**
	 * Image wrapped in a new-tab link to the source. `scroll` fires once
	 * the image has loaded.
	 *
	 * @type {Component<{ url: string; scroll?: () => void }>}
	 */
	const Image = props => Component(Link, {
	  url: props.url,
	  blank: true,
	  children: Component('img', {
	    src: cleanLink(props.url),
	    alt: '',
	    title: props.url,
	    'on:load': props.scroll
	  })
	});

	/**
	 * Inline-autoplay muted video, wrapped in a new-tab link to the
	 * source. `scroll` fires once the video is playable.
	 *
	 * @type {Component<{ url: string; scroll?: () => void }>}
	 */
	const Video = props => Component(Link, {
	  url: props.url,
	  blank: true,
	  children: Component('video', {
	    loop: true,
	    autoplay: true,
	    muted: true,
	    src: cleanLink(props.url),
	    title: props.url,
	    'on:canplay': props.scroll,
	    children: Component('source', {
	      src: cleanLink(props.url)
	    })
	  })
	});

	/**
	 * Wraps a `data:`-URI in an object URL so the renderer hands native
	 * media elements something compact. The object URL is revoked when
	 * the surrounding scope tears down.
	 *
	 * @param {string} url
	 */
	function toObjectURL(url) {
	  const link = mutable({
	    url
	  });
	  /** @type {string | undefined} */
	  let objectURL;
	  fetch(url).then(r => r.blob()).then(blob => {
	    objectURL = URL.createObjectURL(blob);
	    link.url = objectURL;
	  });
	  cleanup(() => {
	    if (objectURL) URL.revokeObjectURL(objectURL);
	  });
	  return link;
	}

	/**
	 * Fallback path for `guessType`: HEAD/GET the URL to learn its
	 * Content-Type, then re-enter `<Media>` with the resolved `type`.
	 *
	 * @param {string} url
	 * @param {(() => void) | undefined} scroll
	 */
	async function toMediaLink(url, scroll) {
	  const res = await fetch(url, {
	    method: url.indexOf('blob:') === 0 ? 'GET' : 'HEAD'
	  });
	  const contentType = res.headers.get('Content-Type') ?? undefined;
	  return Component(Media, {
	    url,
	    scroll,
	    type: contentType
	  });
	}

	/**
	 * Routes a URL to the right media renderer. `data:` URIs are first
	 * converted to object URLs (avoids gigantic `src` attributes). When
	 * the extension is ambiguous and `guessType` is set, a `<Suspense>`
	 * boundary fetches the Content-Type and re-routes.
	 *
	 * @type {Component<{
	 * 	url: string
	 * 	scroll?: () => void
	 * 	type?: string
	 * 	guessType?: boolean
	 * }>}
	 */
	function Media(props) {
	  const url = props.url;
	  if (/^data:video\/(webm|mp4|mpg|ogv);base64/.test(url)) {
	    const link = toObjectURL(url);
	    return Component(Video, {
	      url: link.url,
	      scroll: props.scroll
	    });
	  }
	  if (/^data:audio\/(wav|mp3|m4a|ogg|oga|opus);base64/.test(url)) {
	    const link = toObjectURL(url);
	    return Component(Audio, {
	      url: link.url,
	      scroll: props.scroll
	    });
	  }
	  if (/^data:image\/(png|apng|jpg|jpeg|gif|svg|webp);base64/.test(url)) {
	    const link = toObjectURL(url);
	    return Component(Image, {
	      url: link.url,
	      scroll: props.scroll
	    });
	  }
	  if (/^data:/.test(url)) {
	    const link = toObjectURL(url);
	    return Component(Link, {
	      url: link.url
	    });
	  }
	  if (/[\.\/](webm|mp4|mpg|ogv)/gi.test(props.type || url)) {
	    return Component(Video, {
	      url,
	      scroll: props.scroll
	    });
	  }
	  if (/[\.\/](wav|mp3|m4a|ogg|oga|opus)/gi.test(props.type || url)) {
	    return Component(Audio, {
	      url,
	      scroll: props.scroll
	    });
	  }
	  if (/[\.\/](png|apng|jpg|jpeg|gif|svg|webp)/gi.test(props.type || url)) {
	    return Component(Image, {
	      url,
	      scroll: props.scroll
	    });
	  }
	  if (props.type) {
	    // `type` was set, so type-guessing already ran — render nothing
	    // rather than recursing.
	    return;
	  }
	  if (props.guessType && /^[^/]+\/\/[^/]+\/.+/.test(url)) {
	    // Skip path-less URLs (origin-only). Show the link immediately
	    // and swap to the resolved media once the HEAD/GET returns.
	    return Component(Suspense, {
	      fallback: Component(Link, {
	        url
	      }),
	      children: () => toMediaLink(url, props.scroll)
	    });
	  }
	  return Component(Link, {
	    url
	  });
	}

	/**
	 * Inline-format parser. Produces a tree the renderer can walk to
	 * assemble JSX. Pure logic — no DOM or JSX deps, so this file is
	 * unit-testable.
	 *
	 * Markers (`*bold*`, `/italic/`, `_under_`, `-strike-`, `|spoiler|`,
	 * `code`) nest freely except ```, which is atomic — its body stays
	 * literal so the renderer can copy it verbatim.
	 *
	 * @typedef {{ kind: 'text'; s: string } | { kind: 'atom'; name:
	 * string; s: string } | { kind: 'tag'; name: string; children: Node[]
	 * }} Node
	 */

	/**
	 * Tag char → 1 if the tag may span newlines, 0 if it closes at the
	 * first newline. Membership in this object is also the "is a tag"
	 * test (`name in tags`).
	 *
	 * @type {Record<string, 0 | 1>}
	 */
	const tags = {
	  '*': 0,
	  '/': 1,
	  _: 1,
	  '-': 0,
	  '|': 1,
	  '`': 1
	};

	/** Atomic tags: body stays literal, no nested parsing. */
	const ATOMIC = '`';
	const opener = /["'[({¡¿]/;
	const closer = /[?!.,\])}"']/;

	/** @param {string} c @param {string} s @param {number} i */
	const canOpen = (c, s, i) => opener.test(c) ? /\s/.test(s[i - 1]) : /\s/.test(c);

	/** @param {string} c @param {string} s @param {number} i */
	const canClose = (c, s, i) => closer.test(c) ? i + 2 === s.length || /\s/.test(s[i + 2]) : i + 1 === s.length || /\s/.test(c);

	/**
	 * @param {string} input
	 * @returns {Node[]}
	 */
	function tokenize(input) {
	  return parse$1(' ' + (input || '').trim());
	}

	/**
	 * Parses `s`. The caller prepends a leading space so an opening tag
	 * at position 0 of the original input still satisfies `canOpen`. That
	 * space is stripped from the first text node before return.
	 *
	 * @param {string} s
	 * @returns {Node[]}
	 */
	function parse$1(s) {
	  /** @type {Node[]} */
	  const out = [];
	  let buf = '';
	  for (let i = 0; i < s.length; i++) {
	    const name = s[i + 1];
	    if (name in tags && canOpen(s[i], s, i)) {
	      const close = findClose(name, tags[name], s, i + 1);
	      if (close >= 0) {
	        buf += s[i];
	        if (buf) out.push({
	          kind: 'text',
	          s: buf
	        });
	        buf = '';
	        const inner = s.substring(i + 2, close);
	        out.push(ATOMIC.indexOf(name) >= 0 ? {
	          kind: 'atom',
	          name,
	          s: inner
	        } : {
	          kind: 'tag',
	          name,
	          children: parse$1(' ' + inner)
	        });
	        i = close;
	        continue;
	      }
	    }
	    // `\*` etc. — drop the backslash so the tag char becomes literal.
	    if (s[i] === '\\' && s[i + 1] in tags && canOpen(s[i - 1], s, i - 1)) {
	      continue;
	    }
	    buf += s[i];
	  }
	  if (buf) out.push({
	    kind: 'text',
	    s: buf
	  });
	  // Strip the synthetic leading space (always exactly one char).
	  if (out[0] && out[0].kind === 'text') {
	    out[0].s = out[0].s.slice(1);
	    if (!out[0].s) out.shift();
	  }
	  return out;
	}

	/**
	 * @param {string} name
	 * @param {0 | 1} nLine
	 * @param {string} s
	 * @param {number} i Position of the opening tag char
	 * @returns {number} Index of closing char, or -1 if no match
	 */
	function findClose(name, nLine, s, i) {
	  for (i += 1; i < s.length; i++) {
	    if (s[i] === name && canClose(s[i + 1], s, i)) return i;
	    if (!nLine && s[i] === '\n') return -1;
	  }
	  return -1;
	}

	/** @typedef {import('./tokenize.js').Node} Node */

	/** @type {Record<string, string>} */
	const EmojiMap = Emoji;
	const separator = /(\s+)/;
	const mediaURL = /^(https?|blob|data):.+/;

	/** @param {PointerEvent} e */
	const spoilerRemove = e => {
	  const t = /** @type {HTMLElement} */e.currentTarget;
	  t.style.backgroundColor = 'inherit';
	  t.style.color = 'inherit';
	};

	/**
	 * Tag-marker → component factory. Atomic markers (```) receive the
	 * raw inner string so we can copy it to clipboard verbatim; the rest
	 * receive the recursively-rendered children array.
	 *
	 * @type {Record<string, (c: any) => JSX.Element>}
	 */
	const wraps = {
	  '*': c => Component('b', {
	    children: c
	  }),
	  '/': c => Component('em', {
	    children: c
	  }),
	  _: c => Component('u', {
	    children: c
	  }),
	  '-': c => Component('s', {
	    children: c
	  }),
	  '|': c => Component('span', {
	    'data-linkify-type': 'spoiler',
	    'on:click': spoilerRemove,
	    children: c
	  }),
	  '`': s => Component('code', {
	    'on:click': () => copyToClipboard(s),
	    children: `\`${s}\``
	  })
	};

	/**
	 * Inline-formatter for chat-style text. Renders `*bold*`, `/italic/`,
	 * `_under_`, `-strike-`, `|spoiler|` and `code` markers, recognises
	 * media URLs, optionally substitutes `:emoji:` shortcodes, and can
	 * highlight a `mark` term. A leading `>` makes the whole block a
	 * quote; a leading `/ ` italicises it.
	 *
	 * @type {Component<{
	 * 	text?: string
	 * 	trim?: boolean
	 * 	mark?: string | false
	 * 	scroll?: () => void
	 * 	guessType?: boolean
	 * 	emoji?: boolean
	 * }>}
	 */
	function Linkify(props) {
	  const scroll = props.scroll || noop;
	  /** @type {string | false} */
	  const mark = props.mark ? props.mark.toLowerCase() : false;
	  let s = (props.text || '').trim();
	  if (props.trim) {
	    s = (props.text || '').split('\n').map(m => m.trim()).join('\n').trim();
	  }

	  /** @type {(x: any) => JSX.Element} */
	  let quote = x => x;
	  /** @type {(x: any) => JSX.Element} */
	  let italic = x => x;
	  if (s.startsWith('>')) {
	    s = s.replace(/^>\s*/, '').trim();
	    quote = x => Component('q', {
	      children: x
	    });
	  }
	  if (s.startsWith('/ ')) {
	    s = s.replace(/^\/\s+/, '').trim();
	    italic = x => Component('em', {
	      children: x
	    });
	  }
	  const ctx = {
	    emoji: !!props.emoji,
	    mark,
	    scroll,
	    guessType: props.guessType
	  };
	  return quote(italic(render(tokenize(s), ctx)));
	}

	/**
	 * @typedef {{
	 * 	emoji: boolean
	 * 	mark: string | false
	 * 	scroll: () => void
	 * 	guessType?: boolean
	 * }} Ctx
	 *
	 * @param {Node[]} nodes
	 * @param {Ctx} ctx
	 */
	function render(nodes, ctx) {
	  /** @type {any[]} */
	  const out = [];
	  for (const n of nodes) {
	    if (n.kind === 'text') appendText(n.s, ctx, out);else if (n.kind === 'atom') out.push(wraps[n.name](n.s));else out.push(wraps[n.name](render(n.children, ctx)));
	  }
	  return out;
	}

	/**
	 * Splits a text run into words and substitutes emoji shortcodes,
	 * media URLs, and the `mark` highlight. Adjacent literals coalesce
	 * into one DOM text node.
	 *
	 * @param {string} s
	 * @param {Ctx} ctx
	 * @param {any[]} out
	 */
	function appendText(s, ctx, out) {
	  for (const piece of s.split(separator)) {
	    if (ctx.emoji && EmojiMap[piece]) {
	      out.push(Component('span', {
	        'data-linkify-type': 'emoji',
	        children: piece[0] === '#' ? piece + ' ' + EmojiMap[piece] : EmojiMap[piece]
	      }));
	    } else if (mediaURL.test(piece)) {
	      out.push(Component(Media, {
	        url: piece,
	        scroll: ctx.scroll,
	        guessType: ctx.guessType
	      }));
	    } else if (ctx.mark !== false && ctx.mark === piece.toLowerCase()) {
	      out.push(Component('mark', {
	        children: piece
	      }));
	    } else if (ctx.emoji && !/[a-z0-9&*#]/i.test(piece) && isEmoji(piece)) {
	      out.push(Component('span', {
	        'data-linkify-type': 'emoji',
	        children: piece
	      }));
	    } else if (typeof out[out.length - 1] === 'string') {
	      out[out.length - 1] += piece;
	    } else {
	      out.push(piece);
	    }
	  }
	}

	/**
	 * Renders children based on the `range` function arguments
	 *
	 * @type {FlowComponent<
	 * 	{
	 * 		start?: Accessor<number>
	 * 		stop?: Accessor<number>
	 * 		step?: Accessor<number>
	 * 	},
	 * 	Children<(item: number, index: number) => JSX.Element>
	 * >}
	 * @url https://pota.quack.uy/Components/Range
	 */
	const Range = props => Component(For, {
	  each: () => toArray(range(getValue(props.start) ?? 0, getValue(props.stop) ?? 0, getValue(props.step) ?? 1)),
	  children: props.children
	});

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
	const scrollToTop = () => window$1.scrollTo({
	  top: 0,
	  behavior: 'auto'
	});

	/**
	 * Measures the execution time of a function.
	 *
	 * @param {() => void} fn
	 * @returns {number} Duration in milliseconds.
	 */
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

	/**
	 * @param {Partial<import('#type/Route.d.ts').Context>} props
	 * @returns {import('#type/Route.d.ts').Context}
	 */
	function create(props) {
	  /** @type {SignalObject<import('#type/Route.d.ts').Context[]>} */
	  const children = signal(/** @type {import('#type/Route.d.ts').Context[]} */[]);
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
	      children.update(prev => {
	        prev.push(child);
	        return [...prev];
	      });
	      cleanup(() => children.update(prev => {
	        removeFromArray(prev, child);
	        return [...prev];
	      }));
	    },
	    shouldShowDefault: memo(() => {
	      const child = children.read();
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
	const useRoute = context(create(nothing));

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

	const emit = (node, eventName, data = {}) => {
	  ['bubbles', 'cancelable', 'composed'].forEach(item => {
	    if (!(item in data)) {
	      data[item] = true;
	    }
	  });
	  node.dispatchEvent(new CustomEvent(eventName, data));
	};

	// window.location signal

	const locationSignal = signal(location$2.href);

	// only trigger on what changed
	const locationObject = memo(() => new URL(removeNestedProtocol(locationSignal.read())));
	const href = memo(() => locationObject().href);
	const pathname = memo(() => locationObject().pathname);
	// http://location/# reports hash to be empty
	// http://location/ reports hash to be empty
	const hash = memo(() => locationObject().hash || '#');
	const path = memo(() => pathname() + hash());
	const search = memo(() => locationObject().search);
	const searchParams = mutable(/** @type {Record<PropertyKey, string>} */{});
	const searchParamsMemo = memo(() => {
	  const entries = fromEntries(locationObject().searchParams.entries());
	  replace(searchParams, entries);
	  return entries;
	});
	searchParamsMemo();
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
	  /**
	   * Reactive params for the caller's enclosing route chain. The
	   * effect/mutable created here are owned by the caller's scope and
	   * disposed automatically when that scope ends.
	   *
	   * Capture once at component setup (`const p = location.params`) and
	   * read keys reactively from `p`. Do not call `location.params`
	   * inline inside a reactive expression — every access creates a
	   * fresh effect+mutable. Must be called inside an owner scope, or
	   * the inner effect is orphaned.
	   */
	  get params() {
	    const params = mutable(/** @type {Record<PropertyKey, string>} */{});
	    effect(() => {
	      path(); // track URL changes explicitly, not via Route.params
	      const values = empty();
	      useRoute.walk(context => {
	        for (const [key, value] of entries(context.params()())) {
	          values[key] = value !== undefined ? _decodeURIComponent(/** @type {string} */value) : value;
	        }
	      });
	      replace(params, values);
	    });
	    return params;
	  }
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
	      if (!(await Promise.resolve(beforeLeave.cb()).catch(() => false))) {
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
	  locationSignal.write(location$2.href);
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
	  if (await canNavigate(location$2.href)) {
	    locationSignal.write(location$2.href);
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
	 * @type {{
	 * 	<T>(props: {
	 * 		when: When<T>
	 * 		fallback?: JSX.Element
	 * 		children: Children<
	 * 			(arg: SignalAccessor<Accessed<T>>) => JSX.Element
	 * 		>
	 * 	}): JSX.Element
	 * 	(props: {
	 * 		when: When<any>
	 * 		fallback?: JSX.Element
	 * 		children?: JSX.Element
	 * 	}): JSX.Element
	 * }}
	 * @url https://pota.quack.uy/Components/Show
	 */
	const Show = props => {
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
	};

	/**
	 * Scroll to hash first, if doesnt, scroll to positions defined by the
	 * Routes.
	 *
	 * @param {import('#type/Route.d.ts').Context} context
	 */
	function scroll(context) {
	  if (!scrollToLocationHash() && !useRoute.walk(context => {
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
	 * @property {JSX.Element} fallback - Fallback children.
	 * @property {JSX.Element} children - JSX.Element to render.
	 */

	/**
	 * Renders children if the path matches the current location
	 *
	 * @param {Partial<RouteProps>} props
	 * @returns {JSX.Element}
	 * @url https://pota.quack.uy/Components/Route/Route
	 */
	function Route(props) {
	  addListeners();
	  const parent = useRoute();
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
	  const params = signal(() => nothing);
	  const show = memo(() => {
	    const path = location$1.path();

	    // console.log(path, route)

	    if (route.test(path)) {
	      params.write(() => route.exec(path)?.groups || nothing);
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
	    params: params.read,
	    scroll: props.scroll,
	    parent,
	    show
	  });
	  parent.addChild(context);
	  return Component(useRoute.Provider, {
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
	 * @type {ParentComponent}
	 */
	Route.Default = props => {
	  return Component(Show, {
	    when: useRoute().shouldShowDefault,
	    children: props.children
	  });
	};

	/**
	 * Navigates to a new location from JSX
	 *
	 * @type {ParentComponent<{
	 * 	path: string
	 * 	scroll?: boolean
	 * 	replace?: boolean
	 * 	params?: object
	 * 	delay?: number
	 * }>}
	 * @url https://pota.quack.uy/Components/Route/Navigate
	 */
	const Navigate = props => {
	  addListeners();
	  navigateUser(props.path, props);
	  return props.children;
	};

	/**
	 * Creates a link with Route features
	 *
	 * @type {Component<
	 * 	{
	 * 		href: string
	 * 		params?: Record<string, string>
	 * 		replace?: boolean
	 * 	} & JSX.Elements['a']
	 * >}
	 * @url https://pota.quack.uy/Components/Route/A
	 */
	const A = props => {
	  addListeners();
	  const href = useRoute().resolve(replaceParams(props.href, props.params));
	  return Component('a', {
	    ...props,
	    href,
	    params: undefined
	  });
	};

	/**
	 * For dynamic imports. Used as `load(() => import('file.js'))`. It
	 * retries a couple of times on network error. Scrolls the document to
	 * the hash of the url, or fallbacks defined on the `<Route>`
	 * components.
	 *
	 * @template {(...args: any[]) => JSX.Element} C
	 * @param {() => Promise<{ default: C }>} component - Import statement
	 * @returns {C}
	 * @url https://pota.quack.uy/load
	 */
	function load(component, tries = 0) {
	  return markComponent(() => {
	    /**
	     * `owned` preserves the owner across the async boundary so the
	     * loaded component renders in the correct reactive scope.
	     */
	    let fn;
	    const withOwner = markComponent(owned(() => fn()));
	    return component().then(r => {
	      fn = () => {
	        readyAsync(() => scroll(useRoute()));
	        return r.default();
	      };
	      return withOwner;
	    }).catch(e => new Promise(resolve => {
	      if (tries++ < 9) {
	        fn = () => load(component, tries);
	        useTimeout(() => resolve(withOwner), 5000).start();
	      } else {
	        fn = () => {
	          throw e;
	        };
	        resolve(withOwner);
	      }
	    }));
	  });
	}

	const splitterCSS = `
class {
	flex: 0 0 auto;
	background: transparent;
	position: relative;
	z-index: 10;
	touch-action: none;
	align-self: stretch;
}
class[data-orientation='vertical'] {
	width: 8px;
	min-height: 100%;
	cursor: col-resize;
	margin-left: -3px;
	margin-right: -3px;
}
class[data-orientation='horizontal'] {
	height: 8px;
	min-width: 100%;
	cursor: row-resize;
	margin-top: -3px;
	margin-bottom: -3px;
}
class:hover,
class[data-dragging] {
	background: rgba(140, 154, 165, 0.35);
}
`;

	/**
	 * Resizable splitter. Place between two sibling elements inside a
	 * flex container; dragging resizes the sibling on one side.
	 *
	 * @type {Component<{
	 * 	orientation?: 'vertical' | 'horizontal'
	 * 	target?: 'prev' | 'next'
	 * 	min?: number
	 * 	max?: number
	 * 	initial?: number
	 * 	persist?: string
	 * 	class?: string
	 * }>}
	 * @url https://pota.quack.uy/Components/Splitter
	 */
	const Splitter = props => {
	  const handle = ref();
	  const orientation = props.orientation ?? 'vertical';
	  const targetSide = props.target ?? 'prev';
	  const min = props.min ?? 0;
	  const max = props.max ?? Infinity;
	  const dimension = orientation === 'vertical' ? 'width' : 'height';
	  const clientCoord = orientation === 'vertical' ? 'clientX' : 'clientY';
	  const offsetDim = orientation === 'vertical' ? 'offsetWidth' : 'offsetHeight';
	  const stored = props.persist ? Number(localStorage.getItem(props.persist)) : 0;
	  const initial = stored && Number.isFinite(stored) && stored > 0 ? stored : props.initial;
	  const size = signal(initial ?? null);
	  const dragging = signal(false);
	  ready(() => {
	    const node = handle();
	    const target = /** @type {HTMLElement | null} */

	    targetSide === 'prev' ? node.previousElementSibling : node.nextElementSibling;
	    if (!target) return;
	    const applySize = px => {
	      target.style[dimension] = px + 'px';
	      if (orientation === 'vertical') {
	        target.style.maxWidth = px + 'px';
	        target.style.minWidth = px + 'px';
	      } else {
	        target.style.maxHeight = px + 'px';
	        target.style.minHeight = px + 'px';
	      }
	    };
	    if (size.read() != null) applySize(size.read());
	    let active = false;
	    let startCoord = 0;
	    let startSize = 0;
	    const onPointerDown = e => {
	      active = true;
	      dragging.write(true);
	      startCoord = e[clientCoord];
	      startSize = target[offsetDim];
	      node.setPointerCapture(e.pointerId);
	      document.body.style.userSelect = 'none';
	      document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
	      e.preventDefault();
	    };
	    const onPointerMove = e => {
	      if (!active) return;
	      const delta = e[clientCoord] - startCoord;
	      const sign = targetSide === 'prev' ? 1 : -1;
	      const next = Math.max(min, Math.min(max, startSize + delta * sign));
	      size.write(next);
	      applySize(next);
	    };
	    const onPointerUp = e => {
	      if (!active) return;
	      active = false;
	      dragging.write(false);
	      try {
	        node.releasePointerCapture(e.pointerId);
	      } catch {}
	      document.body.style.userSelect = '';
	      document.body.style.cursor = '';
	      if (props.persist && size.read() != null) {
	        localStorage.setItem(props.persist, String(size.read()));
	      }
	    };
	    node.addEventListener('pointerdown', onPointerDown);
	    node.addEventListener('pointermove', onPointerMove);
	    node.addEventListener('pointerup', onPointerUp);
	    node.addEventListener('pointercancel', onPointerUp);
	    cleanup(() => {
	      node.removeEventListener('pointerdown', onPointerDown);
	      node.removeEventListener('pointermove', onPointerMove);
	      node.removeEventListener('pointerup', onPointerUp);
	      node.removeEventListener('pointercancel', onPointerUp);
	      target.style[dimension] = '';
	      if (orientation === 'vertical') {
	        target.style.maxWidth = '';
	        target.style.minWidth = '';
	      } else {
	        target.style.maxHeight = '';
	        target.style.minHeight = '';
	      }
	      document.body.style.userSelect = '';
	      document.body.style.cursor = '';
	    });
	  });
	  return Component('div', {
	    'use:ref': handle,
	    'use:css': splitterCSS,
	    class: props.class,
	    'data-orientation': orientation,
	    'data-dragging': dragging.read,
	    role: 'separator',
	    'aria-orientation': orientation
	  });
	};

	/**
	 * Renders the first child that matches the given `when` condition, or
	 * a fallback in case of no match
	 *
	 * @type {FlowComponent<{ fallback?: JSX.Element }>}
	 * @url https://pota.quack.uy/Components/Switch
	 */
	const Switch = props => {
	  const matches = resolve(() => isArray(props.children) ? props.children : [props.children]);
	  const fallback = isNullUndefined(props.fallback) ? memo(() => {
	    const r = matches().find(match => !('when' in match));
	    return r && r.children;
	  }) : memo(() => resolve(props.fallback));
	  const match = memo(() => matches().find(match => !!getValue(match.when)));
	  const value = memo(() => match() && getValue(match().when));
	  const callback = memo(() => match() && makeCallback(match().children));
	  return memo(() => match() ? callback()(value) : fallback);
	};

	/**
	 * Renders the content if the `when` condition is true. Without a
	 * `when` prop, acts as the internal fallback branch for `Switch`.
	 *
	 * @type {{
	 * 	<T>(props: {
	 * 		when: When<T>
	 * 		children: Children<
	 * 			(value: SignalAccessor<Accessed<T>>) => JSX.Element
	 * 		>
	 * 	}): JSX.Element
	 * 	<T>(props: {
	 * 		when: When<T>
	 * 		children?: JSX.Element
	 * 	}): JSX.Element
	 * 	(props: { children?: JSX.Element }): JSX.Element
	 * }}
	 * @url https://pota.quack.uy/Components/Switch
	 */
	const Match = identity;

	const Context = context({
	  selected: signal({
	    id: 0,
	    name: ''
	  }),
	  group: 0
	});

	/**
	 * Renders a list of tabs
	 *
	 * @param {Merge<
	 * 	JSX.Elements['nav'],
	 * 	{
	 * 		children: JSX.Element
	 * 	}
	 * >} props
	 *   - `children` is expected to be `Tabs.Label` elements. Not enforced by
	 *       TypeScript: JSX expressions always resolve to `JSX.Element`,
	 *       so the specific component identity cannot be constrained at
	 *       the type level.
	 *
	 * @url https://pota.quack.uy/Components/Tabs
	 */
	function Labels(props) {
	  const context = Context();
	  const group = context.group;
	  const selected = context.selected;
	  function onTabClick(event, group, id, name, props) {
	    selected.write({
	      id,
	      name
	    });
	    props.onClick && props.onClick({
	      event,
	      group,
	      id,
	      props
	    });
	  }
	  const {
	    children,
	    ...rest
	  } = props;
	  return Component('nav', {
	    role: 'tablist',
	    ...rest,
	    children: Component(For, {
	      each: () => [children].flat(),
	      children: (props, id) => {
	        // @ts-ignore
	        props = props();
	        const {
	          // @ts-ignore
	          children,
	          // @ts-ignore
	          onClick,
	          // @ts-ignore
	          selected: defaultSelected,
	          // @ts-ignore
	          hidden,
	          // @ts-ignore
	          name,
	          // @ts-ignore
	          ...rest
	        } = props;
	        if (defaultSelected || selected.read().id === id) selected.write({
	          id,
	          name
	        });
	        return Component(Show, {
	          when: () => !getValue(hidden),
	          children: Component('button', {
	            id: `tab-${group}-${id}`,
	            role: 'tab',
	            'aria-selected': () => selected.read().id === id ? 'true' : 'false',
	            'aria-controls': `tab-panel-${group}-${id}`,
	            'on:click': e => onTabClick(e, group, id, name, props),
	            ...rest,
	            children
	          })
	        });
	      }
	    })
	  });
	}

	/**
	 * Passthrough for label in TabList
	 *
	 * @param {Merge<
	 * 	JSX.Elements['button'],
	 * 	{
	 * 		selected?: boolean
	 * 		name?: string
	 * 		hidden?: Accessor<boolean>
	 * 		onClick?: (info: {
	 * 			event: Event
	 * 			group: number
	 * 			id: number
	 * 			props: {
	 * 				name?: string
	 * 				selected?: boolean
	 * 				hidden?: Accessor<boolean>
	 * 				[key: string]: any
	 * 			}
	 * 		}) => void
	 * 	}
	 * >} props
	 * @url https://pota.quack.uy/Components/Tabs
	 */
	function Label(props) {
	  return props;
	}

	/**
	 * Renders a tab panel with contents
	 *
	 * `props.children` is expected to be `Tabs.Panel` elements. Not
	 * enforced by TypeScript: JSX expressions always resolve to
	 * `JSX.Element`, so the specific component identity cannot be
	 * constrained at the type level.
	 *
	 * @param {object} props
	 * @param {JSX.Element} [props.children]
	 * @returns {JSX.Element}
	 * @url https://pota.quack.uy/Components/Tabs
	 */
	function Panels(props) {
	  const context = Context();
	  const {
	    selected,
	    group
	  } = context;
	  return Component(For, {
	    each: () => [props.children].flat(),
	    children: (props, id) => {
	      // @ts-ignore
	      const {
	        collapse,
	        children,
	        ...rest
	      } = props();
	      return Component(Dynamic, {
	        component: collapse ? Collapse : Show,
	        when: () => selected.read().id === id,
	        children: Component('section', {
	          id: `tab-panel-${group}-${id}`,
	          'aria-labelledby': `tab-${group}-${id}`,
	          ...rest,
	          children
	        })
	      });
	    }
	  });
	}

	/**
	 * Passthrough for content in TabPanel
	 *
	 * @param {Merge<
	 * 	JSX.Elements['section'],
	 * 	{
	 * 		collapse?: boolean
	 * 	}
	 * >} props
	 *   - Leftover props are passed to the section container
	 *
	 * @url https://pota.quack.uy/Components/Tabs
	 */
	function Panel(props) {
	  return props;
	}

	let group = 0;

	/**
	 * Context wrapper for tabs
	 *
	 * @param {{
	 * 	selected?: number
	 * 	children?: JSX.Element
	 * }} props
	 * @returns {JSX.Element}
	 * @url https://pota.quack.uy/Components/Tabs
	 */
	function Tabs(props) {
	  return Component(Context.Provider, {
	    value: {
	      selected: signal({
	        id: props.selected || 0,
	        name: ''
	      }),
	      group: group++
	    },
	    children: props.children
	  });
	}
	Tabs.Labels = Labels;
	Tabs.Label = Label;
	Tabs.Panels = Panels;
	Tabs.Panel = Panel;
	Tabs.selected = () => Context().selected;

	/**
	 * Resolves children as text. It creates 1 effect that contains all
	 * the children, instead of each child with its own effect.
	 *
	 * @type {FlowComponent}
	 * @url https://pota.quack.uy/Components/Normalize
	 */
	const Normalize = props => () =>
	// returnng null when string is empty avoids 1 text node
	unwrap(/** @type {any[]} */[props.children]).map(x => x?.toString()).join('') || null;

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
	  /**
	   * Static base stylesheets for the custom element.
	   *
	   * @type {(CSSStyleSheet | string)[]}
	   */
	  static baseStyleSheets = [];

	  /**
	   * Static additional stylesheets for the custom element.
	   *
	   * @type {(CSSStyleSheet | string)[]}
	   */
	  static styleSheets = [];
	  constructor() {
	    super();
	    const shadowRoot = this.attachShadow({
	      mode: 'open'
	    });

	    // this is needed because `baseStyleSheets/styleSheets` are `static`
	    const constructor = /** @type {typeof CustomElement} */
	    this.constructor;
	    addStyleSheets(shadowRoot, constructor.baseStyleSheets);
	    addStyleSheets(shadowRoot, constructor.styleSheets);
	  }

	  /* DOM API */

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

	  /* EVENTS API */

	  /**
	   * Emits an event
	   *
	   * @param {string} eventName
	   * @param {CustomEventInit} [data]
	   */
	  emit(eventName, data) {
	    emit(this, eventName, data);
	  }
	}

	var components = /*#__PURE__*/Object.freeze({
		__proto__: null,
		A: A,
		Collapse: Collapse,
		CustomElement: CustomElement,
		Dynamic: Dynamic,
		Errored: Errored,
		For: For,
		Head: Head,
		Linkify: Linkify,
		Match: Match,
		Navigate: Navigate,
		Normalize: Normalize,
		Portal: Portal,
		Range: Range,
		Route: Route,
		Show: Show,
		Splitter: Splitter,
		Suspense: Suspense,
		Switch: Switch,
		Tabs: Tabs,
		customElement: customElement,
		load: load
	});

	/** @type {Record<string, JSX.ElementType>} */
	const defaultRegistry = assign(empty(), components, {
	  load: undefined,
	  customElement: undefined,
	  CustomElement: undefined
	});

	/**
	 * Sentinel used to splice `values` into the template string so the
	 * XML parser preserves interpolation positions. Chosen to be unlikely
	 * to collide with anything a user might write in a literal.
	 */
	const id = 'rosa19611227';
	const splitId = /(rosa19611227)/;

	/**
	 * Parses a template's strings into a DOM node list. Cached by
	 * template identity so the (expensive) DOMParser only runs once per
	 * source location, even across `XML()` instances — only the
	 * per-instance compile step depends on the registry.
	 *
	 * @param {TemplateStringsArray} template
	 * @returns {ChildNode[]}
	 */
	const parse = withWeakCache((/** @type {TemplateStringsArray} */template) => {
	  const parsed = /** @type {NodeListOf<ChildNode>} */
	  new DOMParser().parseFromString(`<xml ${namespaces.xmlns}>${template.join(id)}</xml>`, 'text/xml').firstChild.childNodes;
	  const first = /** @type {HTMLElement} */parsed[0];
	  if (first?.tagName === 'parsererror') {
	    first.style.padding = '1em';
	    first.style.whiteSpace = 'pre-line';
	    first.innerText = first.childNodes[1].textContent + '\n' + template.join('$v');
	  }
	  return toArray(parsed);
	});

	/**
	 * Builds a per-instance template cache for the given `xml`. Each
	 * `XML()` calls this once at construction; the returned function
	 * memoizes compiled factories by template identity, so when the `xml`
	 * instance is collected its template factories go with it.
	 *
	 * Trade-off: `xml.define` must happen before the first `xml\`...``
	 * invocation that uses the new tag — registering a name after a
	 * template has been compiled won't retroactively rebind it.
	 *
	 * @param {{ components: Record<string, JSX.ElementType> }} xml
	 */
	const compile = xml => withWeakCache((/** @type {TemplateStringsArray} */template) => {
	  const next = {
	    i: 0
	  };
	  const builders = parse(template).map(n => compileNode(n, next, xml)).filter(b => b);
	  return (/** @type {unknown[]} */values) => unwrapArray(builders.map(b => b(values)));
	});

	/**
	 * Walks a parsed DOM node once and returns a builder function that
	 * emits the corresponding JSX element on demand. The `xml` argument
	 * is consulted at compile time to resolve registered components, so
	 * each `XML()` instance compiles its own builder set.
	 *
	 * @param {ChildNode} node
	 * @param {{ i: number }} next Compile-time slot counter, threaded
	 *   through the walk so each interpolation point bakes its own fixed
	 *   index into `values`. Not referenced at render time.
	 * @param {{ components: Record<string, JSX.ElementType> }} xml
	 * @returns {(values: unknown[]) => JSX.Element}
	 */
	function compileNode(node, next, xml) {
	  switch (node.nodeType) {
	    case 1:
	      {
	        /* element */
	        const {
	          tagName,
	          attributes,
	          childNodes
	        } = /** @type {DOMElement} */node;

	        /** @type {Record<string, string>} */
	        const staticProps = empty();
	        /** @type {((props: any, values: unknown[]) => void)[]} */
	        const setters = [];
	        for (const {
	          name,
	          value
	        } of attributes) {
	          if (value === id) {
	            const valIdx = next.i++;
	            setters.push((props, values) => {
	              props[name] = values[valIdx];
	            });
	          } else if (value.includes(id)) {
	            /** Bake each `id` marker's slot index; literals stay strings */
	            const segments = value.split(splitId).map(x => x === id ? next.i++ : x);
	            setters.push((props, values) => {
	              const snap = segments.map(s => isString(s) ? s : values[s]);
	              props[name] = () => snap.map(getValue).join('');
	            });
	          } else {
	            /**
	             * Literal — collected once at compile time; folded into the
	             * per-render `props` object via a single `assign` rather
	             * than a per-attribute closure call.
	             */
	            staticProps[name] = value;
	          }
	        }
	        const children = childNodes.length ? toArray(childNodes).map(n => compileNode(n, next, xml)).filter(b => b) : null;

	        /**
	         * Resolve the component-or-tagName at compile time using the
	         * owning `xml` instance's registry. Registered names (any case)
	         * resolve to the component value. Names not in the registry
	         * fall through to `tagName` — `Component` then routes string
	         * tags through `createTag`, which handles standard HTML/SVG and
	         * hyphenated custom elements alike. Uppercase misses are likely
	         * typos so we warn once per template; hyphenated / lowercase
	         * misses are legitimate (real custom elements) and stay quiet.
	         */
	        const component = xml.components[tagName];
	        if (!component && /^[A-Z]/.test(tagName)) {
	          warn(`xml: Forgot to ´xml.define({ ${tagName} })´?`);
	        }
	        const value = component || tagName;
	        return values => {
	          /** @type {Record<string, unknown>} */
	          const props = assign(empty(), staticProps);
	          for (const set of setters) set(props, values);
	          if (children && children.length) {
	            props.children = unwrapArray(children.map(child => child(values)));
	          }
	          return Component(value, props);
	        };
	      }
	    case 3:
	      {
	        /**
	         * Text — clean whitespace at compile time using JSX rules so
	         * xml↔jsx round-trips don't have to fix up whitespace. The
	         * interpolation marker has no whitespace, so the cleaner
	         * preserves it in place; pure-whitespace text drops out.
	         */
	        const value = cleanJSXText(node.nodeValue);
	        if (!value) return null;
	        if (value.includes(id)) {
	          const segments = value.split(splitId).map(x => x === id ? next.i++ : x);
	          return values => segments.map(s => isString(s) ? s : values[s]);
	        }
	        return () => value;
	      }
	    case 8:
	      {
	        /* comment */
	        const value = node.nodeValue;
	        if (value.includes(id)) {
	          const segments = value.split(splitId).map(x => x === id ? next.i++ : x);
	          return values => {
	            /**
	             * Reuse one Comment node and mutate its nodeValue so
	             * reactive updates don't replace the node on every read
	             */
	            const comment = createComment('');
	            const snap = segments.map(s => isString(s) ? s : values[s]);
	            return () => {
	              comment.nodeValue = snap.map(getValue).join('');
	              return comment;
	            };
	          };
	        }
	        return () => createComment(value);
	      }
	    default:
	      {
	        error(`xml: ´nodeType´ not supported ´${node.nodeType}´`);
	        return () => null;
	      }
	  }
	}

	/**
	 * Function to create a cached tagged template components namespace.
	 *
	 * @returns {((
	 * 	template: TemplateStringsArray,
	 * 	...values: unknown[]
	 * ) => JSX.Element) & {
	 * 	components: Record<string, JSX.ElementType>
	 * 	define: (userComponents: Record<string, JSX.ElementType>) => void
	 * }}
	 * @url https://pota.quack.uy/XML
	 */
	function XML() {
	  /**
	   * Creates tagged template components.
	   *
	   * Templates are parsed as `text/xml`, so elements must be
	   * well-formed: void elements need a trailing slash (`<br/>`, `<img
	   * src=""/>`), every open tag must be closed, and attribute values
	   * must be quoted. Ill-formed input renders a `parsererror` element
	   * instead of throwing.
	   *
	   * @param {TemplateStringsArray} template
	   * @param {...unknown} values
	   * @url https://pota.quack.uy/XML
	   */
	  function xml(template, ...values) {
	    return compiled(template)(values);
	  }
	  xml.components = assign(empty(), defaultRegistry);
	  /**
	   * Registers custom components that can be referenced by tag name.
	   * Must be called before the first `xml\`...`` invocation that
	   * references the new tag — once a template is compiled, its
	   * component-vs-element decisions are fixed.
	   *
	   * @param {Record<string, JSX.ElementType>} userComponents
	   */
	  xml.define = userComponents => {
	    for (const name of keys(userComponents)) {
	      xml.components[name] = userComponents[name];
	    }
	  };

	  /**
	   * Hoist the per-instance template cache out of the per-render hot
	   * path — `compile(xml)` is memoized but still costs a WeakMap
	   * lookup; storing the inner directly skips that on every render.
	   */
	  const compiled = compile(xml);
	  return xml;
	}
	const xml = XML();

	/**
	 * Returns a `function` that receives as a second argument whats
	 * returned from it.
	 *
	 * @template T
	 * @param {(next: T, previous: T) => T} fn
	 */
	function usePrevious(fn) {
	  let previous;

	  /** @param {T} [next] */
	  return next => {
	    previous = fn(next, previous);
	    return previous; // for testing
	  };
	}

	let idCounter = 1;
	function buildData(count) {
	  const data = new Array(count);
	  for (let i = 0; i < count; i++) {
	    const label = signal('elegant green keyboard');
	    data[i] = {
	      id: idCounter++,
	      label: label.read,
	      update: label.update
	    };
	  }
	  return data;
	}
	const Button = ({
	  id,
	  text,
	  fn
	}) => xml`<div class="col-sm-6 smallpad">
		<button
			prop:textContent="${text}"
			id="${id}"
			type="button"
			class="btn btn-primary btn-block"
			on:click="${fn}"
		/>
	</div>`;
	const App = () => {
	  const data = signal([]),
	    run = () => {
	      // debugger
	      data.write(buildData(10));
	    },
	    runLots = () => {
	      data.write(buildData(10000));
	    },
	    bench = () => {
	      //  console.clear()
	      // warm
	      // debugger
	      for (let k = 0; k < 5; k++) {
	        data.write(buildData(1));
	        data.write([]);
	      }
	      let createLarge = 0;
	      let clearLarge = 0;
	      let createSmall = 0;
	      let clearSmall = 0;
	      const results = [];
	      for (let k = 0; k < 10; k++) {
	        createLarge += timing(() => data.write(buildData(10000)));
	        clearLarge += timing(() => data.write([]));
	        results.push(`
					createLarge ${(createLarge / (k + 1)).toFixed(2)} clearLarge ${(clearLarge / (k + 1)).toFixed(2)}
				`);
	      }
	      for (let k = 0; k < 10; k++) {
	        createSmall += timing(() => data.write(buildData(1000)));
	        clearSmall += timing(() => data.write([]));
	        results.push(`
					createSmall ${(createSmall / (k + 1)).toFixed(2)} clearSmall ${(clearSmall / (k + 1)).toFixed(2)}
				`);
	      }
	      for (const item of results) console.log(item.trim());
	      console.log('------------', version);
	    },
	    add = () => {
	      data.update(d => [...d, ...buildData(1000)]);
	    },
	    update = () => {
	      const d = data.read();
	      for (let i = 0; i < d.length; i += 10) d[i].update(l => l + ' !!!');
	    },
	    swapRows = () => {
	      const d = [...data.read()];
	      const tmp = d[1];
	      d[1] = d[998];
	      d[998] = tmp;
	      data.write(d);
	    },
	    clear = () => {
	      data.write([]);
	    },
	    remove = id => {
	      data.update(d => {
	        const idx = d.findIndex(datum => datum.id === id);
	        d.splice(idx, 1);
	        return [...d];
	      });
	    },
	    danger = usePrevious((next, previous) => {
	      next.setAttribute('class', 'danger');
	      if (previous) {
	        previous.removeAttribute('class');
	      }
	      return next;
	    });
	  xml.define({
	    Button
	  });
	  return xml`<div class="container">
		<div class="jumbotron">
			<div class="row">
				<div class="col-md-6">
					<h1>pota Keyed</h1>
				</div>
				<div class="col-md-6">
					<div class="row">
						<Button
							id="run"
							text="Create 1,000 rows"
							fn="${run}"
						/>
						<Button
							id="runlots"
							text="Create 10,000 rows"
							fn="${runLots}"
						/>
						<Button
							id="add"
							text="Append 1,000 rows"
							fn="${add}"
						/>
						<Button
							id="update"
							text="Update every 10th row"
							fn="${update}"
						/>
						<Button
							id="clear"
							text="Clear"
							fn="${clear}"
						/>
						<Button
							id="swaprows"
							text="Swap Rows"
							fn="${swapRows}"
						/>
						<Button
							id="bench"
							text="bench"
							fn="${bench}"
						/>
					</div>
				</div>
			</div>
		</div>
		<table class="table table-hover table-striped test-data">
			<tbody
				on:click="${e => {
    const element = e.target;
    if ('remove' in element.dataset) {
      remove(+element.parentNode.parentNode.parentNode.firstChild.textContent);
    } else if ('select' in element.dataset) {
      danger(element.parentNode.parentNode);
    }
  }}"
			>
				<For each="${data.read}">
					${row => xml`<tr>
						<td
							prop:textContent="${row.id}"
							class="col-md-1"
						/>
						<td class="col-md-4">
							<a
								data-select=""
								prop:textContent="${row.label}"
							/>
						</td>
						<td class="col-md-1">
							<a>
								<span
									data-remove=""
									aria-hidden="true"
									class="glyphicon glyphicon-remove"
								/>
							</a>
						</td>
						<td class="col-md-6" />
					</tr>`}
				</For>
			</tbody>
		</table>
		<span
			aria-hidden="true"
			class="preloadicon glyphicon glyphicon-remove"
		/>
	</div>`;
	};
	render$1(App, document.getElementById('main'));

})();
//# sourceMappingURL=main.js.map
