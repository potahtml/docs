test(lib + 'instanceof', expect => {
	const original = new Map()
	const observed = mutable(original)

	expect(original instanceof Map).toBe(true)
	expect(observed instanceof Map).toBe(true)
})

test(lib + 'should observe mutations [solid]', expect => {
	let dummy
	const map = mutable(new Map())
	effect(() => {
		dummy = map.get('key')
	})

	expect(dummy).toBe(undefined)
	map.set('key', 'value')
	expect(dummy).toBe('value')
	map.set('key', 'value2')
	expect(dummy).toBe('value2')
	map.delete('key')
	expect(dummy).toBe(undefined)
})

test(
	lib + 'should observe mutations with observed value as key [solid]',
	expect => {
		let dummy
		const key = mutable({})
		const value = mutable({})
		const map = mutable(new Map())
		effect(() => {
			dummy = map.get(key)
		})

		expect(dummy).toBe(undefined)
		map.set(key, value)
		expect(dummy).toBe(value)
		map.delete(key)
		expect(dummy).toBe(undefined)
	},
)

test(lib + 'should observe size mutations [solid]', expect => {
	let dummy
	const map = mutable(new Map())
	effect(() => (dummy = map.size))

	expect(dummy).toBe(0)
	map.set('key1', 'value')
	map.set('key2', 'value2')
	expect(dummy).toBe(2)
	map.delete('key1')
	expect(dummy).toBe(1)
	map.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe for of iteration [solid]', expect => {
	let dummy
	const map = mutable(new Map())
	effect(() => {
		dummy = 0
		for (let [key, num] of map) {
			key
			dummy += num
		}
	})

	expect(dummy).toBe(0)
	map.set('key1', 3)
	expect(dummy).toBe(3)
	map.set('key2', 2)
	expect(dummy).toBe(5)
	// iteration should track mutation of existing entries (#709)
	map.set('key1', 4)
	expect(dummy).toBe(6)
	map.delete('key1')
	expect(dummy).toBe(2)
	map.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe forEach iteration [solid]', expect => {
	let dummy
	const map = mutable(new Map())
	effect(() => {
		dummy = 0
		map.forEach(num => (dummy += num))
	})

	expect(dummy).toBe(0)
	map.set('key1', 3)
	expect(dummy).toBe(3)
	map.set('key2', 2)
	expect(dummy).toBe(5)
	// iteration should track mutation of existing entries (#709)
	map.set('key1', 4)
	expect(dummy).toBe(6)
	map.delete('key1')
	expect(dummy).toBe(2)
	map.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe keys iteration [solid]', expect => {
	let dummy
	const map = mutable(new Map())
	effect(() => {
		dummy = 0
		for (let key of map.keys()) {
			dummy += key
		}
	})

	expect(dummy).toBe(0)
	map.set(3, 3)
	expect(dummy).toBe(3)
	map.set(2, 2)
	expect(dummy).toBe(5)
	map.delete(3)
	expect(dummy).toBe(2)
	map.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe values iteration [solid]', expect => {
	let dummy
	const map = mutable(new Map())
	effect(() => {
		dummy = 0
		for (let num of map.values()) {
			dummy += num
		}
	})

	expect(dummy).toBe(0)
	map.set('key1', 3)
	expect(dummy).toBe(3)
	map.set('key2', 2)
	expect(dummy).toBe(5)
	// iteration should track mutation of existing entries (#709)
	map.set('key1', 4)
	expect(dummy).toBe(6)
	map.delete('key1')
	expect(dummy).toBe(2)
	map.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe entries iteration [solid]', expect => {
	let dummy
	let dummy2
	const map = mutable(new Map())
	effect(() => {
		dummy = ''
		dummy2 = 0
		for (let [key, num] of map.entries()) {
			dummy += key
			dummy2 += num
		}
	})

	expect(dummy).toBe('')
	expect(dummy2).toBe(0)
	map.set('key1', 3)
	expect(dummy).toBe('key1')
	expect(dummy2).toBe(3)
	map.set('key2', 2)
	expect(dummy).toBe('key1key2')
	expect(dummy2).toBe(5)
	// iteration should track mutation of existing entries (#709)
	map.set('key1', 4)
	expect(dummy).toBe('key1key2')
	expect(dummy2).toBe(6)
	map.delete('key1')
	expect(dummy).toBe('key2')
	expect(dummy2).toBe(2)
	map.clear()
	expect(dummy).toBe('')
	expect(dummy2).toBe(0)
})

