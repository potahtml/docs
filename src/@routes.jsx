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
