/**
 * References:
 * https://github.com/potahtml/pota/tree/master/src/lib/reactivity/store
 *
 * https://github.com/solidjs/solid/blob/main/packages/solid/store/test/
 * https://github.com/solidjs-community/solid-primitives/tree/main/packages/mutable/test
 * https://github.com/solidjs-community/solid-primitives/blob/main/packages/map/test/index.test.ts
 * https://github.com/vobyjs/oby/blob/master/test/index.js
 * `https://github.com/vuejs/core/tree/main/packages/reactivity/__tests__`
 * https://discord.com/channels/722131463138705510/1217920934548082748
 * ^ https://discord.com/invite/solidjs
 */

// test stuff

import { test, isProxy, measure } from 'pota/test'
import { timing } from 'pota/lib'

// oby

import $, {
	store as mutableOby,
	memo as memoOby,
	batch as batchOby,
	root as rootOby,
} from 'https://jspm.dev/oby'

const signalOby = initialValue => {
	const s = $(initialValue)
	return [() => s(), v => s(v)]
}

// solid

import {
	createMemo as memoSolid2,
	batch as batchSolid,
	createSignal as signalSolid,
	createRoot as rootSolid,
} from 'https://jspm.dev/npm:solid-js'

import { createMutable as mutableSolid } from 'https://jspm.dev/npm:solid-js/store'

function memoSolid(fn) {
	const [sleeping, setSleeping] = signalSolid(true)
	const m = memoSolid2(() => {
		if (sleeping()) return
		return fn()
	})

	let read = () => {
		setSleeping(false)
		read = m
		return m()
	}
	return () => read()
}

// pota

import {
	mutable as mutablePota,
	memo as memoPota,
	batch as batchPota,
	signal as signalPota,
	root as rootPota,
} from 'pota'

// bench stuff

const benchmarkTable = {}
const doBenchmark = false

// tests

measure('solid', () =>
	testMutable(
		'solid',
		test,
		mutableSolid,
		memoSolid,
		batchSolid,
		signalSolid,
		rootSolid,
	),
)

measure('oby', () =>
	testMutable(
		'oby',
		test,
		mutableOby,
		memoOby,
		batchOby,
		signalOby,
		rootOby,
	),
)

measure('pota', () =>
	testMutable(
		'pota',
		test,
		mutablePota,
		memoPota,
		batchPota,
		signalPota,
		rootPota,
	),
)

document.body.textContent = 'Done'

if (doBenchmark) console.table(benchmarkTable)

