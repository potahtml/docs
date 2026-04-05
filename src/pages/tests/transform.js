(function () {
	'use strict';

	const window = globalThis;
	const queueMicrotask = window.queueMicrotask;
	const Object$1 = window.Object;
	const Array = window.Array;
	const Symbol = window.Symbol;
	const assign = Object$1.assign;
	const freeze = Object$1.freeze;
	const toArray = Array.from;

	/**
	 * @template T
	 * @param {T} value
	 */
	const toValues = value => isArray(value) ? value : isObject(value) && 'values' in (/** @type {object} */value) ? /** @type {{ values(): IterableIterator<T> }} */value.values() : toArray(/** @type {Iterable<T> | ArrayLike<T>} */value);
	const iterator = Symbol.iterator;
	const stringify = JSON.stringify;

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
	/**
	 * `console.error` wrapper kept for consistent dependency
	 * injection/mocking.
	 *
	 * @param {...unknown} args
	 * @returns {void}
	 */
	const error = (...args) => console.error(...args);

	// symbols

	const $isComponent = Symbol();
	const $isMap = Symbol();
	const $isClass = Symbol();

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
	  function doRead(o) {
	    if (Listener) {
	      const sourceSlot = o.observers ? o.observers.length : 0;
	      if (Listener.sources) {
	        Listener.sources.push(o);
	        Listener.sourceSlots.push(sourceSlot);
	      } else {
	        Listener.sources = [o];
	        Listener.sourceSlots = [sourceSlot];
	      }
	      const observerSlot = Listener.sources.length - 1;
	      if (sourceSlot) {
	        o.observers.push(Listener);
	        o.observerSlots.push(observerSlot);
	      } else {
	        o.observers = [Listener];
	        o.observerSlots = [observerSlot];
	      }
	    }
	  }
	  function doWrite(o) {
	    if (o.observers && o.observers.length) {
	      runUpdates(() => {
	        for (const observer of o.observers) {
	          if (observer.state === 0 /* CLEAN */) {
	            observer.queue();
	            observer.observers && downstream(observer);
	          }
	          observer.state = 1; /* STALE */
	        }
	      });
	    }
	  }

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
	        doWrite(this);
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

	  // SIGNAL

	  /**
	   * @param {T} a
	   * @param {T} b
	   */
	  function equalsFalse(a, b) {
	    return false;
	  }

	  /**
	   * @param {T} a
	   * @param {T} b
	   */
	  function equals(a, b) {
	    return a === b;
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
	    const o = {
	      observers: undefined,
	      observerSlots: undefined
	    };
	    let _equals;
	    function read() {
	      if (Listener) {
	        doRead(o);
	      }
	      return value;
	    }
	    function write(val) {
	      if (!_equals(value, val)) {
	        value = val;
	        doWrite(o);
	        return true;
	      }
	      return false;
	    }
	    function update(val) {
	      return write(untrack(() => val(value)));
	    }
	    const s = [read, write, update];

	    // @ts-ignore
	    s.read = read;
	    // @ts-ignore
	    s.write = write;
	    // @ts-ignore
	    s.update = update;
	    if (options) {
	      assign(s, options);
	      if (options.equals === false) {
	        _equals = equalsFalse;
	      } else {
	        _equals = equals;
	      }
	    } else {
	      _equals = equals;
	    }

	    // @ts-ignore
	    return s;
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

	const document = /** @type {Document} */window.document;
	const head = document?.head;

	/**
	 * Checks whether a node is connected to a document tree.
	 *
	 * @param {Node} node
	 * @returns {boolean}
	 */
	const isConnected = node => node.isConnected;

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
	bind('createComment');
	const importNode = bind('importNode');
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
	  node.nodeType === 1 && nodes.push(node);
	  walk.currentNode = node;
	  while (nodes.length !== max && (node = walk.nextNode())) {
	    nodes.push(node);
	  }
	  return nodes;
	}.bind(null, createTreeWalker && createTreeWalker(document, 1 /*NodeFilter.SHOW_ELEMENT*/));

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
	  cleanup,
	  context,
	  effect,
	  owned,
	  root,
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
	 * @template {keyof EventType} Name
	 * @param {TargetElement} node - Element to add the event listener
	 * @param {Name} type - The name of the event listener
	 * @param {EventHandler<EventType[Name], TargetElement>} handler
	 *
	 *   - Function to handle the event
	 *
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
	 * @template {keyof EventType} Name
	 * @param {TargetElement} node - Element to add the event listener
	 * @param {Name} type - The name of the event listener
	 * @param {EventHandler<EventType[Name], TargetElement>} handler
	 *
	 *   - Function to handle the event
	 *
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
	 * @template {keyof EventType} Name
	 * @param {TargetElement} node
	 * @param {Name} name
	 * @param {EventHandlers<EventType[Name], TargetElement>} value
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
	 * @template {DOMElement} TargetElement
	 * @template {keyof EventType} Name
	 * @param {TargetElement} node
	 * @param {Name} localName
	 * @param {EventHandlers<EventType[Name], TargetElement>} value
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
	 * Creates an instance of a class component and handles lifecycle
	 * methods
	 *
	 * @param {{ new (props: any): ElementClass }} value - The class
	 *   constructor
	 * @param {Props<unknown>} props - Props to pass to the class
	 *   constructor
	 * @returns {Children} The rendered output
	 */
	function createClass(value, props) {
	  const i = new value(props);
	  i.ready && ready(() => i.ready());
	  i.cleanup && cleanup(() => i.cleanup());
	  return i.render(props);
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

	        // signal/memo/external/user provided function
	        // needs placeholder to stay in position
	        parent = createPlaceholder(parent, relative);

	        // For - TODO move this to the `For` component
	        if ($isMap in child) {
	          effect(() => {
	            child(child => createChildren(parent, child, true));
	          });
	          // map has own dom removal
	        } else {
	          let node = [];
	          effect(() => {
	            // maybe a signal (at least a function) so needs an effect
	            node = toDiff(node, flatToArray(createChildren(parent, child(), true, node[0])), true);
	          });
	          cleanup(() => {
	            if (parent.isConnected) {
	              toDiff(node);
	              // @ts-expect-error
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

	/** @ts-expect-error freaking typescript */
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
	_div([_node => {
	  assignProps(_node, {
	    "style": "1",
	    ...style,
	    "style": "2",
	    "prop:not-identifier": /* @static */""
	  });
	}]);
	_div([_node2 => {
	  assignProps(_node2, style);
	}]);
	_div([_node3 => {
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
	_div([_node4 => {
	  assignProps(_node4, {
	    ...style,
	    ...style2
	  });
	}]);
	function Counter() {
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
	  (async function () {})();
	  (async () => {})();
	}
	// return
	{
	  (async function () {
	    return;
	  })();
	}

	// await
	{
	  (async function () {
	    return await 1;
	  })();
	}

	// await x 2
	{
	  (async function () {
	    await 1;
	    return await 2;
	  })();
	}

	// await x 2
	{
	  (async function () {
	    await 1;
	    return (await name()) + '-' + name();
	  })();
	}
	const component = _div([_node31 => {
	  createChildren(_node31, [_Counter(), asyncTest, _div3([_node7 => {
	    _node7["not-identifier"] = /* @static  */"";
	    setAttribute(_node7, "data-emptytemplatefn", html` ${lala}`);
	    setAttribute(_node7, "data-emptytemplatefsn", ` ${lala}`);
	    setAttribute(_node7, "data-call", fn());
	    setEvent(_node7, "click", () => {});
	    setElementClass(_node7, "mitrocondria", true);
	    setStyleNS(_node7, "border", '0px');
	    setStyleNS(_node7, "background", "0px");
	    setConnected(_node7, function connected(node) {});
	    setDisconnected(_node7, function disconnected(node) {});
	    setCSS(_node7, 'class {color:red}');
	  }, _node20 => {
	    createChildren(_node20, `aloja ${hotaloja} template`);
	  }, _node23 => {
	    createChildren(_node23, fn());
	  }, _node24 => {
	    createChildren(_node24, () => {});
	  }, _node26 => {
	    setEvent(_node26, "click", [e => {}, () => {}]);
	    assignPropNS(_node26, "use:bind", [e => {}, () => {}], "bind", "use");
	    setConnected(_node26, [e => {}, () => {}]);
	    setDisconnected(_node26, [e => {}, () => {}]);
	  }, _node27 => {
	    setStyle(_node27, {
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