test(lib + 'should be triggered by clearing [solid]', expect => {
	let dummy
	const map = mutable(new Map())
	effect(() => (dummy = map.get('key')))

	expect(dummy).toBe(undefined)
	map.set('key', 3)
	expect(dummy).toBe(3)
	map.clear()
	expect(dummy).toBe(undefined)
})

test(
	lib + 'should not observe custom property mutations [solid]',
	expect => {
		let dummy
		const map = mutable(new Map())
		effect(() => (dummy = map.customProp))

		expect(dummy).toBe(undefined)
		map.customProp = 'Hello World'
		expect(dummy).toBe(undefined)
	},
)

test(
	lib + 'should not observe non value changing mutations [solid]',
	expect => {
		let dummy
		const map = mutable(new Map())
		let calls = 0
		effect(() => {
			calls++
			dummy = map.get('key')
		})

		expect(dummy).toBe(undefined)
		expect(calls).toBe(1)
		map.set('key', undefined)
		expect(dummy).toBe(undefined)
		expect(calls).toBe(2)
		map.set('key', 'value')
		expect(dummy).toBe('value')
		expect(calls).toBe(3)
		map.set('key', 'value')
		expect(dummy).toBe('value')
		expect(calls).toBe(3)
		map.delete('key')
		expect(dummy).toBe(undefined)
		expect(calls).toBe(4)
		map.delete('key')
		expect(dummy).toBe(undefined)
		expect(calls).toBe(4)
		map.clear()
		expect(dummy).toBe(undefined)
		expect(calls).toBe(4)
	},
)

test(
	lib + 'should not pollute original Map with Proxies [solid]',
	expect => {
		const map = new Map()
		const observed = mutable(map)
		const original = {}
		const value = mutable(original)
		observed.set('key', value)
		expect(map.get('key')).not.toBe(value)
		expect(map.get('key')).toBe(original)
	},
)

test(
	lib +
		'should return observable versions of contained values [solid]',
	expect => {
		const observed = mutable(new Map())
		const value = {}
		observed.set('key', value)
		const wrapped = observed.get('key')
		expect(wrapped).not.toBe(value)
	},
)

test(lib + 'should observed nested data [solid]', expect => {
	const observed = mutable(new Map())
	observed.set('key', { a: 1 })
	let dummy
	effect(() => {
		dummy = observed.get('key').a
	})
	observed.get('key').a = 2
	expect(dummy).toBe(2)
})

test(
	lib +
		'should observe nested values in iterations (forEach) [solid]',
	expect => {
		const map = mutable(new Map([[1, { foo: 1 }]]))
		let dummy
		effect(() => {
			dummy = 0
			map.forEach(value => {
				dummy += value.foo
			})
		})
		expect(dummy).toBe(1)
		map.get(1).foo++
		expect(dummy).toBe(2)
	},
)

test(
	lib + 'should observe nested values in iterations (values) [solid]',
	expect => {
		const map = mutable(new Map([[1, { foo: 1 }]]))
		let dummy
		effect(() => {
			dummy = 0
			for (const value of map.values()) {
				dummy += value.foo
			}
		})
		expect(dummy).toBe(1)
		map.get(1).foo++
		expect(dummy).toBe(2)
	},
)

