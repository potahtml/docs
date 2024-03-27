import { Route } from 'pota/router'
import { lazy } from 'pota'

import FourZeroFour from './404.jsx'
import Home from './pages/home.jsx'

function NotFound() {
	return (
		<Route.Default>
			<FourZeroFour />
		</Route.Default>
	)
}
export default function Routes() {
	return (
		<Route
			path="/"
			scrolls={['#content']}
		>
			<NotFound />

			<Route>
				<Home />
			</Route>

			<Route path="articles/">
				<Route
					children={lazy(() => import('./pages/@articles/index.jsx'))}
				/>
				<Route
					path=":path$"
					params={{
						path: 'anatomy-of-a-signals-based-reactive-renderer',
					}}
					children={lazy(
						() =>
							import(
								'./pages/@articles/anatomy/anatomy-of-a-signals-based-reactive-renderer.jsx'
							),
					)}
				/>
			</Route>

			<Route path="CustomElement/">
				<Route
					children={lazy(
						() =>
							import('./pages/@components/custom-element/index.jsx'),
					)}
				/>
				<Route
					path="custom-elements-everywhere"
					params={{ path: '' }}
					children={lazy(
						() =>
							import(
								'./pages/@components/custom-element/custom-elements-everywhere/index.jsx'
							),
					)}
				/>
			</Route>

			<Route path="Components/">
				<NotFound />

				<Route
					path=":path$"
					params={{ path: 'Collapse' }}
					children={lazy(
						() => import('./pages/@components/collapse/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Dynamic' }}
					children={lazy(
						() => import('./pages/@components/dynamic/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'For' }}
					children={lazy(
						() => import('./pages/@components/for/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Head' }}
					children={lazy(
						() => import('./pages/@components/head/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Portal' }}
					children={lazy(
						() => import('./pages/@components/portal/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Promised' }}
					children={lazy(
						() => import('./pages/@components/promised/index.jsx'),
					)}
				/>

				<Route path="Router/">
					<NotFound />

					<Route
						path=":path$"
						params={{ path: 'Route' }}
						children={lazy(
							() =>
								import('./pages/@components/router/route/index.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'A' }}
						children={lazy(
							() =>
								import('./pages/@components/router/link/index.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'Navigate' }}
						children={lazy(
							() =>
								import(
									'./pages/@components/router/navigate/index.jsx'
								),
						)}
					/>

					<Route
						path=":path$"
						params={{ path: 'useLocation' }}
						children={lazy(
							() =>
								import(
									'./pages/@components/router/use-location/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'useParams' }}
						children={lazy(
							() =>
								import(
									'./pages/@components/router/use-params/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'useBeforeLeave' }}
						children={lazy(
							() =>
								import(
									'./pages/@components/router/use-before-leave/index.jsx'
								),
						)}
					/>
				</Route>

				<Route
					path=":path$"
					params={{ path: 'Show' }}
					children={lazy(
						() => import('./pages/@components/show/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'Switch' }}
					children={lazy(
						() => import('./pages/@components/switch/index.jsx'),
					)}
				/>

				<Route path="Library/">
					<Route
						children={lazy(
							() => import('./pages/@components/@library/index.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'alert' }}
						children={lazy(
							() => import('./pages/@components/@library/alert.jsx'),
						)}
					/>
				</Route>
			</Route>

			<Route path="Directory/">
				<NotFound />

				<Route
					children={lazy(
						() => import('./pages/@directory/index.jsx'),
					)}
				/>
			</Route>

			<Route path="hooks/">
				<NotFound />

				<Route
					path=":path$"
					params={{ path: 'useSelector' }}
					children={lazy(
						() => import('./pages/@hooks/use-selector/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'useTimeout' }}
					children={lazy(
						() => import('./pages/@hooks/use-timeout/index.jsx'),
					)}
				/>
			</Route>

			<Route
				path=":path$"
				params={{ path: 'playground' }}
				children={lazy(() => import('./pages/@playground/index.jsx'))}
			/>

			<Route path="props/">
				<NotFound />

				<Route path="plugins/">
					<NotFound />

					<Route
						path=":path$"
						params={{ path: 'autofocus' }}
						children={lazy(
							() =>
								import('./pages/@props/@plugins/autofocus/index.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'bind' }}
						children={lazy(
							() => import('./pages/@props/@plugins/bind/index.jsx'),
						)}
					/>

					<Route
						path=":path$"
						params={{ path: 'onClickOutside' }}
						children={lazy(
							() =>
								import(
									'./pages/@props/@plugins/onClickOutside/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'pasteTextPlain' }}
						children={lazy(
							() =>
								import(
									'./pages/@props/@plugins/pasteTextPlain/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'useClipboard' }}
						children={lazy(
							() =>
								import(
									'./pages/@props/@plugins/useClipboard/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'useFullscreen' }}
						children={lazy(
							() =>
								import(
									'./pages/@props/@plugins/useFullscreen/index.jsx'
								),
						)}
					/>
				</Route>

				<Route
					path=":path$"
					params={{ path: 'attr:__' }}
					children={lazy(
						() => import('./pages/@props/attr/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'attributes-properties' }}
					children={lazy(
						() =>
							import(
								'./pages/@props/attributes-properties/index.jsx'
							),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'bool:__' }}
					children={lazy(
						() => import('./pages/@props/bool/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'class:__' }}
					children={lazy(
						() => import('./pages/@props/class/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{
						path: 'EventListener',
					}}
					children={lazy(
						() => import('./pages/@props/event-listener/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'on__' }}
					children={lazy(
						() =>
							import(
								'./pages/@props/event-listener-window/index.jsx'
							),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'on:__' }}
					children={lazy(
						() =>
							import(
								'./pages/@props/event-listener-native/index.jsx'
							),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'onMount' }}
					children={lazy(
						() => import('./pages/@props/on-mount/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'onUnmount' }}
					children={lazy(
						() => import('./pages/@props/on-unmount/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'prop:__' }}
					children={lazy(
						() => import('./pages/@props/prop/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'propsPlugin' }}
					children={lazy(
						() => import('./pages/@props/props-plugin/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'propsProxy' }}
					children={lazy(
						() => import('./pages/@props/props-proxy/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'propsSplit' }}
					children={lazy(
						() => import('./pages/@props/props-split/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'ref' }}
					children={lazy(
						() => import('./pages/@props/ref/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'setAttribute' }}
					children={lazy(
						() => import('./pages/@props/set-attribute/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'setBool' }}
					children={lazy(
						() => import('./pages/@props/set-bool/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'setProperty' }}
					children={lazy(
						() => import('./pages/@props/set-property/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'setStyle' }}
					children={lazy(
						() => import('./pages/@props/set-style/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'style:__' }}
					children={lazy(
						() => import('./pages/@props/style/index.jsx'),
					)}
				/>
			</Route>

			<Route path="Reactivity/">
				<NotFound />

				<Route
					children={lazy(
						() => import('./pages/@reactivity/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'memo' }}
					children={lazy(
						() => import('./pages/@reactivity/memo/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'map' }}
					children={lazy(
						() => import('./pages/@reactivity/map/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Context' }}
					children={lazy(
						() => import('./pages/@reactivity/context/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'mutable-tests' }}
					children={() => {
						window.location.href =
							'http://localhost:11433/playground#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'
								.trim()
								.replace(
									'http://localhost:11433',
									'https://pota.quack.uy',
								)
					}}
				/>
			</Route>

			<Route
				path=":path$"
				params={{ path: 'Classes' }}
				children={lazy(() => import('./pages/classes/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'Component' }}
				children={lazy(() => import('./pages/component/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'HTML' }}
				children={lazy(() => import('./pages/html/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'lazy' }}
				children={lazy(() => import('./pages/lazy/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'cleanup' }}
				children={lazy(() => import('./pages/cleanup/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'ready' }}
				children={lazy(() => import('./pages/ready/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'render' }}
				children={lazy(() => import('./pages/render/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'resolve' }}
				children={lazy(() => import('./pages/resolve/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'toHTML' }}
				children={lazy(() => import('./pages/to-html/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'usage' }}
				children={lazy(() => import('./pages/usage/index.jsx'))}
			/>
		</Route>
	)
}
