(function () {
	'use strict';

	const version = '0.13.122';

	const global = globalThis;

	const Symbol = global.Symbol;

	const Object$1 = global.Object;

	const assign = Object$1.assign;

	/**
	 * Returns true when value is a Function
	 *
	 * @param {any} value
	 * @returns {boolean} True when `value` is a Function
	 */
	const isFunction = value => typeof value === 'function';

	// symbols

	const $meta = Symbol();
	const $component = Symbol();
	const $class = Symbol();
	const $reactive = Symbol();
	const $map = Symbol();
	const $internal = Symbol();

	// supported namespaces

	const prefix = 'http://www.w3.org/';
	const NS = {
	  __proto__: null,
	  svg: prefix + '2000/svg',
	  math: prefix + '1998/Math/MathML',
	  html: prefix + '1999/xhtml',
	  xlink: prefix + '1999/xlink'
	};

	/**
	 * Marks a function as reactive. Reactive functions are ran inside
	 * effects.
	 *
	 * @param {Function} fn - Function to mark as reactive
	 * @returns {Function}
	 */
	function markReactive(fn) {
	  fn[$reactive] = undefined;
	  return fn;
	}

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
	 * - Update function on Signal that could be used to use the old value
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
	  constructor(owner) {
	    this.owner = owner;
	    this.context = owner?.context;
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
	  constructor(owner, fn) {
	    super(owner);
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
	    if (this.updatedAt <= time) {
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
	  constructor(owner, fn) {
	    super(owner, fn);
	    Effects ? Effects.push(this) : batch(() => this.update());
	  }
	}
	class SyncEffect extends Computation {
	  constructor(owner, fn) {
	    super(owner, fn);
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
	    super(owner, fn);
	    if (options) {
	      assign(this, options);
	    }
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
	    this.read = markReactive(this.read.bind(this));
	    this.write = this.write.bind(this);
	    this.update = this.update.bind(this);
	  }
	  read() {
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
	  }
	  write(value) {
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
	  }
	  update(value) {
	    if (typeof value === 'function') {
	      value = value(this.value);
	    }
	    return this.write(value);
	  }
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
	 * @param {(dispose: Function) => any} fn
	 * @returns {any}
	 */
	function root(fn) {
	  const prevOwner = Owner;
	  const prevListener = Listener;
	  const root = new Root(Owner);
	  Owner = root;
	  Listener = undefined;
	  try {
	    return runUpdates(() => fn(root.dispose.bind(root)), true);
	  } finally {
	    Owner = prevOwner;
	    Listener = prevListener;
	  }
	}

	/**
	 * Creates a signal
	 *
	 * @template T
	 * @param {any} [initialValue] - Initial value of the signal
	 * @param {SignalOptions} [options] - Signal options
	 * @returns {SignalObject<T>}
	 */
	function signal(initialValue, options = undefined) {
	  return new Signal(initialValue, options);
	}

	/**
	 * Creates an effect
	 *
	 * @param {Function} fn
	 */
	function effect(fn) {
	  return new Effect(Owner, fn);
	}

	/**
	 * Creates a syncEffect
	 *
	 * @param {Function} fn
	 */
	function syncEffect(fn) {
	  return new SyncEffect(Owner, fn);
	}

	/**
	 * Creates a read-only signal from the return value of a function that
	 * automatically updates
	 *
	 * @param {Function} fn - Function to re-run when dependencies change
	 * @param {SignalOptions} [options]
	 * @returns {Signal} - Read only signal
	 */
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

	/**
	 * Returns current owner
	 *
	 * @returns {typeof Owner}
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
	 * @param {Generic<T>} fn
	 * @returns {Generic<T>}
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

	/*

	let readForbid = false

	function checkReadForbidden() {
		if (readForbid) {
			console.trace('Signal Read!')
		}
	}
	export function readForbidden(fn, value) {
		const prev = readForbid
		try {
			readForbid = value
			return fn()
		} finally {
			readForbid = prev
		}
	}
	*/

	/**
	 * Creates a context and returns a function to get or set the value
	 *
	 * @param {any} [defaultValue] - Default value for the context
	 * @returns {typeof Context} Context
	 */
	function Context(defaultValue = undefined) {
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
	 * Returns a function on which you can pass functions to run with the
	 * current owner
	 *
	 * @returns {(fn) => any}
	 */
	const withOwner = () => {
	  const o = Owner;
	  return fn => isFunction(fn) ? runWithOwner(o, fn) : fn;
	};

	/**
	 * A self contained signal function, when an argument is present it
	 * writes to the signal, when theres no argument it reads the signal.
	 *
	 * @param {any} [value] - Optional initial value
	 * @returns {Signal}
	 */
	function signalFunction(value) {
	  const [read, write] = signal(value);
	  return markReactive((...args) => args.length ? write(args[0]) : read());
	}

	/**
	 * Unwraps values. If the argument is a function then it runs it
	 * recursively and returns the value
	 *
	 * @param {Function | any} value - Maybe function
	 * @returns {any}
	 */
	const getValue = value => {
	  while (typeof value === 'function') value = value();
	  return value;
	};

	const groupBy = Object$1.groupBy;

	/**
	 * Removes a value from an array
	 *
	 * @param {any[]} array
	 * @param {any} value To remove from the array
	 * @returns {any[]}
	 */
	function removeFromArray(array, value) {
	  const index = array.indexOf(value);
	  if (index !== -1) array.splice(index, 1);
	  return array;
	}

	// MAP


	/**
	 * Reactive Map
	 *
	 * @param {Each} list
	 * @param {Function} callback
	 * @param {boolean} sort
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
	      prev[i].dispose(true);
	    }
	    cache.clear();
	    duplicates.clear();
	    rows.length = 0;
	    prev.length = 0;
	  }

	  // to get rid of all nodes when parent disposes
	  cleanup(clear);
	  class Row {
	    constructor(item, index, fn, isDupe) {
	      this.runId = -1;
	      this.item = item;
	      this.index = index;
	      this.isDupe = isDupe;
	      this.disposer = undefined;
	      this.nodes = root(disposer => {
	        this.disposer = disposer;
	        /** @type Children[] */
	        return fn(item, index);
	      });
	    }
	    get begin() {
	      return this.nodes[0];
	    }
	    get end() {
	      return this.nodes[this.nodes.length - 1];
	    }
	    dispose(all) {
	      // skip cache deletion as we are going to clear the full map
	      if (all === undefined) {
	        // delete from cache
	        if (!this.isDupe) {
	          cache.delete(this.item);
	        } else {
	          const arr = duplicates.get(this.item);
	          arr.length === 1 ? duplicates.delete(this.item) : removeFromArray(arr, this);
	        }
	      }
	      this.disposer();
	    }
	  }

	  /**
	   * @param {Function} fn
	   * @returns {Children}
	   */
	  function mapper(fn) {
	    const cb = fn ? (item, index) => fn(callback(item, index), index) : callback;
	    const items = (getValue(list) || []).entries();
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
	          prev[i].dispose();
	        }
	      }
	    }

	    // reorder elements
	    // `rows.length > 1` because no need for sorting when there are no items
	    // prev.length > 0 to skip sorting on creation as its already sorted
	    if (sort && rows.length > 1 && prev.length) {
	      // if the planets align it handles swapping
	      // a = sorted
	      // b = unsorted
	      const {
	        a,
	        b
	      } = groupBy(rows, (value, index) => rows[index] === prev[index] ? 'a' : 'b');
	      if (a && b && a.length && b.length && b.length < a.length && b.every(item => prev.includes(item))) {
	        for (const usort of b) {
	          for (const sort of a) {
	            if (usort.index === sort.index - 1) {
	              sort.begin.before(...nodesFromRow(usort));
	              break;
	            } else if (usort.index === sort.index + 1) {
	              sort.end.after(...nodesFromRow(usort));
	              break;
	            }
	          }
	        }
	      }

	      // handles all other cases
	      // best for any combination of: push/pop/shift/unshift/insertion/deletion
	      // must check in reverse as on creation stuff is added to the end

	      let current = rows[rows.length - 1];
	      for (let i = rows.length - 1; i > 0; i--) {
	        const previous = rows[i - 1];
	        if (current.begin.previousSibling !== previous.end) {
	          current.begin.before(...nodesFromRow(previous));
	        }
	        current = previous;
	      }
	    }

	    // save sorted list
	    prev = rows;

	    // return external representation
	    return rows.map(item => item.nodes);
	  }
	  mapper[$map] = undefined;
	  return mapper;
	}
	function nodesFromRow(row) {
	  const {
	    begin,
	    end
	  } = row;
	  const nodes = [begin];
	  let nextSibling = begin;
	  while (nextSibling !== end) {
	    nextSibling = nextSibling.nextSibling;
	    nodes.push(nextSibling);
	  }
	  return nodes;
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
	    } = Promise.withResolvers();
	    queue.push(promise);
	    function onDone() {
	      removeFromArray(queue, promise);
	      resolve();
	    }
	    fn(queue.length === 1 ? undefined : queue[queue.length - 2]).then(onDone).catch(onDone);
	  });
	}

	/**
	 * Lazy and writable version of `memo`, its writable and will run the
	 * function only when used
	 *
	 * @author ryansolid
	 * @param {Function} fn - Function to re-run when dependencies change
	 * @returns {((...args) => any) | (() => any)}
	 */
	function writable(fn) {
	  const result = memo(() => signal(fn()));
	  return markReactive((...args) => {
	    return args.length ? result().write(args[0]) : result().read();
	  });
	}

	/**
	 * Runs a function inside an effect if value is a function
	 *
	 * @param {any} value
	 * @param {(value) => any} fn
	 */
	const withValue = (value, fn) => isFunction(value) ? effect(() => {
	  fn(getValue(value));
	}) : fn(value);

	const isArray = Array.isArray;

	/**
	 * Runs arrays of functions with arguments
	 *
	 * @param {Function | Function[]} fn
	 * @param {...any} args? - Arguments to pass to the functions
	 */
	const call = (fn, ...args) => isArray(fn) ? fn[0](...args, ...fn.slice(1)) : fn(...args);

	/**
	 * Calls an array of functions
	 *
	 * @param {Function[]} fns
	 */
	const callAll = fns => {
	  for (const fn of fns) fn();
	};

	/**
	 * Creates a context and returns a function to get or set the value
	 *
	 * @param {any} [defaultValue] - Default value for the context
	 * @returns {typeof Context} Context
	 */
	function contextSimple(defaultValue = undefined) {
	  let value = defaultValue;

	  /**
	   * @overload Gets the context value
	   * @returns {any} Context value
	   */
	  /**
	   * @overload Runs `fn` with a new value as context
	   * @param {any} newValue - New value for the context
	   * @param {Function} fn - Callback to run with the new context value
	   * @returns {any}
	   */
	  /**
	   * @param {any | undefined} newValue
	   * @param {Function | undefined} fn
	   */
	  function Context(newValue, fn) {
	    if (newValue === undefined) {
	      return value;
	    } else {
	      const parent = Context();
	      value = newValue;
	      const result = fn();
	      value = parent;
	      return result;
	    }
	  }
	  return Context;
	}

	/**
	 * Returns true when value is an Object and not null
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isObject = value => value !== null && typeof value === 'object';

	const copy = o => isObject(o) ? structuredClone(o) : o;

	const defineProperties = Object$1.defineProperties;

	const create = Object$1.create;

	const defineProperty = Object$1.defineProperty;

	/**
	 * Object.defineProperty with `enumerable` and `configurable` set to
	 * `true` unless overwriten by `descriptor` argument
	 *
	 * @param {object} target
	 * @param {PropertyKey} key
	 * @param {PropertyDescriptor} descriptor
	 */
	const redefineProperty = (target, key, descriptor) => defineProperty(target, key, assign(create(defaults), descriptor));
	const defaults = {
	  __proto__: null,
	  configurable: true,
	  enumerable: true
	};

	/**
	 * Returns an object without a prototype
	 *
	 * @type {Function}
	 * @returns {Props} Empty object
	 */
	const empty = Object$1.create.bind(null, null);
	const emptyArray = () => [];

	const entries = Object$1.entries;

	/**
	 * Flats an array/childNodes to the first children if the length is 1
	 *
	 * @param {any[] | NodeListOf<ChildNode>} arr
	 * @returns {any}
	 */
	const flat = arr => arr.length === 1 ? arr[0] : arr;

	const freeze = Object$1.freeze;

	const fromEntries = Object$1.fromEntries;

	/**
	 * Keeps state in the function as a bind param
	 *
	 * @param {Function} fn - Function to which add state to it
	 * @param {object} [state] - To which add state to it
	 * @returns {Function} A copy of the function with the state
	 */
	const functionState = (fn, state = empty()) => fn.bind(null, state);

	const getOwnPropertyNames = Object$1.getOwnPropertyNames;

	const getValueWithArguments = (value, ...args) => typeof value === 'function' ? args.length ? getValue(value(...args)) : getValue(value()) : value;

	/**
	 * Unwraps `value` and returns `element` if result is a `Node`, else
	 * `undefined` in the case isn't a `Node`
	 *
	 * @param {Function | any} value - Maybe function
	 * @param {...any} args? - Arguments
	 * @returns {Node | undefined}
	 */
	function getValueElement(value, ...args) {
	  const element = getValueWithArguments(value, ...args);
	  return element instanceof Node ? element : undefined;
	}

	const hasOwnProperty = Object$1.hasOwn;

	const isExtensible = Object$1.isExtensible;

	const isNaN = Number.isNaN;

	/**
	 * Returns `true` if the value is `null` or `undefined`
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isNullUndefined = value => value === undefined || value === null;

	/**
	 * Returns `true` if the property is defined in the prototype and
	 * absent in the object
	 *
	 * @param {{}} target
	 * @param {PropertyKey} key
	 */
	const isPrototypeProperty = (target, key) =>
	// must do `key in target` to check that it DOES have it somewhere
	// must do !hasOwnProperty to check that isnt an own property
	key in target && !hasOwnProperty(target, key);

	/**
	 * Returns true when value is a string
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isString = value => typeof value === 'string';

	const iterator = Symbol.iterator;

	const keys = Object$1.keys;

	function measure(name, cb) {
	  console.time(name);
	  const r = cb();
	  console.timeEnd(name);
	  return r;
	}
	function timing(fn) {
	  const start = performance.now();
	  fn();
	  return performance.now() - start;
	}

	const microtask = queueMicrotask;

	/** @type {Function} */
	const noop = () => {};

	const nothing = freeze(empty());

	// an optional value is `true` by default, so most of the time is undefined which means is `true`
	// to avoid having conditions like `if(something.bla === undefined || something.bla)`
	// this function will short it to `if(optional(something.bla))`
	// additionally the value is resolved, for cases like `when={() => show() && optional(props.when)}`


	/**
	 * Returns true when value is true or undefined
	 *
	 * @param {Function | boolean | undefined} value
	 * @returns {boolean} True when value is true or undefined
	 */
	const optional = value => value === undefined || getValue(value);

	function* range(start, stop, step = 1) {
	  yield start;
	  while (start < stop) {
	    yield start += step;
	  }
	}

	const stringify = JSON.stringify;

	const toArray = Array.from;

	/**
	 * Creates a WeakMap to store data
	 *
	 * @returns {[
	 * 	(
	 * 		reference: WeakKey,
	 * 		createIfNotExistsAs?: (target: any) => any,
	 * 	) => any,
	 * 	(key: WeakKey, value: any) => void,
	 * 	Function,
	 * 	Function,
	 * 	WeakMap<WeakKey, any>,
	 * ]}
	 */

	function weakStore() {
	  const store = new WeakMap();
	  const get = store.get.bind(store);
	  const set = store.set.bind(store);
	  return [(target, defaults = undefined) => {
	    const o = get(target);
	    if (o !== undefined) return o;
	    if (defaults !== undefined) {
	      /**
	       * Default values should be passed as a function, so we dont
	       * constantly initialize values when giving them
	       */
	      defaults = defaults(target);
	      set(target, defaults);
	      return defaults;
	    }
	  }, set, store.has.bind(store), store.delete.bind(store), store];
	}

	/**
	 * Returns true when value is reactive (a signal)
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isReactive = value => isFunction(value) && $reactive in value;

	/**
	 * Returns true if the `value` is a `Component`
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isComponent = value => isFunction(value) && $component in value;

	/**
	 * Returns true if the value can be made a Component
	 *
	 * @param {any} value
	 * @returns {boolean}
	 */
	const isComponentable = value => !isReactive(value) && (isFunction(value) ||
	// avoid [1,2] and support { toString(){ return "something"} }
	!isArray(value) && isObject(value) && !value.then);

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
	  fn[$component] = undefined;
	  return fn;
	}

	/**
	 * The purpose of this file is to guarantee the timing of some
	 * callbacks. It queues a microtask, then the callbacks are added to a
	 * position in the array. These are run in priority.
	 *
	 * `onMount` should only run after a thing has been mounted
	 *
	 * `ready` should only run after all pending things to be mounted, has
	 * been mounted
	 */

	/** @type boolean */
	let added;

	/** @type [][] */
	let queue;

	/** @type Function[] */
	const finally_ = [];

	/** Resets the Scheduler */
	function reset() {
	  queue = [[], [], []];
	  added = false;
	}

	// initialization
	reset();

	/**
	 * Queues a callback at a priority
	 *
	 * @param {PropertyKey} priority - Priority
	 * @param {Function | Function[]} fn - Function to run once the
	 *   callbacks at this priority run
	 */
	function add(priority, fn) {
	  enqueue();
	  queue[priority].push(fn);
	}
	function enqueue() {
	  if (!added) {
	    added = true;
	    microtask(run);
	  }
	}
	/** Runs all queued callbacks */
	function run() {
	  const q = queue;
	  reset();
	  for (const fns of q) {
	    for (const fn of fns) {
	      call(fn);
	    }
	  }
	  for (const fn of finally_) {
	    call(fn);
	  }
	}

	/**
	 * Queue a function to run onMount (before ready)
	 *
	 * @param {Function | Function[]} fn
	 */
	const onMount = fn => add(0, fn);

	/**
	 * Queue a function to run ready (after onMount)
	 *
	 * @param {Function | Function[]} fn
	 * @url https://pota.quack.uy/ready
	 */
	const ready = fn => add(1, fn);

	/**
	 * Queue a function to run after all user defined processes
	 *
	 * @param {Function | Function[]} fn
	 */
	const onDone = fn => add(2, fn);

	/**
	 * Finally_ is intended to never be cleaned.
	 *
	 * @param {VoidFunction | Function} fn
	 */
	function onFinally(fn) {
	  enqueue();
	  finally_.push(fn);
	}

	const plugins = empty();
	const pluginsNS = empty();

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
	 * @param {boolean} [runOnMicrotask=true] - To avoid the problem of
	 *   needed props not being set, or children elements not created yet.
	 *   Default is `true`
	 * @url https://pota.quack.uy/props/propsPlugin
	 */
	const propsPlugin = (propName, fn, runOnMicrotask = true) => {
	  plugin(plugins, propName, fn, runOnMicrotask);
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
	 * @param {boolean} [runOnMicrotask=true] - Set to run on a microtask
	 *   to avoid the problem of needed props not being set, or children
	 *   elements not being created yet. Default is `true`
	 */
	const propsPluginNS = (NSName, fn, runOnMicrotask = true) => {
	  plugin(pluginsNS, NSName, fn, runOnMicrotask);
	};
	const plugin = (plugins, name, fn, runOnMicrotask) => {
	  plugins[name] = !runOnMicrotask ? fn : (...args) => {
	    const owned = withOwner();
	    microtask(() => owned(() => fn(...args)));
	  };
	};

	/**
	 * @param {Elements} node
	 * @param {string} eventName
	 * @param {any} [data]
	 */

	const emit = (node, eventName, data = {
	  bubbles: true,
	  cancelable: true,
	  composed: true
	}) => node.dispatchEvent(new CustomEvent(eventName, data));

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setPropertyNS = (node, name, value, props, localName, ns) => setProperty(node, localName, value);

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @url https://pota.quack.uy/props/setProperty
	 */
	const setProperty = (node, name, value) => withValue(value, value => _setProperty(node, name, value));

	/**
	 * @param {Elements} node
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
	  if (name === 'value') {
	    emit(node, 'input');
	    emit(node, 'change');
	  }
	}

	// NODE ATTRIBUTES

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setAttributeNS = (node, name, value, props, localName, ns) => setAttribute(node, localName, value);

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {string} [ns]
	 * @url https://pota.quack.uy/props/setAttribute
	 */
	const setAttribute = (node, name, value, ns) => withValue(value, value => _setAttribute(node, name, value, ns));

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
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

	// BOOL ATTRIBUTES

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setBoolNS = (node, name, value, props, localName, ns) => setBool(node, localName, value);

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @url https://pota.quack.uy/props/setBool
	 */
	const setBool = (node, name, value) => withValue(value, value => _setBool(node, name, value));

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	const _setBool = (node, name, value) =>
	// if the value is falsy gets removed
	!value ? node.removeAttribute(name) : node.setAttribute(name, '');

	// node style


	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {object} props
	 * @url https://pota.quack.uy/props/setStyle
	 */
	const setStyle = (node, name, value, props) => setNodeStyle(node.style, value);

	/**
	 * @param {Elements} node
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
	 * @param {Elements} node
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
	    let name;
	    for (name in value) {
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
	    effect(() => {
	      setNodeStyle(style, getValue(value));
	    });
	    return;
	  }
	}

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	const setElementStyle = (node, name, value) => setStyleValue(node.style, name, value);

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
	 * @param {Elements} node
	 * @param {string} name
	 * @param {object | string | ArrayLike<any>} value
	 * @param {object} props
	 */
	const setClass = (node, name, value, props) => isString(value) ? node.setAttribute('class', value) : setClassList(node, value);

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {object | string | ArrayLike<any>} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setClassNS = (node, name, value, props, localName, ns) => isObject(value) ? setClassList(node, value) : setClassListValue(node, localName, value);

	// todo: the name of the class is not reactive

	/**
	 * @param {Elements} node
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
	          setClassListValue(node, name, value[name]);
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
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 */
	const setClassListValue = (node, name, value) => withValue(value, value => _setClassListValue(node, name, value));

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 */

	const _setClassListValue = (node, name, value) =>
	// null, undefined or false, the class is removed
	!value ? node.classList.remove(name) : node.classList.add(...name.trim().split(/\s+/));

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setRef = (node, name, value, props) => value(node);

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setOnMount = (node, name, value, props) =>
	// timing is already controlled by onMount
	onMount([value, node]);

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {Function} value
	 * @param {object} props
	 */
	const setUnmount = (node, name, value, props) =>
	// we need to ensure the timing of the cleanup callback
	// so we queue it to run it at a specific time
	cleanup(() => value(node));

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {EventListenerOrEventListenerObject} value
	 * @param {object} props
	 * @param {string} localName
	 * @param {string} ns
	 */
	const setEventNS = (node, name, value, props, localName, ns) => addEventListener(node, localName, value);
	const EventNames = empty();

	/**
	 * Returns an event name when the string could be mapped to an event
	 *
	 * @param {string} name - String to check for a mapped event
	 * @returns {string | undefined} Returns the event name or null in
	 *   case isnt found
	 */
	function eventName(name) {
	  if (name in EventNames) {
	    return EventNames[name];
	  }
	  if (name.startsWith('on') && name.toLowerCase() in window) {
	    EventNames[name] = name.slice(2).toLowerCase();
	  } else {
	    EventNames[name] = undefined;
	  }
	  return EventNames[name];
	}

	/**
	 * Adds an event listener to a node
	 *
	 * @param {Elements} node - Element to add the event listener
	 * @param {string} type - The name of the event listener
	 * @param {EventListenerOrEventListenerObject} handler - Function to
	 *   handle the event
	 * @returns {Function} - An `off` function for removing the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function addEventListener(node, type, handler) {
	  node.addEventListener(type, handler, isFunction(handler) ? undefined : handler);
	  const off = () => removeEventListener(node, type, handler);

	  /**
	   * Removes event on tracking scope disposal.
	   *
	   * Situation: the event was added to the `document` manually using
	   * `addEventListener`, say to listen for clicks as a "click
	   * outside". The event needs to be removed when the component that
	   * added it is disposed.
	   */
	  cleanup(off);
	  return off;
	}

	/**
	 * Removes an event listener from a node
	 *
	 * @param {Elements} node - Element to add the event listener
	 * @param {string} type - The name of the event listener
	 * @param {EventListenerOrEventListenerObject} handler - Function to
	 *   handle the event
	 * @returns {Function} - An `on` function for adding back the event
	 *   listener
	 * @url https://pota.quack.uy/props/EventListener
	 */
	function removeEventListener(node, type, handler) {
	  node.removeEventListener(type, handler);
	  return () => addEventListener(node, type, handler);
	}

	// NODE UNKNOWN PROPERTIES / ATTRIBUTES


	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {string} [ns]
	 */
	const setUnknownProp = (node, name, value, ns) => withValue(value, value => _setUnknownProp(node, name, value, ns));

	/**
	 * @param {Elements} node
	 * @param {string} name
	 * @param {unknown} value
	 * @param {string} [ns]
	 */
	const _setUnknownProp = (node, name, value, ns) => {
	  if (isObject(value)) {
	    // when not null object
	    _setProperty(node, name, value);
	  } else if (typeof value === 'boolean' && !name.includes('-')) {
	    // when boolean and name doesnt have a hyphen
	    _setProperty(node, name, value);
	  } else {
	    // fallback to attribute
	    _setAttribute(node, name, value, ns);
	    // to be able to delete properties
	    isNullUndefined(value) && _setProperty(node, name, value);
	  }
	};

	propsPlugin('style', setStyle, false);
	propsPluginNS('style', setStyleNS, false);
	propsPluginNS('var', setVarNS, false);
	propsPlugin('class', setClass, false);
	propsPluginNS('class', setClassNS, false);
	for (const item of ['value', 'textContent', 'innerText', 'innerHTML']) {
	  propsPlugin(item, setProperty, false);
	}
	propsPluginNS('prop', setPropertyNS, false);
	propsPluginNS('attr', setAttributeNS, false);
	propsPluginNS('bool', setBoolNS, false);
	propsPlugin('onMount', setOnMount, false);
	propsPluginNS('onMount', setOnMount, false);
	propsPlugin('onUnmount', setUnmount, false);
	propsPluginNS('onUnmount', setUnmount, false);

	// ref

	propsPlugin('ref', setRef, false);
	propsPluginNS('ref', setRef, false);
	propsPluginNS('on', setEventNS, false);
	const isCustomElement = (node, props) =>
	// document-fragment wont have a localName
	'is' in props || node.localName?.includes('-');

	/**
	 * Assigns props to an Element
	 *
	 * @param {Elements} node - Element to which assign props
	 * @param {object} props - Props to assign
	 */
	function assignProps(node, props) {
	  let name;
	  let value;
	  for (name in props) {
	    value = props[name];

	    // run plugins
	    if (name in plugins) {
	      plugins[name](node, name, value, props);
	      continue;
	    }

	    // onClick={handler}
	    let event = eventName(name);
	    if (event) {
	      addEventListener(node, event, value);
	      continue;
	    }
	    if (name.includes(':')) {
	      // with ns
	      let [ns, localName] = name.split(':');

	      // run plugins NS
	      if (ns in pluginsNS) {
	        pluginsNS[ns](node, name, value, props, localName, ns);
	        continue;
	      }

	      // onClick:my-ns={handler}
	      event = eventName(ns);
	      if (event) {
	        addEventListener(node, event, value);
	        continue;
	      }
	      isCustomElement(node, props) ? _setProperty(node, name, value) : setUnknownProp(node, name, value, ns);
	      continue;
	    }

	    // catch all
	    isCustomElement(node, props) ? _setProperty(node, name, value) : setUnknownProp(node, name, value);
	  }
	}

	const bind = fn => document[fn].bind(document);
	const createElement = bind('createElement');
	const createElementNS = bind('createElementNS');
	const createTextNode = bind('createTextNode');
	const adoptedStyleSheets = document.adoptedStyleSheets;
	function toDiff(prev = [], node = []) {
	  node = isArray(node) ? node.flat(Infinity) : [node];
	  for (let i = 0, item; i < prev.length; i++) {
	    item = prev[i];
	    item && (node.length === 0 || !node.includes(item)) && item.remove();
	  }
	  return node;
	}

	/** @returns {TreeWalker} */
	function walker() {
	  const walk = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
	  walker = () => walk;
	  return walker();
	}

	const id = 'pota';
	const tag = `<pota></pota>`;
	const [get, set] = weakStore();
	function parse(content) {
	  let cached = get(content);
	  if (!cached) {
	    const template = createElement('template');
	    template.innerHTML = content.join(tag).replaceAll(`"${tag}"`, `"${id}"`)
	    // avoid double br when self-closing
	    .replace(/<br\s*\/\s*>/g, '<br>')
	    // self-close
	    .replace(/<([a-z-]+)([^/>]*)\/\s*>/gi, '<$1 $2></$1>');
	    cached = template.content;
	    set(content, cached);
	  }
	  return cached;
	}
	const Clones = new Map();
	function cloneNode(content, xmlns) {
	  const cached = Clones.get(content);
	  if (cached) {
	    return cached.cloneNode(true);
	  }
	  let template = xmlns ? createElementNS(xmlns, 'template') : createElement('template');
	  template.innerHTML = content;
	  template = xmlns ? template.firstChild : template.content.childNodes.length === 1 ? template.content.firstChild : template.content;
	  Clones.set(content, template);
	  return template.cloneNode(true);
	}

	// REACTIVITE PRIMITIVES


	// STATE

	const Components = new Map();
	const WeakComponents = new WeakMap();
	const useXMLNS = context();

	// COMPONENTS

	/** Used by the JSX transform, as <>...</> or <Fragment>...</Fragment>. */
	const Fragment = Symbol();

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

	  /**
	   * Create a callable function to pass `props`. When `props` its not
	   * defined it allows the user to make a `Factory` of components,
	   * when `props` its defined the `props` are fixed.
	   */

	  return props === undefined ? Factory(value) : markComponent(Factory(value).bind(null, props));
	}

	/**
	 * Creates a component that could be called with a props object
	 *
	 * @param {Componenteable} value
	 * @returns {Component}
	 */

	function Factory(value) {
	  if (isComponent(value)) {
	    return value;
	  }
	  const isWeak = isObject(value);
	  let component = isWeak ? WeakComponents.get(value) : Components.get(value);
	  if (component) {
	    return component;
	  }
	  switch (typeof value) {
	    case 'string':
	      {
	        // string component, 'div' becomes <div>
	        component = createTag.bind(null, value);
	        break;
	      }
	    case 'function':
	      {
	        if ($class in value) {
	          // class component <MyComponent../>
	          component = createClass.bind(null, value);
	          break;
	        }

	        /**
	         * ```js
	         * const [Count, setCount] = signal(1)
	         * return <Count />
	         * ```
	         */
	        if (isReactive(value)) {
	          component = createAnything.bind(null, value);
	          break;
	        }

	        // function component <MyComponent../>
	        component = value;
	        break;
	      }
	    default:
	      {
	        if (value instanceof Node) {
	          // node component <div>
	          component = createNode.bind(null, value);
	          break;
	        }
	        component = createAnything.bind(null, value);
	        break;
	      }
	  }

	  // save in cache
	  isWeak ? WeakComponents.set(value, component) : Components.set(value, component);
	  return markComponent(component);
	}
	function createClass(value, props) {
	  const i = new value();
	  i.ready && ready(i.ready.bind(i));
	  i.cleanup && cleanup(i.cleanup.bind(i));
	  return i.render(props);
	}
	function createAnything(value, props) {
	  return value;
	}

	/**
	 * Creates a x/html element from a tagName
	 *
	 * @param {string} tagName
	 * @param {Props} props
	 * @returns {Elements} Element
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
	    return useXMLNS(NS.html, () => fn(NS.html));
	  }
	  return fn(nsContext);
	}
	function template(content, props) {
	  return markComponent(() => withXMLNS(props ? props[0].xmlns : undefined, xmlns => {
	    const node = cloneNode(content, xmlns);
	    if (props) {
	      const nodes = [];
	      let child;
	      /** The node could be a fragment */
	      if (node.nodeType === 1 &&
	      // element
	      node.hasAttribute('pota')) {
	        nodes.push(node);
	        node.removeAttribute('pota');
	      }

	      /**
	       * First walk then modify it, so the modifications dont make
	       * the walk worse. It also allows to re-use the same walker,
	       * as creating children right now could cause a new instance
	       * of template that will use the same walker and mess up our
	       * current walk. While this is not optimal is fast enough,
	       * requires some more work on the babel plugin.
	       */
	      const walk = walker();
	      walk.currentNode = node;
	      while (child = walk.nextNode()) {
	        if (child.hasAttribute('pota')) {
	          nodes.push(child);
	          child.removeAttribute('pota');
	          if (nodes.length === props.length) {
	            // done
	            break;
	          }
	        }
	      }
	      let i = 0;
	      for (const child of nodes) {
	        assignProps(child, props[i++]);
	      }
	    }
	    return node;
	  }));
	}

	/**
	 * Assigns props to an element and creates its children
	 *
	 * @param {Elements} node
	 * @param {Props} props
	 * @returns {Elements} Element
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
	 * @param {Elements} parent
	 * @param {Children} child
	 * @param {boolean} [relative]
	 * @returns {Children}
	 */
	function createChildren(parent, child, relative) {
	  switch (typeof child) {
	    // string/number
	    case 'string':
	    case 'number':
	      {
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
	        if ($map in child) {
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
	            }));
	          });
	          cleanup(() => {
	            toDiff(node);
	            parent.remove();
	          });
	          return [node, parent];
	        }

	        // maybe a signal so needs an effect
	        effect(() => {
	          node = toDiff(node, createChildren(parent, child(), true));
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
	        // children/fragments
	        if (isArray(child)) {
	          if (child.length === 1) {
	            return createChildren(parent, child[0], relative);
	          }
	          return child.map(child => createChildren(parent, child, relative));
	        }

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
	          const onResult = result => parent.isConnected && setValue(result);
	          child.then(onResult).catch(onResult);
	          return createChildren(parent, value, relative);
	        }

	        // iterable/Map/Set/NodeList
	        if (iterator in child) {
	          return createChildren(parent, toArray(child.values()), relative);
	        }

	        // CSSStyleSheet
	        if (child instanceof CSSStyleSheet) {
	          adoptedStyleSheets.push(child);
	          cleanup(() => removeFromArray(adoptedStyleSheets, child));
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
	 * @param {Elements} parent
	 * @param {unknown} text
	 * @param {boolean} [relative]
	 * @returns {Elements}
	 */
	const createPlaceholder = (parent, text, relative) => {
	  return insertNode(parent, createTextNode(''), relative);

	  /* dev */
	  return insertNode(parent, document.createComment((text || '') + (relative ? ' relative' : '')), relative);
	};
	let headQuerySelector;

	/**
	 * Adds the element to the document
	 *
	 * @param {Elements} parent
	 * @param {Elements} node
	 * @param {boolean} [relative]
	 * @returns {Elements}
	 */

	function insertNode(parent, node, relative) {
	  // special case `head`
	  if (parent === document.head) {
	    if (!headQuerySelector) {
	      const head = document.head;
	      headQuerySelector = head.querySelector.bind(head);
	    }
	    const name = node.tagName;

	    // search for tags that should be unique
	    let prev;
	    if (name === 'TITLE') {
	      prev = headQuerySelector('title');
	    } else if (name === 'META') {
	      prev = headQuerySelector('meta[name="' + node.getAttribute('name') + '"]') || headQuerySelector('meta[property="' + node.getAttribute('property') + '"]');
	    } else if (name === 'LINK' && node.rel === 'canonical') {
	      prev = headQuerySelector('link[rel="canonical"]');
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
	 * Inserts children into a parent
	 *
	 * @param {any} children - Thing to render
	 * @param {Elements | undefined} [parent] - Mount point, defaults to
	 *   document.body
	 * @param {{ clear?: boolean; relative?: boolean }} [options] -
	 *   Mounting options
	 * @returns {Function} Disposer
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
	 * @param {Elements} [parent] - Mount point, defaults to
	 *   `document.body`
	 * @param {{ clear?: boolean; relative?: boolean }} [options] -
	 *   Mounting options
	 */
	function insert(children, parent = document.body, options) {
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
	 * Resolves and returns `children` in a memo
	 *
	 * @param {Function | Children} fn
	 * @returns {Signal} Memo
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
	 * Creates a context and returns a function to get or set the value
	 *
	 * @param {any} [defaultValue] - Default value for the context
	 * @returns {Function & { Provider: ({ value }) => Elements }}
	 *   Context
	 * @url https://pota.quack.uy/Reactivity/Context
	 */
	function context(defaultValue = undefined) {
	  /** @type {Function & { Provider: ({ value }) => Elements }} */
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
	 * A Promise loader handler. Allows to display/run something or
	 * nothing while a promise is resolving. Allows to run a callback when
	 * the promise resolves. Allows to get notified of errors, and
	 * display/run something or nothing, if wanted a `retry` function is
	 * given for retrying the promise. All functions run with the original
	 * owner, so it's `Context` friendly.
	 *
	 * @param {() => Promise<any>} fn - Function that returns a promise
	 * @param {{
	 * 	onLoading?: any
	 * 	onLoaded?: Function
	 * 	onError?: ((e: Error, retry: Function) => any) | any
	 * }} [options]
	 *
	 * @returns {Component}
	 * @url https://pota.quack.uy/lazy
	 */
	const lazy = (fn, options = nothing) => markComponent(props => {
	  const {
	    onLoading,
	    onLoaded,
	    onError
	  } = options;
	  const [value, setValue] = signal(onLoading);
	  const owned = withOwner();
	  const retry = () => fn().then(r => {
	    setValue(markComponent(() => {
	      r = isObject(r) && r.default ? r.default : r;
	      return isFunction(r) ? r(props) : r;
	    }));
	    microtask(() => owned(onLoaded));
	  }).catch(e => onError ? setValue(markComponent(() => isFunction(onError) ? onError(e, retry) : onError)) : console.error(e));
	  retry();
	  return value;
	});
	const Lazy = props => lazy(props.children, props);

	/**
	 * Creates a stylesheet from a css string
	 *
	 * @param {string} css
	 * @returns {CSSStyleSheet}
	 */

	function sheet(css) {
	  const sheet = new CSSStyleSheet();
	  sheet.replace(css);
	  return sheet;
	}

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

	/**
	 * Extend `Pota` and define a `render(props){}` method to create a
	 * class component. `ready(cb)` and `cleanup(cb)` methods will be
	 * registered automatically
	 *
	 * @url https://pota.quack.uy/Classes
	 */
	class Pota {}
	Pota[$class] = undefined;

	// const [others, local] = propsSplit(props, ['children'])


	/**
	 * Split an object into multiple sub objects
	 *
	 * @param {Props} props
	 * @param {...string[]} args
	 * @returns {Props[]} - Array of objects
	 * @url https://pota.quack.uy/props/propsSplit
	 */
	function propsSplit(props, ...args) {
	  const result = [];
	  const used = empty();
	  for (const _props of args) {
	    const target = empty();
	    for (const key of _props) {
	      used[key] = null;
	      target[key] = props[key];
	    }
	    result.push(target);
	  }
	  const target = empty();
	  for (const key of keys(props)) {
	    if (used[key] === undefined) {
	      target[key] = props[key];
	    }
	  }
	  result.unshift(target);
	  return result;
	}

	// VERSION

	const camelCase = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase());

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
	const cachedSheets = empty();
	class CustomElement extends HTMLElement {
	  constructor() {
	    super();
	    this.attachShadow({
	      mode: 'open'
	    });
	    this.addStyleSheets(this.constructor.styleSheets);
	  }

	  /* CSS API */

	  /**
	   * Adds a style sheet to the custom element
	   *
	   * @param {(CSSStyleSheet | string)[]} styleSheets
	   */
	  addStyleSheets(styleSheets = []) {
	    for (const sheet of styleSheets) {
	      sheet instanceof CSSStyleSheet ? this.shadowRoot.adoptedStyleSheets.push(sheet) : this.addStyleSheetExternal(sheet);
	    }
	  }

	  /**
	   * Adds the stylesheet from urls. It uses a cache, to avoid having
	   * to fire a request for each external sheet when used in more than
	   * one custom element. Also, all reference the same object.
	   *
	   * @param {string} url
	   */
	  addStyleSheetExternal(url) {
	    const styleSheet = cachedSheets[url];
	    !styleSheet ? fetch(url).then(r => r.text()).then(css => sheet(css)).then(styleSheet => {
	      cachedSheets[url] = styleSheet;
	      this.addStyleSheets([styleSheet]);
	    }) : this.addStyleSheets([styleSheet]);
	  }

	  /* DOM API */

	  /**
	   * Shortcut for querySelector
	   *
	   * @param {string} query
	   */
	  query(query) {
	    return this.querySelector(query);
	  }
	  /**
	   * Shortcut for this.shadowRoot.innerHTML
	   *
	   * @param {string} value
	   */
	  set html(value) {
	    if (typeof value === 'string') {
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
	    withValue(value, value => {
	      value ? this.setAttribute('hidden', '') : this.removeAttribute('hidden');
	    });
	  }

	  /* EVENTS API */

	  emit(eventName, data) {
	    emit(this, eventName, data);
	  }

	  /* SLOTS API */

	  hasSlot(name) {
	    return this.query(`:scope > [slot="${name}"]`) !== null;
	  }
	}

	/**
	 * Similar to `Show`, but doesn't remove its children from the
	 * document
	 *
	 * @param {{
	 * 	when: When
	 * 	children?: Children
	 * }} props
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Collapse
	 */
	function Collapse(props) {
	  class CollapseElement extends CustomElement {
	    static styleSheets = [css`
				:host {
					display: contents;
				}
			`];

	    /** @param {When} value - To toggle children */
	    set when(value) {
	      withValue(value, value => this.html = getValue(value) ? '<slot/>' : '');
	    }
	  }
	  customElement('pota-collapse', CollapseElement);
	  return Component('pota-collapse', {
	    when: props.when,
	    children: props.children
	  });
	}

	/**
	 * Creates components dynamically
	 *
	 * @param {{
	 * 	component: Componenteable
	 * } & Props} props
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
	 * @param {object} props
	 * @param {Each} props.each
	 * @param {Children} [props.children]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/For
	 */
	const For = props => map(props.each, makeCallback(props.children), true);

	/**
	 * Portals children to a different element while keeping the original
	 * scope
	 *
	 * @param {object} props
	 * @param {Elements} props.mount
	 * @param {Children} [props.children]
	 * @url https://pota.quack.uy/Components/Portal
	 */
	function Portal(props) {
	  // use `render` instead of `insert` so in case the mount point is removed the portal is disposed
	  render(props.children, props.mount);
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
	  mount: document.head,
	  children: props.children
	});

	/**
	 * Renders its children based on a condition
	 *
	 * @param {object} props
	 * @param {When} props.when
	 * @param {Children} [props.fallback]
	 * @param {Children} [props.children]
	 * @returns {Children}
	 * @url https://pota.quack.uy/Components/Show
	 */
	function Show(props) {
	  const callback = makeCallback(props.children);
	  const value = memo(() => getValue(props.when));
	  const condition = memo(() => !!value());

	  // needs resolve to avoid re-rendering
	  const fallback = isNullUndefined(props.fallback) ? undefined : memo(() => resolve(props.fallback));
	  return memo(() => condition() ? callback(value) : fallback);
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
	  const children = resolve(() => props.children);
	  const fallback = isNullUndefined(props.fallback) ? undefined : memo(() => resolve(props.fallback));
	  const match = memo(() => children().find(match => !!getValue(match.when)));
	  const value = memo(() => match() && getValue(match().when));
	  const callback = memo(() => match() && makeCallback(match().children));
	  return memo(() => match() ? callback()(value) : fallback);
	}

	/**
	 * Renders the content if the `when` condition is true
	 *
	 * @param {object} props
	 * @param {When} props.when
	 * @param {Children} [props.children]
	 * @returns {Children}
	 */
	const Match = identity;

	var defaultRegistryTemplate = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Collapse: Collapse,
		CustomElement: CustomElement,
		Dynamic: Dynamic,
		For: For,
		Head: Head,
		Match: Match,
		Portal: Portal,
		Show: Show,
		Switch: Switch,
		customElement: customElement
	});

	const defaultRegistry = fromEntries(entries(defaultRegistryTemplate).map(([k, v]) => [k.toLowerCase(), v]));

	/**
	 * Function to create cached tagged template components
	 *
	 * @param {object} [options]
	 * @param {boolean} [options.unwrap] - To return a `Node/Element` or
	 *   an array of `Node/Elements`. Defaults to `true`
	 * @returns {Function & {
	 * 	define: ({ components }) => void
	 * 	components: {}
	 * }}
	 * @url https://pota.quack.uy/HTML
	 */

	function HTML(options = {
	  unwrap: true
	}) {
	  const components = {
	    ...defaultRegistry
	  };

	  /**
	   * Creates tagged template components
	   *
	   * @param {TemplateStringsArray} template
	   * @param {...any} values
	   * @returns {Children}
	   * @url https://pota.quack.uy/HTML
	   */

	  function html(template, ...values) {
	    const cached = parse(template);
	    let index = 0;
	    function nodes(node) {
	      // Node.ELEMENT_NODE
	      if (node.nodeType === 1) {
	        const localName = node.localName;
	        if (localName === id) {
	          return values[index++];
	        }

	        // gather props
	        const props = empty();
	        for (let {
	          name,
	          value
	        } of node.attributes) {
	          if (value === id) {
	            value = values[index++];
	          }
	          if (name[0] === '.') {
	            props['prop:' + camelCase(name.slice(1))] = value;
	          } else if (name[0] === '?') {
	            props['bool:' + name.slice(1)] = value;
	          } else if (name[0] === '@') {
	            props['on:' + name.slice(1)] = value;
	          } else {
	            props[name] = value;
	          }
	        }

	        // gather children
	        if (node.childNodes.length) {
	          props.children = flat(toArray(node.childNodes).map(nodes));
	        }
	        return Component(components[localName] || localName, props);
	      } else {
	        return node.cloneNode();
	      }
	    }
	    const result = flat(toArray(cached.childNodes).map(nodes));
	    return options.unwrap ? toHTML(result) : result;
	  }
	  html.components = components;
	  html.define = userComponents => {
	    let name;
	    for (name in userComponents) {
	      components[name.toLowerCase()] = userComponents[name];
	    }
	  };
	  return html;
	}
	const html = HTML();

	/**
	 * Runs an `effect` on an `html` template. Reacts to reactive
	 * interpolated values, or to the reactivity used in the body of the
	 * function you pass.
	 *
	 * @param {(html) => any} fn - Function to run as an effect. It
	 *   receives `html` argument for template creation.
	 * @param {object} [options]
	 * @param {boolean} [options.unwrap] - To return a `Node/Element` or
	 *   an array of `Node/Elements`. Defaults to `true`
	 * @param {boolean} [options.updateTrigger] - To return an `update`
	 *   function in case its desired to trigger updates manually.
	 *   Defaults to `false`
	 * @returns {Children}
	 * @url https://pota.quack.uy/HTML
	 */
	const htmlEffect = (fn, options = {
	  unwrap: true,
	  updateTrigger: false
	}) => {
	  /** Copy the components from the global registry */
	  const html_ = HTML(options);
	  html_.components = html.components;
	  const [get, set] = weakStore();
	  const disposeHTMLEffect = [];
	  function _html(template, ...values) {
	    // when template is cached just update the signals
	    let cached = get(template);
	    if (cached) {
	      /**
	       * Purpose:
	       *
	       * 1. Track the `values` by reading, so we track the interpolated
	       *    values.
	       * 2. Aditionally, this will also rerun when reactive values used
	       *    on the body of the function you pass to the effect
	       *    update.
	       * 3. Update the `signals` when `values` change.
	       *
	       * It batches changes so it updates the template in one shot
	       */
	      batch(() => {
	        for (let key = 0; key < values.length; key++) {
	          // getValue(value) causes tracking
	          cached[0][key].write(values[key]);
	        }
	      });

	      /**
	       * It needs to return the result because when used unwrapped and
	       * nesting (ex calling html twice inside the htmlEffect), the
	       * second call will use the value of the first call. The result
	       * is a reference to the nodes created before, so it always use
	       * the same nodes, and reactivity on these nodes is live.
	       *
	       * ```js
	       * htmlEffect(html => {
	       * 	const ELEMENTS = html`<div>
	       * 		double ${data.test * 2}
	       * 	</div>`
	       * 	// ^ these elements are needed in the next line
	       * 	return html`<div>${data.test} ${ELEMENTS}</div>`
	       * })
	       * ```
	       */
	      return cached[1];
	    }

	    /**
	     * Creates the html with `signals` in place of the interpolated
	     * `values`. This is to avoid having to create the template more
	     * than once. Once the template is created, then the only thing
	     * that will update is the `signals`.
	     *
	     * It creates a root because when any of the `values` changes
	     * inside the body of the function that you pass to `htmlEffect`,
	     * or when the interpolated `values` change, it causes disposal
	     * (aka removing the elements), and htmlEffect re-runs. To avoid
	     * having the elements removed by the disposal of the body of your
	     * own function we create a root.
	     */
	    const signals = [];
	    let result;
	    root(dispose => {
	      disposeHTMLEffect.push(dispose);

	      /**
	       * HTML is created with the `signals` in place of the `values`.
	       * Pota will add one effect for each signal. So this wont
	       * re-run.
	       */
	      result = html_(template, ...values.map((value, key) => {
	        signals[key] = signal(value);
	        // give accesors to template instead of the `values`
	        return signals[key].read;
	      }));
	    });

	    // save the `signals` in the cached template
	    set(template, [signals, result]);
	    return result;
	  }

	  /**
	   * This effect will re-run when the `values` interpolated change, or
	   * when any signal that you use on the `htmlEffect` function body
	   * change. It cause re-runs of what we are batching above.
	   */

	  const update = () => fn(_html);
	  let result;
	  syncEffect(() => {
	    result = update();
	  });

	  /** Dispose the effect when whatever started it is disposed. */
	  cleanup(() => callAll(disposeHTMLEffect));
	  return options.updateTrigger ? [result, update] : result;
	};

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
	  let prev;
	  effect(() => {
	    const selected = value();
	    if (selected === prev) return;
	    const previous = map.get(prev);
	    if (previous) previous.write(false);
	    const current = map.get(selected);
	    if (current) current.write(true);
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
	      selected = signal(item === value());
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

	/**
	 * Creates a `setTimeout` that autodisposes. The `delay` could be
	 * reactive. The timeout is NOT started automatically.
	 *
	 * @param {Function} callback - Callback to run once delay completes
	 * @param {Signal | number} delay - Delay number or signal
	 * @param {any[]} args - Arguments to pass to the callback
	 * @returns {{ start: Function; stop: Function }}
	 */
	function useTimeout(callback, delay, ...args) {
	  let id;
	  const fn = {
	    start: () => {
	      withValue(delay, delay => {
	        fn.stop();
	        if (delay < Infinity) id = setTimeout(callback, delay, ...args);
	      });
	      return fn;
	    },
	    stop: () => clearTimeout(id)
	  };
	  cleanup(fn.stop);
	  return fn;
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
      onClick="${fn}"
    >
      ${text}
    </button>
  </div>`;
	const App = () => {
	  const [data, setData] = signal([]);
	  const [selected, setSelected] = signal([]);
	  const run = () => setData(buildData(1000));
	  const runLots = () => {
	    setData(buildData(10000));
	  };
	  const add = () => setData(d => [...d, ...buildData(1000)]);
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
	  const remove = id => setData(d => {
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
          </div>
        </div>
      </div>
    </div>
    <div
      class="table table-hover table-striped test-data"
      onClick="${e => {
    const element = e.target;
    if (element.setSelected !== undefined) {
      setSelected(element.setSelected);
    } else if (element.removeRow !== undefined) {
      remove(element.removeRow);
    }
  }}"
    >
      <div>
        <For each="${data}">
          ${row => {
    const {
      id,
      label
    } = row;
    return html`<tr class:danger="${isSelected(id)}">
              <td class="col-md-1">${id}</td>
              <td class="col-md-4">
                <a .set-selected="${id}">${label}</a>
              </td>
              <td class="col-md-1">
                <a>
                  <span
                    class="glyphicon glyphicon-remove"
                    aria-hidden="true"
                    .remove-row="${id}"
                  />
                </a>
              </td>
              <td class="col-md-6" />
            </tr>`;
  }}
        </For>
      </div>
    </div>
    <span
      class="preloadicon glyphicon glyphicon-remove"
      aria-hidden="true"
    />
  </div>`;
	};
	render(App, document.getElementById('main'));

})();
//# sourceMappingURL=main.js.map