function testMutable(lib, _test, mutable, memo, batch, signal, root) {
	lib = lib + ': '
	console.log('--------------------------------------')
	console.log(lib)

	_test.reset()

	const test = (title, fn, stop) => {
		_test(
			title,
			expect => {
				const dispose = root(dispose => {
					fn(expect)
					return dispose
				})
				dispose()
			},
			stop,
		)
	}

	let supportsMap = false
	let supportsSet = false
	function detectSupport() {
		// detect support for map/set
		const map = new Map()
		const set = new Set()
		const result = mutable({ map, set })

		// map
		map.set('key', 1)

		let called1 = 0
		let execute = memo(() => {
			called1++
			result.map.has('key')
		})
		execute()
		result.map.delete('key')
		execute()

		supportsMap = called1 !== 1

		// set
		set.add('key')
		let called2 = 0
		execute = memo(() => {
			called2++
			result.set.has('key')
		})
		execute()
		result.set.delete('key')
		execute()

		supportsSet = called2 !== 1
	}
	detectSupport()

	test(lib + 'equality: different object', expect => {
		const source = { cat: 'quack' }
		const result = mutable(source)
		expect(result).not.toBe(source)
		expect(isProxy(result)).toBe(true)
		expect(isProxy(source)).toBe(false)
	})

	test(lib + 'equality: different object nested', expect => {
		const source = { cat: 'quack' }
		const result = mutable({ source })
		expect(result.source).not.toBe(source)
		expect(isProxy(result.source)).toBe(true)
	})

	// value

	test(lib + 'value: object property', expect => {
		const source = { cat: 'quack' }
		const result = mutable(source)

		expect(source.cat).toBe('quack')
		expect(result.cat).toBe('quack')
		expect(isProxy(result)).toBe(true)
	})

	// mutation

	test(lib + 'mutation: object property', expect => {
		const source = { cat: 'quack' }
		const result = mutable(source)

		expect(source.cat).toBe('quack')
		expect(result.cat).toBe('quack')

		result.cat = 'murci'
		expect(source.cat).toBe('murci')
		expect(result.cat).toBe('murci')
	})

	test(lib + 'mutation: object nested', expect => {
		const source = mutable({
			data: { starting: 1, ending: 1 },
		})

		expect(source.data.starting).toBe(1)
		expect(source.data.ending).toBe(1)

		source.data.ending = 2
		expect(source.data.starting).toBe(1)
		expect(source.data.ending).toBe(2)

		source.data.starting = 2
		expect(source.data.starting).toBe(2)
		expect(source.data.ending).toBe(2)
	})

	test(lib + 'mutation: object frozen [oby]', expect => {
		const source = mutable(
			Object.freeze({
				user: { name: 'John', last: 'Snow' },
			}),
		)

		expect(source.user.name).toBe('John')
		expect(source.user.last).toBe('Snow')

		let called = 0

		const execute = memo(() => {
			source.user.name
			source.user.last
			called++
		})
		execute()
		expect(called).toBe(1)

		source.user.name = 'quack'
		execute()
		expect(called).toBe(2)

		source.user.last = 'murci'
		execute()
		expect(called).toBe(3)

		expect(source.user.name).toBe('quack')
		expect(source.user.last).toBe('murci')

		try {
			source.user = 'something else'
			// solid by design modifies frozen objects
			if (lib !== 'solid: ') {
				expect('frozen value to not be changed').toBe(true)
			}
		} catch (e) {
			// this is expected to fail
		}
	})

	test(lib + 'mutation: object frozen nested [oby]', expect => {
		const source = mutable({
			data: Object.freeze({
				user: { name: 'John', last: 'Snow' },
			}),
		})

		let called = 0

		const execute = memo(() => {
			called++

			source.data.user.name
			source.data.user.last
		})
		execute()
		expect(called).toBe(1)

		expect(source.data.user.name).toBe('John')
		expect(source.data.user.last).toBe('Snow')

		source.data.user.name = 'quack'
		execute()
		expect(called).toBe(2)

		source.data.user.last = 'murci'
		execute()
		expect(called).toBe(3)

		expect(source.data.user.name).toBe('quack')
		expect(source.data.user.last).toBe('murci')

		try {
			source.data.user = 'something else'
			// solid by design modifies frozen objects
			if (lib !== 'solid: ') {
				expect('frozen value to not be changed').toBe(true)
			}
		} catch (e) {
			// this is expected to fail
		}
	})

	test(
		lib + 'mutation: object frozen within frozen nested [oby]',
		expect => {
			const source = mutable(
				Object.freeze({
					data: Object.freeze({
						user: { store: { name: 'John', last: 'Snow' } },
					}),
				}),
			)

			let called = 0

			const execute = memo(() => {
				called++

				source.data.user.store.name
				source.data.user.store.last
			})
			execute()
			expect(called).toBe(1)

			expect(source.data.user.store.name).toBe('John')
			expect(source.data.user.store.last).toBe('Snow')

			source.data.user.store.name = 'quack'
			execute()
			expect(called).toBe(2)

			source.data.user.store.last = 'murci'
			execute()
			expect(called).toBe(3)

			expect(source.data.user.store.name).toBe('quack')
			expect(source.data.user.store.last).toBe('murci')

			try {
				source.data.user = 'something else'
				// solid by design modifies frozen objects
				if (lib !== 'solid: ') {
					expect('frozen value to not be changed').toBe(true)
				}
			} catch (e) {
				// this is expected to fail
			}
		},
	)

	test(lib + 'mutation: function', expect => {
		const result = mutable({
			fn: () => 1,
		})
		const getValue = memo(() => result.fn())
		expect(getValue()).toBe(1)

		// pota wont trigger changes with functions
		result.fn = () => 2
		expect(getValue()).toBe(2)
	})
	test(
		lib +
			'mutation: returned object by function call is mutable [solid, oby]',
		expect => {
			const result = mutable({
				fn: () => ({
					cat: 'quack',
				}),
			})

			expect(result.fn().cat).toBe('quack')

			expect(isProxy(result.fn())).toBe(true)

			const r = result.fn()
			expect(r.cat).toBe('quack')

			let calls = 0
			const execute = memo(() => {
				calls++
				r.cat
			})
			execute()
			expect(calls).toBe(1)

			r.cat = 'murci'
			execute()
			expect(r.cat).toBe('murci')
			expect(calls).toBe(2)
		},
	)

	// getters

	test(lib + 'getters: object', expect => {
		const result = mutable({
			cat: 'quack',
			get greeting() {
				return `hi, ${this.cat}`
			},
		})
		expect(result.greeting).toBe('hi, quack')

		result.cat = 'murci'
		expect(result.greeting).toBe('hi, murci')
	})

	test(lib + 'getters: returning object [solid]', expect => {
		let value = 'quack'
		const result = mutable({
			get greeting() {
				return { greet: `hi, ${value}` }
			},
			set greeting(val) {
				value = val
			},
		})
		expect(result.greeting.greet).toBe('hi, quack')

		result.greeting = 'murci'
		expect(result.greeting.greet).toBe('hi, murci')
	})

	test(lib + 'getters: returning getter [solid]', expect => {
		let value = 'quack'
		const result = mutable({
			get greeting() {
				return {
					get greet() {
						return `hi, ${value}`
					},
				}
			},
			set greeting(val) {
				value = val
			},
		})
		expect(result.greeting.greet).toBe('hi, quack')

		result.greeting = 'murci'
		expect(result.greeting.greet).toBe('hi, murci')
	})

	test(lib + 'getters: returning frozen object [solid]', expect => {
		let value = 'quack'
		const result = mutable({
			get greeting() {
				return Object.freeze({ greet: `hi, ${value}` })
			},
			set greeting(val) {
				value = val
			},
		})
		expect(result.greeting.greet).toBe('hi, quack')

		result.greeting = 'murci'
		expect(result.greeting.greet).toBe('hi, murci')
	})

	test(
		lib + 'getters: returning frozen object nested [solid]',
		expect => {
			let value = 'quack'
			const result = mutable({
				get greeting() {
					return Object.freeze({
						greet: Object.freeze({ text: `hi, ${value}` }),
					})
				},
				set greeting(val) {
					value = val
				},
			})
			expect(result.greeting.greet.text).toBe('hi, quack')

			result.greeting = 'murci'
			expect(result.greeting.greet.text).toBe('hi, murci')
		},
	)

	test(lib + 'getter/setters: class', expect => {
		class Cat {
			#name = 'quack'
			get name() {
				return this.#name
			}
			set name(value) {
				this.#name = value
			}
			get greeting() {
				return `hi, ${this.#name}`
			}
		}
		const result = mutable(new Cat())
		expect(result.greeting).toBe('hi, quack')

		result.name = 'mishu'
		expect(result.greeting).toBe('hi, mishu')
	})

	test(lib + 'getter/setters: class 2', expect => {
		class Cat {
			#name = 'quack'
			get name() {
				return this.#name
			}
			set name(value) {
				this.#name = value
			}
			get greeting() {
				return `hi, ${this.#name}`
			}
		}
		const result = mutable(new Cat())
		expect(result.greeting).toBe('hi, quack')
		expect(result.name).toBe('quack')

		let calls = 0
		const execute = memo(() => {
			calls++
			result.name
		})
		execute()
		expect(calls).toBe(1)

		result.name = 'mishu'
		execute()

		expect(result.name).toBe('mishu')
		expect(calls).toBe(2)
		expect(result.greeting).toBe('hi, mishu')
	})

	test(
		lib +
			'getter/setters: class, should fail when trying to set in a getter',
		expect => {
			class Cat {
				#name = 'quack'
				get name() {
					return this.#name
				}
				get greeting() {
					return `hi, ${this.#name}`
				}
			}
			const result = mutable(new Cat())
			expect(result.greeting).toBe('hi, quack')

			let fail = false
			try {
				result.name = 'mishu'
				fail = true
			} catch (e) {}

			expect(result.greeting).toBe('hi, quack')

			if (fail) {
				throw 'it should have failed to set the value when its only a getter'
			}
		},
	)

	test(lib + 'getter/setters: object', expect => {
		const result = mutable({
			name: 'John',
			last: 'Smith',
			get full() {
				return `${this.name} ${this.last}`
			},
			set full(value) {
				const parts = value.split(' ')
				this.name = parts[0]
				this.last = parts[1]
			},
		})
		expect(result.name).toBe('John')
		expect(result.last).toBe('Smith')
		expect(result.full).toBe('John Smith')

		result.name = 'Jake'
		expect(result.name).toBe('Jake')
		expect(result.last).toBe('Smith')
		expect(result.full).toBe('Jake Smith')

		result.last = 'Lala'
		expect(result.name).toBe('Jake')
		expect(result.last).toBe('Lala')
		expect(result.full).toBe('Jake Lala')

		result.full = 'Bogi One'
		expect(result.name).toBe('Bogi')
		expect(result.last).toBe('One')
		expect(result.full).toBe('Bogi One')
	})

	// deleting

	test(lib + 'deleting: undefined object property', expect => {
		const result = mutable({
			name: 'quack',
		})

		expect('last' in result).toBe(false)
		delete result.last
		expect('last' in result).toBe(false)

		expect(result.last).toBe(undefined)
	})

	test(
		lib + 'deleting: should throw when non-configurable',
		expect => {
			const result = mutable({})

			Object.defineProperty(result, 'cat', {
				value: 'quack',
				configurable: false,
				writable: false,
			})

			try {
				delete result.cat
				expect(
					'to throw when deleting a non-configurable property',
				).toBe(true)
			} catch (e) {}
		},
	)

	test(
		lib + 'setting to undefined shouldnt delete the property [solid]',
		expect => {
			const result = mutable({
				name: 'quack',
			})
			expect('name' in result).toBe(true)

			result.name = undefined
			expect('name' in result).toBe(true)
			expect(result.name).toBe(undefined)
			expect('name' in result).toBe(true)

			delete result.name
			expect('name' in result).toBe(false)
			expect(result.name).toBe(undefined)
			expect('name' in result).toBe(false)
		},
	)

	test(
		lib +
			'delete key with undefined value does trigger reactivity - object.keys ',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			const execute = memo(() => {
				calls++
				Object.keys(result)
			})
			execute()
			expect(calls).toBe(1)

			delete result.b
			execute()

			expect('b' in result).toBe(false)

			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'delete non existent key doesnt trigger reactivity - object.keys  [solid]',
		expect => {
			const result = mutable({ a: 'somevalue' })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)

			let calls = 0
			const execute = memo(() => {
				calls++
				Object.keys(result)
			})
			execute()
			expect(calls).toBe(1)

			expect('b' in result).toBe(false)
			expect(calls).toBe(1)

			delete result.b
			execute()
			expect('b' in result).toBe(false)
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'delete non existent key doesnt trigger reactivity - value [solid]',
		expect => {
			const result = mutable({ a: 'somevalue' })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)

			let calls = 0
			const execute = memo(() => {
				calls++
				result.b
			})
			execute()
			expect(calls).toBe(1)

			expect('b' in result).toBe(false)
			expect(calls).toBe(1)

			delete result.b
			execute()
			expect('b' in result).toBe(false)
			expect(calls).toBe(1)
		},
	)

	test(
		lib + 'delete non existent key doesnt trigger reactivity - in',
		expect => {
			const result = mutable({ a: 'somevalue' })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)

			let calls = 0
			const execute = memo(() => {
				calls++
				'b' in result
			})
			execute()
			expect(calls).toBe(1)

			expect('b' in result).toBe(false)
			expect(calls).toBe(1)

			delete result.b
			execute()
			expect('b' in result).toBe(false)
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'delete key with defined value does trigger reactivity - object.keys ',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			const execute = memo(() => {
				calls++
				Object.keys(result)
			})
			execute()
			expect(calls).toBe(1)

			delete result.a
			execute()
			expect('a' in result).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'delete key with undefined value does not trigger reactivity - reading [solid]',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			const execute = memo(() => {
				calls++
				result.b
			})
			execute()
			expect(calls).toBe(1)

			delete result.b
			execute()
			expect('b' in result).toBe(false)
			expect(calls).toBe(1)
		},
	)
	test(
		lib +
			'delete key with undefined value does trigger reactivity - in [solid]',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			const execute = memo(() => {
				calls++
				'b' in result
			})
			execute()
			expect(calls).toBe(1)

			delete result.b
			execute()
			expect('b' in result).toBe(false)
			expect(calls).toBe(2)
		},
	)
	test(
		lib +
			'delete key with defined value does trigger reactivity - reading ',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			const execute = memo(() => {
				calls++
				result.a
			})
			execute()
			expect(calls).toBe(1)

			delete result.a
			execute()
			expect('a' in result).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(lib + 'deleting: defined object property', expect => {
		const source = { name: 'quack', last: 'murci' }
		const result = mutable(source)

		expect(result.name).toBe('quack')
		expect(result.last).toBe('murci')

		expect('name' in result).toBe(true)
		expect('last' in result).toBe(true)

		delete result.name

		expect('name' in result).toBe(false)
		expect('last' in result).toBe(true)

		expect(result.name).toBe(undefined)
		expect(result.last).toBe('murci')

		expect('name' in result).toBe(false)
		expect('last' in result).toBe(true)

		expect(result.name).toBe(undefined)
		expect(result.last).toBe('murci')
	})

	// Date, HTMLElement, RegExp

	test(lib + 'should trigger only once ', expect => {
		const result = mutable({ a: 1 })
		expect('a' in result).toBe(true)

		let calls = 0
		let tmp
		const execute = memo(() => {
			calls++
			tmp = { ...result }
			if (calls > 2) {
				throw lib + 'should trigger only once'
			}
		})
		execute()
		expect(calls).toBe(1)

		setTimeout(() => {
			execute()
			result.a = 333
			execute()
			result.a = 333
			execute()
		}, 200)
	})

	/* misc */

	test(lib + 'misc objects', expect => {
		// Date, HTMLElement, RegExp

		const sources = [
			new Date(),
			/[a-z]/,
			document.createElement('div'),
			new Set([1, 2, 3]),
			new Map(),
			Symbol(),
		]
		for (const source of sources) {
			try {
				const result = mutable(source)
				if (lib === 'oby: ' || lib === 'solid: ') {
					if (lib === 'oby: ' && typeof source === 'symbol') {
						expect(result).toBe(source)
						expect(isProxy(result)).toBe(false)
						continue
					}

					expect(result).not.toBe(source)
					expect(isProxy(result)).toBe(true)

					continue
				}
				if (result instanceof Map && supportsMap) {
					expect(result).not.toBe(source)
					expect(isProxy(result)).toBe(true)
				} else {
					expect(result).toBe(source)
					expect(isProxy(result)).toBe(false)
				}
			} catch (e) {
				if (lib === 'solid: ') {
					if (typeof source !== 'symbol') {
						console.error('misc objects: Throws with', source)
					}
				} else {
					console.error('misc objects: Throws with', source)
				}
			}
		}
	})

	test(lib + 'misc objects (nested)', expect => {
		const sources = [
			new Date(),
			/[a-z]/,
			document.createElement('div'),
			new Set([1, 2, 3]),
			new Map(),
			Symbol(),
		]
		for (const source of sources) {
			try {
				const result = mutable({ o: source })
				if (result.o instanceof Map && supportsMap) {
					expect(result.o).not.toBe(source)
					expect(isProxy(result.o)).toBe(true)
				} else {
					expect(result.o).toBe(source)
					expect(isProxy(result.o)).toBe(false)
				}
			} catch (e) {
				console.error(
					'misc objects (nested): throws having nested',
					source,
				)
			}
		}

		const source = {}
		const result = mutable({ o: source })
		expect(result.o).not.toBe(source)
		expect(isProxy(result.o)).toBe(true)
	})

	test(lib + 'misc native objects should work', expect => {
		const result = mutable({ set: new Set(), map: new Map() })

		expect(result.set instanceof Set).toBe(true)
		expect(result.map instanceof Map).toBe(true)
		expect(isProxy(result.set)).toBe(false)

		expect(isProxy(result.map)).toBe(supportsMap ? true : false)

		result.set.add(1)
		result.set.delete(2)
		result.set.delete(1)
		result.set.clear()

		result.map.set(1, 1)
		result.map.delete(1)
		result.map.clear()
	})

	test(lib + 'misc objects (effect)', expect => {
		const sources = [
			new Date(),
			/[a-z]/,
			document.createElement('div'),
		]
		for (const source of sources) {
			const result = mutable({ o: source })

			expect(result.o).toBe(source)
			expect(isProxy(result.o)).toBe(false)

			let calls = 0
			const execute1 = memo(() => {
				calls++
				result.o.something
			})
			execute1()
			expect(calls).toBe(1)

			result.o.something = true
			result.o.something = false
			execute1()
			expect(calls).toBe(1)

			delete result.o.something
			execute1()
			expect(calls).toBe(1)

			result.o.something = true
			result.o.something = false
			execute1()
			expect(calls).toBe(1)

			// again but when reading its defined already
			const execute2 = memo(() => {
				calls++
				result.o.something
			})
			execute1(), execute2()
			expect(calls).toBe(2)

			result.o.something = true
			result.o.something = false
			execute1(), execute2()
			expect(calls).toBe(2)

			delete result.o.something
			execute1(), execute2()
			expect(calls).toBe(2)

			result.o.something = true
			result.o.something = false
			execute1(), execute2()
			expect(calls).toBe(2)
		}
	})

	/* in */

	test(lib + 'in: getters to not be called 1', expect => {
		let access = 0
		const result = mutable({
			a: 1,
			get b() {
				console.log('accesing b')
				access++
				return 2
			},
		})

		expect('a' in result).toBe(true)
		expect('b' in result).toBe(true)
		expect('c' in result).toBe(false)
		expect(access).toBe(0)
	})

	test(lib + 'in: getters to not be called 2', expect => {
		let access = 0
		const result = mutable({
			a: 1,
			get b() {
				console.log('accesing b')
				access++
				return 2
			},
		})
		result.c = 0

		expect('a' in result).toBe(true)
		expect('b' in result).toBe(true)
		expect('c' in result).toBe(true)
		expect(access).toBe(0)
	})

	test(
		lib + 'in: getters to not be called 3 [solid, oby]',
		expect => {
			let access = 0
			const result = mutable({
				a: 1,
				get b() {
					// console.log('accesing b')
					access++
					return 2
				},
			})

			let failed = false
			try {
				result.b = 0
			} catch (e) {
				failed = true
			}
			if (!failed) {
				throw 'setting a value when its only a getter should have throw'
			}

			expect(access).toBe(0)
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)
			expect(access).toBe(0)
		},
	)

	test(lib + 'in: getters to not be called 3.1 [solid]', expect => {
		let access = 0
		let val = 2
		const result = mutable({
			a: 1,
			get b() {
				// console.log('accesing b')
				access++
				return val
			},
			set b(value) {
				val = value
			},
		})

		expect(access).toBe(0)
		expect('a' in result).toBe(true)
		expect('b' in result).toBe(true)
		expect(access).toBe(0)

		expect(result.b).toBe(2)
		expect(access).toBe(1)

		result.b = 3

		expect(result.b).toBe(3)
		expect(access).toBe(2)
	})

	test(
		lib + 'in: getters to not be called 4 [solid, oby]',
		expect => {
			let access = 0
			const result = mutable({
				a: 1,
				get b() {
					access++
					return 2
				},
			})

			expect(access).toBe(0)
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)
			expect(access).toBe(0)

			delete result.b

			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)
			expect(access).toBe(0)

			result.b

			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)
			expect(access).toBe(0)

			result.b = 3

			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)
			expect(result.b).toBe(3)
			expect(access).toBe(0)
		},
	)

	/* tracking */

	test(lib + 'track: value', expect => {
		const source = { name: 'quack' }
		const result = mutable(source)

		let called = 0
		const execute = memo(() => {
			called++
			result.name
		})
		execute()

		// setting to same value
		result.name = 'quack'
		execute()
		expect(called).toBe(1)
		expect(result.name).toBe('quack')

		// change
		result.name = 'murci'
		execute()
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		// same value again should not retrigger
		result.name = 'murci'
		execute()
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		// third
		result.name = 'mishu'
		execute()
		expect(called).toBe(3)
		expect(result.name).toBe('mishu')
	})

	test(lib + 'track: value nested', expect => {
		const source = { data: { name: 'quack' } }
		const result = mutable(source)

		let called = 0
		const execute = memo(() => {
			called++
			result.data.name
		})
		execute()

		// same value again should not retrigger
		result.data.name = 'quack'
		execute()
		expect(called).toBe(1)
		expect(result.data.name).toBe('quack')

		result.data.name = 'murci'
		execute()
		expect(called).toBe(2)
		expect(result.data.name).toBe('murci')

		// same value again should not retrigger
		result.data.name = 'murci'
		execute()
		expect(called).toBe(2)
		expect(result.data.name).toBe('murci')

		// third
		result.data.name = 'mishu'
		execute()
		expect(called).toBe(3)
		expect(result.data.name).toBe('mishu')
	})

	test(lib + 'track: undefined value', expect => {
		const source = {}
		const result = mutable(source)

		let called = 0
		const execute = memo(() => {
			called++
			result.name
		})
		execute()
		expect(called).toBe(1)

		result.name = 'murci'
		execute()
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		// same value again should not retrigger
		result.name = 'murci'
		execute()
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		delete result.name
		execute()
		expect(called).toBe(3)
		expect('name' in result).toBe(false)
		expect(called).toBe(3)

		/**
		 * Tricky because signal gets deleted(see previous lines), then we
		 * add it again with the following, but the signal is not the same
		 * one as before, so effect doesnt re-trigger
		 */
		result.name = 'mishu'
		execute()
		expect(called).toBe(4)
	})

	test(lib + 'track: deleted value', expect => {
		const source = { name: 'hola' }
		const result = mutable(source)

		let called = 0
		const execute = memo(() => {
			called++
			result.name
		})
		execute()
		expect(called).toBe(1)

		result.name = 'murci'
		execute()
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		delete result.name
		execute()
		expect(called).toBe(3)
		expect('name' in result).toBe(false)
		expect(called).toBe(3)

		/**
		 * Tricky because signal gets deleted(see previous lines), then we
		 * add it again with the following, but the signal is not the same
		 * one as before, so effect doesnt re-trigger
		 */
		result.name = 'mishu'
		execute()
		expect(called).toBe(4)
	})

	test(lib + 'track: undefined value nested', expect => {
		const source = {}
		const result = mutable(source)

		let called = 0
		const execute = memo(() => {
			called++
			result.data
		})
		execute()
		expect(called).toBe(1)

		result.data = {}
		execute()
		result.data.name = 'murci'
		execute()
		result.data.name = 'murci'
		execute()
		expect(called).toBe(2)
		expect(result.data.name).toBe('murci')
	})

	test(lib + 'track: state from signal', expect => {
		const [read, write] = signal('init')
		const result = mutable({ data: '' })

		let called = 0
		const execute = memo(() => {
			called++
			result.data = read()
		})
		execute()
		expect(called).toBe(1)
		expect(result.data).toBe('init')

		write('signal')
		execute()
		expect(called).toBe(2)
		expect(result.data).toBe('signal')
	})

	test(lib + 'track `in`', expect => {
		let access = 0
		const result = mutable({
			a: 1,
			get b() {
				access++
				return 2
			},
		})

		let called = 0
		const execute = memo(() => {
			'a' in result
			'b' in result
			called++
		})
		execute()
		expect(called).toBe(1)

		delete result.a
		execute()
		expect(called).toBe(2)
		expect('a' in result).toBe(false)
		expect(called).toBe(2)

		result.a = true
		execute()
		expect(called).toBe(3)

		execute()
		expect(access).toBe(0)
		execute()
	})

	/* classes */

	test(lib + 'read and set class [solid, oby]', expect => {
		class D {
			f = 1
			get e() {
				return this.f * 4
			}
		}
		class A {
			a = 1
			get b() {
				return this.a * 4
			}
			child = new D()
		}
		let count = 0
		let childCount = 0

		const m = mutable(new A())

		const execute1 = memo(() => {
			m.b
			count++
		})
		execute1()
		const execute2 = memo(() => {
			m.child.f
			childCount++
		})
		execute2()

		const increment = () => {
			m.a++
			m.child.f++
			execute1()
			execute2()
		}

		// initial
		expect(m.b).toBe(4)
		expect(m.child.e).toBe(4)
		expect(count).toBe(1)
		expect(childCount).toBe(1)

		// incrementing
		increment()
		expect(m.b).toBe(8)
		expect(m.child.e).toBe(8)
		expect(count).toBe(2)
		expect(childCount).toBe(2)

		increment()
		expect(m.b).toBe(12)
		expect(m.child.e).toBe(12)
		expect(count).toBe(3)
		expect(childCount).toBe(3)

		increment()
		expect(m.b).toBe(16)
		expect(m.child.e).toBe(16)
		expect(count).toBe(4)
		expect(childCount).toBe(4)
	})

	test(lib + 'read and set outside class', expect => {
		const m = mutable({
			a: 1,
			get b() {
				return this.a * 4
			},
		})

		let calls = 0
		const execute = memo(() => {
			m.b
			calls++
		})
		execute()

		const increment = () => {
			m.a++
			execute()
		}

		// initial
		expect(m.a).toBe(1)
		expect(m.b).toBe(4)
		expect(calls).toBe(1)

		// incrementing
		increment()
		expect(m.a).toBe(2)
		expect(m.b).toBe(8)
		expect(calls).toBe(2)

		increment()
		expect(m.a).toBe(3)
		expect(m.b).toBe(12)
		expect(calls).toBe(3)
	})

	test(lib + 'read and set inside class [solid, oby]', expect => {
		class Test {
			a = 1
			get b() {
				return this.a * 4
			}
		}

		const m = mutable(new Test())

		let calls = 0
		const execute = memo(() => {
			m.b
			calls++
		})
		execute()
		expect(calls).toBe(1)

		const increment = () => {
			m.a++
			execute()
		}

		// initial
		expect(m.a).toBe(1)
		expect(m.b).toBe(4)

		// incrementing
		increment()
		expect(calls).toBe(2)
		expect(m.a).toBe(2)
		expect(m.b).toBe(8)

		increment()
		expect(m.a).toBe(3)
		expect(m.b).toBe(12)
		expect(calls).toBe(3)
	})

	test(
		lib + 'read and set inside extended class [solid, oby]',
		expect => {
			class Tests2 {
				get b() {
					return this.a * 4
				}
				get logA() {
					return this.a
				}
			}
			class Test extends Tests2 {
				a = 1
			}

			const m = mutable(new Test())

			let calls = 0
			const execute = memo(() => {
				m.b
				calls++
			})
			execute()

			const increment = () => {
				m.a++
				execute()
			}

			// initial
			expect(m.a).toBe(1)
			expect(m.logA).toBe(1)
			expect(m.b).toBe(4)
			expect(calls).toBe(1)

			// incrementing
			increment()
			expect(m.a).toBe(2)
			expect(m.b).toBe(8)
			expect(calls).toBe(2)

			increment()
			expect(m.a).toBe(3)
			expect(m.b).toBe(12)
			expect(calls).toBe(3)
		},
	)

	test(
		lib + 'read and set inside extended x2 class [solid, oby]',
		expect => {
			class Test4 {
				get b() {
					return this.a * 4
				}
				get logA() {
					return this.a
				}
			}
			class Test3 extends Test4 {}
			class Tests2 extends Test3 {
				a = 1
			}
			class Test extends Tests2 {}

			const m = mutable(new Test())

			let calls = 0
			const execute = memo(() => {
				m.b
				calls++
			})
			execute()

			const increment = () => {
				m.a++
				execute()
			}

			// initial
			expect(m.a).toBe(1)
			expect(m.logA).toBe(1)
			expect(m.b).toBe(4)
			expect(calls).toBe(1)

			// incrementing
			increment()
			expect(m.a).toBe(2)
			expect(m.b).toBe(8)
			expect(calls).toBe(2)

			increment()
			expect(m.a).toBe(3)
			expect(m.b).toBe(12)
			expect(calls).toBe(3)
		},
	)

	test(lib + 'hasOwnProperty shoulnt throw', expect => {
		let m = mutable({ a: { deep: 'test' } })
		m.hasOwnProperty('a')
		m.a.hasOwnProperty('deep')

		m = mutable(Object.create(null))
		m.a = { deep: 'test' }
		// m.hasOwnProperty('a')
		m.a.hasOwnProperty('deep')
	})

	test(lib + 'reacts to hasOwnProperty [solid, oby]', expect => {
		let m = mutable({ a: { deep: 'test' } })

		let has
		let calls1 = 0
		const execute1 = memo(() => {
			calls1++
			has = m.hasOwnProperty('b')
		})
		execute1()
		expect(has).toBe(false)
		m.b = 1
		execute1()
		expect(has).toBe(true)

		let calls2 = 0
		const execute2 = memo(() => {
			calls2++
			has = m.a.hasOwnProperty('b')
		})
		execute1(), execute2()
		expect(has).toBe(false)
		m.a.b = 1
		execute1(), execute2()
		expect(has).toBe(true)

		expect(calls1).toBe(2)
		expect(calls2).toBe(2)
	})

	// oby test suite

	test(
		lib +
			'is both a getter and a setter, for shallow primitive properties',
		expect => {
			const o = mutable({ value: undefined })
			expect(o.value).toBe(undefined)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(lib + 'Object.create(null)', expect => {
		const o = mutable(Object.create(null))
		expect(o.value).toBe(undefined)

		testValues(
			expect,
			v => {
				o.value = v
			},
			() => o.value,
		)
	})

	test(lib + 'Object.create(null) nested', expect => {
		const o = mutable({ value: Object.create(null) })
		expect(o.value).not.toBe(undefined)
		expect(o.value.deep).toBe(undefined)

		testValues(
			expect,
			v => {
				o.value.deep = v
			},
			() => o.value.deep,
		)
	})

	test(
		lib +
			'deeper: is both a getter and a setter, for shallow primitive properties',
		expect => {
			const o = mutable({ value: { deeper: undefined } })
			expect(o.value.deeper).toBe(undefined)

			testValues(
				expect,
				v => {
					o.value.deeper = v
				},
				() => o.value.deeper,
			)
		},
	)

	test(
		lib +
			'is both a getter and a setter, for shallow non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = {}

			const o = mutable({ value: obj1 })
			expect(o.value).toHaveShape(obj1)

			o.value = obj2
			expect(o.value).toHaveShape(obj2)

			o.value = obj1
			expect(o.value).toHaveShape(obj1)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'is both a getter and a setter, for deep primitive properties',
		expect => {
			const o = mutable({ deep: { value: undefined } })
			expect(o.deep.value).toBe(undefined)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'is both a getter and a setter, for deep non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = {}

			const o = mutable({ deep: { value: obj1 } })
			expect(o.deep.value).toHaveShape(obj1)

			o.deep.value = obj2
			expect(o.deep.value).toHaveShape(obj2)

			o.deep.value = obj1
			expect(o.deep.value).toHaveShape(obj1)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'is both a getter and a setter, for deep non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = {}

			const o = mutable({ deep: { value: obj1 } })
			expect(o.deep.value).toHaveShape(obj1)

			let calls = 0
			const execute = memo(() => {
				calls += 1
				o.deep.value
			})
			execute()
			expect(calls).toBe(1)

			o.deep.value = obj2
			execute()
			expect(o.deep.value).toHaveShape(obj2)
			expect(calls).toBe(2)

			o.deep.value = obj1
			execute()
			expect(o.deep.value).toHaveShape(obj1)
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'creates a dependency in a memo when getting a shallow property',
		expect => {
			const o = mutable({ value: 1 })

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'creates a dependency in a memo when getting a deep property',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'creates a single dependency in an memo even if getting a shallow property multiple times',
		expect => {
			const o = mutable({ value: 1 })

			let calls = 0

			const value = memo(() => {
				calls += 1
				o.value
				o.value
				o.value
				return o.value
			})

			expect(value()).toBe(1)
			expect(calls).toBe(1)

			o.value = 2

			expect(value()).toBe(2)
			expect(calls).toBe(2)

			o.value = 3

			expect(value()).toBe(3)
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'creates a single dependency even if getting a shallow property multiple times',
		expect => {
			const o = mutable({ value: 1 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value
				o.value
				o.value
			})
			execute()
			expect(calls).toBe(1)

			o.value = 2
			execute()
			expect(calls).toBe(2)

			o.value = 3
			execute()
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'creates a single dependency in a memo even if getting a deep property multiple times',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const value = memo(() => {
				calls += 1
				o.deep.value
				o.deep.value
				o.deep.value
				return o.deep.value
			})

			expect(value()).toBe(1)
			expect(calls).toBe(1)

			o.deep.value = 2

			expect(value()).toBe(2)
			expect(calls).toBe(2)

			o.deep.value = 3

			expect(value()).toBe(3)
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'creates a single dependency in an effect even if getting a deep property multiple times',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.deep.value
				o.deep.value
				o.deep.value
			})
			execute()
			expect(calls).toBe(1)

			o.deep.value = 2
			execute()
			expect(calls).toBe(2)

			o.deep.value = 3
			execute()
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib + 'does not create a dependency in a memo when creating',
		expect => {
			let o
			let calls = 0

			const value = memo(() => {
				calls += 1
				o = mutable({ value: 1 })
			})

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.value = 2

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)

			expect(calls).toBe(1)
		},
	)

	test(
		lib + 'does not create a dependency in an effect when creating',
		expect => {
			let o
			let calls = 0

			const execute = memo(() => {
				calls += 1
				o = mutable({ value: 1 })
			})
			execute()
			expect(calls).toBe(1)

			o.value = 2
			execute()
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)

			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'does not create a dependency in a memo when setting a shallow property',
		expect => {
			let o = mutable({ value: 0 })
			let calls = 0

			const value = memo(() => {
				calls += 1
				o.value = 1
			})

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.value = 2

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'does not create a dependency in an effect when setting a shallow property',
		expect => {
			let o = mutable({ value: 0 })
			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value = 1
			})
			execute()
			expect(calls).toBe(1)

			o.value = 2
			execute()
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'does not create a dependency in a memo when getting a parent property of the one being updated',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const value = memo(() => {
				calls += 1
				o.deep
			})

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.deep.value = 2

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.deep.value = 3

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'does not create a dependency in an effect when getting a parent property of the one being updated',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.deep
			})
			execute()
			expect(calls).toBe(1)

			o.deep.value = 2
			execute()
			expect(calls).toBe(1)

			o.deep.value = 3
			execute()
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.deep = v
				},
				() => o.deep,
			)
		},
	)

	test(
		lib +
			'does create a dependency (on the parent) in a memo when setting a deep property',
		expect => {
			//FIXME: This can't quite be fixed, it's a quirk of how mutable stores work

			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const value = memo(() => {
				calls += 1
				o.deep.value = 2
			})

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.deep.value = 3
			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)

			o.deep = {}
			expect(value()).toBe(undefined)
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'does create a dependency (on the parent) in an effect when setting a deep property',
		expect => {
			//FIXME: This can't quite be fixed, it's a quirk of how mutable stores work

			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.deep.value = 2
			})
			execute()
			expect(calls).toBe(1)

			o.deep.value = 3
			execute()
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)

			o.deep = {}
			execute()
			expect(calls).toBe(2)
		},
	)

	test(lib + 'returns primitive values as is', expect => {
		// solid doesnt wrap non-objects
		if (lib !== 'solid: ') {
			let o = mutable(123)
			expect(o).toBe(123)

			o = mutable(321)
			expect(o).toBe(321)

			o = mutable(undefined)
			expect(o).toBe(undefined)

			o = mutable(null)
			expect(o).toBe(null)

			o = mutable('')
			expect(o).toBe('')

			o = mutable('string')
			expect(o).toBe('string')

			o = mutable(true)
			expect(o).toBe(true)

			o = mutable(false)
			expect(o).toBe(false)

			o = mutable(Infinity)
			expect(o).toBe(Infinity)
		}

		let o = mutable([true])
		expect(o).toHaveShape([true])

		o = mutable({ 0: true })
		expect(o).toHaveShape({ 0: true })

		o = mutable([true])
		expect(o).toHaveShape([true])

		o = mutable({ 0: true })
		expect(o).toHaveShape({ 0: true })
	})

	test(
		lib +
			'returns unproxied "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toSource", "toString", "valueOf", properties [solid]',
		expect => {
			const o = mutable({})

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.hasOwnProperty
				o.isPrototypeOf
				o.propertyIsEnumerable
				o.toLocaleString
				o.toSource
				o.toString
				o.valueOf
			})
			execute()

			expect(calls).toBe(1)

			o.hasOwnProperty = 1
			o.isPrototypeOf = 1
			o.propertyIsEnumerable = 1
			o.toLocaleString = 1
			o.toSource = 1
			o.toString = 1
			o.valueOf = 1
			execute()

			if (lib === 'oby: ') {
				expect(calls).toBe(1)
			} else {
				expect(calls).toBe(2)
			}
		},
	)

	test(lib + 'returns the value being set', expect => {
		const o = mutable({ value: undefined })

		expect((o.value = 123)).toBe(123)
		expect((o.value = undefined)).toBe(undefined)
		expect((o.value = null)).toBe(null)
		expect((o.value = '')).toBe('')
		expect((o.value = 'string')).toBe('string')
		expect((o.value = [true])).toHaveShape([true])
		expect((o.value = { 0: true })).toHaveShape({ 0: true })
		expect((o.value = true)).toBe(true)
		expect((o.value = false)).toBe(false)
		expect((o.value = Infinity)).toBe(Infinity)
		expect((o.value = 0)).toBe(0)
		expect(Object.is((o.value = NaN), NaN)).toBe(true)
		expect((o.value = 1)).toBe(1)
	})

	test(lib + 'supports setting functions', expect => {
		const fn = () => {}
		const o = mutable({ value: () => {} })

		o.value = fn
		// pota will return wrapped functions
		if (lib === 'pota: ') {
			expect(typeof o.value).toBe('function')
		} else {
			expect(o.value).toBe(fn)
		}
	})

	test(lib + 'supports wrapping a plain object', expect => {
		const o = mutable({})

		let calls = 0

		const execute = memo(() => {
			calls += 1
			o.value
		})
		execute()
		expect(calls).toBe(1)

		o.value = 2
		execute()
		expect(calls).toBe(2)
	})

	test(
		lib +
			'supports wrapping a deep plain object inside a plain object',
		expect => {
			const o = mutable({ value: {} })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value.lala
			})
			execute()
			expect(calls).toBe(1)

			o.value.lala = 3
			execute()
			expect(calls).toBe(2)
			expect(o.value.lala).toBe(3)

			testValues(
				expect,
				v => {
					o.value.lala = v
				},
				() => o.value.lala,
			)
		},
	)

	test(
		lib + 'supports reacting to deleting a shallow property',
		expect => {
			const o = mutable({ value: 123 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value
			})
			execute()
			expect(calls).toBe(1)

			delete o.value
			execute()
			expect(calls).toBe(2)
			expect('value' in o).toBe(false)
			expect(calls).toBe(2)

			o.value = undefined
			execute()
			expect(calls).toBe(2)

			o.value = true
			execute()
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when deleting a shallow property that was undefined [solid]',
		expect => {
			const o = mutable({ value: undefined })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value
			})
			execute()
			expect(calls).toBe(1)

			delete o.value
			execute()
			expect(calls).toBe(1)
			expect('value' in o).toBe(false)
			expect(calls).toBe(1)

			o.value = undefined
			execute()
			expect(calls).toBe(1)

			o.value = true
			execute()
			expect(calls).toBe(2)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)
	test(
		lib +
			'supports reacting when deleting a shallow property that was null',
		expect => {
			const o = mutable({ value: null })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value
			})
			execute()
			expect(calls).toBe(1)

			delete o.value
			execute()
			expect(calls).toBe(2)

			expect('value' in o).toBe(false)
			expect(calls).toBe(2)

			o.value = undefined
			execute()
			expect(calls).toBe(2)

			o.value = true
			execute()
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib + 'supports reacting to deleting a deep property',
		expect => {
			const o = mutable({ deep: { value: 123 } })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.deep.value
			})
			execute()
			expect(calls).toBe(1)

			delete o.deep.value
			execute()
			expect(calls).toBe(2)

			expect('value' in o.deep).toBe(false)
			expect(calls).toBe(2)

			o.deep.value = undefined
			execute()
			expect(calls).toBe(2)

			o.deep.value = true
			execute()
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when deleting a deep property that was undefined [solid]',
		expect => {
			const o = mutable({ deep: { value: undefined } })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.deep.value
			})
			execute()
			expect(calls).toBe(1)

			delete o.deep.value
			execute()
			expect(calls).toBe(1)
			expect('value' in o.deep).toBe(false)
			expect(calls).toBe(1)

			o.deep.value = undefined
			execute()
			expect(calls).toBe(1)

			o.deep.value = true
			execute()
			expect(calls).toBe(2)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when setting a primitive property to itself',
		expect => {
			const o = mutable({ value: 1 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value
			})
			execute()
			expect(calls).toBe(1)

			o.value = 1
			execute()
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when setting a non-primitive property to itself',
		expect => {
			const o = mutable({ deep: { value: 2 } })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.deep.value
			})
			execute()
			expect(calls).toBe(1)

			o.deep = o.deep
			execute()
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when setting a non-primitive property to itself, when reading all values - object ',
		expect => {
			const o = mutable({ value: {} })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value
			})
			execute()
			expect(calls).toBe(1)

			o.value = o.value
			execute()
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when reading the length on a non-array, when reading all values, if the length does not actually change',
		expect => {
			//TODO

			const o = mutable({ length: 0 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.length
			})
			execute()
			expect(calls).toBe(1)

			o.length = o.length
			execute()
			expect(calls).toBe(1)
		},
	)

	test(lib + 'supports reacting to own keys', expect => {
		const o = mutable({ foo: 1, bar: 2, baz: 3 })

		let calls = 0

		const execute = memo(() => {
			calls += 1
			Object.keys(o)
		})
		execute()
		expect(calls).toBe(1)

		o.qux = 4
		execute()
		expect(calls).toBe(2)

		o.foo = 2 // already in
		o.bar = 3 // already in
		o.baz = 4 // already in
		o.qux = 5 // already in
		execute()
		expect(calls).toBe(2)

		o.qux = 5
		execute()
		expect(calls).toBe(2)

		o.qux = 6
		execute()
		expect(calls).toBe(2)

		o.qux2 = 7
		execute()
		expect(calls).toBe(3)

		delete o.foo
		execute()
		expect(calls).toBe(4)
		expect('foo' in o).toBe(false)
		expect(calls).toBe(4)

		o.foo = undefined
		execute()
		expect(calls).toBe(5)
		expect(o.foo).toBe(undefined)
		expect('foo' in o).toBe(true)

		o.foo = true
		execute()
		expect(calls).toBe(5)
		expect(o.foo).toBe(true)
		expect('foo' in o).toBe(true)
	})

	test(lib + 'supports reacting to own keys deep [solid]', expect => {
		const o = mutable({ value: { foo: 1, bar: 2, baz: 3 } })

		let calls = 0

		const execute = memo(() => {
			calls += 1
			Object.keys(o.value)
		})
		execute()
		expect(calls).toBe(1)

		o.value.qux = 4
		execute()
		expect(calls).toBe(2)

		o.value.foo = 2
		o.value.bar = 3
		o.value.baz = 4
		o.value.qux = 5
		execute()
		expect(calls).toBe(2)

		o.value.qux = 5
		execute()
		expect(calls).toBe(2)

		o.value.qux2 = 5
		execute()
		expect(calls).toBe(3)

		delete o.value.foo
		execute()
		expect(calls).toBe(4)
		expect('foo' in o.value).toBe(false)
		expect(calls).toBe(4)

		o.value.foo = undefined
		execute()
		expect(calls).toBe(5)
		expect(o.value.foo).toBe(undefined)
		expect('foo' in o.value).toBe(true)

		o.value.foo = true
		execute()
		expect(calls).toBe(5)
		expect(o.value.foo).toBe(true)
		expect('foo' in o.value).toBe(true)
	})

	test(
		lib + 'supports reacting to properties read by a getter',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				get fn() {
					return this.foo + this.bar
				},
			})

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.fn
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 10
			execute()
			expect(calls).toBe(2)
			expect(o.fn).toBe(12)

			o.bar = 20
			execute()
			expect(calls).toBe(3)
			expect(o.fn).toBe(30)
		},
	)

	test(
		lib +
			'supports reacting to properties read by a regular function',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				fn() {
					return this.foo + this.bar
				},
			})

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.fn()
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 10
			execute()
			expect(calls).toBe(2)
			expect(o.fn()).toBe(12)

			o.bar = 20
			execute()
			expect(calls).toBe(3)
			expect(o.fn()).toBe(30)
		},
	)

	test(
		lib +
			'supports reacting to properties read by a regular function, called via the call method',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				fn() {
					return this.foo + this.bar
				},
			})

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.fn.call(o)
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 10
			execute()
			expect(calls).toBe(2)
			expect(o.fn.call(o)).toBe(12)

			o.bar = 20
			execute()
			expect(calls).toBe(3)
			expect(o.fn.call(o)).toBe(30)
		},
	)

	test(
		lib +
			'supports reacting to properties read by a regular function, called via the apply method',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				fn() {
					return this.foo + this.bar
				},
			})

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.fn.apply(o)
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 10
			execute()
			expect(calls).toBe(2)
			expect(o.fn.apply(o)).toBe(12)

			o.bar = 20
			execute()
			expect(calls).toBe(3)
			expect(o.fn.apply(o)).toBe(30)
		},
	)

	test(lib + 'supports batching implicitly - unsupported', expect => {
		batch(() => {
			const o = mutable({ foo: 1, bar: 2 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.foo
				o.bar
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 10
			o.bar = 20
			execute()
			expect(calls).toBe(2)

			expect(o.foo).toBe(10)
			expect(o.bar).toBe(20)
		})
	})

	test(lib + 'supports batching setters automatically', expect => {
		const o = mutable({
			foo: 1,
			bar: 2,
			set fn(increment) {
				this.foo += increment
				this.bar += increment
			},
		})

		let calls = 0
		const execute = memo(() => {
			calls += 1
			o.foo
			o.bar
		})
		execute()
		expect(calls).toBe(1)

		o.fn = 1
		execute()
		expect(calls).toBe(2)

		expect(o.foo).toBe(2)
		expect(o.bar).toBe(3)
	})

	test(
		lib + 'supports batching deletions automatically Object.keys',
		expect => {
			const o = mutable({ foo: 1, bar: 2 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.foo
				if ('foo' in o) {
				}
				Object.keys(o)
			})
			execute()
			expect(calls).toBe(1)

			delete o.foo
			execute()
			expect(calls).toBe(2)
			expect('foo' in o).toBe(false)
			expect(calls).toBe(2)

			expect('foo' in o).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports batching deletions automatically no Object.keys',
		expect => {
			const o = mutable({ foo: 1, bar: 2 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.foo
				if ('foo' in o) {
				}
			})
			execute()
			expect(calls).toBe(1)

			delete o.foo
			execute()
			expect(calls).toBe(2)
			expect('foo' in o).toBe(false)
			expect(calls).toBe(2)

			expect('foo' in o).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports batching additions automatically Object.keys',
		expect => {
			const o = mutable({ bar: 2 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.foo
				if ('foo' in o) {
				}
				Object.keys(o)
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 1
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports batching additions automatically no Object.keys',
		expect => {
			const o = mutable({ bar: 2 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.foo
				if ('foo' in o) {
				}
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 1
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'supports batching additions automatically no Object.keys, no reading',
		expect => {
			const o = mutable({ bar: 2 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				if ('foo' in o) {
				}
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 1
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports batching additions automatically new property ',
		expect => {
			const o = mutable({ bar: 2 })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.foo
			})
			execute()
			expect(calls).toBe(1)

			o.foo = 1
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports reacting to changes on custom classes',
		expect => {
			class Foo {
				constructor() {
					this.foo = 0
					return mutable(this)
				}
			}

			class Bar extends Foo {
				constructor() {
					super()
					this.bar = 0
					return mutable(this)
				}
			}

			const foo = new Foo()
			const bar = new Bar()

			let calls = ''

			const execute1 = memo(() => {
				foo.foo
				calls += 'f'
			})
			execute1()

			const execute2 = memo(() => {
				bar.bar
				calls += 'b'
			})
			execute1(), execute2()

			expect(calls).toBe('fb')

			foo.foo += 1
			execute1(), execute2()
			expect(calls).toBe('fbf')

			bar.bar += 1
			execute1(), execute2()
			expect(calls).toBe('fbfb')
		},
	)

	test(
		lib +
			'supports reacting to property checks when value is undefined, deleting [solid]',
		expect => {
			const o = mutable({ value: undefined })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				if ('value' in o) {
				}
			})
			execute()
			expect(calls).toBe(1)

			delete o.value
			execute()
			expect(calls).toBe(2)
			expect('value' in o).toBe(false)
			expect(calls).toBe(2)

			delete o.value
			execute()
			expect(calls).toBe(2)
			expect('value' in o).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'supports reacting to property checks when value is undefined, deleting deep [solid]',
		expect => {
			const o = mutable({ value: { deep: undefined } })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				if ('deep' in o.value) {
				}
			})
			execute()
			expect(calls).toBe(1)

			delete o.value.deep
			execute()
			expect(calls).toBe(2)
			expect('deep' in o.value).toBe(false)
			expect(calls).toBe(2)

			delete o.value.deep
			execute()
			expect(calls).toBe(2)
			expect('deep' in o.value).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports reacting to property checks, adding [solid]',
		expect => {
			const o = mutable({})

			let calls = 0

			const execute = memo(() => {
				calls += 1
				if ('value' in o) {
				}
			})
			execute()
			expect(calls).toBe(1)

			o.value = undefined
			execute()
			expect(calls).toBe(2)

			o.value = undefined
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports reacting to property checks, adding deep [solid]',
		expect => {
			const o = mutable({ value: Object.create(null) })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				if ('deep' in o.value) {
				}
			})
			execute()
			expect(calls).toBe(1)

			o.value.deep = undefined
			execute()
			expect(calls).toBe(2)

			o.value.deep = undefined
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'survives reading a value inside a discarded root',
		expect => {
			const o = mutable({ value: 123 })

			let calls = 0

			root(dispose => {
				o.value

				root(() => {
					o.value
				})

				dispose()
			})

			const execute = memo(() => {
				calls += 1

				o.value
			})
			execute()
			expect(calls).toBe(1)

			o.value = 321
			execute()
			expect(calls).toBe(2)
		},
	)

	test(lib + 'does nothing for primitives', expect => {
		const o = mutable({ foo: 123 })
		expect(o.foo).toBe(123)

		o.foo = 321
		expect(o.foo).toBe(321)

		o.foo = undefined
		expect(o.foo).toBe(undefined)

		o.foo = null
		expect(o.foo).toBe(null)

		o.foo = 0
		expect(o.foo).toBe(0)

		o.foo = ''
		expect(o.foo).toBe('')

		o.foo = 'string'
		expect(o.foo).toBe('string')

		o.foo = [true]
		expect(o.foo).toHaveShape([true])

		o.foo = { 0: true }
		expect(o.foo).toHaveShape({ 0: true })

		o.foo = [true]
		expect(o.foo).toHaveShape([true])

		o.foo = true
		expect(o.foo).toBe(true)

		o.foo = false
		expect(o.foo).toBe(false)

		o.foo = Infinity
		expect(o.foo).toBe(Infinity)

		o.foo = Infinity
		expect(o.foo).toBe(Infinity)

		o.foo = NaN
		expect(Object.is(o.foo, NaN)).toBe(true)

		o.foo = 1
		expect(o.foo).toBe(1)
	})

	test(lib + 'can mutate object returned by getter [oby]', expect => {
		const result = mutable({
			get greeting() {
				return { greet: { deep: `hi, quack` } }
			},
			set greeting(val) {},
		})
		expect(result.greeting.greet.deep).toBe('hi, quack')

		result.greeting.greet.deep = undefined
		expect(result.greeting.greet.deep).toBe('hi, quack')

		const tmp1 = result.greeting
		expect(tmp1.greet.deep).toBe('hi, quack')

		testValues(
			expect,
			v => {
				tmp1.greet.deep = v
			},
			() => tmp1.greet.deep,
		)

		const tmp2 = result.greeting.greet
		expect(tmp2.deep).toBe('hi, quack')

		testValues(
			expect,
			v => {
				tmp2.deep = v
			},
			() => tmp2.deep,
		)
	})

	// vue

	test(lib + 'object.keys', expect => {
		const original = { foo: 1 }
		const result = mutable(original)
		expect(result.foo).toBe(1)
		expect(result).not.toBe(original)

		expect('foo' in result).toBe(true)

		expect(Object.keys(result)).toHaveShape(['foo'])
	})

	test(
		lib +
			'observed value should proxy mutations to original (Object)',
		expect => {
			const original = { foo: 1 }
			const observed = mutable(original)
			// set
			observed.bar = 1
			expect(observed.bar).toBe(1)
			expect(original.bar).toBe(1)

			// delete
			delete observed.foo
			expect('foo' in observed).toBe(false)
			expect('foo' in original).toBe(false)
		},
	)

	test(
		lib +
			'original value change should reflect in observed value (Object)',
		expect => {
			// same as before test but the value set is on original rather than observed
			const original = { foo: 1 }
			const observed = mutable(original)

			// set
			original.bar = 1
			expect(original.bar).toBe(1)
			expect(observed.bar).toBe(1)

			// delete
			delete original.foo
			expect('foo' in original).toBe(false)
			expect('foo' in observed).toBe(false)
		},
	)

	test(
		lib +
			'setting a property with an unobserved value should wrap with reactive',
		expect => {
			const observed = mutable({})
			const raw = {}
			observed.foo = raw
			expect(observed.foo).not.toBe(raw)

			let calls = 0
			const execute = memo(() => {
				calls++
				observed.foo
			})
			execute()
			expect(calls).toBe(1)

			observed.foo = false
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'observing already observed value should return same Proxy',
		expect => {
			const original = { foo: 1 }
			const observed = mutable(original)
			const observed2 = mutable(observed)
			expect(observed2).toBe(observed)
		},
	)

	test(
		lib +
			'observing the same value multiple times should return same Proxy',
		expect => {
			const original = { foo: 1 }
			const observed = mutable(original)
			const observed2 = mutable(original)
			expect(observed).toBe(observed2)
		},
	)

	// #1246
	test(
		lib +
			'mutation on objects using reactive as prototype should trigger',
		expect => {
			const observed = mutable({ foo: 1 })
			const original = Object.create(observed)
			let dummy
			const execute = memo(() => (dummy = original.foo))
			execute()
			expect(dummy).toBe(1)

			observed.foo = 2
			execute()
			expect(dummy).toBe(2)
			expect(observed.foo).toBe(2)
			expect(original.foo).toBe(2)

			original.foo = 3
			execute()
			expect(dummy).toBe(3)
			expect(observed.foo).toBe(3)
			expect(original.foo).toBe(3)

			original.foo = 4
			execute()
			expect(dummy).toBe(4)
			expect(observed.foo).toBe(4)
			expect(original.foo).toBe(4)
		},
	)

	test(
		lib + 'should not observe non-extensible objects [solid]',
		expect => {
			let mutableObj
			let testObj

			function createObjects() {
				mutableObj = mutable({
					foo: Object.preventExtensions({ a: 1 }),
					bar: Object.freeze({ a: 1 }),
					baz: Object.seal({ a: 1 }),
				})

				testObj = {
					foo: Object.preventExtensions({ a: 1 }),
					bar: Object.freeze({ a: 1 }),
					baz: Object.seal({ a: 1 }),
				}
			}

			createObjects()

			expect(mutableObj.foo).toHaveShape({ a: 1 })
			expect(mutableObj.bar).toHaveShape({ a: 1 })
			expect(mutableObj.baz).toHaveShape({ a: 1 })

			expect(Object.isExtensible(mutableObj.foo.a)).toBe(false)
			expect(Object.isExtensible(mutableObj.bar.a)).toBe(false)
			expect(Object.isExtensible(mutableObj.baz.a)).toBe(false)
			expect(Object.isFrozen(mutableObj.bar.a)).toBe(true)
			expect(Object.isSealed(mutableObj.bar.a)).toBe(true)

			// if js engine fails, then mutable should fail too
			function testAgainstJSEngine(key) {
				// change value
				createObjects()
				try {
					testObj[key].a = 2
					try {
						mutableObj[key].a = 2
					} catch (e) {
						console.error(
							"shouldn't have failed to mutate value of",
							key,
						)
					}
					// check the value actually changed [engine]
					expect(testObj[key].a).toBe(2)
					// check the value actually changed
					expect(mutableObj[key].a).toBe(2)
				} catch (e) {
					let fail = false
					try {
						mutableObj[key].a = 2
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have mutated value of", key)
					}
				}
				expect(mutableObj[key].a).toBe(testObj[key].a)
				expect('a' in mutableObj[key]).toBe('a' in testObj[key])

				// delete value
				createObjects()
				try {
					delete testObj[key].a
					try {
						delete mutableObj[key].a
					} catch (e) {
						console.error("shouldn't have deleted property of", key)
					}
					// check the value actually changed [engine]
					expect('a' in testObj[key]).toBe(false)
					// check the value actually changed
					expect('a' in mutableObj[key]).toBe(false)
				} catch (e) {
					let fail = false
					try {
						delete mutableObj[key].a
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have deleted property of", key)
					}
				}
				expect(mutableObj[key].a).toBe(testObj[key].a)
				expect('a' in mutableObj[key]).toBe('a' in testObj[key])

				// defineProperty
				createObjects()
				try {
					Object.defineProperty(testObj[key], 'ohai', { value: 17 })
					try {
						Object.defineProperty(mutableObj[key], 'ohai', {
							value: 17,
						})
					} catch (e) {
						console.error("shouldn't have mutated", key)
					}
				} catch (e) {
					let fail = false
					try {
						Object.defineProperty(mutableObj[key], 'ohai', {
							value: 17,
						})
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have mutated", key)
					}
				}
				expect(mutableObj[key].ohai).toBe(testObj[key].ohai)
				expect('ohai' in mutableObj[key]).toBe('ohai' in testObj[key])

				// setPrototypeOf
				createObjects()
				try {
					Object.setPrototypeOf(testObj[key], { x: 17 })
					try {
						Object.setPrototypeOf(mutableObj[key], { x: 17 })
					} catch (e) {
						console.error("shouldn't have changed prototype of", key)
					}
				} catch (e) {
					let fail = false
					try {
						Object.setPrototypeOf(mutableObj[key], { x: 17 })
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have changed prototype of", key)
					}
				}

				// __proto__
				createObjects()
				try {
					testObj[key].__proto__ = { x: 17 }
					try {
						mutableObj[key].__proto__ = { x: 17 }
					} catch (e) {
						console.error("shouldn't have changed prototype of", key)
					}
				} catch (e) {
					let fail = false
					try {
						mutableObj[key].__proto__ = { x: 17 }
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have changed prototype of", key)
					}
				}
			}

			testAgainstJSEngine('foo')
			testAgainstJSEngine('bar')
			testAgainstJSEngine('baz')
		},
	)

	test(lib + 'mutable identity', expect => {
		const raw = {}
		const obj1 = mutable(raw)
		const obj2 = mutable(raw)
		const obj3 = mutable(obj1)
		const obj4 = mutable(obj2)

		expect(obj1 === obj2 && obj2 === obj3 && obj3 === obj4).toBe(true)
	})

	test(lib + 'mutable identity nested [oby]', expect => {
		const raw = {}
		const obj1 = mutable({ value: raw })
		const obj2 = mutable({ value: raw })
		const obj3 = mutable({ value: obj1 })
		const obj4 = mutable({ value: obj2 })

		expect(obj1.value === obj2.value).toBe(true)
		expect(obj2.value === obj3.value.value).toBe(true)
		expect(obj3.value === obj1).toBe(true)
		expect(obj3.value.value === obj4.value.value).toBe(true)
	})

	test(lib + 'should observe basic properties', expect => {
		let dummy
		const counter = mutable({ num: 0 })

		let calls = 0
		const execute = memo(() => {
			calls += 1
			dummy = counter.num
		})
		execute()
		expect(calls).toBe(1)
		expect(dummy).toBe(0)

		counter.num = 7
		execute()
		expect(dummy).toBe(7)
		expect(calls).toBe(2)
	})

	test(lib + 'should observe multiple properties', expect => {
		batch(() => {
			let dummy
			const counter = mutable({ num1: 0, num2: 0 })
			let calls = 0
			const execute = memo(() => {
				calls += 1
				dummy = counter.num1 + counter.num1 + counter.num2
			})
			execute()
			expect(calls).toBe(1)
			expect(dummy).toBe(0)

			counter.num1 = counter.num2 = 7
			execute()
			expect(dummy).toBe(21)
			// fabio implementation of memo is clever
			expect(calls).toBe(2)
		})
	})

	test(lib + 'should handle multiple effects', expect => {
		let dummy1, dummy2
		const counter = mutable({ num: 0 })
		const execute1 = memo(() => (dummy1 = counter.num))
		const execute2 = memo(() => (dummy2 = counter.num))
		execute1(), execute2()

		expect(dummy1).toBe(0)
		expect(dummy2).toBe(0)
		counter.num++
		execute1(), execute2()
		expect(dummy1).toBe(1)
		expect(dummy2).toBe(1)
	})

	test(lib + 'should observe nested properties', expect => {
		let dummy
		const counter = mutable({ nested: { num: 0 } })
		const execute = memo(() => (dummy = counter.nested.num))
		execute()

		expect(dummy).toBe(0)

		counter.nested.num = 8
		execute()
		expect(dummy).toBe(8)
	})

	test(lib + 'should observe delete operations', expect => {
		let dummy
		const obj = mutable({ prop: 'value' })
		const execute = memo(() => (dummy = obj.prop))
		execute()

		expect(dummy).toBe('value')

		delete obj.prop
		execute()
		expect(dummy).toBe(undefined)
	})

	test(lib + 'should observe has operations', expect => {
		let dummy
		const obj = mutable({ prop: 'value' })
		const execute = memo(() => (dummy = 'prop' in obj))
		execute()

		expect(dummy).toBe(true)

		delete obj.prop
		execute()
		expect(dummy).toBe(false)
		obj.prop = 12
		execute()
		expect(dummy).toBe(true)
	})

	test(
		lib + 'should observe properties on the prototype chain [solid]',
		expect => {
			let dummy
			const counter = mutable({ num: 0 })
			const parentCounter = mutable({ num: 2 })
			Object.setPrototypeOf(counter, parentCounter)
			const execute = memo(() => (dummy = counter.num))
			execute()

			expect(dummy).toBe(0)

			delete counter.num
			execute()
			expect(dummy).toBe(2)

			parentCounter.num = 4
			execute()
			expect(dummy).toBe(4)

			counter.num = 3
			execute()
			expect(dummy).toBe(3)
		},
	)

	test(
		lib + 'should observe has operations on the prototype chain',
		expect => {
			let dummy
			const counter = mutable({ num: 0 })
			const parentCounter = mutable({ num: 2 })
			Object.setPrototypeOf(counter, parentCounter)
			const execute = memo(() => (dummy = 'num' in counter))
			execute()

			expect(dummy).toBe(true)

			delete counter.num
			execute()
			expect(dummy).toBe(true)

			delete parentCounter.num
			execute()
			expect(dummy).toBe(false)

			counter.num = 3
			execute()
			expect(dummy).toBe(true)
		},
	)

	test(lib + 'prototype change [oby]', expect => {
		let dummy
		let parentDummy
		let hiddenValue
		const obj = mutable({})
		const parent = mutable({
			set prop(value) {
				hiddenValue = value
			},
			get prop() {
				return hiddenValue
			},
		})
		Object.setPrototypeOf(obj, parent)
		const execute1 = memo(() => (dummy = obj.prop))
		const execute2 = memo(() => (parentDummy = parent.prop))
		execute1(), execute2()

		expect(dummy).toBe(undefined)
		expect(parentDummy).toBe(undefined)

		obj.prop = 4
		execute1(), execute2()
		expect(obj.prop).toBe(4)
		expect(dummy).toBe(4)

		parent.prop = 2
		execute1(), execute2()
		expect(obj.prop).toBe(2)
		expect(dummy).toBe(2)
		expect(parentDummy).toBe(2)
		expect(parent.prop).toBe(2)
	})

	test(lib + 'should observe function call chains', expect => {
		let dummy
		const counter = mutable({ num: 0 })
		const execute = memo(() => (dummy = getNum()))
		execute()

		function getNum() {
			return counter.num
		}

		expect(dummy).toBe(0)

		counter.num = 2
		execute()
		expect(dummy).toBe(2)
	})

	test(lib + 'should observe iteration', expect => {
		let dummy
		const list = mutable({ value: 'Hello' })
		const execute = memo(() => (dummy = list.value))
		execute()

		expect(dummy).toBe('Hello')

		list.value += ' World!'
		execute()
		expect(dummy).toBe('Hello World!')

		list.value = list.value.replace('Hello ', '')
		execute()
		expect(dummy).toBe('World!')
	})

	test(lib + 'should observe enumeration', expect => {
		const numbers = mutable({ num1: 3 })

		let sum = 0
		const execute = memo(() => {
			sum = 0
			for (let key in numbers) {
				sum += numbers[key]
			}
		})
		execute()

		expect(sum).toBe(3)

		numbers.num2 = 4
		execute()
		expect(sum).toBe(7)

		delete numbers.num1
		execute()
		expect(sum).toBe(4)
	})

	test(lib + 'should observe symbol keyed properties', expect => {
		const key = Symbol('symbol keyed prop')

		let dummy
		let hasDummy

		const obj = mutable({ [key]: 'value' })

		let calls1 = 0
		const execute1 = memo(() => {
			calls1++
			dummy = obj[key]
		})
		execute1()

		let calls2 = 0
		const execute2 = memo(() => {
			calls2++
			hasDummy = key in obj
		})
		execute1(), execute2()

		expect(calls1).toBe(1)
		expect(calls2).toBe(1)

		expect(dummy).toBe('value')
		expect(hasDummy).toBe(true)

		expect(calls1).toBe(1)
		expect(calls2).toBe(1)

		obj[key] = 'newValue'
		execute1(), execute2()

		expect(calls1).toBe(2)
		expect(calls2).toBe(1)

		expect(dummy).toBe('newValue')
		expect(hasDummy).toBe(true)

		expect(calls1).toBe(2)
		expect(calls2).toBe(1)

		delete obj[key]
		execute1(), execute2()

		expect(calls1).toBe(3)
		expect(calls2).toBe(2)

		expect(dummy).toBe(undefined)
		expect(hasDummy).toBe(false)
	})

	test(lib + 'should observe function valued properties', expect => {
		const oldFunc = () => {}
		const newFunc = () => {}

		let dummy
		const obj = mutable({ func: oldFunc })
		const execute = memo(() => (dummy = obj.func))
		execute()
		if (lib === 'pota: ') {
			expect(typeof dummy).toBe('function')
			obj.func = newFunc
			execute()
			expect(typeof obj.func).toBe('function')
		} else {
			expect(dummy).toBe(oldFunc)
			obj.func = newFunc
			execute()
			expect(dummy).toBe(newFunc)
		}
	})

	test(lib + 'should observe getters relying on this', expect => {
		const obj = mutable({
			a: 1,
			get b() {
				return this.a
			},
		})

		let dummy
		const execute = memo(() => {
			dummy = obj.b
		})
		execute()
		expect(dummy).toBe(1)

		obj.a++
		execute()
		expect(dummy).toBe(2)
	})

	test(lib + 'should observe methods relying on this', expect => {
		const obj = mutable({
			a: 1,
			b() {
				return this.a
			},
		})

		let dummy
		const execute = memo(() => {
			dummy = obj.b()
		})
		execute()
		expect(dummy).toBe(1)

		obj.a++
		execute()
		expect(dummy).toBe(2)
	})

	test(
		lib + 'should not observe set operations without a value change',
		expect => {
			let hasDummy, getDummy
			const obj = mutable({ prop: 'value' })

			let calls1 = 0
			let calls2 = 0
			const execute1 = memo(() => {
				calls1++
				getDummy = obj.prop
			})
			execute1()
			const execute2 = memo(() => {
				calls2++
				hasDummy = 'prop' in obj
			})
			execute2()
			expect(calls1).toBe(1)
			expect(calls2).toBe(1)

			expect(getDummy).toBe('value')
			expect(hasDummy).toBe(true)

			obj.prop = 'value'
			execute1(), execute2()

			expect(calls1).toBe(1)
			expect(calls2).toBe(1)
			expect(getDummy).toBe('value')
			expect(hasDummy).toBe(true)
		},
	)

	test(lib + 'should cut the loop', expect => {
		const counter = mutable({ num: 0 })
		const execute = memo(() => {
			if (counter.num < 10) {
				counter.num++
			}
		})
		execute()
		expect(counter.num).toBe(10)
	})

	test(
		lib +
			'should not be triggered by mutating a property, which is used in an inactive branch',
		expect => {
			let dummy
			const obj = mutable({ prop: 'value', run: true })

			let calls = 0
			const execute = memo(() => {
				calls++
				dummy = obj.run ? obj.prop : 'other'
			})
			execute()

			expect(dummy).toBe('value')
			expect(calls).toBe(1)

			obj.run = false
			execute()
			expect(dummy).toBe('other')
			expect(calls).toBe(2)

			obj.prop = 'value2'
			execute()
			expect(dummy).toBe('other')
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'should not run multiple times for a single mutation',
		expect => {
			let dummy
			const obj = mutable({})
			let calls = 0
			const execute = memo(() => {
				calls++
				for (const key in obj) {
					dummy = obj[key]
				}
				dummy = obj.prop
			})
			execute()
			expect(calls).toBe(1)

			obj.prop = 16
			execute()

			expect(dummy).toBe(16)
			expect(calls).toBe(2)
		},
	)

	test(lib + 'should observe json methods', expect => {
		let dummy = {}
		const obj = mutable({})
		const execute = memo(() => {
			dummy = JSON.parse(JSON.stringify(obj))
		})
		execute()

		obj.a = 1
		execute()
		expect(dummy.a).toBe(1)
	})

	test(lib + 'should observe class method invocations', expect => {
		class Model {
			count
			constructor() {
				this.count = 0
			}
			inc() {
				this.count++
			}
		}
		const model = mutable(new Model())
		let dummy
		const execute = memo(() => {
			dummy = model.count
		})
		execute()
		expect(dummy).toBe(0)

		model.inc()
		execute()
		expect(dummy).toBe(1)
	})

	test(
		lib +
			'should not be triggered when the value and the old value both are NaN [solid]',
		expect => {
			const obj = mutable({
				foo: NaN,
			})
			let calls = 0
			const execute = memo(() => {
				calls++
				obj.foo
			})
			execute()
			expect(calls).toBe(1)

			obj.foo = NaN
			execute()
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'should not be triggered when set with the same proxy [oby]',
		expect => {
			const obj = mutable({ foo: 1 })
			const observed = mutable({ obj })

			let calls = 0
			const execute = memo(() => {
				calls++
				observed.obj
			})
			execute()
			expect(calls).toBe(1)

			observed.obj = obj
			execute()
			expect(calls).toBe(1)

			const obj2 = mutable({ foo: 1 })
			const observed2 = mutable({ obj2 })

			let calls2 = 0
			const execute2 = memo(() => {
				calls2++
				observed2.obj2
			})
			execute2()
			expect(calls2).toBe(1)

			observed2.obj2 = obj2
			execute()
			execute2()
			expect(calls2).toBe(1)
		},
	)

	test(lib + 'should return updated value', expect => {
		const value = mutable({})
		const cValue = memo(() => value.foo)
		expect(cValue()).toBe(undefined)
		value.foo = 1
		expect(cValue()).toBe(1)
	})

	test(lib + 'should trigger effect', expect => {
		const value = mutable({})
		const cValue = memo(() => value.foo)
		let dummy
		const execute = memo(() => {
			dummy = cValue()
		})
		execute()

		expect(dummy).toBe(undefined)

		value.foo = 1
		execute()
		expect(dummy).toBe(1)
	})

	test(lib + 'should work when chained', expect => {
		const value = mutable({ foo: 0 })
		const c1 = memo(() => value.foo)
		const c2 = memo(() => c1() + 1)
		expect(c2()).toBe(1)
		expect(c1()).toBe(0)
		value.foo++
		expect(c2()).toBe(2)
		expect(c1()).toBe(1)
	})

	test(lib + 'should trigger effect when chained', expect => {
		const value = mutable({ foo: 0 })

		let calls1 = 0
		let calls2 = 0

		const c1 = memo(() => {
			calls1++
			return value.foo
		})
		const c2 = memo(() => {
			calls2++
			return c1() + 1
		})

		let dummy
		const execute = memo(() => {
			dummy = c2()
		})
		execute()

		expect(dummy).toBe(1)
		expect(calls1).toBe(1)
		expect(calls2).toBe(1)

		value.foo++
		execute()
		expect(dummy).toBe(2)
		// should not result in duplicate calls
		expect(calls1).toBe(2)
		expect(calls2).toBe(2)
	})

	test(
		lib + 'should trigger effect when chained (mixed invocations)',
		expect => {
			const value = mutable({ foo: 0 })

			let calls1 = 0
			let calls2 = 0

			const c1 = memo(() => {
				calls1++
				return value.foo
			})
			const c2 = memo(() => {
				calls2++
				return c1() + 1
			})

			let dummy
			const execute = memo(() => {
				dummy = c1() + c2()
			})
			execute()
			expect(dummy).toBe(1)

			expect(calls1).toBe(1)
			expect(calls2).toBe(1)

			value.foo++
			execute()

			expect(dummy).toBe(3)
			// should not result in duplicate calls
			expect(calls1).toBe(2)
			expect(calls2).toBe(2)
		},
	)

	test(
		lib + 'should avoid infinite loops with other effects',
		expect => {
			batch(() => {
				const nums = mutable({ num1: 0, num2: 1 })

				let calls1 = 0
				let calls2 = 0

				const execute1 = memo(() => {
					calls1++
					nums.num1 = nums.num2
				})
				execute1()
				expect(nums.num1).toBe(1)
				expect(nums.num2).toBe(1)

				const execute2 = memo(() => {
					calls2++
					nums.num2 = nums.num1
				})
				execute1(), execute2()

				expect(nums.num1).toBe(1)
				expect(nums.num2).toBe(1)
				expect(calls1).toBe(1)
				expect(calls2).toBe(1)

				nums.num2 = 4
				execute1(), execute2()

				expect(nums.num1).toBe(4)
				expect(nums.num2).toBe(4)
				expect(calls1).toBe(2)
				expect(calls2).toBe(2)

				nums.num1 = 10
				execute1(), execute2()

				expect(nums.num1).toBe(10)
				expect(nums.num2).toBe(10)
				// this is just implementation specific, but shouldnt run more than 3 times
				expect(calls1).toBe(2)
				expect(calls2).toBe(3)
			})
		},
	)

	// #1246
	test(
		lib +
			'mutation on objects using mutable as prototype should trigger',
		expect => {
			const original = mutable({ foo: 1 })

			const user = Object.create(original)

			let dummy
			const execute = memo(() => (dummy = user.foo))
			execute()
			expect(dummy).toBe(1)

			original.foo = 2
			execute()
			expect(dummy).toBe(2)

			user.foo = 3
			execute()
			expect(dummy).toBe(3)

			user.foo = 4
			execute()
			expect(dummy).toBe(4)
		},
	)

	/** ARRAY */

	test(lib + 'array: value: array property', expect => {
		const source = [{ cat: 'quack' }]
		const obj = mutable(source)

		expect(source[0].cat).toBe('quack')
		expect(obj[0].cat).toBe('quack')
	})

	test(lib + 'array: functions', expect => {
		const list = mutable([0, 1, 2])
		const filtered = memo(() => list.filter(i => i % 2))
		expect(filtered()).toHaveShape([1])
	})

	test(lib + 'array: functions nested', expect => {
		const list = mutable({ data: [0, 1, 2] })
		const filtered = memo(() => list.data.filter(i => i % 2))
		expect(filtered()).toHaveShape([1])
	})

	test(lib + 'array: equality: different array', expect => {
		const source = []
		const result = mutable(source)
		expect(result).not.toBe(source)
		expect(isProxy(result)).toBe(true)
	})

	test(lib + 'array: equality: different array nested', expect => {
		const source = []
		const result = mutable({ source })
		expect(result.source).not.toBe(source)
	})

	test(lib + 'array: equality: isArray', expect => {
		const source = []
		const result = mutable(source)
		expect(Array.isArray(result)).toBe(true)
		expect(isProxy(result)).toBe(true)
	})

	test(lib + 'array: equality: isArray nested', expect => {
		const source = { data: [] }
		const result = mutable(source)
		expect(Array.isArray(result.data)).toBe(true)
		expect(isProxy(result.data)).toBe(true)
	})

	test(lib + 'array: mutation: array property', expect => {
		const source = [{ cat: 'quack' }]
		const result = mutable(source)

		expect(source[0].cat).toBe('quack')
		expect(result[0].cat).toBe('quack')

		result[0].cat = 'murci'
		expect(source[0].cat).toBe('murci')
		expect(result[0].cat).toBe('murci')
	})

	test(lib + 'array: mutation: array todos', expect => {
		const todos = mutable([
			{ id: 1, title: 'quack', done: true },
			{ id: 2, title: 'murci', done: false },
		])

		expect(todos[1].done).toBe(false)
		todos[1].done = Infinity
		expect(todos[1].done).toBe(Infinity)

		expect(todos.length).toBe(2)
		todos.push({ id: 3, title: 'mishu', done: false })
		expect(todos.length).toBe(3)

		expect(todos[1].done).toBe(Infinity)
		expect(Array.isArray(todos)).toBe(true)
		expect(todos[0].title).toBe('quack')
		expect(todos[1].title).toBe('murci')
		expect(todos[2].title).toBe('mishu')
	})

	test(lib + 'array: mutation: array batch', expect => {
		const result = mutable([1, 2, 3])
		batch(() => {
			expect(result.length).toBe(3)
			const move = result.splice(1, 1)
			expect(result.length).toBe(2)
			result.splice(0, 0, ...move)
			expect(result.length).toBe(3)
			expect(result).toHaveShape([2, 1, 3])
			result.push(4)
			expect(result.length).toBe(4)
			expect(result).toHaveShape([2, 1, 3, 4])
		})
		expect(result.length).toBe(4)
		expect(result.pop()).toBe(4)
		expect(result.length).toBe(3)
		expect(result).toHaveShape([2, 1, 3])
	})

	test(lib + 'array: getters: array', expect => {
		const result = mutable([
			{
				cat: 'quack',
				get greeting() {
					return `hi, ${this.cat}`
				},
			},
		])
		expect(result[0].greeting).toBe('hi, quack')

		result[0].cat = 'mishu'
		expect(result[0].greeting).toBe('hi, mishu')
	})

	test(lib + 'array: getter/setters: class in array', expect => {
		class Cat {
			#name = 'quack'
			get name() {
				return this.#name
			}
			set name(value) {
				this.#name = value
			}
			get greeting() {
				return `hi, ${this.#name}`
			}
		}
		const result = mutable([new Cat()])
		expect(result[0].greeting).toBe('hi, quack')

		result[0].name = 'mishu'
		expect(result[0].greeting).toBe('hi, mishu')
	})

	test(
		lib +
			'array: supports wrapping a deep array inside a plain object',
		expect => {
			const o = mutable({ value: [] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value[0]
			})
			execute()
			expect(calls).toBe(1)

			o.value[0] = 3
			execute()
			expect(calls).toBe(2)
			expect(o.value[0]).toBe(3)

			testValues(
				expect,
				v => {
					o.value[0] = v
				},
				() => o.value[0],
			)
		},
	)

	test(lib + 'array: supports wrapping an array', expect => {
		const o = mutable([])

		let calls = 0

		const execute = memo(() => {
			calls += 1
			o[0]
		})
		execute()
		expect(calls).toBe(1)

		o[0] = 3
		execute()
		expect(calls).toBe(2)
		expect(o[0]).toBe(3)

		testValues(
			expect,
			v => {
				o[0] = v
			},
			() => o[0],
		)
	})

	test(
		lib + 'array: supports wrapping a deep array inside an array',
		expect => {
			const o = mutable([[]])

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o[0][0]
			})
			execute()
			expect(calls).toBe(1)

			o[0][0] = 3
			execute()
			expect(calls).toBe(2)
			expect(o[0][0]).toBe(3)

			testValues(
				expect,
				v => {
					o[0][0] = v
				},
				() => o[0][0],
			)
		},
	)

	test(
		lib +
			'array: supports wrapping a deep plain object inside an array',
		expect => {
			const o = mutable([{}])

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o[0].lala
			})
			execute()
			expect(calls).toBe(1)

			o[0].lala = 3
			execute()
			expect(calls).toBe(2)
			expect(o[0].lala).toBe(3)

			testValues(
				expect,
				v => {
					o[0].lala = v
				},
				() => o[0].lala,
			)
		},
	)

	test(
		lib +
			'array: supports not reacting when reading the length on a array, when reading all values, if the length does not actually change',
		expect => {
			const o = mutable({ value: [0] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value.length
			})
			execute()
			expect(calls).toBe(1)
			expect(o.value.length).toBe(1)

			o.value.splice(0, 1, 1)
			execute()
			expect(calls).toBe(1)
		},
	)

	test(lib + 'array: should make Array reactive', expect => {
		const original = [{ foo: 1 }]
		const observed = mutable(original)
		expect(observed).not.toBe(original)

		// get
		expect(observed[0].foo).toBe(1)

		let calls = 0
		const execute = memo(() => {
			calls++
			observed[0].foo
		})
		execute()
		expect(calls).toBe(1)

		expect(observed[0].foo).toBe(1)

		observed[0].foo = 2
		execute()
		expect(observed[0].foo).toBe(2)
		expect(calls).toBe(2)

		// has
		expect(0 in observed).toBe(true)
		// ownKeys
		expect(Object.keys(observed)).toHaveShape(['0'])
	})

	test(lib + 'array: slice test', expect => {
		;[
			['ant', 'bison', 'camel', 'duck', 'elephant'],
			mutable(['ant', 'bison', 'camel', 'duck', 'elephant']),
		].forEach(array => {
			expect(array.slice(2)).toHaveShape([
				'camel',
				'duck',
				'elephant',
			])
			expect(array.slice(2, 4)).toHaveShape(['camel', 'duck'])
			expect(array.slice(1, 5)).toHaveShape([
				'bison',
				'camel',
				'duck',
				'elephant',
			])
			expect(array.slice(-2)).toHaveShape(['duck', 'elephant'])
			expect(array.slice(2, -1)).toHaveShape(['camel', 'duck'])
			expect(array.slice()).toHaveShape([
				'ant',
				'bison',
				'camel',
				'duck',
				'elephant',
			])

			expect(array.slice(-400, 600)).toHaveShape([
				'ant',
				'bison',
				'camel',
				'duck',
				'elephant',
			])

			expect(array.slice(-400, -44)).toHaveShape([])
			expect(array.slice(-44, -400)).toHaveShape([])
			expect(array.slice(2, -400)).toHaveShape([])
			expect(array.slice(2, -3)).toHaveShape([])
		})
	})

	test(lib + 'array: sliced test [solid, oby]', expect => {
		const original = [{ foo: 1 }]
		const result = mutable(original)
		const clone = result.slice()
		expect(clone[0]).toBe(result[0])
		expect(clone[0]).toBe(original[0])
		expect(clone).not.toBe(result)

		let calls = 0
		const execute = memo(() => {
			calls++
			clone[0].foo
		})
		execute()
		expect(calls).toBe(1)

		expect(clone[0].foo).toBe(1)

		clone[0].foo = 2
		execute()
		expect(clone[0].foo).toBe(2)
		expect(result[0].foo).toBe(2)
		expect(original[0].foo).toBe(2)
		expect(calls).toBe(2)
	})

	test(lib + 'array: mutable identity', expect => {
		const raw = []
		const obj1 = mutable(raw)
		const obj2 = mutable(raw)
		const obj3 = mutable(obj1)
		const obj4 = mutable(obj2)

		expect(obj1 === obj2 && obj2 === obj3 && obj3 === obj4).toBe(true)
	})

	test(lib + 'array: mutable identity nested [oby]', expect => {
		const raw = []
		const obj1 = mutable({ value: raw })
		const obj2 = mutable({ value: raw })
		const obj3 = mutable({ value: obj1 })
		const obj4 = mutable({ value: obj2 })

		expect(obj1.value === obj2.value).toBe(true)
		expect(obj2.value === obj3.value.value).toBe(true)
		expect(obj3.value === obj1).toBe(true)
		expect(obj3.value.value === obj4.value.value).toBe(true)
	})

	class Sub3 extends Array {
		lastPushed
		lastSearched

		push(item) {
			// console.log('pushing from SubArray', item)
			this.lastPushed = item
			return super.push(item)
		}

		indexOf(searchElement, fromIndex) {
			this.lastSearched = searchElement
			return super.indexOf(searchElement, fromIndex)
		}
	}
	class Sub2 extends Sub3 {}
	class Sub1 extends Sub2 {}
	class SubArray extends Sub1 {}

	test(
		lib + 'array: calls correct mutation method on Array subclass',
		expect => {
			const subArray = new SubArray(4, 5, 6)
			const observed = mutable(subArray)

			subArray.push(7)
			expect(subArray.lastPushed).toBe(7)
			observed.push(9)
			expect(observed.lastPushed).toBe(9)
		},
	)

	test(
		lib +
			'array: calls correct identity-sensitive method on Array subclass',
		expect => {
			const subArray = new SubArray(4, 5, 6)
			const observed = mutable(subArray)
			let index

			index = subArray.indexOf(4)
			expect(index).toBe(0)
			expect(subArray.lastSearched).toBe(4)

			index = observed.indexOf(6)
			expect(index).toBe(2)
			expect(observed.lastSearched).toBe(6)

			expect(mutable(observed)).toBe(mutable(subArray))
			expect(observed).toBe(mutable(subArray))
			expect(mutable(observed).slice()).not.toBe(
				mutable(subArray).slice(),
			)
		},
	)

	test(
		lib + 'array: should be triggered when set length with string',
		expect => {
			let ret1 = 'idle'
			let ret2 = 'idle'
			const arr1 = mutable(new Array(11).fill(0))
			const arr2 = mutable(new Array(11).fill(0))
			const execute1 = memo(() => {
				ret1 =
					arr1[10] === undefined ? 'arr[10] is set to empty' : 'idle'
			})
			execute1()
			const execute2 = memo(() => {
				ret2 =
					arr2[10] === undefined ? 'arr[10] is set to empty' : 'idle'
			})
			execute2()

			arr1.length = 2
			arr2.length = '2'
			execute1()
			execute2()

			expect(ret1).toBe(ret2)
		},
	)

	test(
		lib +
			'array: is both a getter and a setter, for shallow non-primitive properties',
		expect => {
			const obj1 = [{ foo: 123 }]
			const obj2 = []

			const o = mutable({ value: obj1 })
			expect(o.value).toHaveShape(obj1)

			o.value = obj2
			expect(o.value).toHaveShape(obj2)

			o.value = obj1
			expect(o.value).toHaveShape(obj1)

			testValues(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'array: deeper: is both a getter and a setter, for shallow non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = []

			const o = mutable({ value: { deeper: obj1 } })
			expect(o.value.deeper).toHaveShape(obj1)

			o.value.deeper = obj2
			expect(o.value.deeper).toHaveShape(obj2)

			o.value.deeper = obj1
			expect(o.value.deeper).toHaveShape(obj1)

			testValues(
				expect,
				v => {
					o.value.deeper = v
				},
				() => o.value.deeper,
			)
		},
	)

	test(
		lib +
			'array: is both a getter and a setter, for deep non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = []

			const o = mutable({ deep: { value: obj1 } })
			expect(o.deep.value).toHaveShape(obj1)

			o.deep.value = obj2
			expect(o.deep.value).toHaveShape(obj2)

			o.deep.value = obj1
			expect(o.deep.value).toHaveShape(obj1)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'array: is both a getter and a setter, for deep non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = []

			const o = mutable({ deep: { value: obj1 } })
			expect(o.deep.value).toHaveShape(obj1)

			let calls = 0
			const execute = memo(() => {
				calls += 1
				o.deep.value
			})
			execute()
			expect(calls).toBe(1)

			o.deep.value = obj2
			execute()
			expect(o.deep.value).toHaveShape(obj2)
			expect(calls).toBe(2)

			o.deep.value = obj1
			execute()
			expect(o.deep.value).toHaveShape(obj1)
			expect(calls).toBe(3)

			testValues(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib + 'array: reading length and pusing doesnt loop',
		expect => {
			const result = mutable([])

			let read = 0
			const execute = memo(() => {
				read++
				if (read < 100) {
					result.length
					result.push(Date.now())
					result.length
				}
				return read
			})
			execute()
			expect(read).toBe(100)
		},
	)

	test(lib + 'array: mutating array length', expect => {
		const result = mutable([69])

		let calls = 0
		const execute1 = memo(() => {
			calls++
			result[40]
		})
		execute1()

		let calls2 = 0
		const execute2 = memo(() => {
			calls2++
			result[2]
		})
		execute1(), execute2()

		let calls3 = 0
		const execute3 = memo(() => {
			calls3++
			result.length
		})
		execute1(), execute2(), execute3()

		expect(result.length).toBe(1)
		expect(result[40]).toBe(undefined)
		expect(result[2]).toBe(undefined)
		expect(result[0]).toBe(69)

		expect(calls).toBe(1)
		expect(calls2).toBe(1)
		expect(calls3).toBe(1)

		result.length = 45
		execute1(), execute2(), execute3()

		expect(result.length).toBe(45)
		expect(calls).toBe(1)
		expect(calls2).toBe(1)
		expect(calls3).toBe(2)

		result[40] = true
		execute1(), execute2(), execute3()

		expect(result[40]).toBe(true)
		expect(calls).toBe(2)
		expect(calls2).toBe(1)
		expect(calls3).toBe(2)

		result[41] = true
		execute1(), execute2(), execute3()

		expect(result[41]).toBe(true)
		expect(calls).toBe(2)
		expect(calls2).toBe(1)
		expect(calls3).toBe(2)

		result[2] = true
		execute1(), execute2(), execute3()

		expect(result[2]).toBe(true)
		expect(calls).toBe(2)
		expect(calls2).toBe(2)
		expect(calls3).toBe(2)

		result.push()
		execute1(), execute2(), execute3()

		expect(calls).toBe(2)
		expect(calls2).toBe(2)
		expect(calls3).toBe(2)

		result.unshift()
		execute1(), execute2(), execute3()

		expect(calls).toBe(2)
		expect(calls2).toBe(2)
		expect(calls3).toBe(2)

		result.push(1)
		execute1(), execute2(), execute3()

		expect(calls).toBe(2)
		expect(calls2).toBe(2)
		expect(calls3).toBe(3)
	})

	test(
		lib +
			'array: pushing in two separated effects doesnt loop [solid, oby]',
		expect => {
			const result = mutable([0])

			const execute1 = memo(() => {
				result.push(1)
			})
			execute1()

			const execute2 = memo(() => {
				result.push(2)
			})
			execute1(), execute2()

			expect(result).toHaveShape([0, 1, 2])
		},
	)

	test(lib + 'array: track: array functions', expect => {
		const result = mutable([{ username: 'lala' }])

		let called = 0
		const execute = memo(() => {
			try {
				result[0].username
			} catch (e) {}
			called++
		})
		execute()

		expect(result[0].username).toBe('lala')
		expect(called).toBe(1)

		result[0].username = 'lala2'
		execute()
		expect(result[0].username).toBe('lala2')
		expect(called).toBe(2)

		// setting to same value
		result[0].username = 'lala2'
		execute()

		expect(result[0].username).toBe('lala2')
		expect(called).toBe(2)

		result.pop()
		execute()
		expect(called).toBe(3)
		expect(result.length).toBe(0)

		result.push({ username: 'lala2' })
		execute()
		expect(called).toBe(4)

		result.push({ username: 'lala3' })
		execute()
		expect(called).toBe(4)

		result.push({ username: 'lala4' })
		execute()
		expect(called).toBe(4)

		result[0].username = 'lala5'
		execute()
		expect(called).toBe(5)
	})

	test(
		lib + 'array: track: array functions read vs write',
		expect => {
			const result = mutable([1])

			let called = 0
			const execute = memo(() => {
				JSON.stringify(result)
				called++
			})
			execute()

			expect(result[0]).toBe(1)
			expect(called).toBe(1)

			result.filter(i => i % 2)
			execute()
			expect(called).toBe(1)

			result.filter(i => i % 2)
			execute()
			expect(called).toBe(1)

			result.push(2)
			execute()
			expect(called).toBe(2)
		},
	)

	test(lib + 'array: track: array functions read', expect => {
		const result = mutable([1])

		let called = 0
		const execute = memo(() => {
			result.filter(i => i % 2)
			called++
		})
		execute()
		expect(result[0]).toBe(1)
		expect(called).toBe(1)

		result.push(2)
		execute()
		expect(called).toBe(2)

		result.push(3)
		execute()
		expect(called).toBe(3)

		result.push(4)
		execute()
		expect(called).toBe(4)
	})

	test(
		lib +
			'array: supports not reacting when setting a non-primitive property to itself, when reading all values',
		expect => {
			const o = mutable([0])

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o[0]
			})
			execute()
			expect(calls).toBe(1)

			o[0] = o[0]
			execute()
			expect(calls).toBe(1)

			testValues(
				expect,
				v => {
					o[0] = v
				},
				() => o[0],
			)
		},
	)

	test(
		lib + 'array: supports reacting when array length changes',
		expect => {
			const o = mutable({ value: [0] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value.length
			})
			execute()
			expect(calls).toBe(1)
			expect(o.value.length).toBe(1)

			o.value.pop()
			execute()
			expect(calls).toBe(2)
			expect(o.value.length).toBe(0)
		},
	)
	test(
		lib +
			'array: supports reacting when array length is set explicity',
		expect => {
			const o = mutable({ value: [0] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value.length
			})
			execute()
			expect(calls).toBe(1)
			expect(o.value.length).toBe(1)

			o.value.length = 0
			execute()
			expect(calls).toBe(2)
			expect(o.value.length).toBe(0)
		},
	)

	test(
		lib +
			'array: supports reacting when array length is set explicity while reading value [oby]',
		expect => {
			const o = mutable({ value: [0, 2] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value[0]
				o.value[1]
			})
			execute()
			expect(calls).toBe(1)
			expect(o.value.length).toBe(2)

			o.value.length = 0
			execute()
			expect(calls).toBe(2)
			expect(o.value.length).toBe(0)
			expect(o.value[0]).toBe(undefined)
		},
	)

	test(
		lib +
			'array: supports not reacting when array reading function is called ',
		expect => {
			const o = mutable({ value: [0, 1] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value
				o.value[0]
			})
			execute()
			expect(calls).toBe(1)
			expect(o.value.length).toBe(2)

			o.value.filter(() => {})
			execute()

			expect(calls).toBe(1)
			expect(o.value.length).toBe(2)
		},
	)

	test(
		lib +
			'array: supports not reacting when array writing function is called ',
		expect => {
			const o = mutable({ value: [0, 1] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value[0]
			})
			execute()
			expect(calls).toBe(1)
			expect(o.value.length).toBe(2)

			o.value.push(2)
			execute()

			expect(calls).toBe(1)
			expect(o.value.length).toBe(3)
		},
	)

	test(
		lib + 'array: supports reacting to changes in deep arrays',
		expect => {
			const o = mutable({ value: [1, 2] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value.length
			})
			execute()
			expect(calls).toBe(1)

			o.value.pop()
			execute()
			expect(calls).toBe(2)

			o.value.pop()
			execute()
			expect(calls).toBe(3)

			o.value.push(1)
			execute()
			expect(calls).toBe(4)
		},
	)

	test(
		lib + 'array: supports not reacting to no-changes in deep arrays',
		expect => {
			const o = mutable({ value: [1, 2] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value.length
			})
			execute()
			expect(calls).toBe(1)

			o.value.filter(() => {})
			execute()
			expect(calls).toBe(1)

			o.value.filter(() => {})
			execute()
			expect(calls).toBe(1)

			o.value.push(1)
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'array: supports reacting to changes in top-level arrays',
		expect => {
			const o = mutable([1, 2])

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.length
			})
			execute()
			expect(calls).toBe(1)

			o.pop()
			execute()
			expect(calls).toBe(2)

			o.pop()
			execute()
			expect(calls).toBe(3)

			o.push(1)
			execute()
			expect(calls).toBe(4)

			o[0] = true
			execute()
			expect(calls).toBe(4)
		},
	)

	test(
		lib +
			'array: supports not reacting to changes in top-level arrays',
		expect => {
			const o = mutable([1, 2])

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.length
			})
			execute()
			expect(calls).toBe(1)

			o.filter(() => {})
			execute()
			expect(calls).toBe(1)

			o.filter(() => {})
			execute()
			expect(calls).toBe(1)

			o.push(3)
			execute()
			expect(calls).toBe(2)

			o.push(4)
			execute()
			expect(calls).toBe(3)

			o[0] = false
			execute()
			expect(calls).toBe(3)
		},
	)

	test(
		lib +
			'array: supports reacting to changes at a specific index in deep arrays',
		expect => {
			const o = mutable({ value: [1, 2] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value[0]
			})
			execute()
			expect(calls).toBe(1)

			o.value.pop()
			execute()
			expect(calls).toBe(1)

			o.value.push(10)
			execute()
			expect(calls).toBe(1)

			o.value[0] = 123
			execute()
			expect(calls).toBe(2)

			o.value.unshift(1)
			execute()
			expect(calls).toBe(3)

			o.value.unshift(1)
			execute()
			expect(calls).toBe(3)

			o.value.unshift(2)
			execute()
			expect(calls).toBe(4)
		},
	)

	test(
		lib +
			'array: supports reacting to changes at a specific index in top-level arrays',
		expect => {
			const o = mutable([1, 2])

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o[0]
			})
			execute()
			expect(calls).toBe(1)

			o.pop()
			execute()
			expect(calls).toBe(1)

			o.push(10)
			execute()
			expect(calls).toBe(1)

			o[0] = 123
			execute()
			expect(calls).toBe(2)

			o.unshift(1)
			execute()
			expect(calls).toBe(3)

			o.unshift(1)
			execute()
			expect(calls).toBe(3)

			o.unshift(2)
			execute()
			expect(calls).toBe(4)
		},
	)

	test(
		lib +
			'array: supports batching array methods automatically [oby]',
		expect => {
			const o = mutable({ value: [1, 2, 3] })

			let calls = 0

			const execute = memo(() => {
				calls += 1
				o.value.forEach(() => {})
			})
			execute()
			expect(calls).toBe(1)

			o.value.forEach((value, index) => {
				// console.log(o.value)
				o.value[index] = value * 2
			})
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'array: treats number and string properties the same way',
		expect => {
			const o = mutable([0])

			let callsNumber = 0
			let callsString = 0

			const execute1 = memo(() => {
				callsNumber += 1
				o[0]
			})
			execute1()
			const execute2 = memo(() => {
				callsString += 1
				o['0']
			})
			execute1(), execute2()

			expect(callsNumber).toBe(1)
			expect(callsString).toBe(1)

			o[0] = 1
			execute1(), execute2()
			expect(callsNumber).toBe(2)
			expect(callsString).toBe(2)

			o['0'] = 2
			execute1(), execute2()
			expect(callsNumber).toBe(3)
			expect(callsString).toBe(3)
		},
	)

	test(
		lib +
			'array: observed value should proxy mutations to original [solid, oby]',
		expect => {
			const original = [{ foo: 1 }, { bar: 2 }]
			const observed = mutable(original)

			// set
			const value = { baz: 3 }
			const result = mutable(value)
			observed[0] = value
			expect(observed[0]).toBe(result)
			expect(isProxy(observed[0])).toBe(true)
			expect(original[0]).not.toBe(value)

			// delete
			delete observed[0]
			expect(observed[0]).toBe(undefined)
			expect(original[0]).toBe(undefined)

			// mutating methods
			observed.push(value)
			expect(observed[2]).toBe(result)
			expect(original[2]).toBe(result)
		},
	)

	test(
		lib + 'array: identity methods should work [solid, oby]',
		expect => {
			let og = {}
			let arr

			function test(value) {
				expect(arr.indexOf(value || og)).toBe(2)
				expect(arr.indexOf(value || og, 3)).toBe(-1)
				expect(arr.includes(value || og)).toBe(true)
				expect(arr.includes(value || og, 3)).toBe(false)
				expect(arr.lastIndexOf(value || og)).toBe(2)
				expect(arr.lastIndexOf(value || og, 1)).toBe(-1)
				expect(arr.lastIndexOf(0)).toBe(6)
			}

			// sanity check, plain objects
			arr = [{}, {}, og, {}, {}, {}, 0]
			test()

			// mutable
			arr = mutable([{}, {}, og, {}, {}, {}, 0])
			test()

			// should work with the proxy
			test(arr[2])

			// one is the proxy, the other is the original object
			expect(arr[2]).not.toBe(og)
		},
	)

	test(lib + 'array: identity methods should be reactive', expect => {
		const obj = {}
		const arr = mutable([obj, {}])

		const search = arr[0]

		let index = -1
		const execute = memo(() => {
			index = arr.indexOf(search)
		})
		execute()
		expect(index).toBe(0)

		arr.reverse()
		execute()
		expect(index).toBe(1)
		/*
			console.log(
				arr,
				search,
				arr[0],
				search === arr[0],
				search === arr[1],
			)*/
	})

	test(
		lib +
			'array: internal array functions should search for the mutable versions of it [solid, oby]',
		expect => {
			const item1 = { id: 1 }
			const item2 = { id: 2 }

			const state = mutable({ items: [] })

			state.items = [...state.items, item1]

			expect(state.items.indexOf(item1)).toBe(0)

			state.items = [...state.items, item2]

			expect(state.items.indexOf(item2)).toBe(1)
		},
	)

	test(
		lib +
			'array: delete on Array should not trigger length dependency',
		expect => {
			const arr = mutable([1, 2, 3])

			let calls = 0
			const execute = memo(() => {
				calls++
				arr.length
			})
			execute()
			expect(calls).toBe(1)

			delete arr[1]
			execute()
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'array: shift on Array should trigger dependency once [oby]',
		expect => {
			const arr = mutable([1, 2, 3])

			let calls = 0
			const execute = memo(() => {
				calls++
				for (let i = 0; i < arr.length; i++) {
					arr[i]
				}
			})
			execute()
			expect(calls).toBe(1)

			arr.shift()
			execute()
			expect(calls).toBe(2)
		},
	)

	//#6018
	test(
		lib +
			'array: edge case: avoid trigger effect in deleteProperty when array length-decrease mutation methods called [oby]',
		expect => {
			const arr = mutable([1])

			let calls = 0
			const execute = memo(() => {
				calls++
				if (arr.length > 0) {
					arr.slice()
				}
			})
			execute()
			expect(calls).toBe(1)

			arr.splice(0)
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'array: add existing index on Array should not trigger length dependency',
		expect => {
			const array = new Array(3)
			const observed = mutable(array)
			let calls = 0
			const execute = memo(() => {
				calls++
				observed.length
			})
			execute()
			expect(calls).toBe(1)

			observed[1] = 1
			execute()
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'array: add non-integer prop on Array should not trigger length dependency',
		expect => {
			const array = new Array(3)
			const observed = mutable(array)
			let calls = 0
			const execute = memo(() => {
				calls++
				observed.length
			})
			execute()
			expect(calls).toBe(1)

			observed.x = 'x'
			execute()
			expect(calls).toBe(1)

			observed[-1] = 'x'
			execute()
			expect(calls).toBe(1)

			observed[NaN] = 'x'
			execute()
			expect(calls).toBe(1)
		},
	)

	// #2427
	test(
		lib + 'array: track length on for ... in iteration',
		expect => {
			const array = mutable([1])
			let length = ''
			const execute = memo(() => {
				length = ''
				for (const key in array) {
					length += key
				}
			})
			execute()
			expect(length).toBe('0')

			array.push(1)
			execute()
			expect(length).toBe('01')
		},
	)

	// #9742
	test(
		lib + 'array: mutation on user proxy of reactive Array',
		expect => {
			const array = mutable([])
			const proxy = new Proxy(array, {})
			proxy.push(1)
			expect(array.length).toBe(1)
			expect(proxy.length).toBe(1)
		},
	)

	test(lib + 'array: should observe iteration', expect => {
		let dummy
		const list = mutable(['Hello'])
		const execute = memo(() => (dummy = list.join(' ')))
		execute()

		expect(dummy).toBe('Hello')

		list.push('World!')
		execute()
		expect(dummy).toBe('Hello World!')

		list.shift()
		execute()
		expect(dummy).toBe('World!')
	})

	test(
		lib + 'array: should observe implicit array length changes [oby]',
		expect => {
			let dummy
			const list = mutable(['Hello'])
			const execute = memo(() => (dummy = list.join(' ')))
			execute()

			expect(dummy).toBe('Hello')

			list[1] = 'World!'
			execute()
			expect(dummy).toBe('Hello World!')

			list[3] = 'Hello!'
			execute()
			expect(dummy).toBe('Hello World!  Hello!')
		},
	)

	test(
		lib + 'array: should observe sparse array mutations',
		expect => {
			let dummy
			const list = mutable([])
			list[1] = 'World!'
			const execute = memo(() => (dummy = list.join(' ')))
			execute()
			expect(dummy).toBe(' World!')

			list[0] = 'Hello'
			execute()
			expect(dummy).toBe('Hello World!')

			list.pop()
			execute()
			expect(dummy).toBe('Hello')
		},
	)

	test(
		lib +
			'array: should not observe well-known symbol keyed properties',
		expect => {
			const key = Symbol.isConcatSpreadable
			let dummy
			const array = mutable([])
			const execute = memo(() => (dummy = array[key]))
			execute()

			expect(array[key]).toBe(undefined)
			expect(dummy).toBe(undefined)

			array[key] = true
			execute()
			expect(array[key]).toBe(true)
			expect(dummy).toBe(true)
		},
	)

	test(
		lib +
			'array: should support manipulating an array while observing symbol keyed properties',
		expect => {
			const key = Symbol()
			let dummy
			const array = mutable([1, 2, 3])
			const execute = memo(() => (dummy = array[key]))
			execute()

			expect(dummy).toBe(undefined)

			array.pop()
			execute()

			array.shift()
			execute()

			array.splice(0, 1)
			execute()

			expect(dummy).toBe(undefined)

			array[key] = 'value'
			execute()

			array.length = 0
			execute()
			expect(dummy).toBe('value')
		},
	)

	test(
		lib +
			'array: should trigger all effects when array length is set to 0 [oby]',
		expect => {
			const observed = mutable([1])

			let length
			const execute1 = memo(() => {
				length = observed.length
			})
			execute1()

			let a
			const execute2 = memo(() => {
				a = observed[0]
			})
			execute2()

			expect(length).toBe(1)
			expect(a).toBe(1)
			// console.log(observed)

			observed[1] = 2
			execute1(), execute2()

			// console.log(observed)
			expect(observed[1]).toBe(2)
			expect(observed.length).toBe(2)
			expect(length).toBe(2)

			observed.unshift(3)
			execute1(), execute2()
			expect(length).toBe(3)
			expect(a).toBe(3)

			observed.length = 0
			execute1(), execute2()
			expect(length).toBe(0)
			expect(a).toBe(undefined)
		},
	)

	test(
		lib +
			'array: identity methods should work if raw value contains reactive objects [oby]',
		expect => {
			const nativearr = []
			const obj = mutable({})
			nativearr.push(obj)

			const reactivearr = mutable(nativearr)
			// console.log(reactivearr, nativearr, obj)
			expect(reactivearr.includes(obj)).toBe(true)
		},
	)

	test(lib + 'array: iterator references', expect => {
		const item = { a: 1 }

		const obj = mutable([item, item])

		let count = 0
		let calls = 0
		const execute = memo(() => {
			calls++
			for (const key in obj) {
				count += obj.includes(obj[key]) ? 1 : 0
			}
			expect(count).toBe(2)

			for (const key in obj) {
				count += obj.indexOf(obj[key]) !== -1 ? 1 : 0
			}
			expect(count).toBe(4)

			for (const item of obj) {
				count += obj.includes(item) ? 1 : 0
			}
			expect(count).toBe(6)

			for (const item of obj) {
				count += obj.indexOf(item) !== -1 ? 1 : 0
			}
			expect(count).toBe(8)

			for (const item of obj.values()) {
				count += obj.includes(item) ? 1 : 0
			}
			expect(count).toBe(10)

			for (const item of obj.values()) {
				count += obj.indexOf(item) !== -1 ? 1 : 0
			}
			expect(count).toBe(12)

			for (const [k, item] of obj.entries()) {
				count += obj.includes(item) ? 1 : 0
			}
			expect(count).toBe(14)

			for (const [k, item] of obj.entries()) {
				count += obj.indexOf(item) !== -1 ? 1 : 0
			}
			expect(count).toBe(16)
		})
		execute()

		expect(calls).toBe(1)

		expect(count).toBe(16)

		expect(calls).toBe(1)
	})

	test(
		lib +
			'array: should avoid infinite recursive loops when use Array.prototype.push/unshift/pop/shift [solid, oby]',
		expect => {
			;['push', 'unshift'].forEach(key => {
				const arr = mutable([])
				let calls1 = 0
				let calls2 = 0
				const execute1 = memo(() => {
					calls1++
					arr[key](1)
				})
				execute1()
				const execute2 = memo(() => {
					calls2++
					arr[key](2)
				})
				execute2()
				expect(arr.length).toBe(2)
				expect(calls1).toBe(1)
				expect(calls2).toBe(1)
			})
			;['pop', 'shift'].forEach(key => {
				const arr = mutable([1, 2, 3, 4])
				let calls1 = 0
				let calls2 = 0
				const execute1 = memo(() => {
					calls1++
					arr[key]()
				})
				execute1()
				const execute2 = memo(() => {
					calls2++
					arr[key]()
				})
				execute2()
				expect(arr.length).toBe(2)
				expect(calls1).toBe(1)
				expect(calls2).toBe(1)
			})
		},
	)

	/* vue array instrumentation https://github.com/vuejs/core/pull/9511/files */

	test(lib + 'array: vue array instrumentation: iterator', expect => {
		const shallow = mutable([1, 2, 3, 4])
		let result = memo(() => {
			let sum = 0
			for (let x of shallow) {
				sum += x ** 2
			}
			return sum
		})
		expect(result()).toBe(30)

		shallow[2] = 0
		expect(result()).toBe(21)

		const deep = mutable([{ val: 1 }, { val: 2 }])
		result = memo(() => {
			let sum = 0
			for (let x of deep) {
				sum += x.val ** 2
			}
			return sum
		})
		expect(result()).toBe(5)

		deep[1].val = 3
		expect(result()).toBe(10)
	})

	test(lib + 'array: vue array instrumentation: concat', expect => {
		batch(() => {
			const a1 = mutable([1, { val: 2 }])
			const a2 = mutable([{ val: 3 }])
			const a3 = [4, 5]

			let result = memo(() => a1.concat(a2, a3))
			expect(result()).toHaveShape([1, { val: 2 }, { val: 3 }, 4, 5])
			expect(isProxy(result()[1])).toBe(true)
			expect(isProxy(result()[2])).toBe(true)

			a1.shift()
			expect(result()).toHaveShape([{ val: 2 }, { val: 3 }, 4, 5])

			a2.pop()
			expect(result()).toHaveShape([{ val: 2 }, 4, 5])

			a3.pop()
			expect(result()).toHaveShape([{ val: 2 }, 4])
		})
	})

	test(lib + 'array: vue array instrumentation: entries', expect => {
		const shallow = mutable([0, 1])
		const result1 = memo(() => Array.from(shallow.entries()))
		expect(result1()).toHaveShape([
			[0, 0],
			[1, 1],
		])

		shallow[1] = 10
		expect(result1()).toHaveShape([
			[0, 0],
			[1, 10],
		])

		const deep = mutable([{ val: 0 }, { val: 1 }])
		const result2 = memo(() => Array.from(deep.entries()))
		expect(result2()).toHaveShape([
			[0, { val: 0 }],
			[1, { val: 1 }],
		])
		expect(isProxy(result2()[0][1])).toBe(true)

		deep.pop()
		expect(Array.from(result2())).toHaveShape([[0, { val: 0 }]])
	})

	test(lib + 'array: vue array instrumentation: every', expect => {
		const shallow = mutable([1, 2, 5])
		let result = memo(() => shallow.every(x => x < 5))
		expect(result()).toBe(false)

		shallow.pop()
		expect(result()).toBe(true)

		const deep = mutable([{ val: 1 }, { val: 5 }])
		result = memo(() => deep.every(x => x.val < 5))
		expect(result()).toBe(false)

		deep[1].val = 2
		expect(result()).toBe(true)
	})

	test(lib + 'array: vue array instrumentation: filter', expect => {
		const shallow = mutable([1, 2, 3, 4])
		const result1 = memo(() => shallow.filter(x => x < 3))
		expect(result1()).toHaveShape([1, 2])

		shallow[2] = 0
		expect(result1()).toHaveShape([1, 2, 0])

		const deep = mutable([{ val: 1 }, { val: 2 }])
		const result2 = memo(() => deep.filter(x => x.val < 2))
		expect(result2()).toHaveShape([{ val: 1 }])
		expect(isProxy(result2()[0])).toBe(true)

		deep[1].val = 0
		expect(result2()).toHaveShape([{ val: 1 }, { val: 0 }])
	})

	test(
		lib + 'array: vue array instrumentation: find and co.',
		expect => {
			const _reactive = mutable([{ val: 1 }, { val: 2 }])

			let find = memo(() => _reactive.find(x => x.val === 2))
			// @ts-expect-error tests are not limited to es2016
			let findLast = memo(() => _reactive.findLast(x => x.val === 2))
			let findIndex = memo(() =>
				_reactive.findIndex(x => x.val === 2),
			)
			let findLastIndex = memo(() =>
				// @ts-expect-error tests are not limited to es2016
				_reactive.findLastIndex(x => x.val === 2),
			)

			expect(find()).toBe(_reactive[1])
			expect(isProxy(find())).toBe(true)
			expect(findLast()).toBe(_reactive[1])
			expect(isProxy(findLast())).toBe(true)
			expect(findIndex()).toBe(1)
			expect(findLastIndex()).toBe(1)

			_reactive[1].val = 0

			expect(find()).not.toBe(_reactive[1])
			expect(findLast()).not.toBe(_reactive[1])
			expect(findIndex()).toBe(-1)
			expect(findLastIndex()).toBe(-1)

			_reactive.pop()

			expect(find()).toBe(undefined)
			expect(findLast()).toBe(undefined)
			expect(findIndex()).toBe(-1)
			expect(findLastIndex()).toBe(-1)

			const deep = mutable([{ val: 1 }, { val: 2 }])
			find = memo(() => deep.find(x => x.val === 2))
			// @ts-expect-error tests are not limited to es2016
			findLast = memo(() => deep.findLast(x => x.val === 2))
			findIndex = memo(() => deep.findIndex(x => x.val === 2))
			// @ts-expect-error tests are not limited to es2016
			findLastIndex = memo(() => deep.findLastIndex(x => x.val === 2))

			expect(find()).toBe(deep[1])
			expect(isProxy(find())).toBe(true)
			expect(findLast()).toBe(deep[1])
			expect(isProxy(findLast())).toBe(true)
			expect(findIndex()).toBe(1)
			expect(findLastIndex()).toBe(1)

			deep[1].val = 0

			expect(find()).toBe(undefined)
			expect(findLast()).toBe(undefined)
			expect(findIndex()).toBe(-1)
			expect(findLastIndex()).toBe(-1)
		},
	)

	test(lib + 'array: vue array instrumentation: forEach', expect => {
		const shallow = mutable([1, 2, 3, 4])
		let result = memo(() => {
			let sum = 0
			shallow.forEach(x => (sum += x ** 2))
			return sum
		})
		expect(result()).toBe(30)

		shallow[2] = 0
		expect(result()).toBe(21)

		const deep = mutable([{ val: 1 }, { val: 2 }])
		result = memo(() => {
			let sum = 0
			deep.forEach(x => (sum += x.val ** 2))
			return sum
		})
		expect(result()).toBe(5)

		deep[1].val = 3
		expect(result()).toBe(10)
	})

	test(lib + 'array: vue array instrumentation: join', expect => {
		function toString() {
			return this.val
		}
		const shallow = mutable([
			{ val: 1, toString },
			{ val: 2, toString },
		])
		let result = memo(() => shallow.join('+'))
		expect(result()).toBe('1+2')

		shallow[1].val = 23
		expect(result()).toBe('1+23')

		shallow.pop()
		expect(result()).toBe('1')

		const deep = mutable([
			{ val: 1, toString },
			{ val: 2, toString },
		])
		result = memo(() => deep.join())
		expect(result()).toBe('1,2')

		deep[1].val = 23
		expect(result()).toBe('1,23')
	})

	test(lib + 'array: vue array instrumentation: map', expect => {
		const shallow = mutable([1, 2, 3, 4])
		let result = memo(() => shallow.map(x => x ** 2))
		expect(result()).toHaveShape([1, 4, 9, 16])

		shallow[2] = 0
		expect(result()).toHaveShape([1, 4, 0, 16])

		const deep = mutable([{ val: 1 }, { val: 2 }])
		result = memo(() => deep.map(x => x.val ** 2))
		expect(result()).toHaveShape([1, 4])

		deep[1].val = 3
		expect(result()).toHaveShape([1, 9])
	})

	test(
		lib + 'array: vue array instrumentation: reduce left and right',
		expect => {
			function toString() {
				return this.val + '-'
			}
			const reactive = mutable([
				{ val: 1, toString },
				{ val: 2, toString },
			])

			expect(
				reactive.reduce((acc, x) => acc + '' + x.val, undefined),
			).toBe('undefined12')

			let left = memo(() =>
				reactive.reduce((acc, x) => acc + '' + x.val),
			)
			let right = memo(() =>
				reactive.reduceRight((acc, x) => acc + '' + x.val),
			)
			expect(left()).toBe('1-2')
			expect(right()).toBe('2-1')

			reactive[1].val = 23
			expect(left()).toBe('1-23')
			expect(right()).toBe('23-1')

			reactive.pop()
			expect(left()).toBe(reactive[0])
			expect(right()).toBe(reactive[0])

			const deep = mutable([{ val: 1 }, { val: 2 }])
			left = memo(() => deep.reduce((acc, x) => acc + x.val, '0'))
			right = memo(() =>
				deep.reduceRight((acc, x) => acc + x.val, '3'),
			)
			expect(left()).toBe('012')
			expect(right()).toBe('321')

			deep[1].val = 23
			expect(left()).toBe('0123')
			expect(right()).toBe('3231')
		},
	)

	test(lib + 'array: vue array instrumentation: some', expect => {
		const shallow = mutable([1, 2, 5])
		let result = memo(() => shallow.some(x => x > 4))
		expect(result()).toBe(true)

		shallow.pop()
		expect(result()).toBe(false)

		const deep = mutable([{ val: 1 }, { val: 5 }])
		result = memo(() => deep.some(x => x.val > 4))
		expect(result()).toBe(true)

		deep[1].val = 2
		expect(result()).toBe(false)
	})

	// Node 20+
	test(
		lib + 'array: vue array instrumentation: toReversed',
		expect => {
			// mutable
			const array = mutable([1, { val: 2 }])
			const result = memo(() => array.toReversed())
			expect(result()).toHaveShape([{ val: 2 }, 1])
			expect(isProxy(result()[0])).toBe(true)
			expect(result()[0]).toHaveShape({ val: 2 })

			array.splice(1, 1, 2)
			expect(result()).toHaveShape([2, 1])
		},
	)

	// Node 20+
	test(lib + 'array: vue array instrumentation: toSorted', expect => {
		// No comparer

		expect(mutable([2, 1, 3]).toSorted()).toHaveShape([1, 2, 3])

		const r = mutable([{ val: 2 }, { val: 1 }, { val: 3 }])
		let result

		result = memo(() => r.toSorted((a, b) => a.val - b.val))
		expect(result().map(x => x.val)).toHaveShape([1, 2, 3])
		expect(isProxy(result()[0])).toBe(true)

		r[0].val = 4
		expect(result().map(x => x.val)).toHaveShape([1, 3, 4])

		r.pop()
		expect(result().map(x => x.val)).toHaveShape([1, 4])

		const deep = mutable([{ val: 2 }, { val: 1 }, { val: 3 }])

		result = memo(() => deep.toSorted((a, b) => a.val - b.val))
		expect(result().map(x => x.val)).toHaveShape([1, 2, 3])
		expect(isProxy(result()[0])).toBe(true)

		deep[0].val = 4
		expect(result().map(x => x.val)).toHaveShape([1, 3, 4])
	})

	// Node 20+

	test(
		lib + 'array: vue array instrumentation: toSpliced',
		expect => {
			const array = mutable([1, 2, 3])
			expect(array).toHaveShape([1, 2, 3])

			const result = memo(() => array.toSpliced(1, 1, -2))
			expect(result()).toHaveShape([1, -2, 3])

			expect(array).toHaveShape([1, 2, 3])

			array[0] = 0
			expect(array).toHaveShape([0, 2, 3])

			expect(result()).toHaveShape([0, -2, 3])

			expect(array).toHaveShape([0, 2, 3])
		},
	)

	test(lib + 'array: vue array instrumentation: values', expect => {
		const reactive = mutable([{ val: 1 }, { val: 2 }])
		const result = memo(() => Array.from(reactive.values()))
		expect(result()).toHaveShape([{ val: 1 }, { val: 2 }])
		expect(isProxy(result()[0])).toBe(true)

		reactive.pop()
		expect(result()).toHaveShape([{ val: 1 }])

		const deep = mutable([{ val: 1 }, { val: 2 }])
		const firstItem = Array.from(deep.values())[0]
		expect(isProxy(firstItem)).toBe(true)
	})

	// map

	if (supportsMap) {
		// vue

		test(lib + 'Map: instanceof', expect => {
			const original = new Map()
			const observed = mutable(original)
			const observed2 = mutable({ value: original })
			const observed3 = mutable([original])

			expect(original instanceof Map).toBe(true)
			expect(observed instanceof Map).toBe(true)
			expect(observed2.value instanceof Map).toBe(true)
			expect(observed3[0] instanceof Map).toBe(true)

			expect(isProxy(original)).toBe(false)
			expect(isProxy(observed)).toBe(true)
			expect(isProxy(observed2.value)).toBe(true)
			expect(isProxy(observed3[0])).toBe(true)
		})

		test(lib + 'Map: should observe mutations', expect => {
			let dummy
			const map = mutable(new Map())
			const execute = memo(() => {
				dummy = map.get('key')
			})
			execute()

			expect(dummy).toBe(undefined)
			map.set('key', 'value')
			execute()

			expect(dummy).toBe('value')
			map.set('key', 'value2')
			execute()

			expect(dummy).toBe('value2')
			map.delete('key')
			execute()

			expect(dummy).toBe(undefined)
		})

		test(
			lib +
				'Map: should observe mutations with observed value as key',
			expect => {
				let dummy
				const key = mutable({})
				const value = mutable({})
				const map = mutable(new Map())
				const execute = memo(() => {
					dummy = map.get(key)
				})
				execute()

				expect(dummy).toBe(undefined)
				map.set(key, value)
				execute()

				expect(dummy).toBe(value)
				map.delete(key)
				execute()

				expect(dummy).toBe(undefined)
			},
		)

		test(lib + 'Map: should observe size mutations', expect => {
			let dummy
			const map = mutable(new Map())
			const execute = memo(() => (dummy = map.size))
			execute()

			expect(dummy).toBe(0)

			map.set('key1', 'value')
			execute()

			map.set('key2', 'value2')
			execute()
			expect(dummy).toBe(2)

			map.delete('key1')
			execute()
			expect(dummy).toBe(1)

			map.clear()
			execute()
			expect(dummy).toBe(0)
		})

		test(lib + 'Map: should observe for of iteration', expect => {
			let dummy
			const map = mutable(new Map())
			const execute = memo(() => {
				dummy = 0
				for (let [key, num] of map) {
					key
					dummy += num
				}
			})
			execute()

			expect(dummy).toBe(0)
			map.set('key1', 3)
			execute()

			expect(dummy).toBe(3)
			map.set('key2', 2)
			execute()

			expect(dummy).toBe(5)

			// iteration should track mutation of existing entries (#709)
			map.set('key1', 4)
			execute()
			expect(dummy).toBe(6)

			map.delete('key1')
			execute()
			expect(dummy).toBe(2)

			map.clear()
			execute()
			expect(dummy).toBe(0)
		})

		test(lib + 'Map: should observe forEach iteration', expect => {
			let dummy
			const map = mutable(new Map())
			const execute = memo(() => {
				dummy = 0
				map.forEach(num => (dummy += num))
			})
			execute()

			expect(dummy).toBe(0)
			map.set('key1', 3)
			execute()

			expect(dummy).toBe(3)
			map.set('key2', 2)
			execute()

			expect(dummy).toBe(5)
			// iteration should track mutation of existing entries (#709)
			map.set('key1', 4)
			execute()

			expect(dummy).toBe(6)
			map.delete('key1')
			execute()

			expect(dummy).toBe(2)
			map.clear()
			execute()

			expect(dummy).toBe(0)
		})

		test(lib + 'Map: should observe keys iteration', expect => {
			let dummy
			const map = mutable(new Map())
			const execute = memo(() => {
				dummy = 0
				for (let key of map.keys()) {
					dummy += key
				}
			})
			execute()

			expect(dummy).toBe(0)
			map.set(3, 3)
			execute()

			expect(dummy).toBe(3)
			map.set(2, 2)
			execute()

			expect(dummy).toBe(5)
			map.delete(3)
			execute()

			expect(dummy).toBe(2)
			map.clear()
			execute()

			expect(dummy).toBe(0)
		})

		test(lib + 'Map: should observe values iteration', expect => {
			let dummy
			const map = mutable(new Map())
			const execute = memo(() => {
				dummy = 0
				for (let num of map.values()) {
					dummy += num
				}
			})
			execute()
			expect(dummy).toBe(0)

			map.set('key1', 3)
			execute()
			expect(dummy).toBe(3)

			map.set('key2', 2)
			execute()
			expect(dummy).toBe(5)

			// iteration should track mutation of existing entries (#709)
			map.set('key1', 4)
			execute()
			expect(dummy).toBe(6)

			map.delete('key1')
			execute()
			expect(dummy).toBe(2)

			map.clear()
			execute()
			expect(dummy).toBe(0)
		})

		test(lib + 'Map: should observe entries iteration', expect => {
			let dummy
			let dummy2
			const map = mutable(new Map())
			const execute = memo(() => {
				dummy = ''
				dummy2 = 0
				for (let [key, num] of map.entries()) {
					dummy += key
					dummy2 += num
				}
			})
			execute()

			expect(dummy).toBe('')
			expect(dummy2).toBe(0)
			map.set('key1', 3)
			execute()

			expect(dummy).toBe('key1')
			expect(dummy2).toBe(3)
			map.set('key2', 2)
			execute()

			expect(dummy).toBe('key1key2')
			expect(dummy2).toBe(5)
			// iteration should track mutation of existing entries (#709)
			map.set('key1', 4)
			execute()

			expect(dummy).toBe('key1key2')
			expect(dummy2).toBe(6)
			map.delete('key1')
			execute()

			expect(dummy).toBe('key2')
			expect(dummy2).toBe(2)
			map.clear()
			execute()

			expect(dummy).toBe('')
			expect(dummy2).toBe(0)
		})

		test(lib + 'Map: should be triggered by clearing', expect => {
			let dummy
			const map = mutable(new Map())
			const execute = memo(() => (dummy = map.get('key')))

			expect(dummy).toBe(undefined)
			map.set('key', 3)
			execute()

			expect(dummy).toBe(3)
			map.clear()
			execute()

			expect(dummy).toBe(undefined)
		})

		test(
			lib + 'Map: should observe custom property mutations',
			expect => {
				let dummy
				const map = mutable(new Map())
				const execute = memo(() => (dummy = map.customProp))
				execute()

				expect(dummy).toBe(undefined)
				map.customProp = 'Hello World'
				execute()

				expect(dummy).toBe('Hello World')
			},
		)

		test(
			lib + 'Map: should not observe non value changing mutations',
			expect => {
				let dummy
				const map = mutable(new Map())
				let calls = 0
				const execute = memo(() => {
					calls++
					dummy = map.get('key')
				})
				execute()

				expect(dummy).toBe(undefined)
				expect(calls).toBe(1)

				map.set('key', undefined)
				execute()
				expect(dummy).toBe(undefined)
				expect(calls).toBe(1)

				map.set('key', 'value')
				execute()
				expect(dummy).toBe('value')
				expect(calls).toBe(2)

				map.set('key', 'value')
				execute()
				expect(dummy).toBe('value')
				expect(calls).toBe(2)

				map.set('key', undefined)
				execute()
				expect(dummy).toBe(undefined)
				expect(calls).toBe(3)

				map.delete('key')
				execute()
				expect(dummy).toBe(undefined)
				expect(calls).toBe(3)

				map.delete('key')
				execute()
				expect(dummy).toBe(undefined)
				expect(calls).toBe(3)

				map.clear()
				execute()
				expect(dummy).toBe(undefined)
				expect(calls).toBe(3)
			},
		)

		test(
			lib + 'Map: should not pollute original Map with Proxies',
			expect => {
				const map = new Map()
				const observed = mutable(map)
				const original = {}
				const value = mutable(original)
				observed.set('key', value)
				expect(map.get('key')).toBe(value)
				expect(map.get('key')).not.toBe(original)
			},
		)

		test(
			lib +
				'Map: should return observable versions of contained values',
			expect => {
				const observed = mutable(new Map())
				const value = {}
				observed.set('key', value)
				const wrapped = observed.get('key')
				expect(wrapped).not.toBe(value)
			},
		)

		test(lib + 'Map: should observed nested data', expect => {
			const observed = mutable(new Map())
			observed.set('key', { a: 1 })
			let dummy
			const execute = memo(() => {
				dummy = observed.get('key').a
			})
			execute()

			observed.get('key').a = 2
			expect(dummy).toBe(2)
		})

		test(
			lib +
				'Map: should observe nested values in iterations (forEach)',
			expect => {
				const map = mutable(new Map([[1, { foo: 1 }]]))
				let dummy
				const execute = memo(() => {
					dummy = 0
					map.forEach(value => {
						dummy += value.foo
					})
				})
				execute()

				expect(dummy).toBe(1)
				map.get(1).foo++
				expect(dummy).toBe(2)
			},
		)

		test(
			lib +
				'Map: should observe nested values in iterations (values)',
			expect => {
				const map = mutable(new Map([[1, { foo: 1 }]]))
				let dummy
				const execute = memo(() => {
					dummy = 0
					for (const value of map.values()) {
						dummy += value.foo
					}
				})
				execute()

				expect(dummy).toBe(1)
				map.get(1).foo++
				expect(dummy).toBe(2)
			},
		)

		test(
			lib +
				'Map: should observe nested values in iterations (entries)',
			expect => {
				const key = {}
				const map = mutable(new Map([[key, { foo: 1 }]]))
				let dummy
				const execute = memo(() => {
					dummy = 0
					for (const [key, value] of map.entries()) {
						key

						dummy += value.foo
					}
				})
				execute()

				expect(dummy).toBe(1)
				map.get(key).foo++
				expect(dummy).toBe(2)
			},
		)

		test(
			lib +
				'Map: should observe nested values in iterations (for...of)',
			expect => {
				const key = {}
				const map = mutable(new Map([[key, { foo: 1 }]]))
				let dummy
				const execute = memo(() => {
					dummy = 0
					for (const [key, value] of map) {
						key

						dummy += value.foo
					}
				})
				execute()

				expect(dummy).toBe(1)
				map.get(key).foo++
				expect(dummy).toBe(2)
			},
		)

		test(
			lib +
				'Map: should not be trigger when the value and the old value both are NaN',
			expect => {
				const map = mutable(new Map([['foo', NaN]]))
				let calls = 0
				const execute = memo(() => {
					calls++
					map.get('foo')
				})
				execute()

				map.set('foo', NaN)
				execute()

				expect(calls).toBe(1)
			},
		)

		test(
			lib + 'Map: should work with reactive keys in raw map',
			expect => {
				const raw = new Map()
				const key = mutable({})
				raw.set(key, 1)
				const map = mutable(raw)

				expect(map.has(key)).toBe(true)
				expect(map.get(key)).toBe(1)

				expect(map.delete(key)).toBe(true)
				expect(map.has(key)).toBe(false)
				expect(map.get(key)).toBe(undefined)
			},
		)

		test(
			lib + 'Map: should track set of mutable keys in raw map',
			expect => {
				const raw = new Map()
				const key = mutable({})
				raw.set(key, 1)
				const map = mutable(raw)

				let dummy
				const execute = memo(() => {
					dummy = map.get(key)
				})
				execute()

				expect(dummy).toBe(1)

				map.set(key, 2)
				execute()

				expect(dummy).toBe(2)
			},
		)

		test(
			lib + 'Map: should track deletion of reactive keys in raw map',
			expect => {
				const raw = new Map()
				const key = mutable({})
				raw.set(key, 1)
				const map = mutable(raw)

				let dummy
				const execute = memo(() => {
					dummy = map.has(key)
				})
				execute()

				expect(dummy).toBe(true)

				map.delete(key)
				execute()

				expect(dummy).toBe(false)
			},
		)

		// #877
		test(
			lib +
				'Map: should not trigger key iteration when setting existing keys ',
			expect => {
				const map = mutable(new Map())

				let calls = 0
				const execute = memo(() => {
					calls++
					const keys = []
					for (const key of map.keys()) {
						keys.push(key)
					}
				})
				execute()
				expect(calls).toBe(1)

				map.set('a', 0)
				execute()
				expect(calls).toBe(2)

				map.set('b', 0)
				execute()
				expect(calls).toBe(3)

				// keys didn't change, should not trigger
				map.set('b', 1)
				execute()

				expect(calls).toBe(3)
			},
		)

		test(
			lib + 'Map: should return proxy from Map.set call ',
			expect => {
				const map = mutable(new Map())
				const result = map.set('a', 'a')
				expect(result).toBe(map)
			},
		)

		test(
			lib +
				'Map: observing subtypes of IterableCollections(Map, Set)',
			expect => {
				// subtypes of Map
				class CustomMap extends Map {}
				const cmap = mutable(new CustomMap())

				expect(cmap instanceof Map).toBe(true)

				const val = {}
				cmap.set('key', val)
				expect(isProxy(cmap.get('key'))).toBe(true)
				expect(cmap.get('key')).not.toBe(val)
			},
		)

		test(
			lib +
				'Map: observing subtypes of IterableCollections(Map, Set) deep',
			expect => {
				// subtypes of Map
				class CustomMap extends Map {}
				const cmap = mutable({ value: new CustomMap() })

				expect(cmap.value instanceof Map).toBe(true)

				const val = {}
				cmap.value.set('key', val)
				expect(isProxy(cmap.value.get('key'))).toBe(true)
				expect(cmap.value.get('key')).not.toBe(val)
			},
		)

		test(
			lib + 'Map: should work with observed value as key',
			expect => {
				const key = mutable({})
				const m = mutable(new Map())
				m.set(key, 1)
				const roM = m

				let calls = 0
				const execute = memo(() => {
					calls++
					roM.get(key)
				})
				execute()

				expect(calls).toBe(1)
				m.set(key, 1)
				execute()

				expect(calls).toBe(1)
				m.set(key, 2)
				execute()

				expect(calls).toBe(2)
			},
		)

		// solid-primitives

		test(lib + 'Map: behaves like a Map', expect => {
			const obj1 = {}
			const obj2 = {}

			const map = mutable(
				new Map([
					[obj1, 123],
					[1, 'foo'],
				]),
			)

			expect(map.has(obj1)).toBe(true)
			expect(map.has(1)).toBe(true)
			expect(map.has(2)).toBe(false)

			expect(map.get(obj1)).toBe(123)
			expect(map.get(1)).toBe('foo')

			map.set(obj2, 'bar')
			expect(map.get(obj2)).toBe('bar')
			map.set(obj1, 'change')
			expect(map.get(obj1)).toBe('change')

			expect(map.delete(obj2)).toBe(true)
			expect(map.has(obj2)).toBe(false)

			expect(map.size).toBe(2)
			map.clear()
			expect(map.size).toBe(0)

			expect(map instanceof Map).toBe(true)
		})

		test(lib + 'Map: has() is reactive', expect => {
			const map = mutable(
				new Map([
					[1, {}],
					[1, {}],
					[2, {}],
					[3, {}],
				]),
			)

			const captured = []
			const execute = memo(() => {
				captured.push(map.has(2))
			})
			execute()

			expect(captured).toHaveShape([true])

			map.set(4, {})
			expect(captured).toHaveShape([true])

			map.delete(4)
			expect(captured).toHaveShape([true])

			map.delete(2)
			expect(captured).toHaveShape([true, false])

			map.set(2, {})
			expect(captured).toHaveShape([true, false, true])

			map.clear()
			expect(captured).toHaveShape([true, false, true, false])
		})

		test(lib + 'Map: get() is reactive', expect => {
			const obj1 = {}
			const obj2 = {}
			const obj3 = {}
			const obj4 = {}

			const map = mutable(
				new Map([
					[1, obj1],
					[1, obj2],
					[2, obj3],
					[3, obj4],
				]),
			)

			let calls = 0
			let dummy
			const execute = memo(() => {
				calls++
				dummy = map.get(2)
			})
			execute()

			map.set(4, {})
			expect(calls).toBe(1)

			map.delete(4)
			expect(calls).toBe(1)

			map.delete(2)
			expect(dummy).toBe(undefined)
			expect(calls).toBe(2)

			map.set(2, obj4)
			expect(dummy).toBe(mutable(obj4))

			map.set(2, obj4)
			expect(calls).toBe(3)

			map.clear()
			expect(dummy).toBe(undefined)
			expect(calls).toBe(4)
		})

		test(lib + 'Map: spread values is reactive', expect => {
			const map = mutable(
				new Map([
					[1, 'a'],
					[1, 'b'],
					[2, 'c'],
					[3, 'd'],
				]),
			)

			const captured = []

			const execute = memo(() => captured.push([...map.values()]))
			execute()

			expect(captured.length).toBe(1)
			expect(captured[0]).toHaveShape(['b', 'c', 'd'])

			map.set(4, 'e')
			expect(captured.length).toBe(2)
			expect(captured[1]).toHaveShape(['b', 'c', 'd', 'e'])

			map.set(4, 'e')
			expect(captured.length).toBe(2)

			map.delete(4)
			expect(captured.length).toBe(3)
			expect(captured[2]).toHaveShape(['b', 'c', 'd'])

			map.delete(2)
			expect(captured.length).toBe(4)
			expect(captured[3]).toHaveShape(['b', 'd'])

			map.delete(2)
			expect(captured.length).toBe(4)

			map.set(2, 'a')
			expect(captured.length).toBe(5)
			expect(captured[4]).toHaveShape(['b', 'd', 'a'])

			map.set(2, 'b')
			expect(captured.length).toBe(6)
			expect(captured[5]).toHaveShape(['b', 'd', 'b'])

			map.clear()
			expect(captured.length).toBe(7)
			expect(captured[6]).toHaveShape([])
		})

		test(lib + 'Map: .size is reactive', expect => {
			const map = mutable(
				new Map([
					[1, {}],
					[1, {}],
					[2, {}],
					[3, {}],
				]),
			)

			const captured = []
			const execute = memo(() => {
				captured.push(map.size)
			})
			execute()

			expect(captured.length).toBe(1)
			expect(captured[0]).toBe(3)

			map.set(4, {})
			expect(captured.length).toBe(2)
			expect(captured[1]).toBe(4)

			map.delete(4)
			expect(captured.length).toBe(3)
			expect(captured[2]).toBe(3)

			map.delete(2)
			expect(captured.length).toBe(4)
			expect(captured[3]).toBe(2)

			map.delete(2)
			expect(captured.length).toBe(4)

			map.set(2, {})
			expect(captured.length).toBe(5)
			expect(captured[4]).toBe(3)

			map.set(2, {})
			expect(captured.length).toBe(5)

			map.clear()
			expect(captured.length).toBe(6)
			expect(captured[5]).toBe(0)
		})

		test(lib + 'Map: .keys() is reactive', expect => {
			const map = mutable(
				new Map([
					[1, 'a'],
					[2, 'b'],
					[3, 'c'],
					[4, 'd'],
				]),
			)

			const captured = []

			const execute = memo(() => {
				const run = []
				for (const key of map.keys()) {
					run.push(key)
					if (key === 3) break // don't iterate over all keys
				}
				captured.push(run)
			})
			execute()

			expect(captured.length).toBe(1)
			expect(captured[0]).toHaveShape([1, 2, 3])

			map.set(1)
			expect(captured.length).toBe(1)

			map.set(5)
			expect(captured.length).toBe(1)

			map.delete(1)
			expect(captured.length).toBe(2)
			expect(captured[1]).toHaveShape([2, 3])
		})

		test(lib + 'Map: .values() is reactive', expect => {
			const map = mutable(
				new Map([
					[1, 'a'],
					[2, 'b'],
					[3, 'c'],
					[4, 'd'],
				]),
			)

			const captured = []

			const execute = memo(() => {
				const run = []
				let i = 0
				for (const v of map.values()) {
					run.push(v)
					if (i === 2) break // don't iterate over all keys
					i += 1
				}
				captured.push(run)
			})
			execute()

			expect(captured.length).toBe(1)
			expect(captured[0]).toHaveShape(['a', 'b', 'c'])

			map.set(1, 'e')
			expect(captured.length).toBe(2)
			expect(captured[1]).toHaveShape(['e', 'b', 'c'])

			map.set(4, 'f')
			expect(captured.length).toBe(2)

			map.delete(4)
			expect(captured.length).toBe(2)

			map.delete(1)
			expect(captured.length).toBe(3)
			expect(captured[2]).toHaveShape(['b', 'c'])
		})

		test(lib + 'Map: .entries() is reactive', expect => {
			const map = mutable(
				new Map([
					[1, 'a'],
					[2, 'b'],
					[3, 'c'],
					[4, 'd'],
				]),
			)

			const captured = []

			const execute = memo(() => {
				const run = []
				let i = 0
				for (const e of map.entries()) {
					run.push(e)
					if (i === 2) break // don't iterate over all keys
					i += 1
				}
				captured.push(run)
			})
			execute()

			expect(captured.length).toBe(1)
			expect(captured[0]).toHaveShape([
				[1, 'a'],
				[2, 'b'],
				[3, 'c'],
			])

			map.set(1, 'e')
			expect(captured.length).toBe(2)
			expect(captured[1]).toHaveShape([
				[1, 'e'],
				[2, 'b'],
				[3, 'c'],
			])

			map.set(4, 'f')
			expect(captured.length).toBe(2)

			map.delete(4)
			expect(captured.length).toBe(2)

			map.delete(1)
			expect(captured.length).toBe(3)
			expect(captured[2]).toHaveShape([
				[2, 'b'],
				[3, 'c'],
			])
		})

		test(lib + 'Map: .forEach() is reactive', expect => {
			const map = mutable(
				new Map([
					[1, 'a'],
					[2, 'b'],
					[3, 'c'],
					[4, 'd'],
				]),
			)

			const captured = []

			const execute = memo(() => {
				const run = []
				map.forEach((v, k) => {
					run.push([k, v])
				})
				captured.push(run)
			})
			execute()

			expect(captured.length).toBe(1)
			expect(captured[0]).toHaveShape([
				[1, 'a'],
				[2, 'b'],
				[3, 'c'],
				[4, 'd'],
			])

			map.set(1, 'e')
			expect(captured.length).toBe(2)
			expect(captured[1]).toHaveShape([
				[1, 'e'],
				[2, 'b'],
				[3, 'c'],
				[4, 'd'],
			])

			map.delete(4)
			expect(captured.length).toBe(3)
			expect(captured[2]).toHaveShape([
				[1, 'e'],
				[2, 'b'],
				[3, 'c'],
			])
		})
	}
	// misc 2

	test(
		lib + 'misc 2: avoids type confusion with inherited properties',
		expect => {
			class Test4 {
				a = 13
				get b() {
					return this.a * 4
				}
				get myA() {
					return this.a
				}
				set myA(value) {
					this.a = value
				}
			}
			class Test3 extends Test4 {}
			class Tests2 extends Test3 {
				a = 1
			}
			class Test extends Tests2 {}

			const m = mutable(new Test())

			let calls = 0
			const execute = memo(() => {
				m.b
				calls++
			})
			execute()

			const increment = () => {
				m.a++
				execute()
			}

			// initial
			expect(m.a).toBe(1)
			expect(m.b).toBe(4)
			expect(m.myA).toBe(1)
			expect(calls).toBe(1)

			// incrementing
			increment()
			expect(m.a).toBe(2)
			expect(m.b).toBe(8)
			expect(m.myA).toBe(2)
			expect(calls).toBe(2)

			increment()
			expect(m.a).toBe(3)
			expect(m.b).toBe(12)
			expect(m.myA).toBe(3)
			expect(calls).toBe(3)
		},
	)

	// misc

	test(lib + 'misc 2: doesnt change keys', expect => {
		let result

		// object
		result = mutable({})
		expect(Object.keys(result).length).toBe(0)

		// array
		result = mutable([])
		expect(Object.keys(result).length).toBe(0)

		// deep object
		result = mutable({ value: {} })
		expect(Object.keys(result.value).length).toBe(0)

		// deep array
		result = mutable({ value: [] })
		expect(Object.keys(result.value).length).toBe(0)

		// map
		result = mutable(new Map())
		expect(Object.keys(result).length).toBe(0)
	})

	test(
		lib + 'misc 2: reacts when getter/setter using external signal',
		expect => {
			const [read, write] = signal(1)
			// object
			const result = mutable({
				get lala() {
					read()
					return 1
				},
				set lala(value) {
					write(value)
				},
			})

			let calls = 0
			const execute = memo(() => {
				result.lala
				calls++
			})
			execute()
			expect(calls).toBe(1)

			write(1)
			execute()
			expect(calls).toBe(1)

			result.lala = 1
			execute()
			expect(calls).toBe(1)

			result.lala = 2
			execute()
			expect(calls).toBe(2)

			write(2)
			execute()
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'misc 2: reacts when its only a getter with an external write',
		expect => {
			const [read, write] = signal(1)
			// object
			const result = mutable({
				get lala() {
					read()
					return 1
				},
			})

			let calls = 0
			const execute = memo(() => {
				result.lala
				calls++
			})
			execute()
			expect(calls).toBe(1)

			write(1)
			execute()
			expect(calls).toBe(1)

			write(2)
			execute()
			expect(calls).toBe(2)
		},
	)

	test(lib + 'misc 2: proxy invariants', expect => {
		const o = {
			frozen: Object.freeze({}),
		}

		Object.defineProperty(o, 'test', {
			configurable: false,
			writable: false,
			value: { test: 1 },
		})

		// if broken this will crash
		let result = mutable(o)

		expect(result.test).toBe(o.test)

		expect(result.frozen).toBe(o.frozen)
	})

	// benchmark

	// https://github.com/vobyjs/oby/blob/master/tasks/store.fixtures.js
	// https://github.com/vobyjs/oby/blob/master/tasks/store.js

	if (doBenchmark) {
		const NOOP = () => {}

		const OBJ = () => ({
			str: 'string',
			null: null,
			undefined: undefined,
			nr: 123,
			bigint: 10n,
			symbol: Symbol(),
			re: /foo/g,
			fn: function () {},
			arr: [1, 2, 3, {}],
			arrfilled: new Array(10_000).fill(0).map((_, idx) => idx),
			/*arrBuf: new ArrayBuffer(12),
			arrTyped: new Int8Array(new ArrayBuffer(24)),*/
			obj: {
				deep: {
					deeper: true,
				},
			},
			date: new Date(),
			/*map: new Map([
			['1', 1],
			['2', 2],
		]),*/
			set: new Set([1, 2, 3]),
		})

		const OBJ_HUGE = () => ({
			arr: new Array(100_000).fill(0).map((_, idx) => idx),
			date: new Date(),
			/*	map: new Map(
			new Array(100_000)
				.fill(0)
				.map((_, idx) => idx)
				.map(nr => [`${nr}`, nr]),
		),
		set: new Set(new Array(100_000).fill(0).map((_, idx) => idx)),*/
		})

		let superTotal = 0
		const benchmark = (title, context, fn) => {
			if (!benchmarkTable[title]) {
				benchmarkTable[title] = {}
				if (!benchmarkTable.total) {
					benchmarkTable.total = {
						'solid: ': 0,
						'oby: ': 0,
						'pota: ': 0,
					}
				}
			}
			try {
				let total = 0
				root(dispose => {
					const ctx = context()
					for (let i = 0; i < 3_000; i++) {
						total += timing(() => {
							fn(ctx)
						})
					}
					dispose()
				})
				benchmarkTable[title][lib] = total
				benchmarkTable.total[lib] += total
			} catch (e) {
				console.log(e)
				benchmarkTable[title][lib] = e
			}
		}

		// get
		benchmark(
			'access: primitive',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.str
				ctx.nr
				ctx.symbol
			},
		)
		benchmark(
			'access: shallow',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.arr
				ctx.obj
			},
		)
		benchmark(
			'access: deep',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.arr[3].undefined
				ctx.obj.deep.deeper
			},
		)

		benchmark(
			'access: array',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.arr.concat(4)
				ctx.arr.entries()
				ctx.arr.every(NOOP)
				ctx.arr.filter(NOOP)
				ctx.arr.find(NOOP)
				ctx.arr.findIndex(NOOP)
				ctx.arr.forEach(() => {})
				ctx.arr.includes(1)
				ctx.arr.indexOf(1)
				ctx.arr.join()
				ctx.arr.keys()
				ctx.arr.lastIndexOf(1)
				ctx.arr.map(NOOP)
				ctx.arr.reduce(() => ({}))
				ctx.arr.reduceRight(() => ({}))
				ctx.arr.slice()
				ctx.arr.some(NOOP)
				ctx.arr.toLocaleString()
				ctx.arr.toString()
				ctx.arr.values()
			},
		)

		benchmark(
			'set: object:shallow',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.arr[0] = 1
			},
		)

		benchmark(
			'set: object:deep',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.obj.deep.deeper = true
			},
		)

		benchmark(
			'set: array',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.arr.copyWithin(0, 0, 0)
				ctx.arr.push()
				ctx.arr.splice(0, 0)
			},
		)

		benchmark(
			'set: object:shallow 2',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.arr[0] = 10
				ctx.obj.foo = 10
			},
		)
		benchmark(
			'set: object:deep 2',
			() => {
				return mutable(OBJ())
			},
			ctx => {
				ctx.arr[3].undefined = 10
				ctx.obj.deep.deeper = 10
			},
		)

		/*

		benchmark(
		'set: array 2',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arr.copyWithin(0, 1, 2)
			ctx.arr.fill(0)
			ctx.arr.pop()
			ctx.arr.push(-1, -2, -3)
			ctx.arr.reverse()
			ctx.arr.shift()
			ctx.arr.sort()
			ctx.arr.splice(0, 1, 2)
			ctx.arr.unshift(5)
		},
	)
	benchmark(
		'mutate array: copyWithin',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.copyWithin(0, 1, 2)
		},
	)

	benchmark(
		'mutate array: fill',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.fill(0)
		},
	)

	benchmark(
		'mutate array: pop',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.pop()
		},
	)
	benchmark(
		'mutate array: push',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.push()
		},
	)
	benchmark(
		'mutate array: reverse ',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.reverse()
		},
	)
	benchmark(
		'mutate array: shift ',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.shift()
		},
	)
	benchmark(
		'mutate array: sort ',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.sort()
		},
	)
	benchmark(
		'mutate array: splice ',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.splice(0, 1, 2)
		},
	)
	benchmark(
		'mutate array: unshift ',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			ctx.arrfilled.unshift(5)
		},
	)

	benchmark(
		'delete: object:shallow ',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			delete ctx.arr
		},
	)
	benchmark(
		'delete: object:deep ',
		() => {
			return mutable(OBJ())
		},
		ctx => {
			delete ctx.obj.deep.deeper
		},
	)*/
		// create
		benchmark(
			'create: number',
			() => {},
			() => {
				mutable(123)
			},
		)
		benchmark(
			'create: object',
			() => {},
			() => {
				mutable({})
			},
		)
		benchmark(
			'create: array',
			() => {},
			() => {
				mutable([])
			},
		)
		/*benchmark(
		'create: small',
		() => {},
		() => {
			mutable(OBJ())
		},
	)
	benchmark(
		'create: huge',
		() => {},
		() => {
			mutable(OBJ_HUGE())
		},
	)*/
	}

	function testValues(expect, set, get) {
		let callsMemo = 0
		const value = memo(() => {
			callsMemo += 1
			get()
			get()
			get()
			return get()
		})

		expect(callsMemo).toBe(0)

		set(123)
		expect(get()).toBe(123)
		expect(value()).toBe(123)
		expect(callsMemo).toBe(1)

		set(321)
		expect(get()).toBe(321)
		expect(value()).toBe(321)
		expect(callsMemo).toBe(2)

		set(undefined)
		expect(get()).toBe(undefined)
		expect(value()).toBe(undefined)
		expect(callsMemo).toBe(3)

		set(null)
		expect(get()).toBe(null)
		expect(value()).toBe(null)
		expect(callsMemo).toBe(4)

		set(1)
		expect(get()).toBe(1)
		expect(value()).toBe(1)
		expect(callsMemo).toBe(5)

		set('')
		expect(get()).toBe('')
		expect(value()).toBe('')
		expect(callsMemo).toBe(6)

		set('string')
		expect(get()).toBe('string')
		expect(value()).toBe('string')
		expect(callsMemo).toBe(7)

		set([true])
		expect(get()).toHaveShape([true])
		expect(value()).toHaveShape([true])
		expect(Array.isArray(get())).toBe(true)
		expect(callsMemo).toBe(8)

		set({ 0: true })
		expect(get()).toHaveShape({ 0: true })
		expect(value()).toHaveShape({ 0: true })
		expect(Array.isArray(get())).toBe(false)
		expect(callsMemo).toBe(9)

		set([true])
		expect(get()).toHaveShape([true])
		expect(value()).toHaveShape([true])
		expect(Array.isArray(get())).toBe(true)
		expect(callsMemo).toBe(10)

		set({ 0: true })
		expect(get()).toHaveShape({ 0: true })
		expect(value()).toHaveShape({ 0: true })
		expect(Array.isArray(get())).toBe(false)
		expect(callsMemo).toBe(11)

		set(true)
		expect(get()).toBe(true)
		expect(value()).toBe(true)
		expect(callsMemo).toBe(12)

		set(false)
		expect(get()).toBe(false)
		expect(value()).toBe(false)
		expect(callsMemo).toBe(13)

		set(Infinity)
		expect(get()).toBe(Infinity)
		expect(value()).toBe(Infinity)
		expect(callsMemo).toBe(14)

		set(Infinity)
		expect(get()).toBe(Infinity)
		expect(value()).toBe(Infinity)
		expect(callsMemo).toBe(14)

		// symbol
		const s = Symbol()

		set(s)
		expect(get()).toBe(s)
		expect(value()).toBe(s)
		expect(callsMemo).toBe(15)

		// bigint
		const bn = BigInt('9007199254740991')
		set(bn)
		expect(get()).toBe(bn)
		expect(value()).toBe(bn)
		expect(callsMemo).toBe(16)

		// built-ins should work and return same value
		const p = Promise.resolve()
		set(p)
		expect(get()).toBe(p)
		expect(value()).toBe(p)
		expect(callsMemo).toBe(17)

		const r = new RegExp('')
		set(r)
		expect(get()).toBe(r)
		expect(value()).toBe(r)
		expect(callsMemo).toBe(18)

		const d = new Date()
		set(d)
		expect(get()).toBe(d)
		expect(value()).toBe(d)
		expect(callsMemo).toBe(19)

		set(NaN)
		expect(Object.is(get(), NaN)).toBe(true)
		expect(Object.is(value(), NaN)).toBe(true)
		expect(callsMemo).toBe(20)

		set(0)
		expect(get()).toBe(0)
		expect(value()).toBe(0)
		expect(callsMemo).toBe(21)

		set(1)
		expect(get()).toBe(1)
		expect(value()).toBe(1)
		expect(callsMemo).toBe(22)
	}
}
