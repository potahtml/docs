!(function () {
	'use strict'
	const e = (e, t) => e === t,
		t = Symbol('solid-track'),
		n = { equals: e }
	let r = x
	const l = 1,
		o = 2,
		s = { owned: null, cleanups: null, context: null, owner: null }
	var i = null
	let u = null,
		c = null,
		a = null,
		f = null,
		d = 0
	function h(e, t) {
		const n = c,
			r = i,
			l = 0 === e.length,
			o = void 0 === t ? r : t,
			u = l
				? s
				: {
						owned: null,
						cleanups: null,
						context: o ? o.context : null,
						owner: o,
					},
			a = l ? e : () => e(() => v(() => E(u)))
		;(i = u), (c = null)
		try {
			return S(a, !0)
		} finally {
			;(c = n), (i = r)
		}
	}
	function p(e, t) {
		const r = {
			value: e,
			observers: null,
			observerSlots: null,
			comparator:
				(t = t ? Object.assign({}, n, t) : n).equals || void 0,
		}
		return [
			y.bind(r),
			e => ('function' == typeof e && (e = e(r.value)), w(r, e)),
		]
	}
	function b(e, t, n) {
		m(A(e, t, !1, l))
	}
	function v(e) {
		if (null === c) return e()
		const t = c
		c = null
		try {
			return e()
		} finally {
			c = t
		}
	}
	function g(e) {
		return (
			null === i ||
				(null === i.cleanups
					? (i.cleanups = [e])
					: i.cleanups.push(e)),
			e
		)
	}
	function y() {
		if (this.sources && this.state)
			if (this.state === l) m(this)
			else {
				const e = a
				;(a = null), S(() => C(this), !1), (a = e)
			}
		if (c) {
			const e = this.observers ? this.observers.length : 0
			c.sources
				? (c.sources.push(this), c.sourceSlots.push(e))
				: ((c.sources = [this]), (c.sourceSlots = [e])),
				this.observers
					? (this.observers.push(c),
						this.observerSlots.push(c.sources.length - 1))
					: ((this.observers = [c]),
						(this.observerSlots = [c.sources.length - 1]))
		}
		return this.value
	}
	function w(e, t, n) {
		let r = e.value
		return (
			(e.comparator && e.comparator(r, t)) ||
				((e.value = t),
				e.observers &&
					e.observers.length &&
					S(() => {
						for (let t = 0; t < e.observers.length; t += 1) {
							const n = e.observers[t],
								r = u && u.running
							r && u.disposed.has(n),
								(r ? n.tState : n.state) ||
									(n.pure ? a.push(n) : f.push(n),
									n.observers && k(n)),
								r || (n.state = l)
						}
						if (a.length > 1e6) throw ((a = []), new Error())
					}, !1)),
			t
		)
	}
	function m(e) {
		if (!e.fn) return
		E(e)
		const t = i,
			n = c,
			r = d
		;(c = i = e),
			(function (e, t, n) {
				let r
				try {
					r = e.fn(t)
				} catch (t) {
					return (
						e.pure &&
							((e.state = l),
							e.owned && e.owned.forEach(E),
							(e.owned = null)),
						(e.updatedAt = n + 1),
						N(t)
					)
				}
				;(!e.updatedAt || e.updatedAt <= n) &&
					(null != e.updatedAt && 'observers' in e
						? w(e, r)
						: (e.value = r),
					(e.updatedAt = n))
			})(e, e.value, r),
			(c = n),
			(i = t)
	}
	function A(e, t, n, r = l, o) {
		const u = {
			fn: e,
			state: r,
			updatedAt: null,
			owned: null,
			sources: null,
			sourceSlots: null,
			cleanups: null,
			value: t,
			owner: i,
			context: i ? i.context : null,
			pure: n,
		}
		return (
			null === i ||
				(i !== s && (i.owned ? i.owned.push(u) : (i.owned = [u]))),
			u
		)
	}
	function $(e) {
		if (0 === e.state) return
		if (e.state === o) return C(e)
		if (e.suspense && v(e.suspense.inFallback))
			return e.suspense.effects.push(e)
		const t = [e]
		for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < d); )
			e.state && t.push(e)
		for (let n = t.length - 1; n >= 0; n--)
			if ((e = t[n]).state === l) m(e)
			else if (e.state === o) {
				const n = a
				;(a = null), S(() => C(e, t[0]), !1), (a = n)
			}
	}
	function S(e, t) {
		if (a) return e()
		let n = !1
		t || (a = []), f ? (n = !0) : (f = []), d++
		try {
			const t = e()
			return (
				(function (e) {
					a && (x(a), (a = null))
					if (e) return
					const t = f
					;(f = null), t.length && S(() => r(t), !1)
				})(n),
				t
			)
		} catch (e) {
			n || (f = null), (a = null), N(e)
		}
	}
	function x(e) {
		for (let t = 0; t < e.length; t++) $(e[t])
	}
	function C(e, t) {
		e.state = 0
		for (let n = 0; n < e.sources.length; n += 1) {
			const r = e.sources[n]
			if (r.sources) {
				const e = r.state
				e === l
					? r !== t && (!r.updatedAt || r.updatedAt < d) && $(r)
					: e === o && C(r, t)
			}
		}
	}
	function k(e) {
		for (let t = 0; t < e.observers.length; t += 1) {
			const n = e.observers[t]
			n.state ||
				((n.state = o),
				n.pure ? a.push(n) : f.push(n),
				n.observers && k(n))
		}
	}
	function E(e) {
		let t
		if (e.sources)
			for (; e.sources.length; ) {
				const t = e.sources.pop(),
					n = e.sourceSlots.pop(),
					r = t.observers
				if (r && r.length) {
					const e = r.pop(),
						l = t.observerSlots.pop()
					n < r.length &&
						((e.sourceSlots[l] = n),
						(r[n] = e),
						(t.observerSlots[n] = l))
				}
			}
		if (e.owned) {
			for (t = e.owned.length - 1; t >= 0; t--) E(e.owned[t])
			e.owned = null
		}
		if (e.cleanups) {
			for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]()
			e.cleanups = null
		}
		e.state = 0
	}
	function N(e, t = i) {
		const n = (function (e) {
			return e instanceof Error
				? e
				: new Error('string' == typeof e ? e : 'Unknown error', {
						cause: e,
					})
		})(e)
		throw n
	}
	const T = Symbol('fallback')
	function B(e) {
		for (let t = 0; t < e.length; t++) e[t]()
	}
	function _(e, t) {
		return v(() => e(t || {}))
	}
	function L(e) {
		const r = 'fallback' in e && { fallback: () => e.fallback }
		return (function (e, t, r) {
			r = r ? Object.assign({}, n, r) : n
			const l = A(e, t, !0, 0)
			return (
				(l.observers = null),
				(l.observerSlots = null),
				(l.comparator = r.equals || void 0),
				m(l),
				y.bind(l)
			)
		})(
			(function (e, n, r = {}) {
				let l = [],
					o = [],
					s = [],
					i = 0,
					u = n.length > 1 ? [] : null
				return (
					g(() => B(s)),
					() => {
						let c,
							a,
							f = e() || []
						return (
							f[t],
							v(() => {
								let e,
									t,
									n,
									p,
									b,
									v,
									g,
									y,
									w,
									m = f.length
								if (0 === m)
									0 !== i &&
										(B(s),
										(s = []),
										(l = []),
										(o = []),
										(i = 0),
										u && (u = [])),
										r.fallback &&
											((l = [T]),
											(o[0] = h(e => ((s[0] = e), r.fallback()))),
											(i = 1))
								else if (0 === i) {
									for (o = new Array(m), a = 0; a < m; a++)
										(l[a] = f[a]), (o[a] = h(d))
									i = m
								} else {
									for (
										n = new Array(m),
											p = new Array(m),
											u && (b = new Array(m)),
											v = 0,
											g = Math.min(i, m);
										v < g && l[v] === f[v];
										v++
									);
									for (
										g = i - 1, y = m - 1;
										g >= v && y >= v && l[g] === f[y];
										g--, y--
									)
										(n[y] = o[g]), (p[y] = s[g]), u && (b[y] = u[g])
									for (
										e = new Map(), t = new Array(y + 1), a = y;
										a >= v;
										a--
									)
										(w = f[a]),
											(c = e.get(w)),
											(t[a] = void 0 === c ? -1 : c),
											e.set(w, a)
									for (c = v; c <= g; c++)
										(w = l[c]),
											(a = e.get(w)),
											void 0 !== a && -1 !== a
												? ((n[a] = o[c]),
													(p[a] = s[c]),
													u && (b[a] = u[c]),
													(a = t[a]),
													e.set(w, a))
												: s[c]()
									for (a = v; a < m; a++)
										a in n
											? ((o[a] = n[a]),
												(s[a] = p[a]),
												u && ((u[a] = b[a]), u[a](a)))
											: (o[a] = h(d))
									;(o = o.slice(0, (i = m))), (l = f.slice(0))
								}
								return o
							})
						)
						function d(e) {
							if (((s[a] = e), u)) {
								const [e, t] = p(a)
								return (u[a] = t), n(f[a], e)
							}
							return n(f[a])
						}
					}
				)
			})(() => e.each, e.children, r || void 0),
		)
	}
	const M = '_$DX_DELEGATE'
	function j(e, t, n) {
		let r
		const l = () => {
				const t = document.createElement('template')
				return (
					(t.innerHTML = e),
					n ? t.content.firstChild.firstChild : t.content.firstChild
				)
			},
			o = t
				? () => v(() => document.importNode(r || (r = l()), !0))
				: () => (r || (r = l())).cloneNode(!0)
		return (o.cloneNode = o), o
	}
	function D(e, t, n, r) {
		if ((void 0 === n || r || (r = []), 'function' != typeof t))
			return z(e, t, r, n)
		b(r => z(e, t(), r, n), r)
	}
	function q(e) {
		const t = `$$${e.type}`
		let n = (e.composedPath && e.composedPath()[0]) || e.target
		for (
			e.target !== n &&
				Object.defineProperty(e, 'target', {
					configurable: !0,
					value: n,
				}),
				Object.defineProperty(e, 'currentTarget', {
					configurable: !0,
					get: () => n || document,
				});
			n;

		) {
			const r = n[t]
			if (r && !n.disabled) {
				const l = n[`${t}Data`]
				if (
					(void 0 !== l ? r.call(n, l, e) : r.call(n, e),
					e.cancelBubble)
				)
					return
			}
			n = n._$host || n.parentNode || n.host
		}
	}
	function z(e, t, n, r, l) {
		for (; 'function' == typeof n; ) n = n()
		if (t === n) return n
		const o = typeof t,
			s = void 0 !== r
		if (
			((e = (s && n[0] && n[0].parentNode) || e),
			'string' === o || 'number' === o)
		)
			if (('number' === o && (t = t.toString()), s)) {
				let l = n[0]
				l && 3 === l.nodeType
					? (l.data = t)
					: (l = document.createTextNode(t)),
					(n = U(e, n, r, l))
			} else
				n =
					'' !== n && 'string' == typeof n
						? (e.firstChild.data = t)
						: (e.textContent = t)
		else if (null == t || 'boolean' === o) n = U(e, n, r)
		else {
			if ('function' === o)
				return (
					b(() => {
						let l = t()
						for (; 'function' == typeof l; ) l = l()
						n = z(e, l, n, r)
					}),
					() => n
				)
			if (Array.isArray(t)) {
				const o = [],
					i = n && Array.isArray(n)
				if (O(o, t, n, l))
					return b(() => (n = z(e, o, n, r, !0))), () => n
				if (0 === o.length) {
					if (((n = U(e, n, r)), s)) return n
				} else
					i
						? 0 === n.length
							? P(e, o, r)
							: (function (e, t, n) {
									let r = n.length,
										l = t.length,
										o = r,
										s = 0,
										i = 0,
										u = t[l - 1].nextSibling,
										c = null
									for (; s < l || i < o; )
										if (t[s] !== n[i]) {
											for (; t[l - 1] === n[o - 1]; ) l--, o--
											if (l === s) {
												const t =
													o < r
														? i
															? n[i - 1].nextSibling
															: n[o - i]
														: u
												for (; i < o; ) e.insertBefore(n[i++], t)
											} else if (o === i)
												for (; s < l; )
													(c && c.has(t[s])) || t[s].remove(), s++
											else if (
												t[s] === n[o - 1] &&
												n[i] === t[l - 1]
											) {
												const r = t[--l].nextSibling
												e.insertBefore(n[i++], t[s++].nextSibling),
													e.insertBefore(n[--o], r),
													(t[l] = n[o])
											} else {
												if (!c) {
													c = new Map()
													let e = i
													for (; e < o; ) c.set(n[e], e++)
												}
												const r = c.get(t[s])
												if (null != r)
													if (i < r && r < o) {
														let u,
															a = s,
															f = 1
														for (
															;
															++a < l &&
															a < o &&
															null != (u = c.get(t[a])) &&
															u === r + f;

														)
															f++
														if (f > r - i) {
															const l = t[s]
															for (; i < r; )
																e.insertBefore(n[i++], l)
														} else e.replaceChild(n[i++], t[s++])
													} else s++
												else t[s++].remove()
											}
										} else s++, i++
								})(e, n, o)
						: (n && U(e), P(e, o))
				n = o
			} else if (t.nodeType) {
				if (Array.isArray(n)) {
					if (s) return (n = U(e, n, r, t))
					U(e, n, null, t)
				} else
					null != n && '' !== n && e.firstChild
						? e.replaceChild(t, e.firstChild)
						: e.appendChild(t)
				n = t
			} else console.warn('Unrecognized value. Skipped inserting', t)
		}
		return n
	}
	function O(e, t, n, r) {
		let l = !1
		for (let o = 0, s = t.length; o < s; o++) {
			let s,
				i = t[o],
				u = n && n[o]
			if (null == i || !0 === i || !1 === i);
			else if ('object' == (s = typeof i) && i.nodeType) e.push(i)
			else if (Array.isArray(i)) l = O(e, i, u) || l
			else if ('function' === s)
				if (r) {
					for (; 'function' == typeof i; ) i = i()
					l =
						O(
							e,
							Array.isArray(i) ? i : [i],
							Array.isArray(u) ? u : [u],
						) || l
				} else e.push(i), (l = !0)
			else {
				const t = String(i)
				u && 3 === u.nodeType && u.data === t
					? e.push(u)
					: e.push(document.createTextNode(t))
			}
		}
		return l
	}
	function P(e, t, n = null) {
		for (let r = 0, l = t.length; r < l; r++) e.insertBefore(t[r], n)
	}
	function U(e, t, n, r) {
		if (void 0 === n) return (e.textContent = '')
		const l = r || document.createTextNode('')
		if (t.length) {
			let r = !1
			for (let o = t.length - 1; o >= 0; o--) {
				const s = t[o]
				if (l !== s) {
					const t = s.parentNode === e
					r || o
						? t && s.remove()
						: t
							? e.replaceChild(l, s)
							: e.insertBefore(l, n)
				} else r = !0
			}
		} else e.insertBefore(l, n)
		return [l]
	}
	const I = j(
			'<div class="col-sm-6 smallpad"><button class="btn btn-primary btn-block" type="button">',
		),
		F = j(
			'<div class="container"><div class="jumbotron"><div class="row"><div class="col-md-6"><h1>SolidJS Keyed</h1></div><div class="col-md-6"><div class="row"></div></div></div></div><table class="table table-hover table-striped test-data"><tbody></tbody></table><span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true">',
		),
		G = j(
			'<tr><td class="col-md-1"></td><td class="col-md-4"><a> </a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6">',
		)
	let H = 1
	const J = [
			'pretty',
			'large',
			'big',
			'small',
			'tall',
			'short',
			'long',
			'handsome',
			'plain',
			'quaint',
			'clean',
			'elegant',
			'easy',
			'angry',
			'crazy',
			'helpful',
			'mushy',
			'odd',
			'unsightly',
			'adorable',
			'important',
			'inexpensive',
			'cheap',
			'expensive',
			'fancy',
		],
		K = [
			'red',
			'yellow',
			'blue',
			'green',
			'pink',
			'brown',
			'purple',
			'brown',
			'white',
			'black',
			'orange',
		],
		R = [
			'table',
			'chair',
			'house',
			'bbq',
			'desk',
			'car',
			'pony',
			'cookie',
			'sandwich',
			'burger',
			'pizza',
			'mouse',
			'keyboard',
		]
	function X(e) {
		return Math.round(1e3 * Math.random()) % e
	}
	function Q(e) {
		let t = new Array(e)
		for (let n = 0; n < e; n++) {
			const [e, r] = p(
				`${J[X(J.length)]} ${K[X(K.length)]} ${R[X(R.length)]}`,
			)
			t[n] = { id: H++, label: e, setLabel: r }
		}
		return t
	}
	const V = ({ id: e, text: t, fn: n }) =>
		(() => {
			const r = I(),
				l = r.firstChild
			var o, s, i
			return (
				(function (e, t, n, r) {
					if (r)
						Array.isArray(n)
							? ((e[`$$${t}`] = n[0]), (e[`$$${t}Data`] = n[1]))
							: (e[`$$${t}`] = n)
					else if (Array.isArray(n)) {
						const r = n[0]
						e.addEventListener(t, (n[0] = t => r.call(e, n[1], t)))
					} else e.addEventListener(t, n)
				})(l, 'click', n, !0),
				(o = l),
				(s = 'id'),
				null == (i = e) ? o.removeAttribute(s) : o.setAttribute(s, i),
				D(l, t),
				r
			)
		})()
	!(function (e, t, n, r = {}) {
		let l
		h(r => {
			;(l = r),
				t === document
					? e()
					: D(t, e(), t.firstChild ? null : void 0, n)
		}, r.owner)
	})(() => {
		const [t, n] = p([]),
			[r, o] = p(null),
			s = () => n(Q(1e3)),
			i = () => n(Q(1e4)),
			u = () => n(e => [...e, ...Q(1e3)]),
			d = () =>
				S(() => {
					for (let e = 0, n = t(), r = n.length; e < r; e += 10)
						n[e].setLabel(e => e + ' !!!')
				}, !1),
			h = () => {
				const e = t().slice()
				if (e.length > 998) {
					let t = e[1]
					;(e[1] = e[998]), (e[998] = t), n(e)
				}
			},
			bench = () => {
				function timing(fn) {
					const start = performance.now()
					fn()
					return performance.now() - start
				}

				for (let e = 0; e < 5; e++) n(Q(1e4)), t([])
				let e = 0,
					z = 0,
					s = 0,
					o = 0
				for (let s = 0; s < 10; s++)
					(e += timing(() => n(Q(1e4)))),
						(z += timing(() => n([]))),
						console.log(
							s + ' createLarge',
							e / (s + 1),
							s + ' clearLarge',
							z / (s + 1),
						)
				console.log('------------')
				for (let e = 0; e < 10; e++)
					(s += timing(() => n(Q(1e3)))),
						(o += timing(() => n([]))),
						console.log(
							e + ' createSmall',
							s / (e + 1),
							e + ' clearSmall',
							o / (e + 1),
						)
			},
			v = () => n([]),
			y = e =>
				n(t => {
					const n = t.findIndex(t => t.id === e)
					return [...t.slice(0, n), ...t.slice(n + 1)]
				}),
			w = (function (t, n = e, r) {
				const o = new Map(),
					s = A(
						e => {
							const r = t()
							for (const [t, s] of o.entries())
								if (n(t, r) !== n(t, e))
									for (const e of s.values())
										(e.state = l), e.pure ? a.push(e) : f.push(e)
							return r
						},
						void 0,
						!0,
						l,
					)
				return (
					m(s),
					e => {
						const t = c
						if (t) {
							let n
							;(n = o.get(e))
								? n.add(t)
								: o.set(e, (n = new Set([t]))),
								g(() => {
									n.delete(t), !n.size && o.delete(e)
								})
						}
						return n(e, s.value)
					}
				)
			})(r)
		return (() => {
			const e = F(),
				n = e.firstChild,
				r = n.firstChild.firstChild.nextSibling.firstChild,
				l = n.nextSibling.firstChild
			return (
				D(
					r,
					_(V, { id: 'run', text: 'Create 1,000 rows', fn: s }),
					null,
				),
				D(
					r,
					_(V, { id: 'runlots', text: 'Create 10,000 rows', fn: i }),
					null,
				),
				D(
					r,
					_(V, { id: 'add', text: 'Append 1,000 rows', fn: u }),
					null,
				),
				D(
					r,
					_(V, {
						id: 'update',
						text: 'Update every 10th row',
						fn: d,
					}),
					null,
				),
				D(r, _(V, { id: 'clear', text: 'Clear', fn: v }), null),
				D(
					r,
					_(V, { id: 'swaprows', text: 'Swap Rows', fn: h }),
					null,
				),
				D(r, _(V, { id: 'bench', text: 'bench', fn: bench }), null),
				D(
					l,
					_(L, {
						get each() {
							return t()
						},
						children: e => {
							let t = e.id
							return (() => {
								const n = G(),
									r = n.firstChild,
									l = r.nextSibling,
									s = l.firstChild,
									i = s.firstChild,
									u = l.nextSibling.firstChild
								return (
									(r.textContent = t),
									(s.$$click = o),
									(s.$$clickData = t),
									(u.$$click = y),
									(u.$$clickData = t),
									b(
										r => {
											const l = w(t) ? 'danger' : '',
												o = e.label()
											var s, u
											return (
												l !== r._v$ &&
													((s = n),
													null == (u = r._v$ = l)
														? s.removeAttribute('class')
														: (s.className = u)),
												o !== r._v$2 && (i.data = r._v$2 = o),
												r
											)
										},
										{ _v$: void 0, _v$2: void 0 },
									),
									n
								)
							})()
						},
					}),
				),
				e
			)
		})()
	}, document.getElementById('main')),
		(function (e, t = window.document) {
			const n = t[M] || (t[M] = new Set())
			for (let r = 0, l = e.length; r < l; r++) {
				const l = e[r]
				n.has(l) || (n.add(l), t.addEventListener(l, q))
			}
		})(['click'])
})()
