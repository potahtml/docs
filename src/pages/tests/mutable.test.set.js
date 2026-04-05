test(lib + 'instanceof', expect => {
	const original = new Set()
	const observed = mutable(original)
	expect(original instanceof Set).toBe(true)
	expect(observed instanceof Set).toBe(true)
})

test(lib + 'should observe mutations', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => (dummy = set.has('value')))

	expect(dummy).toBe(false)
	set.add('value')
	expect(dummy).toBe(true)
	set.delete('value')
	expect(dummy).toBe(false)
})

test(lib + 'should observe mutations with observed value', expect => {
	let dummy
	const value = mutable({})
	const set = mutable(new Set())
	effect(() => (dummy = set.has(value)))

	expect(dummy).toBe(false)
	set.add(value)
	expect(dummy).toBe(true)
	set.delete(value)
	expect(dummy).toBe(false)
})

test(lib + 'should observe for of iteration', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => {
		dummy = 0
		for (let num of set) {
			dummy += num
		}
	})

	expect(dummy).toBe(0)
	set.add(2)
	set.add(1)
	expect(dummy).toBe(3)
	set.delete(2)
	expect(dummy).toBe(1)
	set.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe forEach iteration', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => {
		dummy = 0
		set.forEach(num => (dummy += num))
	})

	expect(dummy).toBe(0)
	set.add(2)
	set.add(1)
	expect(dummy).toBe(3)
	set.delete(2)
	expect(dummy).toBe(1)
	set.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe values iteration', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => {
		dummy = 0
		for (let num of set.values()) {
			dummy += num
		}
	})

	expect(dummy).toBe(0)
	set.add(2)
	set.add(1)
	expect(dummy).toBe(3)
	set.delete(2)
	expect(dummy).toBe(1)
	set.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe keys iteration', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => {
		dummy = 0
		for (let num of set.keys()) {
			dummy += num
		}
	})

	expect(dummy).toBe(0)
	set.add(2)
	set.add(1)
	expect(dummy).toBe(3)
	set.delete(2)
	expect(dummy).toBe(1)
	set.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should observe entries iteration', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => {
		dummy = 0
		for (let [key, num] of set.entries()) {
			key
			dummy += num
		}
	})

	expect(dummy).toBe(0)
	set.add(2)
	set.add(1)
	expect(dummy).toBe(3)
	set.delete(2)
	expect(dummy).toBe(1)
	set.clear()
	expect(dummy).toBe(0)
})

test(lib + 'should be triggered by clearing', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => (dummy = set.has('key')))

	expect(dummy).toBe(false)
	set.add('key')
	expect(dummy).toBe(true)
	set.clear()
	expect(dummy).toBe(false)
})

test(lib + 'should not observe custom property mutations', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => (dummy = set.customProp))

	expect(dummy).toBe(undefined)
	set.customProp = 'Hello World'
	expect(dummy).toBe(undefined)
})

test(lib + 'should observe size mutations', expect => {
	let dummy
	const set = mutable(new Set())
	effect(() => (dummy = set.size))

	expect(dummy).toBe(0)
	set.add('value')
	set.add('value2')
	expect(dummy).toBe(2)
	set.delete('value')
	expect(dummy).toBe(1)
	set.clear()
	expect(dummy).toBe(0)
})

test(
	lib + 'should not observe non value changing mutations',
	expect => {
		let dummy
		const set = mutable(new Set())
		let calls = 0
		effect(() => {
			calls++
			dummy = set.has('value')
		})

		expect(dummy).toBe(false)
		expect(calls).toBe(1)
		set.add('value')
		expect(dummy).toBe(true)
		expect(calls).toBe(2)
		set.add('value')
		expect(dummy).toBe(true)
		expect(calls).toBe(2)
		set.delete('value')
		expect(dummy).toBe(false)
		expect(calls).toBe(3)
		set.delete('value')
		expect(dummy).toBe(false)
		expect(calls).toBe(3)
		set.clear()
		expect(dummy).toBe(false)
		expect(calls).toBe(3)
	},
)

test(lib + 'should support objects as key', expect => {
	let dummy
	const key = {}
	const set = mutable(new Set())
	let calls = 0
	effect(() => {
		calls++
		dummy = set.has(key)
	})

	expect(dummy).toBe(false)
	expect(calls).toBe(1)

	set.add({})
	expect(dummy).toBe(false)
	expect(calls).toBe(1)

	set.add(key)
	expect(dummy).toBe(true)
	expect(calls).toBe(2)
})

