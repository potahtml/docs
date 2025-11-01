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
	 * @template {unknown | unknown[]} T
	 * @param {T} arr
	 * @returns {T[]}
	 */
	const flatToArray = arr => isArray(arr) ? arr.flat(Infinity) : [arr];

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

	/** Memoize functions with a map cache */
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
	 * @param {unknown} value
	 * @returns {value is function}
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
	const cacheStore = () => new DataStore(Map);

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
	        removeFromArray(/** @type Function[] */this.cleanups, fn);
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
	      // @ts-expect-error
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
	      // @ts-expect-error
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
	        // @ts-expect-error
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
	      // @ts-expect-error
	      if (this.equals === false || !this.equals(this.value, value)) {
	        // @ts-expect-error
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
	     * @type {(a, b) => boolean}
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
	   * @template T
	   * @param {() => T} fn
	   * @param {object} [options]
	   */
	  function effect(fn, options) {
	    new Effect(Owner, fn, options);
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
	   * @returns {SignalAccessor<T>}
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
	     * @param {T} [props.value]
	     * @param {Children} props.children
	     * @returns {Children} Children
	     * @url https://pota.quack.uy/Reactivity/Context
	     */
	    useContext.Provider = props =>
	    // @ts-expect-error
	    useContext(props.value, () => useContext.toHTML(props.children));

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
	  cleanup,
	  Context,
	  effect,
	  owned,
	  root,
	  signal,
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
	 * @param {(...unknoown) => Children} callback
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
	 * Makes of `children` a function. Reactive children will run as is,
	 * non-reactive children will run untracked, regular children will
	 * just return.
	 *
	 * @template {Children} T
	 * @param {T} children
	 * @returns {((...args: T[]) => T) | T}
	 */
	function makeCallback(children) {
	  /** Shortcut the most used case */
	  if (isFunction(children)) {
	    return markComponent(children);
	  }

	  /**
	   * When children is an array, as in >${[0, 1, 2]}< then children
	   * will end as `[[0, 1, 2]]`, so flat it
	   */
	  // @ts-expect-error
	  children = flatToArray(children);
	  return markComponent((...args) =>
	  // @ts-expect-error
	  children.map(child => isFunction(child) ? child(...args) : child));
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
	const importNode = bind('importNode');
	const createTreeWalker = bind('createTreeWalker');

	// tokenList

	const tokenList = s => s ? s.trim().split(/\s+/) : emptyArray;
	const addClass = (node, className) => className.length && node.classList.add(...(isArray(className) ? className : tokenList(className)));
	const removeClass = (node, className) => className.length && node.classList.remove(...(isArray(className) ? className : tokenList(className)));

	// selector

	const querySelector = (node, query) => node.querySelector(query);

	/**
	 * Returns `document` for element. That could be a `shadowRoot`
	 *
	 * @template {Element} T
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
	}.bind(null, createTreeWalker && createTreeWalker(document$1, 1 /*NodeFilter.SHOW_ELEMENT*/));

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
	let queue$1;
	function reset() {
	  queue$1 = [[], [], [], [], []];
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
	 * @param {(node: Element, propValue: T) => void} fn - Function to run
	 *   when this prop is found on any Element
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
	 * 	node: Element,
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
	 * @param {string} localName
	 * @param {unknown} value
	 */
	const setPropertyNS = (node, localName, value) => {
	  setProperty(node, localName, value);
	};

	/**
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
	 * @template {Element} T
	 * @param {T} node
	 * @param {string} name
	 * @param {EventHandler<Event, T>} value
	 */
	const setEvent = (node, name, value) => {
	  // `value &&` because avoids crash when `on:click={prop.onClick}` and `!prop.onClick`
	  value && addEvent(node, name, ownedEvent(value));
	};

	/**
	 * @template {Element} T
	 * @param {T} node
	 * @param {string} localName
	 * @param {EventHandler<Event, T>} value
	 */
	const setEventNS = (node, localName, value) => {
	  setEvent(node, localName, value);
	};

	/** Returns true or false with a `chance` of getting `true` */
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
	 * @param {Element} node
	 * @param {Function} value
	 */
	const setRef = (node, value) => {
	  value(node);
	};

	/**
	 * @param {Element} node
	 * @param {Function} value
	 */
	const setConnected = (node, value) => {
	  onMount(() => value(node));
	};

	/**
	 * @param {Element} node
	 * @param {Function} value
	 */
	const setDisconnected = (node, value) => {
	  cleanup(() => value(node));
	};

	// node style


	/**
	 * @param {DOMElement} node
	 * @param {StyleAttribute} value
	 * @url https://pota.quack.uy/props/setStyle
	 */
	const setStyle = (node, value) => {
	  setNodeStyle(node.style, value);
	};

	/**
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
	const useSuspense = context({
	  c: 0,
	  s: signal(false)
	});

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
	 * @param {string} xmlns
	 * @param {(xmlns: string) => Element} fn
	 * @param {string} [tagName]
	 * @returns {Element}
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

	/** Used in transform in place of jsxs */
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
	 * 	i?: number
	 * 	m?: number
	 * } & Record<string, unknown>} [propsData]
	 * @returns {(props: T extends any[]) => Children}
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
	 * @param {T[]} props
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
	          return createChildren(parent, untrack(/** @type {() => Children} */child), relative);
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
	          node = toDiff(node,
	          // @ts-expect-error
	          flatToArray(createChildren(parent, child(), true, node[0])), true);
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
	        if (child === null) {
	          return undefined;
	        }

	        // async values
	        if ('then' in child) {
	          const suspense = useSuspense();
	          suspense.c++;
	          const [value, setValue] = signal(undefined);
	          const onResult = owned(result => {
	            setValue(result);
	            if (--suspense.c === 0) {
	              suspense.s.write(true);
	            }
	          });
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

	  // @ts-expect-error
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
	  // @ts-expect-error
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
	      // @ts-expect-error
	      active.focus();
	      documentElement.scrollTop = scroll;
	    });
	  }
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
	  };
	}

	function timing(fn) {
	  const start = performance.now();
	  fn();
	  return performance.now() - start;
	}

	var _div = createPartial("<div class='col-sm-6 smallpad'><button type=button class='btn btn-primary btn-block'></button></div>", {"0":1,"m":2}),
	  _div2 = createPartial("<div class=container><div class=jumbotron><div class=row><div class=col-md-6><h1>pota Keyed</h1></div><div class=col-md-6><div class=row></div></div></div></div><table class='table table-hover table-striped test-data'><tbody></tbody></table><span aria-hidden=true class='preloadicon glyphicon glyphicon-remove'></span></div>", {"0":6,"1":8,"m":9}),
	  _tr = createPartial("<tr><td class=col-md-1></td><td class=col-md-4><a data-select></a></td><td class=col-md-1><a><span data-remove aria-hidden=true class='glyphicon glyphicon-remove'></span></a></td><td class=col-md-6></td></tr>", {"0":1,"1":3,"m":4});
	const _For = createComponent(For);
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
	  _node.textContent = getValue(/** @static */text);
	  _node.setAttribute("id", getValue(/** @static */id));
	  setEvent(_node, "click", fn);
	}]);
	const _Button = createComponent(Button);
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
	  }, _node15 => {
	    setEvent(_node15, "click", e => {
	      const element = e.target;
	      if ('remove' in element.dataset) {
	        remove(+element.parentNode.parentNode.parentNode.firstChild.textContent);
	      } else if ('select' in element.dataset) {
	        danger(element.parentNode.parentNode);
	      }
	    });
	    createChildren(_node15, _For({
	      each: data,
	      children: row => {
	        return _tr([_node9 => {
	          _node9.textContent = getValue(/* @static */row.id);
	        }, _node0 => {
	          setProperty(_node0, "textContent", row.label);
	        }]);
	      }
	    }));
	  }]);
	};
	render(App, document.getElementById('main'));

})();
//# sourceMappingURL=main.js.map
