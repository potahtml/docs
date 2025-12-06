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
	const getOwnPropertyDescriptors = Object$1.getOwnPropertyDescriptors;
	const getOwnPropertyNames = Object$1.getOwnPropertyNames;
	const getOwnPropertySymbols = Object$1.getOwnPropertySymbols;
	const getPrototypeOf = Object$1.getPrototypeOf;
	const is = Object$1.is;
	const isExtensible = Object$1.isExtensible;
	const toArray = Array$1.from;

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
	const stringify = JSON.stringify;

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
	const redefineProperty = (target, key, descriptor) => defineProperty(target, key, assign(create$1(redefinePropertyDefailts), descriptor));
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
	 * Returns `true` when `typeof` of `value` is `symbol`
	 *
	 * @param {unknown} value
	 * @returns {value is symbol}
	 */
	const isSymbol = value => typeof value === 'symbol';

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
	      if (!this.cleanups) ; else if (this.cleanups === fn) {
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
	      if (!this.owned) ; else if (isArray(this.owned)) {
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
	      if (!this.cleanups) ; else if (isArray(this.cleanups)) {
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
	    run = () => {
	      this.update();
	    };
	    update() {
	      this.dispose();
	      runWith(() => {
	        // @ts-expect-error
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
	   */
	  /* #__NO_SIDE_EFFECTS__ */
	  const derived = /** @type {import('./derived.d.ts').derived} */
	  /** @type {unknown} */(...fn) => (/** @type {import('./derived.d.ts').derived} */
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
	   */
	  const resolve = (value, cbs) => isFunction(value) ? track(() => resolve(getValue(value), cbs)) : isPromise(value) ? value.then(owned(value => resolve(value, cbs))) : cbs.length ? resolve(() => cbs[0](value), cbs.slice(1)) : value;

	  /**
	   * Unwraps functions and promises recursively canceling if owner
	   * gets disposed
	   *
	   * @type {import('./action.d.ts').action}
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
	  batch,
	  cleanup,
	  context,
	  createSuspenseContext,
	  effect,
	  memo,
	  owned,
	  root,
	  signal,
	  syncEffect,
	  untrack,
	  useSuspense,
	  withValue
	} = createReactiveSystem();

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
	      if (rows.length > 1 && prev.length) {
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

	const document$1 = window.document;
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

	/**
	 * @returns {Element | undefined} The root `<html>` element if
	 *   available.
	 */
	const documentElement = document$1?.documentElement;

	/** DocumentFragment constructor exposed for convenience. */
	const DocumentFragment = window.DocumentFragment;

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
	bind('importNode');
	const createTreeWalker = bind('createTreeWalker');

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
	 * Queue a function to run after all user defined processes
	 *
	 * @param {() => void} fn
	 */
	const onDone = fn => add(4, fn);

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
	function insert(children, parent = document$1.body, options = nothing) {
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
	 * @template T
	 * @param {Dynamic<T>} props
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
	 * @param {boolean} [props.reactiveIndex] - Make indices reactive
	 *   signals
	 * @param {(item: T, index: number) => Children} [props.children]
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
	 * @param {object} props
	 * @param {DOMElement} props.mount
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
	 * @param {number} [props.start]
	 * @param {number} [props.stop]
	 * @param {number} [props.step]
	 * @param {Children} [props.children]
	 * @returns {Children}
	 */

	const Range = props => Component(For, {
	  each: toArray(range(props.start ?? 0, props.stop ?? 0, props.step ?? 1)),
	  children: props.children
	});

	const constructorsTracked = [Object, Array, Map, undefined /** Object.create(null) */];

	/**
	 * Returns `true` when `object` can't be made mutable.
	 *
	 * @param {any} target
	 */
	const isMutationBlacklisted = target => constructorsBlacklist.has(target.constructor) || isGeneratorFunction(target);
	const constructorsBlacklist = new Set(Object.getOwnPropertyNames(window).map(value => window[value]));
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
	...getOwnValues(Symbol).filter(isSymbol)]);

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
	const createTracker = () => new Track();

	/**
	 * Returns a tracker for an object. A tracker is unique per object,
	 * always the same tracker for the same object.
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
	const Values = Symbol('Values');
	const Keys = Symbol('Keys');
	const Value = 'Value';
	const Key = 'Key';
	const isUndefined = 'isUndefined';
	const kinds = {
	  __proto__: null,
	  [Value]: undefined,
	  [Key]: undefined,
	  [isUndefined]: undefined
	};
	class Track {
	  // id = Date.now()

	  #props = empty();
	  #prop(kind, key, value, equalsType) {
	    if (!(key in this.#props)) {
	      this.#props[key] = create$1(kinds);
	    }
	    if (this.#props[key][kind] === undefined) {
	      this.#props[key][kind] = signal(value, equalsType);
	    }
	    return this.#props[key][kind];
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
	  const getter = descriptor.get?.bind(target);
	  const setter = descriptor.set?.bind(target);

	  /** Needs to wrap to recurse the object */
	  if (!setter && wrapper) {
	    value = wrapper(value);
	  }
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
	      return track.valueRead(key, value);
	    } : () => {
	      value = wrapper(value);
	      return track.valueRead(key, value);
	    },
	    set: /** When it's only a getter it shouldn't have a setter */
	    getter && !setter ? undefined : setter ? val => {
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
	    this.track.keyRead(key, r);
	    return r;
	  }
	  deleteProperty(target, key) {
	    /** To not trigger effects when the property isn't in the object */
	    if (!(key in target)) {
	      return true;
	    }
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
	    return reflectGetOwnPropertyDescriptor(target, key);
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

	    /** To be able to track properties not yet set */
	    if (!(key in target)) {
	      this.track.isUndefinedRead(key, true);
	    }
	    const value = reflectGet(target, key, proxy);
	    return isFunction(value) ? this.returnFunction(target, key, value, proxy) : this.track.valueRead(key, this.returnValue(target, key, value));
	  }
	  set(target, key, value, proxy) {
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
	    handler.track.valuesRead();
	    reflectApply(value, target, args);
	  },
	  map(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  every(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  some(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
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
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  reduce(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  reduceRight(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  // lib.es2015.core.d.ts

	  find(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  findIndex(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
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
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
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
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
	  },
	  findLastIndex(handler, target, value, args, proxy) {
	    handler.track.valuesRead();
	    return reflectApply(value, target, args);
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

	    /** To be able to track properties not yet set */
	    if (!(key in target)) {
	      this.track.isUndefinedRead(key, true);
	    }
	    const value = reflectGet(target, key, proxy);
	    return isFunction(value) ? this.returnFunction(target, key, value, proxy) : this.returnValue(target, key, value);
	  }
	  set(target, key, value, proxy) {
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
	 * Proxy for objects. In objects, values are tracked by the
	 * setter/getters in the properties.
	 */
	class ProxyHandlerMap extends ProxyHandlerObject {
	  // type = 'Map'

	  constructor(value) {
	    super(value);
	    this.trackSlot = tracker(empty());
	  }
	  get(target, key, proxy) {
	    if (key === $isMutable) {
	      return true;
	    }

	    /** To be able to track properties not yet set */
	    if (!(key in target)) {
	      this.track.isUndefinedRead(key, true);
	    }

	    /**
	     * Tracking + value For whatever reason `size` is special for
	     * `Map`
	     */

	    const value = key === 'size' ? this.track.valueRead(key, reflectGet(target, key, target)) : reflectGet(target, key, proxy);
	    return isFunction(value) ? this.returnFunction(target, key, value, proxy) : this.returnValue(target, key, value);
	  }
	  returnFunction(target, key, value, proxy) {
	    /**
	     * 1. `Reflect.apply` to correct `receiver`. `TypeError: Method
	     *    Set.prototype.add called on incompatible receiver #<Set>`
	     * 2. Run in a batch to react to all changes at the same time.
	     */
	    return (...args) => batch(() => mutable(key in mapMethods ? mapMethods[key](this, this.trackSlot, target, value, args, proxy) : reflectApply(value, target, args)));
	  }
	}

	/**
	 * Like Map but tracks.
	 *
	 * 1. Instances are supposed to be used Proxied, so theres no need for
	 *    batching, because the proxy already batches the functions.
	 * 2. This is an internal Class and is not meant to be used outside
	 *    `mutable`.
	 */

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
	    trackSlot.valuesRead();
	    trackSlot.keysRead();
	    for (const [key, value] of target.entries()) {
	      trackSlot.valueRead(key, value);
	      cb(value, key, proxy);
	    }
	  },
	  *keys(handler, trackSlot, target, value, args, proxy) {
	    for (const key of target.keys()) {
	      trackSlot.keyRead(key, true);
	      yield key;
	    }

	    // for when empty and for when iterating all
	    trackSlot.keysRead();
	  },
	  *values(handler, trackSlot, target, value, args, proxy) {
	    for (const [key, value] of target.entries()) {
	      trackSlot.valueRead(key, value);
	      yield value;
	    }

	    // for when empty and for when iterating all
	    trackSlot.valuesRead();
	    trackSlot.keysRead();
	  },
	  *entries(handler, trackSlot, target, value, args, proxy) {
	    for (const entry of target.entries()) {
	      trackSlot.valueRead(entry[0], entry[1]);
	      yield entry;
	    }

	    // for when empty and for when iterating all
	    trackSlot.valuesRead();
	    trackSlot.keysRead();
	  },
	  [iterator](handler, trackSlot, target, value, args, proxy) {
	    return this.entries(handler, trackSlot, target, value, args, proxy);
	  }
	};

	/**
	 * Copies an object leaving native/built-ins intact
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
	  const c = /** @type {T} */isArray(o) ? [] : (/** @type {{ [key: string]: unknown }} */{});
	  seen.set(o, c);
	  for (const k in o) {
	    // @ts-expect-error
	    c[k] = copy(o[k], seen);
	  }
	  // @ts-expect-error
	  return c;
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

	  /** Avoid unwrapping external proxies */
	  if (value[$isMutable]) {
	    return value;
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
	    return value;
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

	  /** An intance of something we dont have a special handler for it */
	  proxy = createProxy(value, ProxyHandlerObject);
	  signalifyObject(value, mutable);
	  return proxy;
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
	 * Returns a `isSelected` function that will return `true` when the
	 * argument for it matches the original signal `value`.
	 *
	 * @param {SignalAccessor<unknown>} value - Signal with the current
	 *   value
	 */
	function useSelector(value) {
	  const map = new Map();
	  let prev = [];
	  syncEffect(() => {
	    const val = value();
	    const selected = isIterable(val) ? toArray(
	    // @ts-expect-error, no idea how to type this
	    val.values()) : val === undefined ? [] : [val];

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

	/** Re-export of the platform `encodeURIComponent`. */
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

	/// <Reference path="./context.js.d.ts"/>


	/**
	 * @param {Partial<RouteContext>} props
	 * @returns {RouteContext}
	 */
	function create(props) {
	  /** @type SignalObject<RouteContext[]> */
	  const [children, _, updateChildren] = signal(/** @type {RouteContext[]} */[]);
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
	const useRoute = context(create(nothing));

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
	const searchParams = mutable(/** @type {Record<PropertyKey, string>} */{});
	const searchParamsMemo = memo(() => {
	  const entries = fromEntries(locationObject().searchParams.entries());
	  replace(searchParams, entries);
	  return entries;
	});
	searchParamsMemo();
	const params = mutable(/** @type {Record<PropertyKey, string>} */{});
	const paramsMemo = memo(() => {
	  const values = empty();
	  useRoute.walk(context => {
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
	 * @param {When<T>} props.when
	 * @param {Children} [props.fallback]
	 * @param {(arg: T) => Children} [props.children]
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
	 *
	 * @param {RouteContext} context
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
	 * @param {object} props
	 * @param {Children} [props.children]
	 * @returns {Children}
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
	  const href = useRoute().resolve(replaceParams(props.href, props.params));
	  return Component('a', {
	    ...props,
	    href,
	    params: undefined
	  });
	}

	/**
	 * Provides a fallback till children promises resolve (recursively)
	 *
	 * @template T
	 * @param {object} props
	 * @param {Children} [props.fallback]
	 * @param {Children} [props.children]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Suspense
	 */
	const Suspense = props => useSuspense(new createSuspenseContext(), () => {
	  const children = toHTMLFragment(props.children);
	  const context = useSuspense();
	  // for when `Suspense` was used with children that dont have promises
	  return context.isEmpty() ? children : memo(() => context.s.read() ? children : props.fallback);
	});

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
	  Suspense,
	  Switch
	};

	// parseXML

	const id = 'rosa19611227';
	const splitId = /(rosa19611227)/;

	/**
	 * Makes Nodes from TemplateStringsArray
	 *
	 * @param {TemplateStringsArray} content
	 * @returns {DOMElement[]}
	 */
	const parseXML = withWeakCache((/** @type TemplateStringsArray */content) => {
	  const html = /** @type {DOMElement[]} */
	  /** @type unknown */
	  new DOMParser().parseFromString(`<xml ${namespaces.xmlns}>${content.join(id)}</xml>`, 'text/xml').firstChild.childNodes;
	  if (html[0].tagName === 'parsererror') {
	    const err = html[0];
	    err.style.padding = '1em';
	    err.firstChild.textContent = 'HTML Syntax Error:';
	    // @ts-expect-error typescript doesnt understand dom walking
	    err.firstChild.nextSibling.style.cssText = '';
	    err.lastChild.replaceWith(createTextNode(content));
	  }
	  return html;
	});

	/**
	 * Recursively walks a template and transforms it to `h` calls.
	 *
	 * @param {typeof xml} xml
	 * @param {DOMElement[]} cached
	 * @param {...unknown} values
	 * @returns {Children}
	 */
	function toH(xml, cached, values) {
	  let index = 0;
	  /**
	   * Recursively transforms DOM nodes into Component calls.
	   *
	   * @param {ChildNode} node
	   * @returns {Children}
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
	      } = /** @type {DOMElement} */node;

	      // gather props
	      /** @type {Record<string, Accessor<unknown>>} */
	      const props = empty();
	      for (let {
	        name,
	        value
	      } of attributes) {
	        if (value === id) {
	          props[name] = values[index++];
	        } else if (value.includes(id)) {
	          const val = value.split(splitId).map(x => x === id ? values[index++] : x);
	          props[name] = () => val.map(getValue).join('');
	        } else {
	          props[name] = value;
	        }
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
	 * Function to create cached tagged template components.
	 *
	 * @returns {((
	 * 	template: TemplateStringsArray,
	 * 	...values: unknown[]
	 * ) => Children) & {
	 * 	components: Record<string, Component>
	 * 	define: (userComponents: Record<string, Component>) => void
	 * }}
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
	  /**
	   * Registers custom components that can be referenced by tag name.
	   *
	   * @param {Record<string, Component>} userComponents
	   */
	  xml.define = userComponents => {
	    for (const name in userComponents) {
	      xml.components[name] = userComponents[name];
	    }
	  };
	  return xml;
	}
	const xml = XML();

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