test(lib + 'should not pollute original Set with Proxies', expect => {
	const set = new Set()
	const observed = mutable(set)
	const value = mutable({})
	observed.add(value)
	expect(observed.has(value)).toBe(true)
	expect(set.has(value)).toBe(false)
})

test(
	lib + 'should observe nested values in iterations (forEach)',
	expect => {
		const set = mutable(new Set([{ foo: 1 }]))
		let dummy
		effect(() => {
			dummy = 0
			set.forEach(value => {
				dummy += value.foo
			})
		})
		expect(dummy).toBe(1)
		set.forEach(value => {
			value.foo++
		})
		expect(dummy).toBe(2)
	},
)

test(
	lib + 'should observe nested values in iterations (values)',
	expect => {
		const set = mutable(new Set([{ foo: 1 }]))
		let dummy
		effect(() => {
			dummy = 0
			for (const value of set.values()) {
				dummy += value.foo
			}
		})
		expect(dummy).toBe(1)
		set.forEach(value => {
			value.foo++
		})
		expect(dummy).toBe(2)
	},
)

test(
	lib + 'should observe nested values in iterations (entries)',
	expect => {
		const set = mutable(new Set([{ foo: 1 }]))
		let dummy
		effect(() => {
			dummy = 0
			for (const [key, value] of set.entries()) {
				dummy += value.foo
			}
		})
		expect(dummy).toBe(1)
		set.forEach(value => {
			value.foo++
		})
		expect(dummy).toBe(2)
	},
)

test(
	lib + 'should observe nested values in iterations (for...of)',
	expect => {
		const set = mutable(new Set([{ foo: 1 }]))
		let dummy
		effect(() => {
			dummy = 0
			for (const value of set) {
				dummy += value.foo
			}
		})
		expect(dummy).toBe(1)
		set.forEach(value => {
			value.foo++
		})
		expect(dummy).toBe(2)
	},
)

test(lib + 'should work with reactive entries in raw set', expect => {
	const raw = new Set()
	const entry = mutable({})
	raw.add(entry)
	const set = mutable(raw)

	expect(set.has(entry)).toBe(true)

	expect(set.delete(entry)).toBe(true)
	expect(set.has(entry)).toBe(false)
})

test(
	lib + 'should track deletion of reactive entries in raw set',
	expect => {
		const raw = new Set()
		const entry = mutable({})
		raw.add(entry)
		const set = mutable(raw)

		let dummy
		effect(() => {
			dummy = set.has(entry)
		})
		expect(dummy).toBe(true)

		set.delete(entry)
		expect(dummy).toBe(false)
	},
)

test(lib + 'thisArg', expect => {
	const raw = new Set(['value'])
	const proxy = mutable(raw)
	const thisArg = {}
	let count = 0
	proxy.forEach(function (that, value, _, set) {
		++count
		expect(that).toBe(thisArg)
		expect(value).toBe('value')
		expect(set).toBe(proxy)
	}, thisArg)
	expect(count).toBe(1)
})

test(lib + 'should return proxy from Set.add call', expect => {
	const set = mutable(new Set())
	const result = set.add('a')
	expect(result).toBe(set)
})

test(
	lib + 'observing subtypes of IterableCollections(Map, Set) [solid]',
	expect => {
		// subtypes of Set
		class CustomSet extends Set {}
		const cset = mutable(new CustomSet())

		expect(cset instanceof Set).toBe(true)

		let dummy
		effect(() => (dummy = cset.has('value')))
		expect(dummy).toBe(false)
		cset.add('value')
		expect(dummy).toBe(true)
		cset.delete('value')
		expect(dummy).toBe(false)
	},
)

test(
	lib +
		'observing subtypes of IterableCollections(Map, Set) deep [solid]',
	expect => {
		// subtypes of Set
		class CustomSet extends Set {}
		const cset = mutable({ value: new CustomSet() })

		expect(cset.value instanceof Set).toBe(true)

		let dummy
		effect(() => (dummy = cset.value.has('value')))
		expect(dummy).toBe(false)
		cset.value.add('value')
		expect(dummy).toBe(true)
		cset.value.delete('value')
		expect(dummy).toBe(false)
	},
)
