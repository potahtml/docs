/*
	test(
		lib +
			'should avoid implicit infinite recursive loops with itself',
		expect => {
			const counter = mutable({ num: 0 })

			let calls = 0
			effect(() => {
				calls += 1
				counter.num++
			})
			expect(counter.num).toBe(1)
			expect(calls).toBe(1)
			counter.num = 4
			expect(counter.num).toBe(4)
			expect(calls).toBe(2)
		},
	)
	*/
