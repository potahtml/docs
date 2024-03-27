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
