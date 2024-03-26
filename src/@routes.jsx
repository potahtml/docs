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
							'http://localhost:11433/playground#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'.replace(
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