test(
	lib +
		'should observe nested values in iterations (entries) [solid]',
	expect => {
		const key = {}
		const map = mutable(new Map([[key, { foo: 1 }]]))
		let dummy
		effect(() => {
			dummy = 0
			for (const [key, value] of map.entries()) {
				key

				dummy += value.foo
			}
		})
		expect(dummy).toBe(1)
		map.get(key).foo++
		expect(dummy).toBe(2)
	},
)

test(
	lib +
		'should observe nested values in iterations (for...of) [solid]',
	expect => {
		const key = {}
		const map = mutable(new Map([[key, { foo: 1 }]]))
		let dummy
		effect(() => {
			dummy = 0
			for (const [key, value] of map) {
				key

				dummy += value.foo
			}
		})
		expect(dummy).toBe(1)
		map.get(key).foo++
		expect(dummy).toBe(2)
	},
)

test(
	lib +
		'should not be trigger when the value and the old value both are NaN [solid]',
	expect => {
		const map = mutable(new Map([['foo', NaN]]))
		let calls = 0
		effect(() => {
			calls++
			map.get('foo')
		})
		map.set('foo', NaN)
		expect(calls).toBe(1)
	},
)

test(
	lib + 'should work with reactive keys in raw map [solid]',
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
	lib + 'should track set of mutable keys in raw map [solid]',
	expect => {
		const raw = new Map()
		const key = mutable({})
		raw.set(key, 1)
		const map = mutable(raw)

		let dummy
		effect(() => {
			dummy = map.get(key)
		})
		expect(dummy).toBe(1)

		map.set(key, 2)
		expect(dummy).toBe(2)
	},
)

test(
	lib + 'should track deletion of reactive keys in raw map [solid]',
	expect => {
		const raw = new Map()
		const key = mutable({})
		raw.set(key, 1)
		const map = mutable(raw)

		let dummy
		effect(() => {
			dummy = map.has(key)
		})
		expect(dummy).toBe(true)

		map.delete(key)
		expect(dummy).toBe(false)
	},
)

// #877
test(
	lib +
		'should not trigger key iteration when setting existing keys  [solid]',
	expect => {
		const map = mutable(new Map())

		let calls = 0
		effect(() => {
			calls++
			const keys = []
			for (const key of map.keys()) {
				keys.push(key)
			}
		})

		expect(calls).toBe(1)

		map.set('a', 0)
		expect(calls).toBe(2)

		map.set('b', 0)
		expect(calls).toBe(3)

		// keys didn't change, should not trigger
		map.set('b', 1)
		expect(calls).toBe(3)
	},
)

test(
	lib + 'should return proxy from Map.set call  [solid]',
	expect => {
		const map = mutable(new Map())
		const result = map.set('a', 'a')
		expect(result).toBe(map)
	},
)

test(
	lib + 'observing subtypes of IterableCollections(Map, Set) [solid]',
	expect => {
		// subtypes of Map
		class CustomMap extends Map {}
		const cmap = mutable(new CustomMap())

		expect(cmap instanceof Map).toBe(true)

		const val = {}
		cmap.set('key', val)
		expect(cmap.get('key')).toBe(val)
	},
)

test(
	lib +
		'observing subtypes of IterableCollections(Map, Set) deep [solid]',
	expect => {
		// subtypes of Map
		class CustomMap extends Map {}
		const cmap = mutable({ value: new CustomMap() })

		expect(cmap.value instanceof Map).toBe(true)

		const val = {}
		cmap.value.set('key', val)
		expect(cmap.value.get('key')).toBe(val)
	},
)

test(
	lib + 'should work with observed value as key [solid]',
	expect => {
		const key = mutable({})
		const m = mutable(new Map())
		m.set(key, 1)
		const roM = m

		let calls = 0
		effect(() => {
			calls++
			roM.get(key)
		})
		expect(calls).toBe(1)
		m.set(key, 1)
		expect(calls).toBe(1)
		m.set(key, 2)
		expect(calls).toBe(2)
	},
)
