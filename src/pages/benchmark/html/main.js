(function () {
	'use strict';

	// isCustomElement

	const ce = customElements;
	const define = ce.define.bind(ce);
	ce.define = (name, constructor, options) => {
	  constructor.prototype.isCustomElement = true;
	  define(name, constructor, options);
	};

	const global = globalThis;
	const window = global;
	const CSSStyleSheet = global.CSSStyleSheet;
	const document$1 = global.document;
	const DocumentFragment = global.DocumentFragment;
	const Object$1 = global.Object;
	const Promise$1 = global.Promise;
	const Symbol = global.Symbol;
	const queueMicrotask = global.queueMicrotask;
	const assign = Object$1.assign;
	const entries = Object$1.entries;
	const freeze = Object$1.freeze;
	const getOwnPropertyDescriptors = Object$1.getOwnPropertyDescriptors;
	const getPrototypeOf = Object$1.getPrototypeOf;
	const groupBy = Object$1.groupBy;
	const isArray = Array.isArray;
	const toArray = Array.from;
	const iterator = Symbol.iterator;
	const stringify = JSON.stringify;
	const history = global.history;
	const location$1 = global.location;
	const origin$1 = location$1?.origin;
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
	const setAttribute$1 = (node, name, value) => node.setAttribute(name, value);
	const removeAttribute = (node, name) => node.removeAttribute(name);
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
	const bind = fn => document$1 && document$1[fn].bind(document$1);
	const createElement = bind('createElement');
	const createElementNS = bind('createElementNS');
	const createTextNode = bind('createTextNode');
	const createComment = bind('createComment');
	bind('importNode');
	bind('createTreeWalker');

	/**
	 * Returns an object without a prototype
	 *
	 * @type {Function}
	 * @returns {Props} Empty object
	 */
	const empty = Object$1.create.bind(null, null);

	/**
	 * Flats an array/childNodes to the first children if the length is 1
	 *
	 * @param {any[] | NodeListOf<ChildNode>} arr
	 * @returns {any}
	 */
	const flat = arr => arr.length === 1 ? arr[0] : arr;

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
	 * @param {Function | any} value - Maybe function
	 * @returns {any}
	 */
	function getValue(value) {
	  while (typeof value === 'function') value = value();
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
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isFunction = value => typeof value === 'function';

	/**
	 * Returns `true` when value is Iterable
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isIterable = value => value?.[Symbol.iterator];

	/**
	 * Returns `true` if the value is `null` or `undefined`
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isNullUndefined = value => value === undefined || value === null;

	/**
	 * Returns `true` when typeof of value is object and not null
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isObject = value => value !== null && typeof value === 'object';

	/**
	 * Returns `true` when `typeof` of `value` is `string`
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isString = value => typeof value === 'string';

	/**
	 * Returns `true` when `value` may be a promise
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isPromise = value => isObject(value) && 'then' in value;
	const noop = () => {};

	/**
	 * An empty frozen object
	 *
	 * @type object
	 */
	const nothing = freeze(empty());

	// an optional value is `true` by default, so most of the time is undefined which means is `true`
	// to avoid having conditions like `if(something.bla === undefined || something.bla)`
	// this function will short it to `if(optional(something.bla))`
	// additionally the value is resolved, for cases like `when={() => show() && optional(props.when)}`

	/**
	 * Returns `true` when value is true or undefined
	 *
	 * @param {Function | boolean | undefined} value
	 * @returns {boolean} True when value is true or undefined
	 */
	const optional = value => value === undefined || getValue(value);
	const querySelector = (node, query) => node.querySelector(query);

	/**
	 * Removes a value from an array
	 *
	 * @template T
	 * @param {T[]} array
	 * @param {T} value To remove from the array
	 * @returns {T[]}
	 */
	function removeFromArray(array, value) {
	  const index = array.indexOf(value);
	  if (index !== -1) array.splice(index, 1);
	  return array;
	}
	function walkParents(context, propertyName, cb) {
	  while (context) {
	    if (cb(context)) return true;
	    context = context[propertyName];
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
	 */

	class DataStore {
	  constructor(kind) {
	    const store = new kind();
	    const get = k => store.get(k);
	    const set = (k, v) => store.set(k, v);
	    const has = k => store.has(k);
	    this.get = (target, defaults = undefined) => {
	      const o = get(target);
	      if (o !== undefined) {
	        return o;
	      }
	      if (defaults !== undefined) {
	        /**
	         * Default values should be passed as a function, so we dont
	         * constantly initialize values when giving them
	         */
	        defaults = defaults(target);
	        set(target, defaults);
	        return defaults;
	      }
	    };
	    this.set = set;
	    this.has = has;
	    this.delete = k => store.delete(k);
	  }
	  *[Symbol.iterator]() {
	    yield this.get;
	    yield this.set;
	    yield this.has;
	    yield this.delete;
	  }
	}

	/**
	 * Creates a WeakMap to store data
	 *
	 * @returns {[
	 * 	DataStoreGet,
	 * 	DataStoreSet,
	 * 	DataStoreHas,
	 * 	DataStoreDelete,
	 * ] & {
	 * 	get: DataStoreGet
	 * 	set: DataStoreSet
	 * 	has: DataStoreHas
	 * 	delete: DataStoreDelete
	 * }}
	 */
	const weakStore = () => new DataStore(WeakMap);

	/**
	 * Creates a Map to store data
	 *
	 * @returns {[
	 * 	DataStoreGet,
	 * 	DataStoreSet,
	 * 	DataStoreHas,
	 * 	DataStoreDelete,
	 * ] & {
	 * 	get: DataStoreGet
	 * 	set: DataStoreSet
	 * 	has: DataStoreHas
	 * 	del: DataStoreDelete
	 * }}
	 */
	const cacheStore = () => new DataStore(Map);
	const classListAdd = (node, className) => node.classList.add(className);
	const classListRemove = (node, className) => node.classList.remove(className);

	/**
	 * - Returns `adoptedStyleSheets` for a document
	 *
	 * @param {Document | ShadowRoot} document
	 */
	const adoptedStyleSheetsGet = document => document.adoptedStyleSheets;

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
	 * Adds a style sheet to the custom element
	 *
	 * @param {Document | ShadowRoot} document
	 * @param {(CSSStyleSheet | string)[]} styleSheets
	 */
	function addStyleSheets(document, styleSheets = []) {
	  for (const sheet of styleSheets) {
	    if (sheet) {
	      sheet instanceof CSSStyleSheet ? adoptedStyleSheetsAdd(document, sheet) : addStyleSheetExternal(document, sheet);
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
	  state.get(text, text => text.startsWith('http') ? fetch(text).then(r => r.text()).then(css => sheet(css)) : promise(resolve => resolve(sheet(text)))).then(styleSheet => adoptedStyleSheetsAdd(document, styleSheet));
	});

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
	  const sheet = new CSSStyleSheet();
	  /**
	   * Replace is asynchronous and can accept @import statements
	   * referencing external resources.
	   */
	  sheet.replace(css);
	  return sheet;
	});

	/**
	 * @param {Element} node
	 * @param {string} eventName
	 * @param {any} [data]
	 */

	const emit = (node, eventName, data = {
	  bubbles: true,
	  cancelable: true,
	  composed: true
	}) => node.dispatchEvent(new CustomEvent(eventName, data));
	const preventDefault = e => e.preventDefault();
	const warn = (...args) => console.warn(...args);
	const error = (...args) => console.error(...args);

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
	 * This is so far the core of Solid JS Reactivity, this may change.
	 *
	 * Adaptation for potas needs have been made:
	 *
	 * - Ported to Classes what does fit
	 * - Signal has more options: `label` and `save` previous value
	 * - Writing to a signal returns `true` when the value changes
	 * - Signal is an object that could be used as signal.read/write or
	 *   destructured as an array.
	 * - Signals can save and wont run functions
	 * - `update` function on Signal that could be used to use the old value
	 */

	const CLEAN = 0;
	const STALE = 1;
	const CHECK = 2;
	let Owner;
	let Listener;
	let Updates = null;
	let Effects = null;
	let Time = 0;

	// ROOT

	class Root {
	  owner;
	  owned;
	  cleanups;
	  context;
	  constructor(owner, options) {
	    this.owner = owner;
	    this.context = owner?.context;
	    if (options) {
	      assign(this, options);
	    }
	  }
	  dispose() {
	    let i;
	    const {
	      owned,
	      cleanups
	    } = this;
	    if (owned) {
	      for (i = owned.length - 1; i >= 0; i--) {
	        owned[i].dispose();
	      }
	      owned.length = 0;
	    }
	    if (cleanups) {
	      for (i = cleanups.length - 1; i >= 0; i--) {
	        cleanups[i]();
	      }
	      cleanups.length = 0;
	    }
	  }
	}

	// COMPUTATION

	class Computation extends Root {
	  state = STALE;
	  updatedAt = 0;
	  fn;
	  sources;
	  sourceSlots;
	  constructor(owner, fn, options) {
	    super(owner, options);
	    this.fn = fn;
	    if (owner) {
	      if (owner.owned) {
	        owner.owned.push(this);
	      } else {
	        owner.owned = [this];
	      }
	    }
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
	    if (sources) {
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
	}
	class Effect extends Computation {
	  user = true;
	  constructor(owner, fn, options) {
	    super(owner, fn, options);
	    Effects ? Effects.push(this) : batch(() => this.update());
	  }
	}
	class SyncEffect extends Computation {
	  constructor(owner, fn, options) {
	    super(owner, fn, options);
	    batch(() => this.update());
	  }
	}

	// SIGNALS

	class Memo extends Computation {
	  state = STALE;
	  pure = true;
	  value;
	  observers;
	  observerSlots;

	  // options:
	  // equals

	  constructor(owner, fn, options) {
	    super(owner, fn, options);
	    return markReactive(this.read.bind(this));
	  }
	  read() {
	    // checkReadForbidden()

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
	      if (this.observers) {
	        this.observers.push(Listener);
	        this.observerSlots.push(Listener.sources.length - 1);
	      } else {
	        this.observers = [Listener];
	        this.observerSlots = [Listener.sources.length - 1];
	      }
	    }
	    return this.value;
	  }
	  write(value) {
	    if (this.equals === false || !this.equals(this.value, value)) {
	      this.value = value;
	      if (this.observers && this.observers.length) {
	        runUpdates(() => {
	          for (let i = 0, observer; i < this.observers.length; i++) {
	            observer = this.observers[i];
	            if (observer.state === CLEAN) {
	              if (observer.pure) {
	                Updates.push(observer);
	              } else {
	                Effects.push(observer);
	              }
	              if (observer.observers) {
	                downstream(observer);
	              }
	            }
	            observer.state = STALE;
	          }
	        });
	      }
	    }
	  }
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
	      if (this.owned) {
	        this.owned.forEach(node => node.dispose());
	        this.owned.length = 0;
	      }
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
	}

	// SIGNAL

	class Signal {
	  value;
	  observers;
	  observerSlots;

	  // options:
	  // equals
	  // save

	  // `prev` if option save was given

	  constructor(value, options) {
	    this.value = value;
	    if (options) {
	      assign(this, options);
	      if (this.save) {
	        this.prev = value;
	      }
	    }
	    this.read = markReactive(this.read);
	  }
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
	      if (this.observers) {
	        this.observers.push(Listener);
	        this.observerSlots.push(Listener.sources.length - 1);
	      } else {
	        this.observers = [Listener];
	        this.observerSlots = [Listener.sources.length - 1];
	      }
	    }
	    return this.value;
	  };
	  write = value => {
	    if (this.equals === false || !this.equals(this.value, value)) {
	      if (this.save) {
	        this.prev = this.value;
	      }
	      this.value = value;
	      if (this.observers && this.observers.length) {
	        runUpdates(() => {
	          for (let i = 0, observer; i < this.observers.length; i++) {
	            observer = this.observers[i];
	            if (observer.state === CLEAN) {
	              if (observer.pure) {
	                Updates.push(observer);
	              } else {
	                Effects.push(observer);
	              }
	              if (observer.observers) {
	                downstream(observer);
	              }
	            }
	            observer.state = STALE;
	          }
	        });
	      }
	      return true;
	    }
	    return false;
	  };
	  update = value => {
	    if (isFunction(value)) {
	      value = value(this.value);
	    }
	    return this.write(value);
	  };
	  equals(a, b) {
	    return a === b;
	  }
	  *[Symbol.iterator]() {
	    yield this.read;
	    yield this.write;
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
	function root(fn, options = undefined) {
	  const prevOwner = Owner;
	  const prevListener = Listener;
	  const root = new Root(Owner, options);
	  Owner = root;
	  Listener = undefined;
	  try {
	    return runUpdates(() => fn(() => root.dispose()), true);
	  } finally {
	    Owner = prevOwner;
	    Listener = prevListener;
	  }
	}

	/**
	 * Creates a signal
	 *
	 * @template const T
	 * @param {T} [initialValue] - Initial value of the signal
	 * @param {SignalOptions} [options] - Signal options
	 * @returns {SignalObject<T>}
	 */
	/* #__NO_SIDE_EFFECTS__ */
	function signal(initialValue, options = undefined) {
	  return new Signal(initialValue, options);
	}

	/**
	 * Creates an effect
	 *
	 * @param {Function} fn
	 * @param {object} [options]
	 */
	function effect(fn, options = undefined) {
	  new Effect(Owner, fn, options);
	}

	/**
	 * Creates a syncEffect
	 *
	 * @param {Function} fn
	 * @param {object} [options]
	 */
	function syncEffect(fn, options = undefined) {
	  return new SyncEffect(Owner, fn, options);
	}

	/**
	 * Creates a read-only signal from the return value of a function that
	 * automatically updates
	 *
	 * @template T
	 * @param {() => T} fn - Function to re-run when dependencies change
	 * @param {SignalOptions} [options]
	 * @returns {SignalAccessor<T>} - Read only signal
	 */

	/* #__NO_SIDE_EFFECTS__ */
	function memo(fn, options = undefined) {
	  return new Memo(Owner, fn, options);
	}

	/**
	 * Batches changes to signals
	 *
	 * @param {Function} fn
	 * @returns {any}
	 */
	const batch = runUpdates;
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
	 * @param {T} fn
	 * @returns {T}
	 */
	function cleanup(fn) {
	  if (Owner) {
	    if (Owner.cleanups) {
	      Owner.cleanups.push(fn);
	    } else {
	      Owner.cleanups = [fn];
	    }
	  }
	  return fn;
	}

	// UPDATES

	function runTop(node) {
	  switch (node.state) {
	    case CLEAN:
	      {
	        return;
	      }
	    case CHECK:
	      {
	        return upstream(node);
	      }
	  }
	  const ancestors = [];
	  do {
	    if (node.state) {
	      ancestors.push(node);
	    }
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
	      runQueue(Updates);
	      Updates = null;
	    }
	    if (!wait) {
	      const effects = Effects;
	      Effects = null;
	      if (effects.length) {
	        runUpdates(() => runEffects(effects));
	      }
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
	function runQueue(queue) {
	  for (let i = 0; i < queue.length; i++) {
	    runTop(queue[i]);
	  }
	}
	function runEffects(queue) {
	  let i;
	  let effect;
	  let userLength = 0;
	  for (i = 0; i < queue.length; i++) {
	    effect = queue[i];
	    if (!effect.user) {
	      runTop(effect);
	    } else {
	      queue[userLength++] = effect;
	    }
	  }
	  for (i = 0; i < userLength; i++) {
	    runTop(queue[i]);
	  }
	}
	function upstream(node, ignore) {
	  node.state = CLEAN;
	  for (let i = 0, source; i < node.sources.length; i++) {
	    source = node.sources[i];
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
	  for (let i = 0, observer; i < node.observers.length; i++) {
	    observer = node.observers[i];
	    if (observer.state === CLEAN) {
	      observer.state = CHECK;
	      if (observer.pure) {
	        Updates.push(observer);
	      } else {
	        Effects.push(observer);
	      }
	      observer.observers && downstream(observer);
	    }
	  }
	}

	/**
	 * Creates a context and returns a function to get or set the value
	 *
	 * @param {any} [defaultValue] - Default value for the context
	 * @returns {typeof Context} Context
	 */
	function Context$1(defaultValue = undefined) {
	  const id = Symbol();
	  return useContext.bind(null, id, defaultValue);
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
	 * @param {function | undefined} cb
	 * @returns {() => any}
	 */
	const owned = cb => {
	  const o = Owner;
	  return (...args) => cb && runWithOwner(o, () => cb(...args));
	};

	/**
	 * Returns true when value is reactive (a signal)
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isReactive = value => isFunction(value) && $isReactive in value;

	/**
	 * Marks a function as reactive. Reactive functions are ran inside
	 * effects.
	 *
	 * @param {Function} fn - Function to mark as reactive
	 * @returns {Function}
	 */
	function markReactive(fn) {
	  fn[$isReactive] = undefined;
	  return fn;
	}

	/**
	 * Runs a function inside an effect if value is a function.
	 * Aditionally unwraps promises.
	 *
	 * @param {any} value
	 * @param {(value) => any} fn
	 */
	const withValue = (value, fn) => {
	  if (isFunction(value)) {
	    effect(() => withValue(getValue(value), fn));
	  } else if (isPromise(value)) {
	    value.then(owned(value => withValue(value, fn)));
	  } else {
	    fn(value);
	  }
	};

	/**
	 * Runs a function inside an effect if value is a function
	 *
	 * @param {any} value
	 * @param {(value) => any} fn
	 */
	function withPrevValue(value, fn) {
	  if (isFunction(value)) {
	    let prev = undefined;
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
	    this.runId = -1;
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
	 */
	function map(list, callback, sort) {
	  const cache = new Map();
	  const duplicates = new Map(); // for when caching by value is not possible [1, 2, 1, 1, 1]

	  let runId = 0;
	  let rows = [];
	  /** @type any[] */
	  let prev = [];
	  function clear() {
	    for (let i = 0; i < prev.length; i++) {
	      dispose(prev[i], true);
	    }
	    cache.clear();
	    duplicates.clear();
	    rows.length = 0;
	    prev.length = 0;
	  }

	  // to get rid of all nodes when parent disposes
	  cleanup(clear);
	  function dispose(row, all) {
	    // skip cache deletion as we are going to clear the full map
	    if (all === undefined) {
	      // delete from cache
	      if (!row.isDupe) {
	        cache.delete(row.item);
	      } else {
	        const arr = duplicates.get(row.item);
	        arr.length === 1 ? duplicates.delete(row.item) : removeFromArray(arr, row);
	      }
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
	        for (let i = 0; i < dupes.length; i++) {
	          if (dupes[i].runId !== runId) {
	            row = dupes[i];
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

	    // remove rows that arent present on the current run
	    if (rows.length === 0) {
	      clear();
	    } else {
	      for (let i = 0; i < prev.length; i++) {
	        if (prev[i].runId !== runId) {
	          dispose(prev[i]);
	        }
	      }
	    }

	    // reorder elements
	    // `rows.length > 1` because no need for sorting when there are no items
	    // prev.length > 0 to skip sorting on creation as its already sorted
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
	    return rows.map(item => item.nodes);
	  }
	  mapper[$isMap] = undefined;
	  return mapper;
	}

	/**
	 * Resolves and returns `children` in a memo
	 *
	 * @param {Function | Children} fn
	 * @returns {Function} Memo
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
	 * @returns {Children}
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
	 * Returns true if the value can be made a Component
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isComponentable = value => !isReactive(value) && (isFunction(value) ||
	// avoid [1,2] and support { toString(){ return "something"} }
	!isArray(value) && isObject(value) && !value.then);

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

	  children = isArray(children) ? flat(children) : children;
	  const callbacks = !isArray(children) ? callback(children) : children.map(callback);
	  return !isArray(children) ? markComponent((...args) => callbacks(args)) : markComponent((...args) => callbacks.map(callback => callback(args)));
	}
	const callback = child => isFunction(child) ? isReactive(child) ? args => {
	  /**
	   * The function inside the `for` is saved in a signal. The
	   * result of the signal is our callback
	   *
	   * ```js
	   * htmlEffect(
	   * 	html =>
	   * 		html`<table>
	   * 			<tr>
	   * 				<th>name</th>
	   * 			</tr>
	   * 			<for each="${tests}">
	   * 				${item =>
	   * 					html`<tr>
	   * 						<td>${item.name}</td>
	   * 					</tr>`}
	   * 			</for>
	   * 		</table>`,
	   * )
	   * ```
	   */
	  const r = child();
	  return isFunction(r) ? isReactive(r) ? r() : untrack(() => r(...args)) : r;
	} : args => untrack(() => child(...args)) : () => child;

	// allows to tell a `signal function` from a `component function`
	// signals and user functions go in effects, for reactivity
	// components and callbacks are untracked and wont go in effects to avoid re-rendering

	/**
	 * Marks a function as a `Component`.
	 *
	 * @param {Function} fn - Function to mark as a `Component`
	 * @returns {Component}
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

	/**
	 * Queue a function to run after all user defined processes
	 *
	 * @param {Function} fn
	 */
	const onDone = fn => add(5, fn);

	const plugins = cacheStore();
	const pluginsNS = cacheStore();

	/**
	 * Defines a prop that can be used on any Element
	 *
	 * @param {string} propName - Name of the prop
	 * @param {(
	 * 	node: Elements,
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
	 * 	node: Elements,
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

	/**
	 * Defines prop and namespaced prop that can be used on any Element
	 *
	 * @param {string} propName - Name of the prop/namespace
	 * @param {Function} fn - Function to run when this prop is found on
	 *   any Element
	 * @param {boolean} [onMicrotask=true] - Set to run on a microtask to
	 *   avoid the problem of needed props not being set, or children
	 *   elements not being created yet. Default is `true`
	 */
	const propsPluginBoth = (propName, fn, onMicrotask) => {
	  plugin(plugins, propName, fn, onMicrotask);
	  plugin(pluginsNS, propName, fn, onMicrotask);
	};
	const plugin = (plugins, name, fn, onMicrotask = true) => {
	  plugins.set(name, !onMicrotask ? fn : (...args) => onProps(() => fn(...args)));
	};

	// NODE ATTRIBUTES

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setAttributeNS = (node, name, value, props, localName, ns) => setAttribute(node, localName, value);

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
	 * @param {string} value
	 * @param {string} [ns]
	 */
	function _setAttribute(node, name, value, ns) {
	  // if the value is null or undefined it will be removed
	  if (isNullUndefined(value)) {
	    ns && NS[ns] ? node.removeAttributeNS(NS[ns], name) : node.removeAttribute(name);
	  } else {
	    ns && NS[ns] ? node.setAttributeNS(NS[ns], name, value) : node.setAttribute(name, value);
	  }
	}

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setPropertyNS = (node, name, value, props, localName, ns) => setProperty(node, localName, value);

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @url https://pota.quack.uy/props/setProperty
	 */
	const setProperty = (node, name, value) => withValue(value, value => _setProperty(node, name, value));

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	function _setProperty(node, name, value) {
	  // if the value is null or undefined it will be set to null
	  if (isNullUndefined(value)) {
	    // defaulting to undefined breaks `progress` tag and the whole page
	    node[name] = null;
	  } else {
	    node[name] = value;
	  }
	}

	// NODE UNKNOWN PROPERTIES / ATTRIBUTES


	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {string} [ns]
	 */
	const setUnknown = (node, name, value, ns) => {
	  withValue(value, value => _setUnknown(node, name, value, ns));
	};

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {string} [ns]
	 */
	const _setUnknown = (node, name, value, ns) => {
	  const setters = elementSetters(node);
	  if (setters.element.has(name) && (typeof value !== 'string' || node.isCustomElement)) {
	    /**
	     * 1. Only do this when it's different to a string to avoid coarcing
	     *    on native elements (ex: (img.width = '16px') === 0)
	     * 2. Or when a custom element has a setter
	     */
	    setProperty(node, name, value);
	  } else if (setters.builtIn.has(name)) {
	    // ex: innerHTML, textContent, draggable={true}
	    setProperty(node, name, value);
	  } else {
	    setAttribute(node, name, value, ns);
	  }
	};
	const elements = new Map();

	/** @param {Element} node */
	function elementSetters(node) {
	  /**
	   * Use `node.constructor` instead of `node.nodeName` because it
	   * handles the difference between `a` `HTMLAnchorElement` and `a`
	   * `SVGAElement`
	   */
	  let setters = elements.get(node.constructor);
	  if (setters) return setters;
	  setters = {
	    builtIn: new Set(builtInSetters),
	    element: new Set()
	  };
	  elements.set(node.constructor, setters);
	  let store = setters.element;
	  let proto = getPrototypeOf(node);

	  /**
	   * Stop at `Element` instead of `HTMLElement` because it handles the
	   * difference between `HTMLElement`, `SVGElement`, `FutureElement`
	   * etc
	   */
	  while (proto.constructor !== Element) {
	    const nextProto = getPrototypeOf(proto);

	    /**
	     * The previous prototype to `Element` is a `builtIn`
	     * (`HTMLElement`, `SVGElement`,`FutureElement`, etc)
	     */
	    if (nextProto.constructor === Element) {
	      store = setters.builtIn;
	    }
	    getSetterNamesFromPrototype(proto, store);
	    proto = nextProto;
	  }
	  return setters;
	}

	/** Setters shared by all kind of elements */
	const builtInSetters = getSetterNamesFromPrototype(Element.prototype, getSetterNamesFromPrototype(Node.prototype));

	// BOOL ATTRIBUTES


	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setBoolNS = (node, name, value, props, localName, ns) => setBool(node, localName, value);

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @url https://pota.quack.uy/props/setBool
	 */
	const setBool = (node, name, value) => withValue(value, value => _setBool(node, name, value));

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	const _setBool = (node, name, value) =>
	// if the value is falsy gets removed
	value ? node.setAttribute(name, '') : node.removeAttribute(name);

	// node style


	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @url https://pota.quack.uy/props/setStyle
	 */
	const setStyle = (node, name, value, props) => setNodeStyle(node.style, value);

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setStyleNS = (node, name, value, props, localName, ns) => setNodeStyle(node.style, isObject(value) ? value : {
	  [localName]: value
	});

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setVarNS = (node, name, value, props, localName, ns) => setNodeStyle(node.style, {
	  ['--' + localName]: value
	});

	/**
	 * @param {CSSStyleDeclaration} style
	 * @param {unknown} value
	 */
	function setNodeStyle(style, value) {
	  if (isObject(value)) {
	    for (const name in value) {
	      setStyleValue(style, name, value[name]);
	    }
	    return;
	  }
	  const type = typeof value;
	  if (type === 'string') {
	    style.cssText = value;
	    return;
	  }
	  if (type === 'function') {
	    withValue(value, value => setNodeStyle(style, getValue(value)));
	    return;
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

	// node class / classList


	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {object | string | ArrayLike<any>} value
	 * @param {object} props
	 */
	const setClass = (node, name, value, props) => isString(value) ? node.setAttribute('class', value) : setClassList(node, value);

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {object | string | ArrayLike<any>} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setClassNS = (node, name, value, props, localName, ns) => isFunction(value) ? setElementClass(node, localName, value) : setClassList(node, value);

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
	const setElementClass = (node, name, value) => withPrevValue(value, (value, prev) => {
	  // on initialization do not remove whats not there
	  if (!value && !prev) ; else {
	    _setClassListValue(node, name, value);
	  }
	});

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {unknown} value
	 */

	const _setClassListValue = (node, name, value) =>
	// null, undefined or false, the class is removed
	!value ? classListRemove(node, name) : classListAdd(node, ...name.trim().split(/\s+/));

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

	/**
	 * `value` as a prop is special cased so the button `reset` in forms
	 * works as expected. The first time a value is set, its done as an
	 * attribute.
	 */
	const setValue = (node, name, value) => withValue(value, value => _setValue(node, name, value));
	const defaults = new Set();
	function _setValue(node, name, value) {
	  if (!defaults.has(node)) {
	    defaults.add(node);
	    cleanup(() => defaults.delete(node));
	    if (!isNullUndefined(value)) {
	      switch (node.tagName) {
	        case 'INPUT':
	          {
	            node.setAttribute('value', value);
	            return;
	          }
	        case 'TEXTAREA':
	          {
	            node.textContent = value;
	            return;
	          }
	      }
	    }
	  }
	  if (!value && node.tagName === 'PROGRESS') {
	    node.removeAttribute('value');
	  } else {
	    _setUnknown(node, name, value);
	  }
	}

	/** Returns true or false with a `chance` of getting `true` */
	const randomId = () => crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {string} value
	 * @param {object} props
	 */
	const setCSS = (node, name, value, props) => setNodeCSS(node, value);

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
	const setOnMount = (node, name, value, props) => onMount(() => value(node));

	/**
	 * @param {Element} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setUnmount = (node, name, value, props) => cleanup(() => value(node));

	propsPluginNS('prop', setPropertyNS, false);
	propsPluginNS('attr', setAttributeNS, false);
	propsPluginNS('bool', setBoolNS, false);
	propsPluginNS('on', setEventNS, false);
	propsPluginNS('var', setVarNS, false);
	propsPlugin('__dev', noop, false);
	propsPlugin('xmlns', noop, false);
	propsPlugin('value', setValue, false);
	propsPluginBoth('css', setCSS, false);
	propsPluginBoth('onMount', setOnMount, false);
	propsPluginBoth('onUnmount', setUnmount, false);
	propsPluginBoth('ref', setRef, false);
	propsPlugin('style', setStyle, false);
	propsPluginNS('style', setStyleNS, false);
	propsPlugin('class', setClass, false);
	propsPluginNS('class', setClassNS, false);

	// catch all

	/**
	 * Assigns props to an Element
	 *
	 * @param {Element} node - Element to which assign props
	 * @param {object} props - Props to assign
	 */
	function assignProps(node, props) {
	  for (const name in props) {
	    assignProp(node, name, props[name], props);
	  }
	}
	const propNS = empty();

	/**
	 * Assigns a prop to an Element
	 *
	 * @param {Element} node
	 * @param {string} name
	 * @param {any} value
	 * @param {object} props
	 */
	function assignProp(node, name, value, props) {
	  // run plugins
	  let plugin = plugins.get(name);
	  if (plugin) {
	    plugin(node, name, value, props);
	    return;
	  }
	  if (propNS[name] || name.includes(':')) {
	    // with ns
	    propNS[name] = propNS[name] || name.split(':');
	    const [ns, localName] = propNS[name];

	    // run plugins NS
	    plugin = pluginsNS.get(ns);
	    if (plugin) {
	      plugin(node, name, value, props, localName, ns);
	      return;
	    }
	    setUnknown(node, name, value, ns);
	    return;
	  }

	  // catch all
	  setUnknown(node, name, value);
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
	 * @param {string | Function | Element | object | symbol} value -
	 *   Component
	 * @param {any} [props] Object
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
	        if (value instanceof Node) {
	          // node component <div>
	          return markComponent(props => createNode(value, props));
	        }
	        return markComponent(() => createAnything(value));
	      }
	  }
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

	/**
	 * Assigns props to an element and creates its children
	 *
	 * @template P
	 * @param {Element} node
	 * @param {P} props
	 * @returns {Element} Element
	 */
	function createNode(node, props) {
	  if (props) {
	    assignProps(node, props);
	  }
	  return node;
	}

	/**
	 * Creates the children for a parent
	 *
	 * @param {Element} parent
	 * @param {Children} child
	 * @param {boolean} [relative]
	 * @param {Text | undefined} [prev]
	 * @returns {Children}
	 */
	function createChildren(parent, child, relative, prev = undefined) {
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
	        parent = createPlaceholder(parent, undefined /*child.name*/, relative);

	        // For
	        if ($isMap in child) {
	          effect(() => {
	            node = toDiff(node, child(child => {
	              /**
	               * Wrap the item with placeholders, for when stuff in
	               * between moves. If a `Show` adds and removes nodes, we
	               * dont have a reference to these nodes. By delimiting
	               * with a shore, we can just handle anything in between
	               * as a group.
	               */
	              const begin = createPlaceholder(parent, undefined /*begin*/, true);
	              const end = createPlaceholder(parent, undefined /*end*/, true);
	              return [begin, createChildren(end, child, true), end];
	            }), true);
	          });
	          cleanup(() => {
	            toDiff(node);
	            parent.remove();
	          });
	          return [node, parent];
	        }

	        // maybe a signal so needs an effect

	        effect(() => {
	          node = toDiff(node, [createChildren(parent, child(), true, node[0])], true);
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
	        return [node, parent];
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
	          return createChildren(parent, toArray(child.values()), relative);
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
	        return insertNode(parent, createTextNode(child.toString()), relative);
	      }
	  }
	}
	propsPlugin('children', (node, propName, propValue) => createChildren(node, propValue), false);

	/**
	 * Creates placeholder to keep nodes in position
	 *
	 * @param {Element} parent
	 * @param {unknown} text
	 * @param {boolean} [relative]
	 * @returns {Element}
	 */
	const createPlaceholder = (parent, text, relative) => {
	  return insertNode(parent, createTextNode(''), relative);

	  /* dev
	  return insertNode(
	  	parent,
	  	document.createComment(
	  		(text || '') + (relative ? ' relative' : ''),
	  	),
	  	relative,
	  ) */
	};
	const head = document$1.head;

	/**
	 * Adds the element to the document
	 *
	 * @param {Element} parent
	 * @param {Element &
	 * 	HTMLTitleElement &
	 * 	HTMLMetaElement &
	 * 	HTMLLinkElement} node
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
	  const node = createChildren(parent, isComponentable(children) ? Factory(children) : children, options.relative);
	  cleanup(() => toDiff([node].flat(Infinity)));
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

	flat(toHTMLFragment(children).childNodes);

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
	  const ctx = Context$1(defaultValue);

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
	 * Removes from the DOM `prev` elements not found on `next`
	 *
	 * @param {Element[]} prev - Array with previous elements
	 * @param {Element[]} next - Array with next elements
	 * @returns {Element[]}
	 */
	function toDiff(prev = [], next = [], short = false) {
	  next = next.flat(Infinity);
	  // fast clear
	  if (short && prev.length && next.length === 0) {
	    // + 1 because of the original placeholder
	    if (prev.length + 1 === prev[0].parentNode.childNodes.length) {
	      const parent = prev[0].parentNode;
	      // save the placeholder
	      const child = parent.lastChild;
	      parent.textContent = '';
	      parent.append(child);
	      return;
	    }
	  }
	  for (let i = 0, item; i < prev.length; i++) {
	    item = prev[i];
	    item && (next.length === 0 || !next.includes(item)) && item.remove();
	  }
	  return next;
	}

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
	   * @param {string} value
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
	 * 	when: When<T>
	 * 	children?: Children
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
	      this.html = value ? '<slot/>' : '';
	    }
	  }
	  const name = 'pota-collapse';
	  customElement(name, CollapseElement);
	  return Component(name, {
	    when: props.when,
	    children: props.children
	  });
	}

	/**
	 * Creates components dynamically
	 *
	 * @template props
	 * @param {{
	 * 	component: Component
	 * } & props} props
	 * @returns {Component}
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
	 * @param {Children} [props.children]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/For
	 */

	const For = props => map(() => {
	  props.restoreFocus && queue();
	  return props.each;
	}, makeCallback(props.children));
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
	 * @param {{
	 * 	children?: Children
	 * }} props
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Head
	 */
	const Head = props => Component(Portal, {
	  mount: document$1.head,
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
	const scrollToLocationHash = () => scrollToSelector(location$1.hash);

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

	const encodeURIComponent = global.encodeURIComponent;

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

	/**
	 * Returns true if the link is absolute: starts with '/', '#' or
	 * 'http'
	 *
	 * @param {string} href - Url
	 * @returns {boolean} Returns true if the link is absolute
	 */
	const isAbsolute = href => href[0] === '/' || href[0] === '#' || /^http/.test(href);

	/**
	 * Returns true if the link is external. It does so by checking that
	 * window.location.origin is present at the beginning of the url
	 *
	 * @param {string} url - Url
	 * @returns {boolean} Returns true if the link is external
	 */
	const isExternal = url =>
	// origin could be http://example.net and link could be http://example.net.ha.com, so add "/"
	/^http/.test(url) && !(url + '/').startsWith(origin + '/');

	/**
	 * Returns true if the link is relative
	 *
	 * @param {string} url - Url
	 * @returns {boolean} Returns true if the link relative
	 */
	const isRelative = url => !isAbsolute(url);

	/**
	 * Replace params in an url for the encoded equivalent
	 *
	 * @param {string | undefined} url - Url
	 * @param {object} [params] - Key-value pair to replace
	 * @returns {string} Url with the params replaced
	 */
	const replaceParams = (url, params) => params ? url.replace(/\:([a-z0-9_\-]+)/gi, (a, b) =>
	// only replace the ones defined on params
	params[b] !== undefined ? encodeURIComponent(params[b]) : a) : url;

	/* #__NO_SIDE_EFFECTS__ */
	function create(props = nothing) {
	  const [children, setChildren, updateChildren] = signal([]);
	  return {
	    base: '',
	    // the composed base route
	    href: () => '',
	    // the url of the route
	    parent: undefined,
	    // parent context
	    show: () => false,
	    // if the route is shown
	    params: () => () => nothing,
	    // params of the route
	    scroll: [],
	    // elements to scroll
	    // the children routes
	    addChildren: child => {
	      updateChildren(children => {
	        children.push(child);
	        return [...children];
	      });
	    },
	    removeChildren: child => {
	      updateChildren(children => {
	        removeFromArray(children, child);
	        return [...children];
	      });
	    },
	    noneMatch: memo(() => {
	      return (
	        /**
	         * If doesnt have siblings then is not a 404
	         *
	         * @example
	         * 	<Route>
	         * 	<Component/> <Router.Default/> <-- Router.Default should never render
	         * 	</Route>
	         */
	        children().length &&
	        // when it has sibling, check if at least 1 rendered
	        children().every(children => !children.show())
	      );
	    }),
	    // override
	    ...props
	  };
	}
	const Context = context(create());

	// window.location signal

	const [getLocation, setLocation] = signal(location$1, {
	  equals: false
	});

	// only trigger on what changed

	const pathname = memo(() => getLocation().pathname);
	const search = memo(() => getLocation().search);
	const href = memo(() => getLocation().href);

	// http://location/# reports hash to be empty
	// http://location/ reports hash to be empty
	// handle this difference by checking if "#" is at the end of `href`
	const hash = memo(() => href().endsWith('#') ? '#' : getLocation().hash);

	/**
	 * @typedef {object} location
	 * @property {Signal} href - The full url
	 * @property {Signal} pathname - Mirror of window.location.pathname
	 * @property {Signal} hash - Everything after #
	 * @property {Signal} path - Pathname + hash
	 * @property {Signal} query - Key value pairs with search params
	 * @property {Function} params - Key value pairs with route params
	 */

	/** @type location */
	const location = {
	  href,
	  pathname,
	  hash,
	  path: memo(() => pathname() + hash()),
	  query: memo(() => {
	    const value = search();
	    const searchParams = empty();
	    const params = new URL(origin$1 + '/' + value).searchParams;
	    for (const [key, value] of params.entries()) {
	      searchParams[key] = value;
	    }
	    return searchParams;
	  }),
	  params: () => {
	    const routes = [];
	    walkParents(Context(), 'parent', context => {
	      routes.push(context.params);
	    });
	    const params = empty();
	    for (const param of routes) {
	      // `|| params` because when nothing is found the result is undefined
	      for (const [key, value] of entries(param()() || nothing)) {
	        params[key] = value !== undefined ? _decodeURIComponent(value) : value;
	      }
	    }
	    return params;
	  }
	};
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
	      if (!(await beforeLeave.callback().catch(() => false))) return false;
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
	 * @param {{ scroll?: boolean; replace?: boolean }} options
	 * @url https://pota.quack.uy/Components/Router/Navigate
	 */
	async function navigate(href, options = nothing) {
	  if (location$1.href !== href) {
	    if (await canNavigate(href)) {
	      const fn = () => navigateInternal(href, options);
	      // navigate with transition if available
	      document$1.startViewTransition && location$1.href.replace(/#.*/, '') !== href.replace(/#.*/, '') ? document$1.startViewTransition(fn) : fn();
	    }
	  }
	}
	function navigateInternal(href, options) {
	  if (options.replace) {
	    history.replaceState(null, '', href);
	  } else {
	    history.pushState(null, '', href);
	  }
	  setLocation(location$1);
	  if (optional(options.scroll)) {
	    scrollToSelectorWithFallback(location$1.hash);
	  }
	}

	// listeners

	let addListenersAdded = false;
	function addListeners() {
	  if (!addListenersAdded) {
	    addListenersAdded = true;
	    document$1.addEventListener('click', onLinkClick);
	    addEventListener('hashchange', onLocationChange);
	    addEventListener('popstate', onLocationChange);
	  }
	}

	// listen when using browser buttons
	// safe to use async as its on a listener
	async function onLocationChange() {
	  // chrome has a bug on which if you use the back/forward button
	  // it will change the title of the tab to whatever it was before
	  // if the navigation is prevented (therefore the title/page wont change)
	  // it will still use the old title even if the title tag didn't change at all
	  const title = document$1.title;
	  document$1.title = title + ' ';
	  document$1.title = title;
	  if (await canNavigate(location$1.href)) {
	    setLocation(location$1);
	  } else {
	    history.pushState(null, '', location.href());
	  }
	}
	function onLinkClick(e) {
	  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

	  // find link
	  const node = e.composedPath().find(item => item instanceof HTMLAnchorElement);

	  // validate
	  if (!node || !node.href || node.download || node.target || !node.href.startsWith('http') ||
	  // when using other protocol than "http"
	  isExternal(node.href) || node.rel && node.rel.split(/\s/).includes('external')) return;
	  preventDefault(e);
	  navigate(node.href, {
	    replace: node.replace
	  });
	}

	/**
	 * Renders its children based on a condition
	 *
	 * @template T
	 * @param {object} props
	 * @param {When<T>} props.when
	 * @param {Children} [props.fallback]
	 * @param {Children} [props.children]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Show
	 */
	function Show(props) {
	  // fallback
	  const fallback = isNullUndefined(props.fallback) ? undefined : memo(() => resolve(props.fallback));

	  // callback
	  const callback = makeCallback(props.children);

	  // shortcircuit non-functions
	  if (!isFunction(props.when)) {
	    return props.when ? callback(() => props.when) : fallback;
	  }

	  // signals/functions
	  const value = memo(() => getValue(props.when));
	  const condition = memo(() => !!value());
	  return memo(() => condition() ? callback(value) : fallback);
	}

	function scroll(context) {
	  /**
	   * Scroll to hash first, if doesnt, scroll to positions defined by
	   * the Routes.
	   */
	  if (!scrollToLocationHash()) {
	    if (!walkParents(context, 'parent', context => {
	      if (context.scroll) {
	        for (const item of context.scroll) {
	          if (scrollToSelector(item)) {
	            return true;
	          }
	        }
	      }
	    })) {
	      scrollToTop();
	    }
	  }
	}

	/**
	 * Renders children if the path matches the current location
	 *
	 * @template T
	 * @param {object} props
	 * @param {string} [props.path] - Path to match relative to the parent
	 *   Route. When `path` is missing, it will render only when the
	 *   parent's route path is matched exactly.
	 * @param {string[]} [props.scroll] - Elements to scroll when the
	 *   route matches
	 * @param {object} [props.params] - Key-value pairs params to encode
	 *   and replace on the path
	 * @param {When<T>} [props.collapse] - To hide the route instead of
	 *   removing it from the document
	 * @param {When<T>} [props.when] - To stop rendering the route even if
	 *   the path matches.
	 * @param {Children} [props.fallback] - Fallback for when a `when`
	 *   condition is set. If the `when` condition is not set, this wont
	 *   be used.
	 * @param {Children} [props.children]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Router/Router
	 */
	function Router(props) {
	  addListeners();
	  const parent = Context();
	  const base = parent.base + replaceParams(
	  // when <Router lacks a path prop is treated as the final route
	  props.path === undefined ? '(|#.*)$' // ends with nothing or has a hash followed of stuff
	  :
	  // ends with nothing or has a hash followed of stuff
	  props.path.replace('$', '(|#.*)$')
	  // pathname always starts with /, make sure the hash is considered
	  .replace(/^#/, '/#'), props.params);
	  const route = new RegExp('^' + base.replace(/\:([a-z0-9_\-]+)/gi, '(?<$1>[^/#]+)'));
	  let href = '';
	  const [params, setParams] = signal(() => nothing);

	  // derived
	  const show = memo(() => {
	    const path = location.path();
	    if (route.test(path)) {
	      setParams(() => route.exec(path).groups);
	      if (href === '') {
	        href = path.replace(path.replace(route, ''), '');
	        // create full link
	        href =
	        // add origin
	        origin$1 + (
	        // add slash after origin if isnt present in the href
	        href[0] !== '/' ? '/' : '') +
	        // add the path
	        href;
	      }
	      onDone(() => scroll(context));
	      return true;
	    } else {
	      return false;
	    }
	  });
	  const context = create({
	    base,
	    // the prefix for the children path
	    href: () => href,
	    // the full url of the route
	    params,
	    scroll: props.scroll,
	    parent,
	    show
	  });
	  parent.addChildren(context);
	  cleanup(() => parent.removeChildren(context));
	  return Component(Context.Provider, {
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
	 * Renders children when no sibling `Router` matches
	 *
	 * @param {object} props
	 * @param {Children} [props.children]
	 * @returns {Children}
	 */
	Router.Default = props => {
	  const context = Context();
	  return Component(Show, {
	    when: context.noneMatch,
	    children: props.children
	  });
	};

	/*
	 * // props
	 * // props.href Url relative to the parent <Router/>
	 * // props.params Key-value pair object params to replace in the url
	 *   not scroll on location change
	 * // props.replace Replace the history entry from the browser} props
	 */

	/**
	 * Creates a link with Router features
	 *
	 * @param {{
	 * 	href: string
	 * 	params?: object
	 * 	replace?: boolean
	 * } & Props} props
	 *
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Router/A
	 */

	function A(props) {
	  addListeners();
	  let href = replaceParams(props.href, props.params);

	  // make it absolute
	  // link is relative to the <Route
	  const base = Context().href();
	  href = !isRelative(href[0]) || !base ? href : base.includes('/#') ?
	  // making link dos/ relative to http://localhost:11433/#uno/
	  // becomes http://localhost:11433/#uno/dos/
	  base + href : new URL(href, base).href;
	  return Component('a', {
	    ...{
	      ...props,
	      href,
	      params: undefined
	    }
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
	 * @param {When<T>} props.when
	 * @param {Children} [props.children]
	 * @returns {Children}
	 */
	const Match = identity;

	const defaultRegistry = {
	  A,
	  Collapse,
	  Dynamic,
	  For,
	  Head,
	  Match,
	  Portal,
	  Router,
	  Show,
	  Switch
	};

	// parseHTML

	const id = 'pota19611227';
	const splitId = /(pota19611227)/;
	const xmlns = ['class', 'on', 'prop', 'attr', 'bool', 'style', 'var', 'onMount', 'onUnmount', 'ref'].map(ns => `xmlns:${ns}="/"`).join(' ');

	/**
	 * Makes Nodes from TemplateStringsArray
	 *
	 * @param {TemplateStringsArray} content
	 * @returns {Element}
	 */
	const parseHTML = withWeakCache(content => {
	  const html = new DOMParser().parseFromString(`<xml ${xmlns}>${content.join(id)}</xml>`, 'text/xml').firstChild.childNodes;
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
	 * @param {{ components: {} }} html
	 * @param {Element[]} cached
	 * @param {...any} values
	 * @returns {Children}
	 */
	function toH(html, cached, values) {
	  let index = 0;
	  function nodes(node) {
	    if (node.nodeType === 1) {
	      // element
	      const tagName = node.tagName;

	      // gather props
	      const props = empty();
	      for (let {
	        name,
	        value
	      } of node.attributes) {
	        if (value === id) {
	          value = values[index++];
	        } else if (value.includes(id)) {
	          const val = value.split(splitId).map(x => x === id ? values[index++] : x);
	          value = () => val.map(getValue).join('');
	        }
	        props[name] = value;
	      }

	      // gather children
	      const childNodes = node.childNodes;
	      if (childNodes.length) {
	        props.children = flat(toArray(childNodes).map(nodes));
	      }
	      /[A-Z]/.test(tagName) && !html.components[tagName] && warn(`html: Forgot to ´html.define({ ${tagName} })´?`);
	      return Component(html.components[tagName] || tagName, props);
	    } else if (node.nodeType === 3) {
	      // text
	      const value = node.nodeValue;
	      return value.includes(id) ? value.split(splitId).map(x => x === id ? values[index++] : x) : value;
	    } else if (node.nodeType === 8) {
	      // comment
	      const value = node.nodeValue;
	      if (value.includes(id)) {
	        const val = value.split(splitId).map(x => x === id ? values[index++] : x);
	        return () => createComment(val.map(getValue).join(''));
	      } else {
	        return createComment(value);
	      }
	    } else {
	      error(`html: ´nodeType´ not supported ´${node.nodeType}´`);
	    }
	  }
	  return flat(toArray(cached).map(nodes));
	}

	/**
	 * Function to create cached tagged template components
	 *
	 * @returns {Function & {
	 * 	define: ({ components }) => void
	 * 	components: {}
	 * }}
	 * @url https://pota.quack.uy/HTML
	 */

	function HTML() {
	  /**
	   * Creates tagged template components
	   *
	   * @param {TemplateStringsArray} template
	   * @param {...any} values
	   * @returns {Children}
	   * @url https://pota.quack.uy/HTML
	   */

	  function html(template, ...values) {
	    return toH(html, parseHTML(template), values);
	  }
	  html.components = {
	    ...defaultRegistry
	  };
	  html.define = userComponents => {
	    for (const name in userComponents) {
	      html.components[name] = userComponents[name];
	    }
	  };
	  return html;
	}
	const html = HTML();

	/**
	 * Returns a `isSelected` function that will return `true` when the
	 * argument for it matches the original signal `value`.
	 *
	 * @param {Signal} value - Signal with the current value
	 * @returns {(item: any) => Signal} Signal that you can run with a
	 *   value to know if matches the original signal
	 */
	function useSelector(value) {
	  const map = new Map();
	  let prev = [];
	  syncEffect(() => {
	    const val = value();
	    const selected = isIterable(val) ? toArray(val.values()) : [val];

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
	   * @param {any} item - Values to compare with current
	   * @returns {Signal} A signal with a boolean value
	   */
	  return function isSelected(item) {
	    let selected = map.get(item);
	    if (!selected) {
	      selected = signal(prev.includes(item));
	      selected.counter = 0;
	      map.set(item, selected);
	    }
	    selected.counter++;
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
	}) => html`<div class="col-sm-6 smallpad">
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
	  html.define({
	    bbutton
	  });
	  return html`<div class="container">
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
    return html`<tr class:danger="${isSelected(id)}">
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
