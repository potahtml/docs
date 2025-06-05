(function () {
	'use strict';

	const global = globalThis;
	const CSSStyleSheet = global.CSSStyleSheet;
	const document$1 = global.document;
	const DocumentFragment = global.DocumentFragment;
	const Object$1 = global.Object;
	const Symbol = global.Symbol;
	const queueMicrotask = global.queueMicrotask;
	const assign = Object$1.assign;
	const entries = Object$1.entries;
	const freeze = Object$1.freeze;
	const groupBy = Object$1.groupBy;
	const isArray = Array.isArray;
	const toArray = Array.from;
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
	const isConnected = node => node.isConnected;
	const activeElement = () => document$1.activeElement;
	const documentElement = document$1?.documentElement;

	/**
	 * Runs an array of functions
	 *
	 * @param {Iterable<Function>} fns
	 */
	const call = fns => {
	  for (const fn of fns) fn();
	};
	const bind = /* #__NO_SIDE_EFFECTS__ */fn => document$1 && document$1[fn].bind(document$1);
	const createElement = bind('createElement');
	const createElementNS = bind('createElementNS');
	const createTextNode = bind('createTextNode');
	const importNode = bind('importNode');
	const createTreeWalker = bind('createTreeWalker');

	/**
	 * Returns an object without a prototype
	 *
	 * @type {Function}
	 * @returns {Props} Empty object
	 */
	const empty = Object$1.create.bind(null, null);

	/**
	 * An empty frozen array
	 *
	 * @type {readonly []}
	 */
	const emptyArray = freeze([]);

	/**
	 * An empty frozen object
	 *
	 * @type object
	 */
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
	 * @param {any[]} arr
	 * @returns {any}
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

	/**
	 * Returns `document` for element. That could be a `shadowRoot`
	 *
	 * @param {Element} node
	 * @returns {Document | ShadowRoot}
	 */

	const getDocumentForElement = node => {
	  const document = node.getRootNode();
	  const {
	    nodeType
	  } = document;
	  // getRootNode returns:
	  // 1. Node for isConnected = false
	  // 2. Document for isConnected = true
	  // 3. shadowRoot for custom elements

	  // always return a Document-like
	  return nodeType === 11 || nodeType === 9 ? document : node.ownerDocument;
	};

	/**
	 * Unwraps values. If the argument is a function then it runs it
	 * recursively and returns the value
	 *
	 * @template T
	 * @param {Accessor<T>} value - Maybe function
	 */
	function getValue(value) {
	  while (typeof value === 'function') value = value();
	  return value;
	}

	/**
	 * Returns `true` when `typeof` of `value` is `function`
	 *
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	const isFunction = value => typeof value === 'function';

	/**
	 * Returns `true` when value is Iterable
	 *
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	const isIterable = value => value?.[Symbol.iterator];

	/**
	 * Returns `true` if the value is `null` or `undefined`
	 *
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	const isNullUndefined = value => value === undefined || value === null;

	/**
	 * Returns `true` when typeof of value is object and not null
	 *
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	const isObject = value => value !== null && typeof value === 'object';

	/**
	 * Returns `true` when `typeof` of `value` is `string`
	 *
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	const isString = value => typeof value === 'string';

	/**
	 * Returns `true` when `value` may be a promise
	 *
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	const isPromise = value => isFunction(value?.then);
	const noop = () => {};
	const querySelector = (node, query) => node.querySelector(query);

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
	class DataStore {
	  /** @param {WeakMap | Map} kind */
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
	 * Creates a Map to store data
	 *
	 * @returns {DataStoreT}
	 */
	const cacheStore = () => new DataStore(Map);
	const classListAdd = (node, className) => node.classList.add(className);
	const classListRemove = (node, className) => node.classList.remove(className);

	/**
	 * - Returns `adoptedStyleSheets` for a document
	 *
	 * @param {Document | ShadowRoot} document
	 */
	const adoptedStyleSheetsGet = document => document?.adoptedStyleSheets;

	/**
	 * Adds a style sheet to the document
	 *
	 * @param {Document | ShadowRoot} document
	 * @param {CSSStyleSheet} styleSheet
	 */
	const adoptedStyleSheetsAdd = (document, styleSheet) => adoptedStyleSheetsGet(document).push(styleSheet);

	/**
	 * Removes a style sheet from the document
	 *
	 * @param {Document | ShadowRoot} document
	 * @param {CSSStyleSheet} styleSheet
	 */
	const adoptedStyleSheetsRemove = (document, styleSheet) => removeFromArray(adoptedStyleSheetsGet(document), styleSheet);

	/**
	 * Creates a stylesheet from a css string
	 *
	 * @param {string} css
	 * @returns {CSSStyleSheet}
	 */
	const sheet = withCache(css => {
	  const sheet = new CSSStyleSheet();
	  /**
	   * Replace is asynchronous and can accept `@import` statements
	   * referencing external resources.
	   */
	  sheet.replace(css);
	  return sheet;
	});

	// symbols

	const $isComponent = Symbol();
	const $isClass = Symbol();
	const $isReactive = Symbol();
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
	 */

	function createReactiveSystem() {
	  const CLEAN = 0;
	  const STALE = 1;
	  const CHECK = 2;

	  /** @type {Computation} */
	  let Owner;

	  /** @type {Computation} */
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

	    /** @type {Record<string, unknown>} */
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
	    read = markReactive(() => {
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
	    });
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
	        if (this.updatedAt !== 0) {
	          this.write(nextValue);
	        } else {
	          this.value = nextValue;
	        }
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
	    read = markReactive(() => {
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
	    });
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
	   * @returns {any}
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
	   * @param {Function} fn - Function to run with tracking disabled
	   * @returns {any}
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
	   * @template T
	   * @param {T extends Function} fn
	   * @returns {T}
	   */
	  function cleanup(fn) {
	    Owner?.addCleanups(fn);
	    return fn;
	  }

	  /**
	   * Cancels a cleanup
	   *
	   * @template T
	   * @param {T extends Function} fn
	   * @returns {T}
	   */
	  function cancelCleanup(fn) {
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
	   * @param {any} [defaultValue] - Default value for the context
	   */
	  function Context(defaultValue = undefined) {
	    return useContext.bind(null, Symbol(), defaultValue);
	  }

	  /**
	   * @overload Gets the context value
	   * @returns {any} Context value
	   */
	  /**
	   * @overload Runs `fn` with a new value as context
	   * @param {any} newValue - New value for the context
	   * @param {Function} fn - Callback to run with the new context value
	   * @returns {Children} Children
	   */
	  /**
	   * @param {any} newValue
	   * @param {Function} fn
	   */
	  function useContext(id, defaultValue, newValue, fn) {
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
	   * Returns an owned function
	   *
	   * @template T
	   * @param {(...args: unknown[]) => T} cb
	   * @returns {() => T}
	   */
	  const owned = cb => {
	    const o = Owner;
	    return cb ? (...args) => runWithOwner(o, () => cb(...args)) : noop;
	  };

	  // export

	  return {
	    batch,
	    cleanup,
	    cancelCleanup,
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
	    untrack,
	    useContext
	  };
	}

	/**
	 * Marks a function as reactive. Reactive functions are ran inside
	 * effects.
	 *
	 * @template T
	 * @param {T} fn - Function to mark as reactive
	 * @returns {T}
	 */
	function markReactive(fn) {
	  fn[$isReactive] = undefined;
	  return fn;
	}

	const {
	  cleanup,
	  Context,
	  effect,
	  owned,
	  root,
	  signal,
	  syncEffect,
	  untrack} = createReactiveSystem();

	/**
	 * Returns true when value is reactive (a signal)
	 *
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	const isReactive = value => isFunction(value) && $isReactive in value;

	/**
	 * Runs a function inside an effect if value is a function.
	 * Aditionally unwraps promises.
	 *
	 * @param {unknown | Promise<unknown>} value
	 * @param {(value) => unknown} fn
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
	  constructor(item, index, fn, isDupe) {
	    this.item = item;
	    this.index = index;
	    this.isDupe = isDupe;
	    root(disposer => {
	      this.disposer = disposer;
	      /** @type Children[] */
	      this.nodes = fn(item, index);
	    });
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
	 * @param {boolean} [sort]
	 * @param {Children} [fallback]
	 */
	function map(list, callback, sort, fallback) {
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
	   * @param {Function} fn
	   * @returns {Children}
	   */
	  function mapper(fn) {
	    const cb = fn ? (item, index) => fn(callback(item, index), index) : callback;
	    const value = getValue(list) || [];

	    /** To allow iterate objects as if were an array with indexes */
	    const items = isIterable(value) ? value.entries() : entries(value);
	    runId++;
	    rows = [];
	    const hasPrev = prev.length;
	    for (const [index, item] of items) {
	      let row = hasPrev ? cache.get(item) : undefined;

	      // if the item doesnt exists, create it
	      if (row === undefined) {
	        row = new Row(item, index, cb, false);
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
	          row = new Row(item, index, cb, true);
	          dupes.push(row);
	        }
	      }
	      row.runId = runId; // mark used on this run
	      row.index = index; // save sort order
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
	 * Returns true if the `value` is a `Component`
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isComponent = value => isFunction(value) && $isComponent in value;

	/**
	 * Returns true if the value can be made a Component
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	function isComponentable(value) {
	  return !isReactive(value) && (isFunction(value) || !isArray(value) && isObject(value) && !isPromise(value));
	}

	// avoid [1,2] and support { toString(){ return "something"} }

	/**
	 * Makes of `children` a function. Reactive children will run as is,
	 * non-reactive children will run untracked, regular children will
	 * just return.
	 *
	 * @param {Children} children
	 * @returns {Function}
	 */
	function makeCallback(children) {
	  /**
	   * When children is an array, as in >${[0, 1, 2]}< then children
	   * will end as `[[0, 1, 2]]`, so flat it
	   */

	  children = isArray(children) ? unwrapArray(children) : children;
	  const callbacks = !isArray(children) ? callback(children) : children.map(callback);
	  return !isArray(children) ? markComponent((...args) => callbacks(args)) : markComponent((...args) => callbacks.map(callback => callback(args)));
	}
	const callback = child => isFunction(child) ? isReactive(child) ? args => {
	  /**
	   * The function inside the `for` is saved in a signal. The
	   * result of the signal is our callback
	   *
	   * ```js
	   * xml`
	   * <table>
	   * 		<tr>
	   * 			<th>name</th>
	   * 		</tr>
	   * 		<for each="${tests}">
	   * 			${item =>
	   * 				xml`<tr>
	   * 					<td>${item.name}</td>
	   * 				</tr>`}
	   * 		</for>
	   * 	</table>
	   * `
	   * ```
	   */
	  // TODO this may be simplified to call itself again as `callback(r)`
	  const r = child();
	  return isFunction(r) ? isReactive(r) ? r() : untrack(() => r(...args)) : r;
	} : args => untrack(() => child(...args)) : () => child;

	// allows to tell a `signal function` from a `component function`
	// signals and user functions go in effects, for reactivity
	// components and callbacks are untracked and wont go in effects to avoid re-rendering

	/**
	 * Marks a function as a `Component`.
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
	 * @param {Element | Document | typeof window} node - Element to add
	 *   the event listener
	 * @param {(keyof WindowEventMap & keyof GlobalEventHandlersEventMap)
	 * 	| string} type
	 *   - The name of the event listener
	 *
	 * @param {EventListener
	 * 	| EventListenerObject
	 * 	| (EventListenerObject & AddEventListenerOptions)} handler
	 *   - Function to handle the event
	 *
	 * @returns {Function} - An `off` function for removing the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function addEvent(node, type, handler) {
	  node.addEventListener(type, handler, !isFunction(handler) && handler);

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
	 * @param {Element | Document | typeof window} node - Element to add
	 *   the event listener
	 * @param {(keyof WindowEventMap & keyof GlobalEventHandlersEventMap)
	 * 	| string} type
	 *   - The name of the event listener
	 *
	 * @param {EventListener
	 * 	| EventListenerObject
	 * 	| (EventListenerObject & AddEventListenerOptions)} handler
	 *   - Function to handle the event
	 *
	 * @returns {Function} - An `on` function for adding back the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function removeEvent(node, type, handler) {
	  node.removeEventListener(type, handler, !isFunction(handler) && handler);
	  return () => addEvent(node, type, handler);
	}

	/**
	 * It gives a handler an owner, so stuff runs batched on it, and
	 * things like context and cleanup work
	 */
	const ownedEvent = handler => 'handleEvent' in handler ? {
	  ...handler,
	  handleEvent: owned(e => handler.handleEvent(e))
	} : owned(handler);

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
	 * Queue a function to run on ready (after onMount)
	 *
	 * @param {Function} fn
	 * @url https://pota.quack.uy/ready
	 */
	const ready = fn => add(4, fn);

	const plugins = cacheStore();
	const pluginsNS = cacheStore();

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
	  plugin(pluginsNS, NSName, fn, onMicrotask);
	};
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
	 * @param {Element} node
	 * @param {string} name
	 * @param {EventListener
	 * 	| EventListenerObject
	 * 	| (EventListenerObject & AddEventListenerOptions)} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setEventNS = (node, name, value, props, localName, ns) =>
	// `value &&` because avoids crash when `on:click={bla}` and `bla === null`
	value && addEvent(node, localName, ownedEvent(value));

	// node style


	/**
	 * @param {DOMElement} node
	 * @param {string} name
	 * @param {StylePropertyValue} value
	 * @param {object} props
	 * @url https://pota.quack.uy/props/setStyle
	 */
	const setStyle = (node, name, value, props) => setNodeStyle(node.style, value);

	/**
	 * @param {DOMElement} node
	 * @param {string} name
	 * @param {StylePropertyValue} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setStyleNS = (node, name, value, props, localName, ns) => setNodeStyle(node.style, isObject(value) ? value : {
	  [localName]: value
	});

	/**
	 * @param {DOMElement} node
	 * @param {string} name
	 * @param {StylePropertyValue} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setVarNS = (node, name, value, props, localName, ns) => setNodeStyle(node.style, {
	  ['--' + localName]: value
	});

	/**
	 * @param {CSSStyleDeclaration} style
	 * @param {StylePropertyValue} value
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
	const setStyleValue = (style, name, value) => withValue(value, value => _setStyleValue(style, name, value));

	/**
	 * @param {CSSStyleDeclaration} style
	 * @param {string} name
	 * @param {string | null} value
	 */
	const _setStyleValue = (style, name, value) =>
	// if the value is null or undefined it will be removed
	isNullUndefined(value) ? style.removeProperty(name) : style.setProperty(name, value);

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

	/**
	 * @param {Element} node
	 * @param {string} value
	 */
	const setNodeCSS = withState((state, node, value) => {
	  classListAdd(node, state.get(value, value => {
	    const id = 'c' + randomId();
	    adoptedStyleSheetsAdd(getDocumentForElement(node), sheet(value.replace(/class/g, '.' + id)));
	    return id;
	  }));
	});

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setRef = (node, name, value, props) => onRef(() => value(node));

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setConnected = (node, name, value, props) => onMount(() => value(node));

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setDisconnected = (node, name, value, props) => cleanup(() => value(node));

	// node class / classList


	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {object | string | ArrayLike<any>} value
	 * @param {object} props
	 */
	const setClass = (node, name, value, props) => {
	  isString(value) ? node.setAttribute('class', value) : setClassList(node, value);
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
	  isFunction(value) ? setElementClass(node, localName, value) : setClassList(node, value);
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
	    // on initialization do not remove whats not there
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
	  !value ? classListRemove(node, name) : classListAdd(node, ...name.trim().split(/\s+/));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {string} [ns]
	 * @url https://pota.quack.uy/props/setAttribute
	 */
	const setAttribute = (node, name, value, ns) => withValue(value, value => _setAttribute(node, name, value, ns));

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
	propsPluginNS('var', setVarNS, false);
	propsPlugin('plugin:css', setCSS, false);
	propsPlugin('connected', setConnected, false);
	propsPlugin('disconnected', setDisconnected, false);
	propsPlugin('ref', setRef, false);
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

	/**
	 * Creates a component that could be called with a props object
	 *
	 * @template T
	 * @param {any} value
	 * @returns {Component}
	 */

	function Factory(value) {
	  if (isComponent(value)) {
	    return value;
	  }
	  switch (typeof value) {
	    case 'string':
	      {
	        // string component, 'div' becomes <div>
	        return markComponent(props => createTag(value, props));
	      }
	    case 'function':
	      {
	        if ($isClass in value) {
	          // class component <MyComponent../>
	          return markComponent(props => createClass(value, props));
	        }

	        /**
	         * ```js
	         * const [Count, setCount] = signal(1)
	         * return <Count />
	         * ```
	         */
	        if (isReactive(value)) {
	          return markComponent(() => createAnything(value));
	        }

	        // function component <MyComponent../>
	        // value = value
	        return markComponent(value);
	      }
	    default:
	      {
	        if (value instanceof Element) {
	          // node component <div>
	          return markComponent(props => createNode(value, props));
	        }
	        return markComponent(() => createAnything(value));
	      }
	  }
	}
	function createComponent(value) {
	  const component = Factory(value);
	  return props => {
	    /** Freeze props so isnt directly writable */
	    freeze(props);
	    return markComponent(() => component(props));
	  };
	}
	function createClass(value, props) {
	  const i = new value();
	  i.ready && ready(() => i.ready());
	  i.cleanup && cleanup(() => i.cleanup());
	  return i.render(props);
	}
	function createAnything(value) {
	  return value;
	}

	/**
	 * Creates a x/html element from a tagName
	 *
	 * @template P
	 * @param {TagNames} tagName
	 * @param {P} props
	 * @returns {Element} Element
	 */
	function createTag(tagName, props) {
	  /**
	   * Namespace, use props xmlns or special case svg, math, etc in case
	   * of missing xmlns attribute
	   */
	  const xmlns = props?.xmlns || NS[tagName];
	  return withXMLNS(xmlns, xmlns => createNode(xmlns ? createElementNS(xmlns, tagName) : createElement(tagName), props), tagName);
	}
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
	  }
	  return tlpContent.childNodes.length === 1 ? tlpContent.firstChild : tlpContent;
	}

	/**
	 * @param {string} content
	 * @param {{
	 * 	x?: string
	 * 	i?: boolean
	 * 	m?: number
	 * }} propsData
	 */
	function createPartial(content, propsData = nothing) {
	  let clone = () => {
	    const node = withXMLNS(propsData.x, xmlns => parseXML(content, xmlns));
	    clone = propsData.i ? importNode.bind(null, node, true) : node.cloneNode.bind(node, true);
	    return clone();
	  };
	  return props => markComponent(() => assignPartialProps(clone(), props, propsData));
	}
	function assignPartialProps(node, props, propsData) {
	  if (props) {
	    const nodes = walkElements(node, propsData.m);
	    withXMLNS(propsData.x, xmlns => {
	      for (let i = 0; i < props.length; i++) {
	        assignProps(nodes[propsData[i] || i], props[i]);
	      }
	    });
	  }
	  return node instanceof DocumentFragment ? toArray(node.childNodes) : node;
	}

	/**
	 * Assigns props to an element and creates its children
	 *
	 * @template P
	 * @param {Element} node
	 * @param {P} props
	 * @returns {Element} Element
	 */
	function createNode(node, props) {
	  props && assignProps(node, props);
	  return node;
	}

	/**
	 * Creates the children for a parent
	 *
	 * @param {Element} parent
	 * @param {Children} child
	 * @param {boolean} [relative]
	 * @param {Text | undefined} [prev]
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
	        if (isComponent(child)) {
	          return createChildren(parent, untrack(child), relative);
	        }
	        let node = [];

	        // signal/memo/external/user provided function
	        // needs placeholder to stay in position
	        parent = createPlaceholder(parent, relative);

	        // For - TODO move this to the `For` component
	        $isMap in child ? effect(() => {
	          node = toDiff(node, child(child => {
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
	          }), true);
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
	          return createChildren(parent, toArray(/** @type Iterator */child.values()), relative);
	          /**
	           * For some reason this breaks with a node list in the
	           * `Context` example of the `html` docs section.
	           *
	           *     return toArray(child.values(), child =>
	           *     	createChildren(parent, child, relative),
	           *     )
	           */
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
	              adoptedStyleSheetsAdd(doc, child);
	              cleanup(() => adoptedStyleSheetsRemove(doc, child));
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
	propsPlugin('children', (node, propName, propValue) => createChildren(node, propValue), false);

	/**
	 * Creates placeholder to keep nodes in position
	 *
	 * @param {Element} parent
	 * @param {boolean} [relative]
	 * @returns {Element}
	 */
	const createPlaceholder = (parent, relative) => insertNode(parent, createTextNode(''), relative);
	const head = document$1.head;

	/**
	 * Adds the element to the document
	 *
	 * @param {Element} parent
	 * @param {Element} node
	 * @param {boolean} [relative]
	 * @returns {Element}
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
	 * @param {Element} [parent] - Mount point, defaults to document.body
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
	 * @param {Element} [parent] - Mount point, defaults to
	 *   `document.body`
	 * @param {{ clear?: boolean; relative?: boolean }} [options] -
	 *   Mounting options
	 */
	function insert(children, parent = document$1.body, options = nothing) {
	  if (options.clear && parent) parent.textContent = '';
	  const node = createChildren(parent, isComponentable(children) ? Factory(children) : children, options.relative);
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
	const toHTML = children =>
	/**
	 * DocumentFragment is transformed to an `Array` of `Node/Element`,
	 * that way we can keep a reference to the nodes. Because when the
	 * DocumentFragment is used, it removes the nodes from the
	 * DocumentFragment and then we will lose the reference.
	 */

	unwrapArray(toHTMLFragment(children).childNodes);

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
	 * @param {any} [defaultValue] - Default value for the context
	 * @returns {Function & { Provider: ({ value }) => Children }}
	 *   Context
	 * @url https://pota.quack.uy/Reactivity/Context
	 */
	/* #__NO_SIDE_EFFECTS__ */
	function context(defaultValue = undefined) {
	  /** @type {Function & { Provider: ({ value }) => Children }} */
	  const ctx = Context(defaultValue);

	  /**
	   * Sets the `value` for the context
	   *
	   * @param {object} props
	   * @param {any} props.value
	   * @param {Children} [props.children]
	   * @returns {Children} Children
	   * @url https://pota.quack.uy/Reactivity/Context
	   */
	  ctx.Provider = props => ctx(props.value, () => toHTML(props.children));
	  return ctx;
	}

	/**
	 * Removes from the DOM `prev` elements not found in `next`
	 *
	 * @param {Element[]} prev - Array with previous elements
	 * @param {Element[]} next - Array with next elements
	 * @returns {Element[]}
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
	 * @param {Children} [props.children]
	 * @param {Children} [props.fallback]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/For
	 */

	const For = props => map(() => {
	  props.restoreFocus && queue();
	  return props.each;
	}, makeCallback(props.children), true, props.fallback);

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
	      active && active !== activeElement() && isConnected(active) && active.focus();
	      documentElement.scrollTop = scroll;
	    });
	  }
	}

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

	function timing(fn) {
	  const start = performance.now();
	  fn();
	  return performance.now() - start;
	}

	var _div = createPartial("<div class='col-sm-6 smallpad'><button type=button class='btn btn-primary btn-block'></button></div>", {"0":1,"m":2}),
	  _div2 = createPartial("<div class=container><div class=jumbotron><div class=row><div class=col-md-6><h1>pota Keyed</h1></div><div class=col-md-6><div class=row></div></div></div></div><table class='table table-hover table-striped test-data'><tbody></tbody></table><span aria-hidden=true class='preloadicon glyphicon glyphicon-remove'></span></div>", {"0":6,"1":8,"m":9}),
	  _tr = createPartial("<tr><td class=col-md-1></td><td class=col-md-4><a></a></td><td class=col-md-1><a><span aria-hidden=true class='glyphicon glyphicon-remove'></span></a></td><td class=col-md-6></td></tr>", {"2":3,"3":6,"m":7});
	const _For = createComponent(For);
	let idCounter = 1;
	function buildData(count) {
	  const data = new Array(count);
	  for (let i = 0; i < count; i++) {
	    const [label, setLabel, updateLabel] = signal(`elegant green keyboard ${idCounter++}`);
	    data[i] = {
	      id: idCounter,
	      label,
	      updateLabel
	    };
	  }
	  return data;
	}
	const Button = ({
	  id,
	  text,
	  fn
	}) => _div([{
	  id: id,
	  "prop:textContent": text,
	  "on:click": fn
	}]);
	const _Button = createComponent(Button);
	const App = () => {
	  const [data, setData, updateData] = signal([]),
	    [selected, setSelected] = signal(null),
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
	      for (let i = 0; i < d.length; i += 10) d[i].updateLabel(l => l + ' !!!');
	    },
	    swapRows = () => {
	      const d = [...data()];
	      const tmp = d[1];
	      d[1] = d[998];
	      d[998] = tmp;
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
	    isSelected = useSelector(selected);
	  return _div2([{
	    children: [_Button({
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
	    })]
	  }, {
	    "on:click": e => {
	      const element = e.target;
	      if (element.selectRow !== undefined) {
	        setSelected(element.selectRow);
	      } else if (element.removeRow !== undefined) {
	        remove(element.removeRow);
	      }
	    },
	    children: _For({
	      each: data,
	      children: row => {
	        const {
	          id,
	          label
	        } = row;
	        return _tr([{
	          "class:danger": isSelected(id)
	        }, {
	          "prop:textContent": id
	        }, {
	          "prop:selectRow": id,
	          "prop:textContent": label
	        }, {
	          "prop:removeRow": id
	        }]);
	      }
	    })
	  }]);
	};
	render(App, document.getElementById('main'));

})();
//# sourceMappingURL=main.js.map
