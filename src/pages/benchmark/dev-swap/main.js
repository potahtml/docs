(function () {
	'use strict';

	const window = globalThis;
	const queueMicrotask = window.queueMicrotask;
	const Object$1 = window.Object;
	const Array$1 = window.Array;
	const Symbol = window.Symbol;
	const assign = Object$1.assign;
	const freeze = Object$1.freeze;
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
	const iterator = Symbol.iterator;
	const stringify = JSON.stringify;

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
	 * Returns `true` when `typeof` of `value` is `function`
	 *
	 * @template T
	 * @param {T} value
	 * @returns {value is ((...args:unknown[])=>T)}
	 */
	const isFunction = value => typeof value === 'function';

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

	/** Function that intentionally performs no operation. */
	const noop = () => {};

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
	 * Creates a Map-backed `DataStore` instance.
	 *
	 * @returns {DataStore<Map<any, any>>}
	 */
	const cacheStore = () => new DataStore(Map);

	// symbols

	const $isComponent = Symbol();
	const $isMap = Symbol();
	const $isClass = Symbol();
	const $isDerived = Symbol();

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
	  const errorHandlerId = Symbol();
	  function routeError(node, err) {
	    const handler = node.context && node.context[errorHandlerId];
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
	     * preserving identity-via-`===` semantics for the staleness check.
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
	     * Thenable surface. Stays defined across commits so consumers
	     * can register more than once: each call to `then` either
	     * fires synchronously (if already resolved) or queues onto
	     * `thenCallbacks`, drained by `_fireThens` on commit. Has to
	     * be an instance arrow so `assign(self(), this)` carries it
	     * onto the callable wrapper.
	     *
	     * We resolve with `_unwrap()` rather than `self()`: `self()`
	     * carries `then` onto every fresh wrapper, which makes the
	     * resolved value itself thenable — JS's `await` would
	     * recursively `then` it forever. `_unwrap()` returns the
	     * same callable shape but with `then` stripped, terminating
	     * the recursion.
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
	   * @param {any} a
	   * @param {any} b
	   */
	  function equalsFalse(a, b) {
	    return false;
	  }

	  /**
	   * @param {any} a
	   * @param {any} b
	   */
	  function equals(a, b) {
	    return a === b;
	  }

	  /**
	   * Plain leaf observable shared with Memo/Derived for the
	   * `o.observers` access in doRead/doWrite. observers / observerSlots
	   * start as the EMPTY sentinel so the slot type is always JSArray —
	   * eliminates the undefined→array transition that was making doRead
	   * megamorphic across signal-literal vs Memo vs Derived shapes.
	   */
	  class Signal {
	    /** @type {Computation[]} */
	    observers = EMPTY;

	    /** @type {number[]} */
	    observerSlots = EMPTY;

	    /** @type {any} */
	    value;

	    /** @param {any} value */
	    constructor(value) {
	      this.value = value;
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
	    let _equals = equals;
	    if (options) {
	      if (options.equals === false) _equals = equalsFalse;else if (options.equals) _equals = options.equals;
	    }
	    const o = new Signal(value);
	    function read() {
	      if (Listener) {
	        doRead(o);
	      }
	      return o.value;
	    }
	    function write(val) {
	      if (!_equals(o.value, val)) {
	        o.value = val;
	        doWrite(o);
	        return true;
	      }
	      return false;
	    }
	    function update(val) {
	      return write(untrack(() => val(o.value)));
	    }
	    const s = /** @type {any} */[read, write, update];
	    s.read = read;
	    s.write = write;
	    s.update = update;
	    if (options) {
	      assign(s, options);
	    }
	    return s;
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
	    const id = Symbol();

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

	const document$1 = /** @type {Document} */window.document;
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
	bind('createComment');
	const importNode = bind('importNode');
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
	const walkElements = function (walk, node, max = Infinity, nodes = []) {
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
	}.bind(null, createTreeWalker && createTreeWalker(document$1, 1 /*NodeFilter.SHOW_ELEMENT*/));

	/**
	 * Removes from the DOM `prev` elements not found in `next`
	 *
	 * @param {DOMElement[]} [prev=[]] - Array with previous elements.
	 *   Default is `[]`
	 * @param {DOMElement[]} [next=[]] - Array with next elements.
	 *   Default is `[]`
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
	  cleanup,
	  context,
	  effect,
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

	const CSSStyleSheet$1 = window.CSSStyleSheet;

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
	 * @param {(node: DOMElement, propValue: T) => void} fn - Function
	 *   to run when this prop is found on any Element
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
	 *
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
	 * Wraps values for JSX runtime helpers, ensuring we always return a
	 * component function.
	 *
	 * @template T
	 * @param {string | Function | Element | object | symbol} value
	 * @returns {(props?: JSX.Props<T>) => JSX.Element}
	 */
	function createComponent(value) {
	  const component = Factory(value);
	  return (props = nothing) => {
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
	 * @returns {(props: T[]) => JSX.Element}
	 */
	function createPartial(content, propsData = nothing) {
	  let clone = () => {
	    const node = withXMLNS(propsData.x, xmlns => parseXML(content, xmlns));
	    clone = 'i' in propsData ? importNode.bind(null, node, true) : node.cloneNode.bind(node, true);
	    return clone();
	  };
	  return props => markComponent(() => assignPartialProps(clone(), /** @type {((node: Node) => void)[]} */
	  /** @type {unknown} */props, propsData));
	}

	/**
	 * @template T
	 * @param {Element} node
	 * @param {((node: Node) => void)[]} props
	 * @param {{
	 * 	x?: string
	 * 	[i: number]: number
	 * 	m?: number
	 * } & Record<string, unknown>} propsData
	 * @returns {JSX.Element}
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
	          const [value, setValue] = signal(undefined);
	          child.then(owned(result => {
	            if (isComponent && isFunction(result)) {
	              markComponent(result);
	            }
	            setValue(result);
	            remove();
	          }, remove), owned(err => {
	            remove();
	            throw err;
	          }, remove));
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
	function render(children, parent, options = nothing) {
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

	var _div = createPartial("<div class='col-sm-6 smallpad'><button type=button class='btn btn-primary btn-block'></button></div>", {"0":1,"m":2}),
	  _div2 = createPartial("<div class=container><div class=jumbotron><div class=row><div class=col-md-6><h1>pota Keyed</h1></div><div class=col-md-6><div class=row></div></div></div></div><table class='table table-hover table-striped test-data'><tbody></tbody></table><span aria-hidden=true class='preloadicon glyphicon glyphicon-remove'></span></div>", {"0":6,"1":8,"m":9}),
	  _tr = createPartial("<tr><td class=col-md-1></td><td class=col-md-4><a data-select></a></td><td class=col-md-1><a><span data-remove aria-hidden=true class='glyphicon glyphicon-remove'></span></a></td><td class=col-md-6></td></tr>", {"0":1,"1":3,"m":4});
	var _For = createComponent(For);
	let idCounter = 1;
	function buildData(count) {
	  const data = new Array(count);
	  for (let i = 0; i < count; i++) {
	    const [label,, update] = signal('elegant green keyboard');
	    data[i] = {
	      id: idCounter++,
	      label,
	      update
	    };
	  }
	  return data;
	}
	const Button = ({
	  id,
	  text,
	  fn
	}) => _div([_node => {
	  setProperty(_node, "textContent", /** @static */text);
	  setAttribute(_node, "id", /** @static */id);
	  setEvent(_node, "click", fn);
	}]);
	var _Button = createComponent(Button);
	const App = () => {
	  const [data, setData, updateData] = signal([]),
	    run = () => {
	      // debugger
	      setData(buildData(10));
	    },
	    runLots = () => {
	      setData(buildData(10000));
	    },
	    bench = () => {
	      //  console.clear()
	      // warm
	      // debugger
	      for (let k = 0; k < 5; k++) {
	        setData(buildData(1));
	        setData([]);
	      }
	      let createLarge = 0;
	      let clearLarge = 0;
	      let createSmall = 0;
	      let clearSmall = 0;
	      const results = [];
	      for (let k = 0; k < 10; k++) {
	        createLarge += timing(() => setData(buildData(10000)));
	        clearLarge += timing(() => setData([]));
	        results.push(`
					createLarge ${createLarge / (k + 1)} clearLarge ${clearLarge / (k + 1)}
				`);
	      }
	      for (let k = 0; k < 10; k++) {
	        createSmall += timing(() => setData(buildData(1000)));
	        clearSmall += timing(() => setData([]));
	        results.push(`
					createSmall ${createSmall / (k + 1)} clearSmall ${clearSmall / (k + 1)}
				`);
	      }
	      for (const item of results) console.log(item.trim());
	      console.log('------------');
	    },
	    add = () => {
	      updateData(d => [...d, ...buildData(1000)]);
	    },
	    update = () => {
	      const d = data();
	      for (let i = 0; i < d.length; i += 10) d[i].update(l => l + ' !!!');
	    },
	    swapRows = () => {
	      const d = [...data()];
	      const tmp = d[1];
	      d[1] = d[8];
	      d[8] = tmp;
	      setData(d);
	    },
	    clear = () => {
	      setData([]);
	    },
	    remove = id => {
	      updateData(d => {
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
	  return _div2([_node5 => {
	    createChildren(_node5, [_Button({
	      fn: run,
	      id: "run",
	      text: "Create 1,000 rows"
	    }), _Button({
	      fn: runLots,
	      id: "runlots",
	      text: "Create 10,000 rows"
	    }), _Button({
	      fn: add,
	      id: "add",
	      text: "Append 1,000 rows"
	    }), _Button({
	      fn: update,
	      id: "update",
	      text: "Update every 10th row"
	    }), _Button({
	      fn: clear,
	      id: "clear",
	      text: "Clear"
	    }), _Button({
	      fn: swapRows,
	      id: "swaprows",
	      text: "Swap Rows"
	    }), _Button({
	      fn: bench,
	      id: "bench",
	      text: "bench"
	    })]);
	  }, _node17 => {
	    setEvent(_node17, "click", e => {
	      const element = e.target;
	      if ('remove' in element.dataset) {
	        remove(+element.parentNode.parentNode.parentNode.firstChild.textContent);
	      } else if ('select' in element.dataset) {
	        danger(element.parentNode.parentNode);
	      }
	    });
	    createChildren(_node17, _For({
	      each: data,
	      children: row => {
	        return _tr([_node9 => {
	          setProperty(_node9, "textContent", /* @static */row.id);
	        }, _node10 => {
	          setProperty(_node10, "textContent", row.label);
	        }]);
	      }
	    }));
	  }]);
	};
	render(App, document.getElementById('main'));

})();
//# sourceMappingURL=main.js.map
