import { Switch, Match } from 'pota/components'
import { H2 } from './headings.jsx'

export function Header(props) {
	return (
		<Switch>
			<Match when={props.title}>
				<H2
					title={props.title}
					no-meta={props['no-meta']}
					meta-title={props['meta-title']}
				>
					{props.children}
				</H2>
			</Match>
			<Match when={!props.title}>
				<header>{props.children}</header>
			</Match>
		</Switch>
	)
}
